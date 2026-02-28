import React from "react";
import { Search, Zap, Trophy, Globe, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Hero = () => {
  return (
    <div className="relative pt-32 pb-20 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 mb-8 bg-muted/50 px-3 py-1 rounded-full border border-border backdrop-blur-sm">
            <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              New
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              The 2026 Curriculum is now live
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 max-w-4xl">
            Forge Your <br />
            <span className="text-primary italic">Dominance.</span>
          </h1>

          <div className="flex flex-col items-center w-full gap-12">
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
              Architect your career with elite knowledge. Hyper-specialized
              modules for the top 1%.
            </p>

            <div className="w-full max-w-2xl">
              <div className="relative flex items-center gap-2 p-1 border rounded-xl bg-card shadow-sm group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <div className="pl-4 text-muted-foreground">
                  <Search size={20} />
                </div>
                <Input
                  type="text"
                  placeholder="What do you want to learn?"
                  className="border-none shadow-none focus-visible:ring-0 text-base py-6 h-12"
                />
                <Button size="lg" className="h-12 rounded-lg px-8">
                  Search
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full max-w-5xl pt-12 border-t">
            {[
              { icon: <Zap size={20} />, label: "Response Time", val: "0.4ms" },
              {
                icon: <Trophy size={20} />,
                label: "Industry Rank",
                val: "#01",
              },
              { icon: <Globe size={20} />, label: "Global Users", val: "1.2M" },
              {
                icon: <Sparkles size={20} />,
                label: "Elite Mentors",
                val: "500+",
              },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div className="text-primary p-2 bg-primary/5 rounded-lg mb-2">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold tracking-tight">
                  {stat.val}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
