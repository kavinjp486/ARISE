import { Badge } from "@/components/ui/badge";
import { Activity, Leaf, Wifi } from "lucide-react";

export function Navbar() {
  return (
    <header className="flex items-center justify-between rounded-xl border border-border bg-card/80 px-5 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
          <Leaf className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">ARISE</h1>
          <p className="text-xs text-muted-foreground">
            Autonomous Tea Harvest Control Center
          </p>
        </div>
      </div>

      <div className="hidden items-center gap-6 md:flex">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Wifi className="h-4 w-4 text-accent" />
          <span>Robot Link</span>
          <Badge variant="success">Online</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4 text-accent" />
          <span>System Status</span>
          <Badge variant="info">Operational</Badge>
        </div>
      </div>

      <div className="text-right">
        <p className="font-mono text-sm text-foreground">21:45:02</p>
        <p className="text-xs text-muted-foreground">Sector B — Row 14</p>
      </div>
    </header>
  );
}
