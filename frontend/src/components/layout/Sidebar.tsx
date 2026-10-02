import React from "react";
import { Home, Layers, ScanEye, Droplets, BarChart3 } from "lucide-react";

export type NavTab = "home" | "digital-twin" | "ai-vision" | "irrigation" | "owner";

export interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "home",
      label: "Overview",
      icon: <Home className="w-4 h-4 stroke-[1.8]" />,
    },
    {
      id: "digital-twin",
      label: "Digital Twin",
      icon: <Layers className="w-4 h-4 stroke-[1.8]" />,
    },
    {
      id: "ai-vision",
      label: "AI Vision",
      icon: <ScanEye className="w-4 h-4 stroke-[1.8]" />,
    },
    {
      id: "irrigation",
      label: "Smart Irrigation",
      icon: <Droplets className="w-4 h-4 stroke-[1.8]" />,
    },
    {
      id: "owner",
      label: "Owner Dashboard",
      icon: <BarChart3 className="w-4 h-4 stroke-[1.8]" />,
    },
  ];

  return (
    <aside className="w-56 bg-[#0E1514] border-r border-[#26332F] p-4 flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-64px)]">
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-semibold tracking-wider text-[#8FA19C] uppercase px-3">
            Mission Control
          </span>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-[8px] text-sm font-medium transition-colors select-none ${
                    isActive
                      ? "bg-[#4ADE80]/12 text-[#4ADE80]"
                      : "text-[#8FA19C] hover:text-[#E6EDEB] hover:bg-[#1B2625]"
                  }`}
                >
                  <span className={isActive ? "text-[#4ADE80]" : "text-[#8FA19C]"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};
