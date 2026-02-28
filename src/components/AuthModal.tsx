import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { Shield, Zap, X } from "lucide-react";

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "instructor">("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: role,
            },
          },
        });
        if (error) throw error;
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay animate-fadeIn" onClick={onClose}>
      <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={22} />
        </button>

        <div className="modal-body">
          <div className="modal-header">
            <h2 className="modal-title">
              {isLogin ? "Welcome Back" : "Join Knowlify"}
            </h2>
            <p className="modal-subtitle">
              {isLogin
                ? "Enter your credentials to access your course materials."
                : "Create an account to start your learning journey."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="form-input"
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">I am a</label>
                <div className="role-selection">
                  <button
                    type="button"
                    className={`role-btn ${role === "student" ? "active" : ""}`}
                    onClick={() => setRole("student")}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`role-btn ${role === "instructor" ? "active" : ""}`}
                    onClick={() => setRole("instructor")}
                  >
                    Instructor
                  </button>
                </div>
              </div>
            )}

            {error && <p className="form-error">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full auth-submit"
            >
              {loading
                ? "Processing..."
                : isLogin
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>

          <div className="modal-footer">
            <p className="switch-auth-text">
              {isLogin ? "Don't have an account?" : "Already a member?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="switch-auth-btn"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>

            <div className="auth-trust-badges">
              <div className="trust-badge">
                <Shield size={14} />
                <span>Secure SSL</span>
              </div>
              <div className="trust-badge">
                <Zap size={14} />
                <span>Instant Setup</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        :root {
          --text-main: #0f172a;
          --text-muted: #64748b;
          --pink-main: #ec4899;
          --pink-light: #fdf2f8;
          --pink-gradient: linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%);
          --bg-slate: #f8fafc;
          --border-soft: #e2e8f0;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1.5rem;
        }

        .modal-content {
          width: 100%;
          max-width: 480px;
          background: white;
          padding: 3.5rem;
          position: relative;
          box-shadow: 0 40px 80px rgba(236, 72, 153, 0.1);
          border-radius: 32px;
          border: 1px solid var(--border-soft);
        }

        .modal-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          color: var(--text-muted);
          transition: color 0.2s;
        }

        .modal-close:hover {
          color: var(--pink-main);
        }

        .modal-header {
          margin-bottom: 2.5rem;
          text-align: center;
        }

        .modal-title {
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
          color: var(--text-main);
          letter-spacing: -0.04em;
        }

        .modal-subtitle {
          font-size: 1rem;
          color: var(--text-muted);
          line-height: 1.5;
          font-weight: 500;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .form-label {
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-main);
        }

        .form-input {
          width: 100%;
          padding: 1rem 1.25rem;
          font-size: 1rem;
          border-radius: 16px;
          background: var(--bg-slate);
          border: 1px solid var(--border-soft);
          transition: all 0.2s;
        }
        
        .form-input:focus {
          border-color: #fbcfe8;
          background: white;
          box-shadow: 0 0 0 4px var(--pink-light);
          outline: none;
        }

        .role-selection {
          display: flex;
          gap: 1rem;
        }

        .role-btn {
          flex: 1;
          padding: 0.75rem;
          border-radius: 12px;
          border: 1px solid var(--border-soft);
          background: var(--bg-slate);
          font-weight: 700;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .role-btn.active {
          background: var(--pink-light);
          color: var(--pink-main);
          border-color: var(--pink-main);
        }

        .form-error {
          font-size: 0.85rem;
          color: var(--pink-main);
          font-weight: 700;
          background: var(--pink-light);
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(236, 72, 153, 0.2);
        }

        .auth-submit {
          padding: 16px;
          font-size: 1rem;
          font-weight: 700;
          border-radius: 16px;
          margin-top: 0.5rem;
          background: var(--pink-gradient);
          color: white;
          border: none;
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 10px 20px rgba(236, 72, 153, 0.3);
        }

        .auth-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(236, 72, 153, 0.4);
        }

        .auth-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .modal-footer {
          margin-top: 2.5rem;
          padding-top: 2.5rem;
          border-top: 1px solid var(--border-soft);
          text-align: center;
        }

        .switch-auth-text {
          font-size: 1rem;
          color: var(--text-muted);
          margin-bottom: 2rem;
          font-weight: 500;
        }

        .switch-auth-btn {
          color: var(--pink-main);
          font-weight: 800;
          margin-left: 0.25rem;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          text-decoration: none;
        }
        
        .switch-auth-btn:hover {
          text-decoration: underline;
        }

        .auth-trust-badges {
          display: flex;
          justify-content: center;
          gap: 2rem;
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.05em;
          opacity: 0.6;
        }

        .trust-badge svg {
          color: var(--pink-main);
        }
      `}</style>
    </div>
  );
};

export default AuthModal;
