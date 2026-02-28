import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { Shield, Zap, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        const { error } = await supabase.auth.signUp({ email, password });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border shadow-lg rounded-xl overflow-hidden relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 h-8 w-8"
          onClick={onClose}
        >
          <X size={18} />
        </Button>

        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isLogin
                ? "Enter your credentials to access your dashboard."
                : "Join our community of elite learners today."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-destructive text-xs font-medium">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          <div className="flex flex-col items-center space-y-4 pt-6 mt-6 border-t">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-semibold hover:underline"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>

            <div className="flex space-x-4">
              <div className="flex items-center space-x-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <Shield size={12} className="text-primary" />
                <span>Encrypted</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <Zap size={12} className="text-primary" />
                <span>Instant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
