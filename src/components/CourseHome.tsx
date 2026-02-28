import React from "react";
import {
  PlayCircle,
  FileText,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCourseStore } from "../store/useCourseStore";
import { supabase } from "../lib/supabase";
import { Button } from "./ui/button";

const CourseHome = () => {
  const { selectedCourse, setSelectedCourse } = useCourseStore();
  const [lessons, setLessons] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchContents = async () => {
      if (!selectedCourse) return;

      console.log("Fetching contents for course:", selectedCourse.id);
      const { data, error } = await supabase
        .from("course_contents")
        .select("*")
        .eq("course_id", selectedCourse.id)
        .order("order", { ascending: true });

      if (error) {
        console.error("Error fetching contents:", error);
      } else {
        console.log("Fetched contents:", data);
        setLessons(data || []);
      }
      setLoading(false);
    };

    fetchContents();
  }, [selectedCourse]);

  if (!selectedCourse) return null;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="bg-muted/30 border-b py-12">
        <div className="container mx-auto px-6">
          <button
            onClick={() => setSelectedCourse(null)}
            className="flex items-center space-x-2 text-primary hover:underline mb-6 text-sm font-bold uppercase tracking-widest"
          >
            <ChevronLeft size={14} />
            <span>Back to Marketplace</span>
          </button>

          <div className="flex items-center space-x-2 text-primary mb-4 text-xs font-bold uppercase tracking-widest">
            <span>My Courses</span>
            <ChevronRight size={12} />
            <span className="text-muted-foreground">
              {selectedCourse.title}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            {selectedCourse.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-medium text-sm">
            <div className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
              <CheckCircle size={16} />
              <span className="font-bold">Active Module</span>
            </div>
            <span>{lessons.length} Lessons</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
            <span>Instructed by @Internal_AI</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12 flex flex-col lg:flex-row gap-12">
        {/* Lesson List */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              Course <span className="text-muted-foreground">Index</span>
            </h2>
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {lessons.length} Blocks Total
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-muted animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : lessons.length > 0 ? (
            lessons.map((lesson, idx) => (
              <div
                key={lesson.id}
                onClick={() => {
                  if (lesson.type === "video" || lesson.type === "pdf") {
                    window.open(lesson.url, "_blank");
                  }
                }}
                className="bg-card border rounded-xl p-5 flex items-center justify-between hover:border-primary/50 transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-muted-foreground/40 font-mono text-lg w-6 font-bold">
                    {(idx + 1).toString().padStart(2, "0")}
                  </div>
                  <div className="p-3 bg-muted rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {lesson.type === "video" ? (
                      <PlayCircle size={22} />
                    ) : (
                      <FileText size={22} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold group-hover:text-primary transition-colors text-lg">
                      {lesson.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-muted rounded text-muted-foreground">
                        {lesson.type}
                      </span>
                      {lesson.type === "video" && (
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                          • High Definition
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-tighter text-[10px]"
                  >
                    Access Data
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-muted/20 border border-dashed rounded-2xl p-12 text-center">
              <div className="text-muted-foreground font-bold uppercase tracking-widest text-sm">
                No data blocks indexed for this module.
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-96 space-y-8">
          <div className="bg-card border rounded-2xl p-8 shadow-sm">
            <h3 className="font-bold mb-6 text-sm uppercase tracking-widest">
              Deployment Progress
            </h3>
            <div className="w-full bg-muted h-3 rounded-full mb-4 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-1000"
                style={{ width: "0%" }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Knowledge Gained
              </span>
              <span className="text-xs font-bold text-primary">0%</span>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
            <h3 className="font-bold text-primary mb-3 text-sm uppercase tracking-widest">
              Resource Manifest
            </h3>
            <p className="text-sm text-muted-foreground font-medium mb-6 leading-relaxed">
              All assets for this module are hosted on the decentralized storage
              network.
            </p>
            <Button className="w-full font-bold uppercase tracking-widest h-11 text-xs shadow-lg shadow-primary/20">
              Download Source ZIP
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHome;
