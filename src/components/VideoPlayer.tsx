import { ChevronLeft, Maximize, Settings, Volume2 } from "lucide-react";

const VideoPlayer = () => {
  return (
    <div className="player-page">
      {/* Top Bar */}
      <div className="player-top-bar glass">
        <button className="player-back-btn">
          <ChevronLeft size={24} />
          <span>Library</span>
        </button>
        <div className="player-info">
          <h1 className="player-title">4. Core Concepts Deep Dive</h1>
          <p className="player-subtitle">Introduction to Computer Science</p>
        </div>
        <div className="player-spacer"></div>
      </div>

      {/* Main Content */}
      <main className="player-main">
        <div className="video-container group">
          <div className="video-screen card">
            {/* Mock Video UI */}
            <img
              src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1200&q=80"
              alt="Video Content"
              className="video-poster"
            />

            <div className="play-overlay">
              <div className="play-btn-large">
                <div className="play-icon-shape"></div>
              </div>
            </div>

            {/* Controls */}
            <div className="player-controls">
              <div className="progress-bar-container">
                <div className="progress-fill-bg">
                  <div
                    className="progress-fill-active"
                    style={{ width: "33%" }}
                  >
                    <div className="progress-handle"></div>
                  </div>
                </div>
              </div>

              <div className="controls-row">
                <div className="controls-left">
                  <div className="play-icon-small"></div>
                  <div className="volume-control">
                    <Volume2 size={20} />
                    <div className="volume-slider">
                      <div
                        className="volume-fill"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                  <span className="time-display">04:20 / 12:45</span>
                </div>

                <div className="controls-right">
                  <Settings size={20} className="control-icon" />
                  <Maximize size={20} className="control-icon" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Info */}
      <footer className="player-footer">
        <div className="footer-content container">
          <div className="info-header">
            <h2 className="info-title">About this lesson</h2>
            <button className="btn btn-outline next-btn">Next Lesson</button>
          </div>
          <p className="lesson-desc">
            In this deep dive, we explore the fundamental building blocks of
            modern computing. We'll cover binary logic, memory management, and
            how high-level code eventually gets executed by the CPU.
            Understanding these "under the hood" mechanics is crucial for any
            serious software engineer.
          </p>
        </div>
      </footer>

      <style>{`
        .player-page {
          min-height: 100vh;
          background: #fff;
          color: var(--text-primary);
          display: flex;
          flex-direction: column;
        }

        .player-top-bar {
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 10;
          background: white;
          border-bottom: 1.5px solid var(--border-color);
        }

        .player-back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          transition: var(--transition);
          font-weight: 700;
        }

        .player-back-btn:hover {
          color: var(--text-primary);
        }

        .player-info {
          text-align: center;
        }

        .player-title {
          font-size: 1.2rem;
          font-weight: 800;
          margin-bottom: 0.25rem;
          color: var(--text-primary);
        }

        .player-subtitle {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-secondary);
          font-weight: 800;
        }

        .player-spacer { width: 120px; }

        .player-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          background: #f8f8f6;
        }

        .video-container {
          width: 100%;
          max-width: 1100px;
          position: relative;
        }

        .video-screen {
          aspect-ratio: 16/9;
          background: #000;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          padding: 0;
          border: 1.5px solid var(--border-color);
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.15);
        }

        .video-poster {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.7;
        }

        .play-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .play-btn-large {
          width: 85px;
          height: 85px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .play-btn-large:hover {
          transform: scale(1.1);
        }

        .play-icon-shape {
          width: 0;
          height: 0;
          border-top: 15px solid transparent;
          border-left: 25px solid black;
          border-bottom: 15px solid transparent;
          margin-left: 8px;
        }

        .player-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2.5rem;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          opacity: 0;
          transition: var(--transition);
        }

        .video-container:hover .player-controls {
          opacity: 1;
        }

        .progress-bar-container {
          margin-bottom: 1.5rem;
          cursor: pointer;
        }

        .progress-fill-bg {
          height: 5px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 100px;
          position: relative;
        }

        .progress-fill-active {
          height: 100%;
          background: white;
          border-radius: 100px;
          position: relative;
        }

        .progress-handle {
          position: absolute;
          right: -8px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }

        .controls-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .controls-left, .controls-right {
          display: flex;
          align-items: center;
          gap: 2.5rem;
        }

        .play-icon-small {
          width: 0;
          height: 0;
          border-top: 10px solid transparent;
          border-left: 16px solid white;
          border-bottom: 10px solid transparent;
          cursor: pointer;
        }

        .volume-control {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .volume-slider {
          width: 80px;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 100px;
        }

        .volume-fill {
          height: 100%;
          background: #fff;
          border-radius: 100px;
        }

        .time-display {
          font-family: monospace;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 600;
        }

        .control-icon {
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          transition: var(--transition);
        }

        .control-icon:hover {
          color: #fff;
        }

        .player-footer {
          background: white;
          padding: 5rem 0;
          border-top: 1.5px solid var(--border-color);
        }

        .info-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
        }

        .info-title {
          font-size: 2rem;
          font-weight: 900;
          color: var(--text-primary);
          letter-spacing: -0.04em;
        }

        .lesson-desc {
          color: var(--text-secondary);
          line-height: 1.8;
          max-width: 850px;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .next-btn {
          padding: 12px 35px;
          background: #f8f8f6;
          border-color: var(--border-color);
          font-weight: 800;
        }
        
        .next-btn:hover {
          background: var(--text-primary);
          color: white;
        }

        @media (max-width: 768px) {
          .player-spacer { display: none; }
          .player-main { padding: 1.5rem; }
          .controls-left, .controls-right { gap: 1.5rem; }
          .volume-control { display: none; }
          .info-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;
