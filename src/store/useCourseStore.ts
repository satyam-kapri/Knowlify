import { create } from "zustand";

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  instructor_id: string;
  thumbnail_url: string;
  created_at: string;
  course_contents?: CourseContent[];
}

export interface CourseContent {
  id: string;
  course_id: string;
  title: string;
  type: "video" | "pdf" | "quiz" | "exam";
  url: string;
  order: number;
  created_at: string;
}

interface CourseState {
  courses: Course[];
  selectedCourse: Course | null;
  setCourses: (courses: Course[]) => void;
  addCourse: (course: Course) => void;
  setSelectedCourse: (course: Course | null) => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  selectedCourse: null,
  setCourses: (courses) => set({ courses }),
  addCourse: (course) =>
    set((state) => ({ courses: [course, ...state.courses] })),
  setSelectedCourse: (course) => set({ selectedCourse: course }),
}));
