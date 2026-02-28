import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useCourseStore } from "../store/useCourseStore";
import { LogOut, User, Command, Menu, ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";

interface NavbarProps {
  onAuthClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAuthClick }) => {
  const { user, signOut } = useAuthStore();
  const { selectedCourse, setSelectedCourse } = useCourseStore();

  const handleMarketplaceClick = () => {
    if (selectedCourse) {
      setSelectedCourse(null);
      // Wait for re-render then scroll
      setTimeout(() => {
        const element = document.getElementById("marketplace");
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById("marketplace");
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center">
          {selectedCourse ? (
            <div
              onClick={handleMarketplaceClick}
              className="flex items-center space-x-2 cursor-pointer group hover:text-primary transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="font-bold tracking-tight text-lg">
                Marketplace
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 cursor-pointer group">
              <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-md transition-transform group-hover:scale-110 shadow-lg shadow-primary/20">
                <Command size={18} className="text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">Knowlify</span>
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center space-x-10">
          <button
            onClick={handleMarketplaceClick}
            className={`text-sm font-bold uppercase tracking-widest transition-colors ${
              !selectedCourse
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Marketplace
          </button>
          {["My Learning", "Instructors"].map((item) => (
            <button
              key={item}
              className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 border bg-muted/30 rounded-full pl-1 pr-1 py-1 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={16} className="text-primary" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => signOut()}
                  className="h-8 w-8 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={onAuthClick}
              variant="default"
              size="sm"
              className="font-bold uppercase tracking-widest text-[10px] h-9"
            >
              Join Now
            </Button>
          )}

          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
