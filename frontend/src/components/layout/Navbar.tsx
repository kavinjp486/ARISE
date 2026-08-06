import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Gamepad2, LayoutDashboard, Leaf, Wifi } from "lucide-react";

interface NavbarProps {
  activeTab?: "overview" | "controls";
  onTabChange?: (tab: "overview" | "controls") => void;
}

export function Navbar({ activeTab = "overview", onTabChange }: NavbarProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card/80 px-5 py-3 backdrop-blur-sm">
      {/* Brand & Mission Title */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent shadow-sm">
          <Leaf className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            ARISE
            <Badge variant="outline" className="text-[10px] uppercase font-mono">
              Cable-Robot v1.0
            </Badge>
          </h1>
          <p className="text-xs text-muted-foreground">
            Autonomous Tea Plantation Control Center
          </p>
        </div>
      </div>

      {/* Page Navigation Tabs */}
      <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 p-1">
        <Button
          size="sm"
          variant={activeTab === "overview" ? "default" : "ghost"}
          className="gap-2 text-xs font-semibold"
          onClick={() => onTabChange?.("overview")}
        >
          <LayoutDashboard className="h-4 w-4" />
          Overview
        </Button>
        <Button
          size="sm"
          variant={activeTab === "controls" ? "default" : "ghost"}
          className="gap-2 text-xs font-semibold"
          onClick={() => onTabChange?.("controls")}
        >
          <Gamepad2 className="h-4 w-4" />
          Robot Controls
        </Button>
      </div>

      {/* Connection & Telemetry Status Badges */}
      <div className="hidden items-center gap-5 lg:flex">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Wifi className="h-4 w-4 text-accent" />
          <span>ESP32 Wi-Fi</span>
          <Badge variant="success">Connected</Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className="h-4 w-4 text-accent" />
          <span>System Status</span>
          <Badge variant="info">Operational</Badge>
        </div>
      </div>
    </header>
  );
}
