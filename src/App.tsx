import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CourseList from "./components/CourseList";
import CourseHome from "./components/CourseHome";
import AuthModal from "./components/AuthModal";
import Chatbot from "./components/Chatbot";
import { useEffect } from "react";
import { supabase } from "./lib/supabase";
import { useAuthStore } from "./store/useAuthStore";
import { useCourseStore } from "./store/useCourseStore";

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { selectedCourse } = useCourseStore();
  const { setUser, setProfile } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (!error && data) {
        setProfile(data);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setProfile]);

  return (
    <div className="app-container">
      <Navbar onAuthClick={() => setShowAuthModal(true)} />

      {!selectedCourse ? (
        <main>
          <Hero />
          <CourseList />
        </main>
      ) : (
        <CourseHome />
      )}

      <Chatbot />

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      <style>{`
        .app-container {
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
}

export default App;
