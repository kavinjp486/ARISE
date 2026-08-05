/*
 * ARISE — ESP32 Autonomous Cable Robot Firmware
 * =============================================
 * Physical prototype controller for tea plantation cable robot.
 * Receives HTTP commands over Wi-Fi from FastAPI backend, controls motor
 * PWM/direction outputs, reports telemetry, and enforces watchdog safety.
 */

#include <WiFi.h>
#include <WebServer.h>
#include "config.h"

// HTTP Web Server instance on port 80
WebServer server(HTTP_PORT);

// Operational State Variables
bool emergencyStopActive = false;
String currentMode = "manual";      // "manual" | "autonomous" | "idle"
String lastCommand = "STOP";
unsigned long lastCommandTimeMs = 0;
int currentSpeed = DEFAULT_SPEED;

// Simulated Sensor Telemetry Variables
float batteryVoltage = 12.4; // 12.4V nominal LiFePO4 pack
float positionX = 14.5;      // Meters along cable track X
float positionY = 8.2;       // Meters along cable track Y
float temperatureC = 32.5;   // Motor driver temperature
float payloadKg = 2.4;       // Harvested leaf weight

// --- Motor Control Helper Functions ---

void applyMotorOutputs(int speedL, int dirL, int speedR, int dirR) {
  if (emergencyStopActive) {
    digitalWrite(PIN_MOTOR_L_EN, LOW);
    digitalWrite(PIN_MOTOR_R_EN, LOW);
    return;
  }

  // Enable Motor Drivers
  digitalWrite(PIN_MOTOR_L_EN, HIGH);
  digitalWrite(PIN_MOTOR_R_EN, HIGH);

  // Set Directions
  digitalWrite(PIN_MOTOR_L_DIR, dirL ? HIGH : LOW);
  digitalWrite(PIN_MOTOR_R_DIR, dirR ? HIGH : LOW);

  // Write PWM Duty Cycle (0 - 255)
  dacWrite(PIN_MOTOR_L_PWM, speedL);
  dacWrite(PIN_MOTOR_R_PWM, speedR);
}

void stopMotors() {
  applyMotorOutputs(0, 0, 0, 0);
  digitalWrite(PIN_MOTOR_L_EN, LOW);
  digitalWrite(PIN_MOTOR_R_EN, LOW);
  lastCommand = "STOP";
}

void emergencyStopHardware() {
  emergencyStopActive = true;
  stopMotors();
  digitalWrite(PIN_PLUCKER_RELAY, LOW);
  digitalWrite(PIN_ESTOP_RELAY, HIGH); // Cut main power relay
  digitalWrite(PIN_STATUS_LED, LOW);   // Turn off status LED
  Serial.println("[EMERGENCY STOP] Hardware power relay cut!");
}

void resetEmergencyStop() {
  emergencyStopActive = false;
  digitalWrite(PIN_ESTOP_RELAY, LOW);
  digitalWrite(PIN_STATUS_LED, HIGH);
  Serial.println("[SAFETY] Emergency Stop cleared.");
}

// --- HTTP Endpoint Handlers ---

// GET / - Root Health Check Endpoint
void handleRoot() {
  String json = "{\"system\":\"ARISE Cable Robot ESP32\",\"version\":\"1.0.0\",\"status\":\"online\"}";
  server.send(200, "application/json", json);
}

// POST /api/robot/control - Process Navigation & Action Commands
void handleControl() {
  if (emergencyStopActive) {
    server.send(403, "application/json", "{\"error\":\"E-STOP ACTIVE\",\"message\":\"Clear emergency stop before issuing commands\"}");
    return;
  }

  if (server.hasArg("plain") == false) {
    // Check form parameters as fallback
    server.send(400, "application/json", "{\"error\":\"Missing body payload\"}");
    return;
  }

  String body = server.arg("plain");
  Serial.print("[HTTP POST /control] Received: ");
  Serial.println(body);

  // Simple string parsing for lightweight HTTP requests without heavy JSON library overhead
  lastCommandTimeMs = millis();

  if (body.indexOf("\"cmd\":\"MOVE\"") >= 0 || body.indexOf("MOVE") >= 0) {
    if (body.indexOf("FWD") >= 0 || body.indexOf("forward") >= 0) {
      applyMotorOutputs(currentSpeed, 1, currentSpeed, 1);
      lastCommand = "MOVE_FORWARD";
    } else if (body.indexOf("BCK") >= 0 || body.indexOf("backward") >= 0) {
      applyMotorOutputs(currentSpeed, 0, currentSpeed, 0);
      lastCommand = "MOVE_BACKWARD";
    } else if (body.indexOf("LFT") >= 0 || body.indexOf("left") >= 0) {
      applyMotorOutputs(currentSpeed / 2, 0, currentSpeed, 1);
      lastCommand = "MOVE_LEFT";
    } else if (body.indexOf("RGT") >= 0 || body.indexOf("right") >= 0) {
      applyMotorOutputs(currentSpeed, 1, currentSpeed / 2, 0);
      lastCommand = "MOVE_RIGHT";
    }
  } else if (body.indexOf("\"cmd\":\"HARVEST\"") >= 0 || body.indexOf("HARVEST") >= 0) {
    digitalWrite(PIN_PLUCKER_RELAY, HIGH);
    delay(500); // Pulse plucker actuator
    digitalWrite(PIN_PLUCKER_RELAY, LOW);
    lastCommand = "HARVEST_PULSE";
  } else if (body.indexOf("\"cmd\":\"STOP\"") >= 0 || body.indexOf("STOP") >= 0) {
    stopMotors();
  }

  String responseJson = "{\"status\":\"ACK\",\"executing\":\"" + lastCommand + "\",\"mode\":\"" + currentMode + "\"}";
  server.send(200, "application/json", responseJson);
}

// GET /api/robot/status - Report Sensor Telemetry Payload
void handleStatus() {
  // Read simulated ADC values (replace with analogRead for real hardware)
  int batteryPct = (int)((batteryVoltage / 14.8) * 100);

  String telemetryJson = "{";
  telemetryJson += "\"connection\":\"connected\",";
  telemetryJson += "\"battery\":" + String(batteryPct) + ",";
  telemetryJson += "\"position\":{\"x\":" + String(positionX, 1) + ",\"y\":" + String(positionY, 1) + "},";
  telemetryJson += "\"speed\":" + String((currentSpeed / 100.0) * 1.2, 2) + ",";
  telemetryJson += "\"mode\":\"" + currentMode + "\",";
  telemetryJson += "\"temperature\":" + String(temperatureC, 1) + ",";
  telemetryJson += "\"payload\":" + String(payloadKg, 1) + ",";
  telemetryJson += "\"e_stop\":" + String(emergencyStopActive ? "true" : "false") + ",";
  telemetryJson += "\"last_cmd\":\"" + lastCommand + "\"";
  telemetryJson += "}";

  server.send(200, "application/json", telemetryJson);
}

// POST /api/robot/estop - Immediate Emergency Stop Trigger
void handleEmergencyStop() {
  emergencyStopHardware();
  server.send(200, "application/json", "{\"status\":\"EMERGENCY_STOP_ENGAGED\",\"message\":\"Motor driver power relay disengaged\"}");
}

// --- Arduino Core Setup & Main Loop ---

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println("\n==========================================");
  Serial.println("   ARISE ESP32 Cable Robot Firmware v1.0 ");
  Serial.println("==========================================");

  // Initialize Pin Modes
  pinMode(PIN_MOTOR_L_PWM, OUTPUT);
  pinMode(PIN_MOTOR_L_DIR, OUTPUT);
  pinMode(PIN_MOTOR_L_EN, OUTPUT);
  pinMode(PIN_MOTOR_R_PWM, OUTPUT);
  pinMode(PIN_MOTOR_R_DIR, OUTPUT);
  pinMode(PIN_MOTOR_R_EN, OUTPUT);
  pinMode(PIN_ELEVATOR_PWM, OUTPUT);
  pinMode(PIN_ELEVATOR_DIR, OUTPUT);
  pinMode(PIN_PLUCKER_RELAY, OUTPUT);
  pinMode(PIN_ESTOP_RELAY, OUTPUT);
  pinMode(PIN_STATUS_LED, OUTPUT);

  // Initial State: Safe Disarmed Motors
  stopMotors();
  digitalWrite(PIN_STATUS_LED, HIGH);

  // Connect to Wi-Fi Network
  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempt = 0;
  while (WiFi.status() != WL_CONNECTED && attempt < 10) {
    delay(500);
    Serial.print(".");
    attempt++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[Wi-Fi] Connected successfully!");
    Serial.print("[Wi-Fi] Robot IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    // SoftAP Fallback mode if local Wi-Fi router is unavailable
    Serial.println("\n[Wi-Fi] Router connection failed. Launching Access Point mode...");
    WiFi.softAP(AP_SSID, AP_PASSWORD);
    Serial.print("[Wi-Fi] Access Point IP Address: ");
    Serial.println(WiFi.softAPIP());
  }

  // Register WebServer Endpoints
  server.on("/", HTTP_GET, handleRoot);
  server.on("/api/robot/control", HTTP_POST, handleControl);
  server.on("/api/robot/status", HTTP_GET, handleStatus);
  server.on("/api/robot/estop", HTTP_POST, handleEmergencyStop);

  server.begin();
  Serial.println("[HTTP Server] WebServer listening on port 80");
}

void loop() {
  // Handle HTTP requests from FastAPI backend
  server.handleClient();

  // Safety Watchdog Check: Auto-stop motors if control packet times out
  if (!emergencyStopActive && lastCommand != "STOP" && currentMode == "manual") {
    if (millis() - lastCommandTimeMs > WATCHDOG_TIMEOUT_MS) {
      Serial.println("[WATCHDOG] Control packet timeout (>2s). Safety stopping motors!");
      stopMotors();
    }
  }

  delay(10); // Yield to ESP32 background tasks
}
