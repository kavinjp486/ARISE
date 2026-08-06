import { HeroCanvas } from "@/components/dashboard/HeroCanvas";
import type { NavTab } from "@/components/layout/Navbar";

interface LandingPageProps {
  go: (tab: NavTab) => void;
}

export function LandingPage({ go }: LandingPageProps) {
  const feats = [
    {
      icon: "🗺️",
      title: "Smart Field Map",
      desc: "Live 10×8 grid shows every zone — green = done, blue = working, red = needs help. Like a game map for your farm.",
      col: "b" as const,
    },
    {
      icon: "🎮",
      title: "Game Controls",
      desc: "Slide left/right, adjust depth arm UP/DOWN. Control a real cable robot like you're playing a video game.",
      col: "g" as const,
    },
    {
      icon: "📡",
      title: "Live Data Feed",
      desc: "Battery, motor health, cable tension, XP — everything updates in real time so you always know what's happening.",
      col: "b" as const,
    },
    {
      icon: "🏆",
      title: "Level Up System",
      desc: "Earn XP as zones are harvested. Unlock badges. Level up from Seedling to Harvest God. Real farming, gamified.",
      col: "g" as const,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col pt-16">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col lg:flex-row items-center gap-8 px-6 pt-16 pb-12 max-w-7xl mx-auto w-full">
        {/* Left Intro Column */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-g text-g text-xs font-bold uppercase tracking-widest blink-a">
            <span>●</span> System Online · Nilgiris Estate
          </div>
          <h1 className="font-orb text-5xl md:text-7xl font-black leading-none tracking-tight">
            <span className="text-white">ARI</span>
            <span className="text-b">SE</span>
          </h1>
          <p className="text-white/40 text-base">
            Cable Suspended Tea Harvesting Robot
          </p>
          <p className="text-2xl md:text-3xl font-bold leading-snug">
            <span className="text-g">Smart Harvesting.</span>
            <br />
            <span className="text-white/90">Zero Labor Dependency.</span>
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => go("status")}
              className="btn-press px-8 py-4 rounded-2xl font-orb font-bold text-sm panim-g glow-g"
              style={{
                background: "linear-gradient(135deg,#00A86B,#00c97e)",
                color: "#070b14",
              }}
            >
              🤖 View Robot Status
            </button>
            <button
              onClick={() => go("control")}
              className="btn-press px-8 py-4 rounded-2xl font-orb font-bold text-sm glass-b text-b border border-b/40 hover:bg-b/10 transition-colors panim-b"
            >
              🕹️ Control ARISE
            </button>
          </div>
          <div className="flex gap-8 pt-4">
            {[
              ["95%", "Labor Saved"],
              ["24/7", "Operation"],
              ["80+", "Zones / Day"],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="font-orb text-2xl font-black text-b">{v}</div>
                <div className="text-xs text-white/30 mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Canvas Column */}
        <div className="flex-1 w-full lg:max-w-2xl float-a">
          <HeroCanvas />
          <p className="text-center text-xs text-white/20 mt-3 font-orb tracking-widest">
            LIVE SIMULATION
          </p>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="px-6 pb-16 max-w-7xl mx-auto w-full">
        <h2 className="font-orb font-black text-2xl text-center mb-8">
          How It <span className="text-b">Works</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {feats.map((f) => (
            <div
              key={f.title}
              className={`rounded-2xl p-5 transition-all duration-300 ${
                f.col === "g" ? "glass-g" : "glass-b"
              }`}
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-orb font-bold text-sm mb-2 text-white">
                {f.title}
              </h3>
              <p className="text-xs text-white/45 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
