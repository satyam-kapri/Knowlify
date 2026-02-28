import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useCourseStore } from "../store/useCourseStore";
import { LogOut, User, Command, Menu, ChevronLeft } from "lucide-react";

interface NavbarProps {
  onAuthClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAuthClick }) => {
  const { user, signOut } = useAuthStore();
  const { selectedCourse, setSelectedCourse } = useCourseStore();

  const handleMarketplaceClick = () => {
    if (selectedCourse) {
      setSelectedCourse(null);
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
    <nav className="nav glass-nav">
      <div className="container nav-container">
        <div className="nav-logo-section">
          {selectedCourse ? (
            <div onClick={handleMarketplaceClick} className="nav-back-button">
              <ChevronLeft size={20} />
              <span className="nav-logo-text">Marketplace</span>
            </div>
          ) : (
            <div
              className="nav-logo"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="nav-logo-icon">
                <Command size={18} />
              </div>
              <span className="nav-logo-text">Knowlify</span>
            </div>
          )}
        </div>

        <div className="nav-links">
          <button
            onClick={handleMarketplaceClick}
            className={`nav-link ${!selectedCourse ? "active" : ""}`}
          >
            Marketplace
          </button>
          {["My Learning", "Instructors"].map((item) => (
            <button key={item} className="nav-link">
              {item}
            </button>
          ))}
        </div>

        <div className="nav-actions">
          {user ? (
            <div className="nav-user-pill">
              <div className="nav-user-avatar">
                <User size={16} />
              </div>
              <button
                onClick={() => signOut()}
                className="nav-logout-btn"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button onClick={onAuthClick} className="btn-pink nav-cta">
              Join Now
            </button>
          )}

          <button className="nav-mobile-toggle">
            <Menu size={24} />
          </button>
        </div>
      </div>

      <style>{`
        /* Core Variables syncing with the Hero theme */
        :root {
          --nav-bg: rgba(255, 255, 255, 0.85);
          --nav-border: rgba(226, 232, 240, 0.8);
          --text-main: #0f172a;
          --text-muted: #64748b;
          --pink-main: #ec4899;
          --pink-light: #fdf2f8;
          --pink-gradient: linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%);
          --transition: all 0.3s ease;
        }

        .glass-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: 75px;
          display: flex;
          align-items: center;
          background: var(--nav-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--nav-border);
          box-shadow: 0 4px 20px -10px rgba(0, 0, 0, 0.05);
          transition: var(--transition);
        }
        
        .nav-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo-section {
          display: flex;
          align-items: center;
        }

        .nav-back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          color: var(--text-muted);
          transition: var(--transition);
          font-weight: 700;
        }

        .nav-back-button:hover {
          color: var(--pink-main);
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .nav-logo-icon {
          width: 38px;
          height: 38px;
          background: var(--pink-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: white;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.25);
        }

        .nav-logo-text {
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--text-main);
        }

        .nav-links {
          display: flex;
          gap: 3rem;
        }

        .nav-link {
          background: none;
          border: none;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--transition);
          padding: 0;
        }

        .nav-link:hover {
          color: var(--pink-main);
        }

        .nav-link.active {
          color: var(--pink-main);
          position: relative;
        }
        
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 6px;
          background: var(--pink-main);
          border-radius: 50%;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        /* --- User Logged In State --- */
        .nav-user-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f8fafc;
          padding: 6px;
          border-radius: 100px;
          border: 1px solid #e2e8f0;
          transition: var(--transition);
        }
        .nav-user-pill:hover {
          border-color: #fbcfe8;
          background: var(--pink-light);
        }

        .nav-user-avatar {
          width: 32px;
          height: 32px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--pink-main);
          border: 1px solid #fbcfe8;
        }

        .nav-logout-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #94a3b8;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: var(--transition);
        }

        .nav-logout-btn:hover {
          color: #e11d48;
          background: #ffe4e6;
        }

        /* --- Join Now Button --- */
        .btn-pink {
          background: var(--pink-gradient);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 16px -8px var(--pink-main);
        }
        .btn-pink:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 20px -8px var(--pink-main);
        }

        .nav-mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--text-main);
          cursor: pointer;
        }

        @media (max-width: 1024px) {
          .nav-links {
            display: none;
          }
          .nav-mobile-toggle {
            display: block;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
