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
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
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
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.1);
          border-radius: 24px;
          border: 1.5px solid var(--border-color);
        }

        .modal-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          color: var(--text-secondary);
        }

        .modal-close:hover {
          color: var(--text-primary);
        }

        .modal-header {
          margin-bottom: 2.5rem;
        }

        .modal-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
          letter-spacing: -0.04em;
        }

        .modal-subtitle {
          font-size: 1rem;
          color: var(--text-secondary);
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
          color: var(--text-primary);
        }

        .form-input {
          width: 100%;
          padding: 1rem 1.25rem;
          font-size: 1rem;
          border-radius: 12px;
          background: #f8f8f6;
        }
        
        .form-input:focus {
          background: white;
        }

        .role-selection {
          display: flex;
          gap: 1rem;
        }

        .role-btn {
          flex: 1;
          padding: 0.75rem;
          border-radius: 10px;
          border: 1.5px solid var(--border-color);
          background: #f8f8f6;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .role-btn.active {
          background: var(--text-primary);
          color: white;
          border-color: var(--text-primary);
        }

        .form-error {
          font-size: 0.85rem;
          color: #d00;
          font-weight: 700;
          background: #fee;
          padding: 12px 16px;
          border-radius: 8px;
        }

        .auth-submit {
          padding: 16px;
          font-size: 1rem;
          border-radius: 12px;
          margin-top: 0.5rem;
        }

        .modal-footer {
          margin-top: 2.5rem;
          padding-top: 2.5rem;
          border-top: 1.5px solid var(--border-color);
          text-align: center;
        }

        .switch-auth-text {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          font-weight: 500;
        }

        .switch-auth-btn {
          color: var(--text-primary);
          font-weight: 800;
          margin-left: 0.25rem;
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
          color: #bbb;
          letter-spacing: 0.05em;
        }

        .trust-badge svg {
          color: #000;
        }
      `}</style>
    </div>
  );
};

export default AuthModal;
