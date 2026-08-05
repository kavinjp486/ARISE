/*
 * ARISE ESP32 Hardware & Network Configuration
 * --------------------------------------------
 * Firmware configuration for cable-based tea plantation harvesting robot.
 */

#ifndef ARISE_CONFIG_H
#define ARISE_CONFIG_H

// --- Network Settings ---
#define WIFI_SSID       "ARISE_Plantation_WiFi"
#define WIFI_PASSWORD   "AriseHarvest2026"
#define AP_SSID         "ARISE_Robot_AP"
#define AP_PASSWORD     "Arise1234"
#define HTTP_PORT       80

// --- Hardware GPIO Pin Mapping ---
// Cable Motor Left (Motor A - Stepper/PWM)
#define PIN_MOTOR_L_PWM   18
#define PIN_MOTOR_L_DIR   19
#define PIN_MOTOR_L_EN    21

// Cable Motor Right (Motor B - Stepper/PWM)
#define PIN_MOTOR_R_PWM   22
#define PIN_MOTOR_R_DIR   23
#define PIN_MOTOR_R_EN    25

// Cable Z-Axis Elevator Actuator
#define PIN_ELEVATOR_PWM  26
#define PIN_ELEVATOR_DIR  27

// Harvesting Mechanism (Plucker Tool Relay/PWM)
#define PIN_PLUCKER_RELAY 32

// Emergency Stop Hard Relay & Status LED
#define PIN_ESTOP_RELAY   33
#define PIN_STATUS_LED    2

// Analog ADC Sensors
#define PIN_BATTERY_ADC   34  // Voltage divider (0 - 3.3V)
#define PIN_TEMP_ADC      35  // Thermistor / Analog Temp sensor

// --- Safety & Watchdog Parameters ---
#define WATCHDOG_TIMEOUT_MS  2000  // 2-second auto-stop safety timeout
#define MAX_SPEED_PERCENT    100
#define DEFAULT_SPEED        75

#endif // ARISE_CONFIG_H
