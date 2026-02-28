// import React from "react";
import { Search, ArrowRight, Play, Star, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <div className="hero-light-wrapper">
      {/* Soft Pink Background Blobs */}
      <div className="bg-blob blob-top-left"></div>

      <div className="container hero-container">
        <div className="hero-content">
          <div
            className="badge-pill animate-slide-up"
            style={{ animationDelay: "0ms" }}
          >
            <span className="badge-tag">AI Studio</span>
            <span className="badge-text">Auto-Generate Courses in Seconds</span>
            <ArrowRight size={14} className="badge-icon" />
          </div>

          <h1
            className="hero-title animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            Learn & Create with <br />
            <span className="text-highlight">AI Intelligence.</span>
          </h1>

          <p
            className="hero-subtitle animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            The future of education is here. Instantly generate comprehensive,
            interactive courses from a single prompt, or dive into our
            marketplace of elite, hyper-focused modules.
          </p>

          <div
            className="search-container animate-slide-up"
            style={{ animationDelay: "300ms" }}
          >
            <div className="search-bar">
              <div className="search-input-wrapper">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="What do you want to learn or teach today?"
                  className="search-input"
                />
              </div>
              <button className="btn-pink">Start Exploring</button>
            </div>
            <div className="search-tags">
              <span>Try prompts:</span>
              <button className="tag">Generate React Course</button>
              <button className="tag">Learn System Design</button>
              <button className="tag">Web3 Basics</button>
            </div>
          </div>
        </div>

        {/* Right Side - Static Visual Composition */}
        <div
          className="hero-visual animate-fade-in"
          style={{ animationDelay: "400ms" }}
        >
          <div className="visual-composition">
            {/* Main Image - Single image divided into 4x4 grid */}
            <div className="image-grid-4x4">
              {Array.from({ length: 16 }).map((_, i) => {
                const row = Math.floor(i / 4);
                const col = i % 4;
                const imageUrl =
                  "https://img.freepik.com/premium-psd/3d-illustration-cute-girl-reading-book_611602-513.jpg";
                return (
                  <div key={i} className="grid-item">
                    <img
                      src={imageUrl}
                      alt=""
                      style={{
                        left: `-${col * 100}%`,
                        top: `-${row * 100}%`,
                      }}
                    />
                  </div>
                );
              })}
              <button className="play-button pulse-ring">
                <Play size={24} fill="currentColor" className="play-icon" />
              </button>
            </div>

            {/* Static Review Card (Overlapping) */}
            <div className="floating-card review-card glass-card">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} fill="#ec4899" color="#ec4899" />
                ))}
              </div>
              <p className="card-text">
                "The AI Studio built my course in 30 seconds."
              </p>
              <p className="card-author">- Lead Instructor</p>
            </div>

            {/* Static Stat Card (Overlapping) */}
            <div className="floating-card stat-card glass-card">
              <div className="stat-icon-box">
                <Sparkles size={20} color="#ec4899" />
              </div>
              <div>
                <p className="stat-num">50k+</p>
                <p className="stat-desc">Courses Generated</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        :root {
          --bg-color: #ffffff;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --pink-main: #ec4899;
          --pink-light: #fdf2f8;
          --pink-gradient: linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%);
          --shadow-soft: 0 20px 40px -15px rgba(236, 72, 153, 0.15);
          --shadow-heavy: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero-light-wrapper * {
          box-sizing: border-box;
        }

        .hero-light-wrapper {
          background-color: var(--bg-color);
          color: var(--text-main);
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding: 120px 0;
          font-family: var(--font-sans, system-ui, sans-serif);
          font-size: 0.875rem;
        }

        /* --- Ambient Pink Background Blobs --- */
        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.3;
          z-index: 0;
          animation: blob-bounce 10s infinite alternate;
        }
        .blob-top-left {
          background: #f9a8d4;
          width: 600px;
          height: 600px;
          top: -200px;
          left: -200px;
        }

        .container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 10;
        }

        .hero-container {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 60px;
          align-items: center;
        }

        /* --- Left Content --- */
        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 6px 16px 6px 6px;
          background: var(--pink-light);
          border: 1px solid rgba(236, 72, 153, 0.2);
          border-radius: 100px;
          margin-bottom: 2rem;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        .badge-pill:hover {
          transform: translateY(-2px);
        }

        .badge-tag {
          background: var(--pink-gradient);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 100px;
          text-transform: uppercase;
        }

        .badge-text {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--pink-main);
        }

        .badge-icon {
          color: var(--pink-main);
        }

        .hero-title {
          font-size: clamp(2rem, 3.5vw, 2.75rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin-bottom: 1.5rem;
          color: #0f172a;
        }

        .text-highlight {
          color: var(--pink-main);
          position: relative;
          display: inline-block;
        }

        .hero-subtitle {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 2.5rem;
          max-width: 440px;
          font-weight: 400;
        }

        /* --- Search Area --- */
        .search-container {
          max-width: 560px;
        }

        .search-bar {
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 6px 6px 6px 20px;
          transition: var(--transition);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }

        .search-bar:focus-within {
          border-color: var(--pink-main);
          box-shadow: 0 8px 20px rgba(236, 72, 153, 0.08);
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .search-icon {
          color: #94a3b8;
          margin-right: 10px;
          flex-shrink: 0;
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 0.9rem;
          color: var(--text-main);
          background: transparent;
          width: 100%;
        }
        .search-input::placeholder {
          color: #94a3b8;
          text-overflow: ellipsis;
        }

        .btn-pink {
          background: var(--pink-gradient);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2);
          white-space: nowrap;
        }
        .btn-pink:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 25px -10px var(--pink-main);
        }

        .search-tags {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 1.5rem;
          font-size: 0.875rem;
          color: var(--text-muted);
          flex-wrap: wrap;
        }
        .tag {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 6px 12px;
          border-radius: 100px;
          color: #64748b;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tag:hover {
          background: var(--pink-light);
          color: var(--pink-main);
          border-color: #fbcfe8;
        }

        /* --- Right Visual Composition (STATIC) --- */
        .hero-visual {
          position: relative;
          height: 100%;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .visual-composition {
          position: relative;
          width: 100%;
          max-width: 500px;
        }

        .image-grid-4x4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(4, 1fr);
          gap: 4px;
          width: 100%;
          height: 440px;
          position: relative;
          z-index: 2;
          background: #ffffff;
          padding: 4px;
          border-radius: 16px;
        }

        .grid-item {
          overflow: hidden;
          position: relative;
          border-radius: 2px;
        }

        .grid-item img {
          position: absolute;
          width: 400%; /* 4 columns */
          height: 400%; /* 4 rows */
          object-fit: cover;
        }

        .play-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--pink-main);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .play-button:hover {
          transform: translate(-50%, -50%) scale(1.1);
          background: #ffffff;
        }
        .pulse-ring::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(236, 72, 153, 0.4);
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          z-index: -1;
        }

        /* Overlapping Cards (Static Positioning) */
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          position: absolute;
          z-index: 3;
        }

        .review-card {
          bottom: 40px;
          left: -40px;
          padding: 20px;
          max-width: 240px;
        }
        .stars {
          display: flex;
          gap: 4px;
          margin-bottom: 12px;
        }
        .card-text {
          font-weight: 600;
          font-size: 0.95rem;
          line-height: 1.4;
          color: #1e293b;
          margin-bottom: 8px;
        }
        .card-author {
          font-size: 0.8rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .stat-card {
          top: 60px;
          right: -30px;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .stat-icon-box {
          background: var(--pink-light);
          padding: 12px;
          border-radius: 12px;
        }
        .stat-num {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1;
        }
        .stat-desc {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 500;
          margin-top: 4px;
        }

        /* --- Animations --- */
        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          opacity: 0;
          animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          opacity: 0;
          animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }

        @keyframes blob-bounce {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(20px, -50px) scale(1.1); }
        }

        /* --- Responsive Breakpoints --- */
        
        /* Tablet / Smaller Desktops */
        @media (max-width: 1024px) {
          .hero-light-wrapper {
             padding: 80px 0;
          }
          .hero-container {
            display: flex;
            flex-direction: column-reverse;
            text-align: center;
            gap: 60px;
          }
          .hero-visual {
            width: 100%;
            min-height: auto;
          }
          .visual-composition {
            max-width: 400px;
            margin: 0 auto;
          }
          .image-grid-4x4 {
            height: 360px;
          }
          .hero-content {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .badge-pill { 
            margin: 0 auto 2rem; 
          }
          .hero-subtitle { margin: 0 auto 3rem; }
          .search-container { margin: 0 auto; width: 100%; }
          .search-tags { justify-content: center; }
          
          /* Keep cards visible but pull them in slightly */
          .review-card { left: -20px; bottom: 10px; }
          .stat-card { right: -20px; top: 20px; }
        }

        /* Mobile Phones */
        @media (max-width: 640px) {
          .hero-light-wrapper { 
            padding: 60px 0 40px; 
          }
          .hero-title { font-size: 2.25rem; }
          
          /* Stack the search bar */
          .search-bar { 
            flex-direction: column; 
            background: transparent; 
            border: none; 
            box-shadow: none; 
            padding: 0; 
            gap: 12px; 
          }
          .search-input-wrapper { 
            background: #ffffff; 
            border: 1px solid #e2e8f0; 
            padding: 12px 16px; 
            border-radius: 12px; 
            width: 100%; 
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          }
          .search-icon { margin-right: 12px; }
          .search-input { width: 100%; padding: 0; text-align: left; }
          .btn-pink { width: 100%; padding: 14px; font-size: 1rem; }
          
          .image-grid-4x4 { height: 280px; }
          
          /* Keep pill horizontal but wrap text if needed */
          .badge-pill { 
            flex-direction: row; 
            border-radius: 100px; 
            padding: 4px 12px 4px 4px; 
            gap: 8px; 
            flex-wrap: wrap; 
            justify-content: center; 
          }
          .badge-tag { font-size: 0.65rem; }
          .badge-text { font-size: 0.75rem; text-align: center; }
          
          /* Scale cards down and change origin to prevent horizontal overflow */
          .visual-composition { max-width: 300px; }
          .review-card { 
            left: -10px; 
            bottom: -15px; 
            transform: scale(0.75); 
            transform-origin: bottom left;
          }
          .stat-card { 
            right: -10px; 
            top: -15px; 
            transform: scale(0.75); 
            transform-origin: top right;
          }
          
          .search-tags { gap: 8px; }
          .tag { padding: 4px 10px; font-size: 0.75rem; }
        }
      `}</style>
    </div>
  );
};

export default Hero;
