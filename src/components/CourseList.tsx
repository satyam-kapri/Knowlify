import { useEffect, useState } from "react";
import { useCourseStore } from "../store/useCourseStore";
import { supabase } from "../lib/supabase";
import { ArrowRight, ArrowUpRight, Clock, Users, Star } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

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
      <div className="container mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[400px] rounded-xl bg-muted animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div id="marketplace" className="container mx-auto px-6 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-[2px] bg-primary"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Marketplace
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            The Alpha <br />
            <span className="text-muted-foreground">Collection.</span>
          </h2>
        </div>
        <div className="md:text-right space-y-4">
          <p className="text-muted-foreground font-medium text-sm max-w-xs md:ml-auto">
            Synchronized with global industry standards. Updated daily.
          </p>
          <Button variant="outline" className="group">
            Access All Modules
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Card
            key={course.id}
            onClick={() => setSelectedCourse(course)}
            className="group overflow-hidden border bg-card transition-all hover:shadow-md cursor-pointer"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={
                  course.thumbnail_url ||
                  `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80`
                }
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full"
                >
                  <ArrowUpRight size={16} />
                </Button>
              </div>
              <div className="absolute bottom-4 left-4">
                <div className="bg-background/90 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1 rounded-md shadow-sm">
                  ${course.price} USD
                </div>
              </div>
            </div>

            <CardHeader className="p-6">
              <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">
                Course Module
              </div>
              <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                {course.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <p className="text-muted-foreground text-sm font-medium line-clamp-2">
                {course.description}
              </p>
            </CardContent>

            <CardFooter className="px-6 py-4 border-t bg-muted/30 grid grid-cols-3 gap-2">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Duration
                </span>
                <span className="text-[11px] font-bold flex items-center gap-1">
                  <Clock size={10} /> 12h
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Enrolled
                </span>
                <span className="text-[11px] font-bold flex items-center gap-1">
                  <Users size={10} /> 1.2K
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Rating
                </span>
                <span className="text-[11px] font-bold text-primary flex items-center gap-1 italic">
                  <Star size={10} className="fill-current" /> TopTier
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
