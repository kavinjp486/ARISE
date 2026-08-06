import { useState } from "react";
import { DashboardPage } from "@/pages/DashboardPage";
import { ControlPage } from "@/pages/ControlPage";

export default function App() {
  const [activeTab, setActiveTab] = useState<"overview" | "controls">("overview");

  return activeTab === "overview" ? (
    <DashboardPage onTabChange={setActiveTab} />
  ) : (
    <ControlPage onTabChange={setActiveTab} />
  );
}
