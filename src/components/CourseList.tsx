import { useEffect, useState } from "react";
import { useCourseStore } from "../store/useCourseStore";
import { supabase } from "../lib/supabase";
import { ArrowRight, ArrowUpRight, Clock, Users, Star } from "lucide-react";

const CourseList = () => {
  const { courses, setCourses, setSelectedCourse } = useCourseStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*, course_contents(*)")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setCourses(data);
      }
      setLoading(false);
    };

    fetchCourses();
  }, [setCourses]);

  if (loading) {
    return (
      <div className="container marketplace-loading">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton-card pulse-bg"></div>
        ))}
      </div>
    );
  }

  return (
    <div id="marketplace" className="marketplace">
      <div className="container">
        <div className="marketplace-header animate-slide-up">
          <div className="header-left">
            <div className="section-label">
              <span className="label-line"></span>
              <span className="label-text">Marketplace</span>
            </div>
            <h2 className="marketplace-title">
              The Alpha <br />
              <span className="text-pink-gradient">Collection.</span>
            </h2>
          </div>
          <div className="header-right">
            <p className="marketplace-desc">
              Synchronized with global industry standards. High-tier modules
              updated daily.
            </p>
            <button className="btn-outline-pink marketplace-all-btn">
              Access All Modules
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="course-grid">
          {courses.map((course, index) => (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="course-card animate-slide-up"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="course-thumb-wrapper">
                <img
                  src={
                    course.thumbnail_url ||
                    `https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80`
                  }
                  alt={course.title}
                  className="course-thumb"
                />
                <div className="course-badge">${course.price} USD</div>
                <div className="course-hover-btn">
                  <ArrowUpRight size={18} />
                </div>
              </div>

              <div className="course-content">
                <div className="course-module-label">Module Asset</div>
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{course.description}</p>
              </div>

              <div className="course-footer">
                <div className="footer-stat">
                  <span className="stat-label">Duration</span>
                  <span className="stat-val">
                    <Clock size={14} className="stat-icon" /> 12h
                  </span>
                </div>
                <div className="footer-stat">
                  <span className="stat-label">Enrolled</span>
                  <span className="stat-val">
                    <Users size={14} className="stat-icon" /> 1.2K
                  </span>
                </div>
                <div className="footer-stat">
                  <span className="stat-label">Rating</span>
                  <span className="stat-val rating">
                    <Star
                      size={14}
                      fill="currentColor"
                      className="stat-icon-pink"
                    />{" "}
                    TopTier
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        :root {
          --bg-color: #ffffff;
          --bg-slate: #f8fafc;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --pink-main: #ec4899;
          --pink-light: #fdf2f8;
          --pink-gradient: linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%);
          --border-soft: #e2e8f0;
          --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          --shadow-hover: 0 20px 40px -10px rgba(236, 72, 153, 0.15);
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .marketplace {
          padding: 140px 0;
          background: var(--bg-color);
          font-family: var(--font-sans);
        }

        /* --- Header --- */
        .marketplace-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 4rem;
          gap: 2rem;
        }

        .section-label {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .label-line {
          width: 50px;
          height: 2px;
          background: var(--pink-main);
          border-radius: 2px;
        }

        .label-text {
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--pink-main);
        }

        .marketplace-title {
          font-family: var(--font-heading);
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--text-main);
        }

        .text-pink-gradient {
          background: var(--pink-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1rem;
          text-align: right;
        }

        .marketplace-desc {
          font-size: 0.875rem;
          color: var(--text-muted);
          max-width: 280px;
          line-height: 1.6;
          font-weight: 400;
        }

        .btn-outline-pink {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 8px 16px;
          background: transparent;
          color: var(--pink-main);
          border: 1px solid #fbcfe8;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-outline-pink:hover {
          background: var(--pink-light);
          border-color: var(--pink-main);
          transform: translateY(-2px);
        }

        .btn-outline-pink:hover svg {
          transform: translateX(4px);
        }

        /* --- Grid & Cards --- */
        .course-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        @media (max-width: 640px) {
          .course-grid {
            grid-template-columns: 1fr;
          }
        }

        .course-card {
          padding: 0;
          background: #ffffff;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          border-radius: 16px;
          border: 1px solid var(--border-soft);
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
        }

        .course-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-hover);
          border-color: #fbcfe8;
        }

        .course-thumb-wrapper {
          position: relative;
          aspect-ratio: 16/9;
          overflow: hidden;
          background: var(--bg-slate);
        }

        .course-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.2, 0, 0, 1);
        }

        .course-card:hover .course-thumb {
          transform: scale(1.05);
        }

        .course-badge {
          position: absolute;
          bottom: 1.25rem;
          left: 1.25rem;
          background: var(--pink-gradient);
          color: white;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
          z-index: 2;
        }

        .course-hover-btn {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          width: 44px;
          height: 44px;
          background: #ffffff;
          color: var(--pink-main);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateY(10px);
          transition: var(--transition);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
          z-index: 2;
        }

        .course-card:hover .course-hover-btn {
          opacity: 1;
          transform: translateY(0);
        }

        /* --- Card Content --- */
        .course-content {
          padding: 1.5rem;
          flex: 1;
        }

        .course-module-label {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--pink-main);
          background: var(--pink-light);
          display: inline-block;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }

        .course-title {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          line-height: 1.3;
          color: var(--text-main);
        }

        .course-description {
          font-size: 0.8rem;
          color: var(--text-muted);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.6;
          font-weight: 400;
        }

        /* --- Card Footer --- */
        .course-footer {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          padding: 1rem 1.5rem;
          background: var(--bg-slate);
          border-top: 1px solid var(--border-soft);
        }

        .footer-stat {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .stat-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          color: #94a3b8;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .stat-val {
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-main);
        }

        .stat-icon {
          color: #cbd5e1;
        }

        .stat-icon-pink {
          color: var(--pink-main);
        }

        .stat-val.rating {
          color: var(--text-main);
        }

        /* --- Loading State --- */
        .marketplace-loading {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2.5rem;
          padding: 120px 0;
        }

        .skeleton-card {
          height: 440px;
          border-radius: 24px;
          border: 1px solid var(--border-soft);
        }

        @keyframes pulse-bg {
          0% { background-color: #f1f5f9; }
          50% { background-color: #e2e8f0; }
          100% { background-color: #f1f5f9; }
        }
        .pulse-bg {
          animation: pulse-bg 2s infinite ease-in-out;
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

        /* --- Responsive --- */
        @media (max-width: 768px) {
          .marketplace-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .header-right {
            align-items: flex-start;
            text-align: left;
          }
          .course-grid {
            grid-template-columns: 1fr;
          }
          .course-card {
            border-radius: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseList;
