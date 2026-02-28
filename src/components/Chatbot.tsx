import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  X,
  Loader2,
  FolderUp,
  Terminal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import JSZip from "jszip";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/useAuthStore";
import { useCourseStore } from "../store/useCourseStore";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Input } from "./ui/input";

interface Message {
  id: string;
  role: "bot" | "user";
  content: string;
  type?: "upload" | "metadata" | "success" | "thumbnail";
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content:
        "WELCOME TO KNOWLIFY.OS. I AM YOUR ARCHITECT. READY TO TRANSMIT KNOWLEDGE TO THE GLOBAL NETWORK?",
    },
    {
      id: "2",
      role: "bot",
      content:
        "TO BEGIN, PLEASE UPLOAD YOUR COURSE ARCHIVE (ZIP) OR DIRECTORY CONTAINING THE LEARNING MODULES.",
      type: "upload",
    },
  ]);
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [courseData, setCourseData] = useState<any>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [step, setStep] = useState<"upload" | "thumbnail" | "metadata">(
    "upload",
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();
  const { addCourse } = useCourseStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    if (step === "metadata") {
      processMetadata(input);
    } else {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "bot",
            content:
              "COMMAND NOT RECOGNIZED. I REQUIRE DATA INPUT TO PROCEED WITH THE ARCHITECTURAL PHASE.",
          },
        ]);
      }, 600);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (!user) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: "ERROR: IDENTITY NOT VERIFIED. AUTHENTICATION REQUIRED.",
        },
      ]);
      return;
    }

    setUploading(true);

    try {
      const file = files[0];
      const isZip =
        file.name.endsWith(".zip") || file.type === "application/zip";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "user",
          content: isZip
            ? `TRANSMITTING ARCHIVE: ${file.name}`
            : `UPLOADING ${files.length} DATA BLOCKS...`,
        },
      ]);

      let processedFiles: { name: string; blob: Blob; type: string }[] = [];
      let courseName = "";

      if (isZip) {
        const zip = new JSZip();
        const contents = await zip.loadAsync(file);
        courseName = file.name.replace(".zip", "");

        const extractPromises = Object.keys(contents.files)
          .filter((path) => !contents.files[path].dir)
          .map(async (path) => {
            const zipFile = contents.files[path];
            const blob = await zipFile.async("blob");
            const ext = path.split(".").pop()?.toLowerCase();
            let type = "other";
            if (["mp4", "mov", "avi"].includes(ext || "")) type = "video";
            else if (ext === "pdf") type = "pdf";

            return { name: path, blob, type };
          });

        processedFiles = await Promise.all(extractPromises);
      } else {
        courseName = files[0].webkitRelativePath.split("/")[0] || "NEW_MODULE";
        processedFiles = Array.from(files).map((f) => {
          const ext = f.name.split(".").pop()?.toLowerCase();
          let type = "other";
          if (["mp4", "mov", "avi"].includes(ext || "")) type = "video";
          else if (ext === "pdf") type = "pdf";
          return { name: f.name, blob: f, type };
        });
      }

      setCourseData({
        files: processedFiles,
        instructor_id: user.id,
      });

      setUploading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: `DATA SYNC COMPLETE: "${courseName}". ${processedFiles.length} ASSETS IDENTIFIED.`,
        },
        {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content:
            "NOW, PLEASE PROVIDE A VISUAL IDENTITY (THUMBNAIL) FOR THIS COURSE.",
          type: "thumbnail",
        },
      ]);
      setStep("thumbnail");
    } catch (error) {
      console.error(error);
      setUploading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: "SYNC_ERROR: LINK INTERRUPTED.",
        },
      ]);
    }
  };

  const handleThumbnailUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setThumbnailFile(file);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: `THUMBNAIL ATTACHED: ${file.name}`,
      },
      {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: "VISUAL IDENTITY SECURED. FINAL STEP: DEFINE COURSE SCHEMA.",
      },
      {
        id: (Date.now() + 2).toString(),
        role: "bot",
        content: "PLEASE ENTER: [TITLE], [DESCRIPTION], [PRICE]",
        type: "metadata",
      },
    ]);
    setStep("metadata");
  };

  const processMetadata = async (metadataStr: string) => {
    const parts = metadataStr.split(",");
    const title = parts[0]?.trim();
    const description = parts[1]?.trim();
    const price = parts[2]?.trim();

    if (!title || !description || !price) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content:
            "SCHEMA ERROR: ATTRIBUTES INCOMPLETE. FORMAT REQUIRED: [TITLE], [DESCRIPTION], [PRICE]",
          type: "metadata",
        },
      ]);
      return;
    }

    setUploading(true);

    try {
      console.log("Starting metadata process for:", title);
      let thumbnailUrl =
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80";

      // 1. Create Course Skeleton to get ID
      const { data: courseDataRes, error: courseError } = await supabase
        .from("courses")
        .insert([
          {
            title,
            description,
            price: parseFloat(price),
            instructor_id: user?.id,
            thumbnail_url: thumbnailUrl, // temp
          },
        ])
        .select();

      if (courseError || !courseDataRes) throw courseError;
      const newCourse = courseDataRes[0];

      // 2. Upload Thumbnail if exists
      if (thumbnailFile) {
        const thumbExt = thumbnailFile.name.split(".").pop();
        const thumbPath = `${newCourse.id}/thumbnail.${thumbExt}`;
        console.log("Uploading thumbnail to:", thumbPath);
        const { error: thumbUploadError, data: thumbData } =
          await supabase.storage
            .from("course-assets")
            .upload(thumbPath, thumbnailFile);

        if (thumbUploadError) {
          console.error("Thumbnail upload error:", thumbUploadError);
        }

        if (!thumbUploadError) {
          console.log("Thumbnail uploaded successfully:", thumbData);
          const {
            data: { publicUrl },
          } = supabase.storage.from("course-assets").getPublicUrl(thumbPath);
          thumbnailUrl = publicUrl;

          // Update course with actual thumbnail URL
          await supabase
            .from("courses")
            .update({ thumbnail_url: thumbnailUrl })
            .eq("id", newCourse.id);

          newCourse.thumbnail_url = thumbnailUrl;
        }
      }

      // 3. Upload Files to Storage and create DB entries
      if (courseData && courseData.files) {
        console.log(`Uploading ${courseData.files.length} files...`);

        // Use a loop instead of Promise.all for better reliability and debugging
        for (let index = 0; index < courseData.files.length; index++) {
          const file = courseData.files[index];
          const filePath = `${newCourse.id}/${file.name}`;

          console.log(
            `[${index + 1}/${courseData.files.length}] Processing: ${file.name}`,
          );

          // Upload to Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from("course-assets")
            .upload(filePath, file.blob, {
              upsert: true,
            });

          if (uploadError) {
            console.error(`Upload failed for ${file.name}:`, uploadError);
            continue; // Move to next file
          }

          // Get Public URL
          const { data: urlData } = supabase.storage
            .from("course-assets")
            .getPublicUrl(filePath);

          const publicUrl = urlData.publicUrl;

          // Create Course Content entry
          const { error: contentError } = await supabase
            .from("course_contents")
            .insert({
              course_id: newCourse.id,
              title: file.name.split(".")[0],
              type: file.type === "other" ? "pdf" : file.type,
              url: publicUrl,
              order: index,
            });

          if (contentError) {
            console.error(
              `Database entry failed for ${file.name}:`,
              contentError,
            );
            throw new Error(
              `Failed to index file: ${file.name}. ${contentError.message}`,
            );
          }

          console.log(`Indexed successfully: ${file.name}`);
        }
      }

      addCourse(newCourse);
      setUploading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: `CONGRATULATIONS. "${title}" HAS BEEN MANIFESTED ON THE GLOBAL NETWORK. KNOWLEDGE DISTRIBUTION COMMENCING.`,
          type: "success",
        },
      ]);
      setStep("upload");
      setThumbnailFile(null);
      setCourseData(null);
    } catch (error: any) {
      console.error(error);
      setUploading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: `SYNC_ERROR: ${error.message || "DB WRITE FAILED."}`,
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mb-4 mr-2"
          >
            <div className="relative">
              <div className="bg-primary text-primary-foreground text-[10px] font-bold px-4 py-2 rounded-lg shadow-xl uppercase tracking-widest animate-bounce">
                Upload Course Here
                <div className="absolute -bottom-1 right-6 w-3 h-3 bg-primary rotate-45"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="mb-4"
          >
            <Card className="w-[380px] h-[550px] flex flex-col shadow-2xl border-primary/20 bg-background/95 backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b">
                <div className="flex items-center space-x-2">
                  <Terminal size={18} className="text-primary" />
                  <CardTitle className="text-sm font-bold uppercase tracking-widest">
                    Knowlify.OS
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={18} />
                </Button>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 text-xs font-medium ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="leading-relaxed">
                        {/* {m.role === "bot" ? "> " : ""} */}
                        {m.content}
                      </p>

                      {m.type === "upload" && !uploading && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-3 w-full h-8 text-[10px] font-bold uppercase tracking-wider"
                        >
                          <FolderUp size={14} className="mr-2" />
                          Initialize Upload
                        </Button>
                      )}

                      {m.type === "thumbnail" && !uploading && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => thumbInputRef.current?.click()}
                          className="mt-3 w-full h-8 text-[10px] font-bold uppercase tracking-wider"
                        >
                          <FolderUp size={14} className="mr-2" />
                          Upload Thumbnail
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {uploading && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-2 text-primary bg-primary/5 px-4 py-2 rounded-2xl">
                      <Loader2 className="animate-spin" size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        Processing...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              <CardFooter className="p-4 border-t">
                <div className="flex w-full items-center space-x-2">
                  <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Enter command..."
                    className="flex-1 h-9 text-xs"
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    className="h-9 w-9 rounded-md"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 z-10"
      >
        <MessageSquare size={28} />
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />

      <input
        type="file"
        ref={thumbInputRef}
        onChange={handleThumbnailUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default Chatbot;
