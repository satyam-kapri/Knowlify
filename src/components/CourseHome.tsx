import React from "react";
import {
  PlayCircle,
  FileText,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { useCourseStore } from "../store/useCourseStore";
import { supabase } from "../lib/supabase";

const CourseHome = () => {
  const { selectedCourse, setSelectedCourse } = useCourseStore();
  const [lessons, setLessons] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchContents = async () => {
      if (!selectedCourse) return;

      const { data, error } = await supabase
        .from("course_contents")
        .select("*")
        .eq("course_id", selectedCourse.id)
        .order("order", { ascending: true });

      if (!error) {
        setLessons(data || []);
      }
      setLoading(false);
    };

    fetchContents();
  }, [selectedCourse]);

  if (!selectedCourse) return null;

  return (
    <div className="course-home animate-fade-in">
      {/* Header */}
      <header className="course-header">
        <div className="container">
          <button onClick={() => setSelectedCourse(null)} className="back-btn">
            <ChevronLeft size={16} />
            <span>Back to Marketplace</span>
          </button>

          <nav className="breadcrumb">
            <span>Library</span>
            <ChevronRight size={14} />
            <span className="current">{selectedCourse.title}</span>
          </nav>

          <h1 className="course-main-title">{selectedCourse.title}</h1>

          <div className="course-meta">
            <div className="meta-badge">
              <CheckCircle size={16} />
              <span>Verified Module</span>
            </div>
            <span className="meta-item">{lessons.length} Lessons</span>
            <span className="meta-dot"></span>
            <span className="meta-item">Instructed by Top 1% Mentors</span>
          </div>
        </div>
      </header>

      <main className="container course-main">
        <div className="lessons-section animate-slide-up">
          <div className="section-header">
            <h2 className="section-title">Module Curriculum</h2>
            <div className="lesson-count">{lessons.length} Sections</div>
          </div>

          {loading ? (
            <div className="skeleton-list">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-item pulse-bg" />
              ))}
            </div>
          ) : lessons.length > 0 ? (
            <div className="lesson-list">
              {lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  onClick={() => {
                    if (lesson.type === "video" || lesson.type === "pdf") {
                      window.open(lesson.url, "_blank");
                    }
                  }}
                  className="lesson-card"
                >
                  <div className="lesson-info">
                    <div className="lesson-index">
                      {(idx + 1).toString().padStart(2, "0")}
                    </div>
                    <div className="lesson-icon-wrapper">
                      {lesson.type === "video" ? (
                        <PlayCircle size={24} />
                      ) : (
                        <FileText size={24} />
                      )}
                    </div>
                    <div className="lesson-details">
                      <h3 className="lesson-name">{lesson.title}</h3>
                      <div className="lesson-sub-meta">
                        <span className="type-pill">{lesson.type}</span>
                        {lesson.type === "video" && (
                          <span className="quality-text">HD Available</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="access-btn">View Lesson</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No sections identified for this module yet.</p>
            </div>
          )}
        </div>

        <aside
          className="course-sidebar animate-slide-up"
          style={{ animationDelay: "150ms" }}
        >
          <div className="sidebar-widget">
            <h3 className="widget-title">Course Completion</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "0%" }}></div>
            </div>
            <div className="progress-stats">
              <span className="progress-label">Progress</span>
              <span className="progress-value">0%</span>
            </div>
          </div>

          <div className="sidebar-widget manifest-widget">
            <h3 className="widget-title">Documentation</h3>
            <p className="widget-desc">
              Download the complete documentation, architectural diagrams, and
              source assets for offline reference.
            </p>
            <button className="btn-pink w-full flex-center">
              <Download size={18} />
              <span>Download Resources</span>
            </button>
          </div>
        </aside>
      </main>

      <style>{`
        :root {
          --bg-color: #f8fafc; /* Light modern slate */
          --text-main: #0f172a;
          --text-muted: #64748b;
          --pink-main: #ec4899;
          --pink-light: #fdf2f8;
          --pink-gradient: linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%);
          --border-soft: #e2e8f0;
          --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          --shadow-md: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
          --shadow-pink: 0 10px 25px -5px rgba(236, 72, 153, 0.15);
        }

        .course-home {
          padding-top: 75px;
          min-height: 100vh;
          background: var(--bg-color);
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* --- Header --- */
        .course-header {
          padding: 60px 0;
          background: #ffffff;
          border-bottom: 1px solid var(--border-soft);
          box-shadow: var(--shadow-sm);
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 2rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0;
        }

        .back-btn:hover {
          color: var(--pink-main);
          transform: translateX(-4px);
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }

        .breadcrumb .current {
          color: var(--pink-main);
        }

        .course-main-title {
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          font-weight: 800;
          margin-bottom: 1.5rem;
          color: var(--text-main);
          letter-spacing: -0.04em;
          line-height: 1.1;
        }

        .course-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1.5rem;
        }

        .meta-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--pink-light);
          color: var(--pink-main);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 700;
          border: 1px solid rgba(236, 72, 153, 0.2);
        }

        .meta-item {
          font-size: 0.95rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .meta-dot {
          width: 4px;
          height: 4px;
          background: #cbd5e1;
          border-radius: 50%;
        }

        /* --- Main Content Grid --- */
        .course-main {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 3rem;
          margin-top: 3rem;
          padding-bottom: 4rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .lesson-count {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--pink-main);
          background: var(--pink-light);
          padding: 4px 10px;
          border-radius: 8px;
        }

        .lesson-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* --- Lesson Cards --- */
        .lesson-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          background: #ffffff;
          border: 1px solid var(--border-soft);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .lesson-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
          border-color: #fbcfe8;
        }

        .lesson-info {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .lesson-index {
          font-family: 'Space Mono', monospace;
          font-size: 1.2rem;
          font-weight: 700;
          color: #cbd5e1;
          width: 28px;
        }

        .lesson-icon-wrapper {
          width: 48px;
          height: 48px;
          background: #f1f5f9;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          transition: all 0.3s ease;
        }

        .lesson-card:hover .lesson-icon-wrapper {
          background: var(--pink-light);
          color: var(--pink-main);
        }

        .lesson-name {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          color: var(--text-main);
        }

        .lesson-sub-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .type-pill {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 6px;
          color: var(--text-muted);
        }

        .quality-text {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          color: #94a3b8;
        }

        .access-btn {
          background: transparent;
          border: none;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--pink-main);
          opacity: 0;
          transform: translateX(10px);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .lesson-card:hover .access-btn {
          opacity: 1;
          transform: translateX(0);
        }

        /* --- Sidebar --- */
        .sidebar-widget {
          background: #ffffff;
          padding: 2rem;
          margin-bottom: 1.5rem;
          border-radius: 20px;
          border: 1px solid var(--border-soft);
          box-shadow: var(--shadow-sm);
        }

        .widget-title {
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1.5rem;
          color: var(--text-main);
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #f1f5f9;
          border-radius: 100px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .progress-fill {
          height: 100%;
          background: var(--pink-gradient);
          border-radius: 100px;
          transition: width 1s ease-in-out;
        }

        .progress-stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .progress-value {
          color: var(--pink-main);
        }

        .manifest-widget {
          background: var(--pink-light);
          border-color: #fbcfe8;
        }

        .widget-desc {
          font-size: 0.9rem;
          color: #475569;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        /* --- Global Buttons & States --- */
        .btn-pink {
          background: var(--pink-gradient);
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: var(--shadow-pink);
        }
        .btn-pink:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 25px -10px var(--pink-main);
        }

        .w-full { width: 100%; }
        .flex-center { display: flex; align-items: center; justify-content: center; gap: 8px; }

        .empty-state {
          padding: 4rem;
          text-align: center;
          background: #ffffff;
          border: 2px dashed var(--border-soft);
          border-radius: 16px;
          color: var(--text-muted);
          font-weight: 600;
        }

        .skeleton-item {
          height: 85px;
          background: #ffffff;
          border: 1px solid var(--border-soft);
          border-radius: 16px;
          margin-bottom: 1rem;
        }

        /* --- Animations --- */
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fade-in {
          opacity: 0;
          animation: fade-in 0.6s ease forwards;
        }

        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          opacity: 0;
          animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes pulse-bg {
          0% { background-color: #ffffff; }
          50% { background-color: #f8fafc; }
          100% { background-color: #ffffff; }
        }
        .pulse-bg {
          animation: pulse-bg 2s infinite;
        }

        /* --- Responsive --- */
        @media (max-width: 1024px) {
          .course-main {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .course-sidebar {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
          }
          .sidebar-widget {
            margin-bottom: 0;
          }
        }

        @media (max-width: 768px) {
          .course-header { padding: 40px 0; }
          .course-main-title { font-size: 2rem; }
          .course-sidebar { grid-template-columns: 1fr; }
          .lesson-card { padding: 1rem; flex-direction: column; align-items: flex-start; gap: 1rem; }
          .access-btn { transform: translateX(0); opacity: 1; width: 100%; text-align: left; padding-left: 3.5rem; }
        }
      `}</style>
    </div>
  );
};

export default CourseHome;
