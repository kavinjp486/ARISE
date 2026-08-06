import { Activity, Gamepad2, Home, MapPin } from "lucide-react";
import type { NavTab } from "@/types";

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-4 py-3 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand Title */}
        <div
          onClick={() => onTabChange("landing")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="h-9 w-9 rounded-xl glass-g flex items-center justify-center text-g font-bold font-orb group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <div className="font-orb text-lg font-black tracking-wider flex items-center gap-1.5">
              <span>ARI</span>
              <span className="text-b">SE</span>
            </div>
            <div className="text-[10px] text-white/40 tracking-tight font-medium">
              Cable Suspended Tea Robot
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl glass border border-white/10">
          <button
            onClick={() => onTabChange("landing")}
            className={`btn-press px-3.5 py-1.5 rounded-lg text-xs font-orb font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "landing"
                ? "glass-g text-g panim-g"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Home className="h-3.5 w-3.5" />
            Home
          </button>
          <button
            onClick={() => onTabChange("status")}
            className={`btn-press px-3.5 py-1.5 rounded-lg text-xs font-orb font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "status"
                ? "glass-b text-b panim-b"
                : "text-white/50 hover:text-white"
            }`}
          >
            <MapPin className="h-3.5 w-3.5" />
            Status & Map
          </button>
          <button
            onClick={() => onTabChange("data")}
            className={`btn-press px-3.5 py-1.5 rounded-lg text-xs font-orb font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "data"
                ? "glass-g text-g panim-g"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            Live Data
          </button>
          <button
            onClick={() => onTabChange("control")}
            className={`btn-press px-3.5 py-1.5 rounded-lg text-xs font-orb font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "control"
                ? "glass-b text-b panim-b"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Gamepad2 className="h-3.5 w-3.5" />
            Controls
          </button>
        </div>

        {/* Live System Indicator */}
        <div className="hidden sm:flex items-center gap-2.5 font-orb text-xs">
          <span className="h-2 w-2 rounded-full bg-g animate-ping" />
          <span className="text-g font-bold">ONLINE</span>
          <span className="text-white/20">|</span>
          <span className="text-white/40 font-mono">Nilgiris Estate</span>
        </div>
      </div>
    </nav>
  );
}
