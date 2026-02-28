import React, { useEffect, useState } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { useCourseStore } from "./store/useCourseStore";
import { supabase } from "./lib/supabase";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CourseList from "./components/CourseList";
import CourseHome from "./components/CourseHome";
import AuthModal from "./components/AuthModal";
import Chatbot from "./components/Chatbot";

function App() {
  const { setUser, loading } = useAuthStore();
  const { selectedCourse } = useCourseStore();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark overflow-x-hidden">
      {/* Background Aesthetic Grid */}
      {!selectedCourse && (
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-grid bg-grid-fade" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
      )}

      <div className="relative z-10">
        <Navbar onAuthClick={() => setShowAuthModal(true)} />
        <main>
          {selectedCourse ? (
            <CourseHome />
          ) : (
            <>
              <Hero />
              <CourseList />
            </>
          )}
        </main>
        <Chatbot />
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      <div className="noise-bg" />
    </div>
  );
}

export default App;
