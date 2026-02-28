import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  X,
  Loader2,
  FolderUp,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import JSZip from "jszip";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/useAuthStore";
import { useCourseStore } from "../store/useCourseStore";
import { getChatGPTResponse, getChatGPTJSON } from "../lib/openai";
import { extractFolderId, listDriveFiles, getFileBlob } from "../lib/gdrive";

interface Message {
  id: string;
  role: "bot" | "user";
  content: string;
  type?: "upload" | "metadata" | "success" | "thumbnail" | "drive";
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "🤖 Hi! Let's publish your course.",
    },
    {
      id: "2",
      role: "bot",
      content:
        "Please upload your course folder or share a Google Drive link (make sure it's public).",
      type: "upload",
    },
  ]);
  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [courseData, setCourseData] = useState<any>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [step, setStep] = useState<"upload" | "thumbnail" | "metadata">(
    "upload",
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const { user, profile } = useAuthStore();
  const { addCourse } = useCourseStore();

  const isInstructor = profile?.role === "instructor";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    if (step === "metadata") {
      processMetadata(userMessage);
    } else {
      setProcessing(true);
      try {
        const folderId = extractFolderId(userMessage);
        if (folderId) {
          await handleDriveLink(folderId);
        } else {
          const text = await getChatGPTResponse(userMessage);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "bot",
              content: text,
            },
          ]);
        }
      } catch (error: any) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "bot",
            content: `Error: ${error.message || "Something went wrong."}`,
          },
        ]);
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleDriveLink = async (folderId: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "bot",
        content: "Reading Google Drive folder...",
      },
    ]);

    const driveFiles = await listDriveFiles(folderId);
    if (driveFiles.length === 0) {
      throw new Error("No files found in the Drive folder.");
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "bot",
        content: `Found ${driveFiles.length} files. Analyzing course structure...`,
      },
    ]);

    // Use Gemini to understand the course structure
    const fileList = driveFiles
      .map((f: any) => `${f.name} (ID: ${f.id})`)
      .join("\n");
    const analysisPrompt = `
      I have a list of files from a Google Drive folder. I want to create a course from them.
      Please identify:
      1. A suitable course name.
      2. The order of lessons.
      3. The type of each lesson (video or pdf).

      Files:
      ${fileList}

      Return ONLY a JSON object in this format:
      {
        "courseName": "extracted name",
        "lessons": [
          { "name": "lesson name", "id": "drive_file_id", "order": 1, "type": "video|pdf" }
        ]
      }
    `;

    const courseStructure = await getChatGPTJSON(analysisPrompt);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "bot",
        content: `I've analyzed the files. The course name will be "${courseStructure.courseName}". I'll now download and process the ${courseStructure.lessons.length} lessons.`,
      },
    ]);

    const processedFiles: any[] = [];
    for (const lesson of courseStructure.lessons) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: `Downloading ${lesson.name}...`,
        },
      ]);
      const blob = await getFileBlob(lesson.id);
      processedFiles.push({
        name: lesson.name,
        blob: blob,
        type: lesson.type,
      });
    }

    setCourseData({
      title: courseStructure.courseName,
      files: processedFiles,
      instructor_id: user?.id,
    });

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "bot",
        content: "Lessons downloaded successfully!",
      },
      {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content:
          "Please upload a high-quality thumbnail image for this course.",
        type: "thumbnail",
      },
    ]);
    setStep("thumbnail");
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
          content: "Please sign in to your account to upload courses.",
        },
      ]);
      return;
    }

    if (!isInstructor) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: "Only instructors are allowed to upload courses.",
        },
      ]);
      return;
    }

    setProcessing(true);

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
            ? `Uploading archive: ${file.name}`
            : `Uploading ${files.length} files...`,
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
        courseName = files[0].webkitRelativePath.split("/")[0] || "New Module";
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

      setProcessing(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: `Success! Identified ${processedFiles.length} assets in "${courseName}".`,
        },
        {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content:
            "Please upload a high-quality thumbnail image to represent this course.",
          type: "thumbnail",
        },
      ]);
      setStep("thumbnail");
    } catch (error) {
      console.error(error);
      setProcessing(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: "Upload failed. Please try again or check your file format.",
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
        content: `Thumbnail selected: ${file.name}`,
      },
      {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: "Great. Final step: please provide the course details.",
      },
      {
        id: (Date.now() + 2).toString(),
        role: "bot",
        content: courseData?.title
          ? `I've got the title: "${courseData.title}". Please provide the [Description] and [Price] (comma separated).`
          : "Format: [Title], [Description], [Price]",
        type: "metadata",
      },
    ]);
    setStep("metadata");
  };

  const processMetadata = async (metadataStr: string) => {
    const parts = metadataStr.split(",");
    let title = "";
    let description = "";
    let price = "";

    if (courseData?.title) {
      title = courseData.title;
      description = parts[0]?.trim();
      price = parts[1]?.trim();
    } else {
      title = parts[0]?.trim();
      description = parts[1]?.trim();
      price = parts[2]?.trim();
    }

    if (!title || !description || !price) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content:
            "I need all three details. Please enter: [Title], [Description], [Price]",
          type: "metadata",
        },
      ]);
      return;
    }

    setProcessing(true);

    try {
      let thumbnailUrl =
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80";

      const { data: courseDataRes, error: courseError } = await supabase
        .from("courses")
        .insert([
          {
            title,
            description,
            price: parseFloat(price),
            instructor_id: user?.id,
            thumbnail_url: thumbnailUrl,
          },
        ])
        .select();

      if (courseError || !courseDataRes) throw courseError;
      const newCourse = courseDataRes[0];

      if (thumbnailFile) {
        const thumbExt = thumbnailFile.name.split(".").pop();
        const thumbPath = `${newCourse.id}/thumbnail.${thumbExt}`;
        const { error: thumbUploadError } = await supabase.storage
          .from("course-assets")
          .upload(thumbPath, thumbnailFile);

        if (!thumbUploadError) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("course-assets").getPublicUrl(thumbPath);
          thumbnailUrl = publicUrl;

          await supabase
            .from("courses")
            .update({ thumbnail_url: thumbnailUrl })
            .eq("id", newCourse.id);

          newCourse.thumbnail_url = thumbnailUrl;
        }
      }

      if (courseData && courseData.files) {
        for (let index = 0; index < courseData.files.length; index++) {
          const file = courseData.files[index];
          const ext = file.name.split(".").pop();
          const sequentialName = `${index + 1}.${ext}`;
          const filePath = `${newCourse.id}/${sequentialName}`;

          const { error: uploadError } = await supabase.storage
            .from("course-assets")
            .upload(filePath, file.blob, {
              upsert: true,
              contentType:
                file.type === "pdf" || file.name.toLowerCase().endsWith(".pdf")
                  ? "application/pdf"
                  : undefined,
              cacheControl: "3600",
            });

          if (uploadError) continue;

          const { data: urlData } = supabase.storage
            .from("course-assets")
            .getPublicUrl(filePath);

          const publicUrl = urlData.publicUrl;

          await supabase.from("course_contents").insert({
            course_id: newCourse.id,
            title: sequentialName,
            type: file.type === "other" ? "pdf" : file.type,
            url: publicUrl,
            order: index,
          });
        }
      }

      addCourse(newCourse);
      setProcessing(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: `Congratulations! "${title}" is now published and available to all learners.`,
          type: "success",
        },
      ]);
      setStep("upload");
      setThumbnailFile(null);
      setCourseData(null);
    } catch (error: any) {
      console.error(error);
      setProcessing(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          content: `An error occurred: ${error.message || "Failed to save data."}`,
        },
      ]);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {!isOpen && (
        <div className="chatbot-hint animate-fade-in-up">
          <div className="hint-pill">
            <Sparkles size={14} />
            Publish Course
            <div className="hint-arrow"></div>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="chatbot-window animate-scale-in">
          <header className="chatbot-header">
            <div className="header-title">
              <div className="header-icon-wrapper">
                <MessageSquare size={16} color="white" />
              </div>
              <div className="header-text">
                <span className="title-main">Knowlify Studio</span>
                <span className="title-sub">AI Publishing Assistant</span>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </header>

          <div className="chatbot-messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`message-row ${m.role === "user" ? "user-row" : "bot-row"}`}
              >
                <div className="message-bubble">
                  <p>{m.content}</p>

                  {m.type === "upload" && !processing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="chatbot-action-btn bot-action"
                    >
                      <FolderUp size={16} />
                      Choose ZIP/Folder
                    </button>
                  )}

                  {m.type === "thumbnail" && !processing && (
                    <button
                      onClick={() => thumbInputRef.current?.click()}
                      className="chatbot-action-btn bot-action"
                    >
                      <ImageIcon size={16} />
                      Choose Image
                    </button>
                  )}
                </div>
              </div>
            ))}
            {processing && (
              <div className="message-row bot-row">
                <div className="message-bubble loading-bubble">
                  <Loader2 className="animate-spin text-pink-main" size={16} />
                  <span>Processing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <footer className="chatbot-footer">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your response..."
              className="chatbot-input"
              disabled={processing}
            />
            <button
              className="chatbot-send-btn"
              onClick={handleSend}
              disabled={!input.trim() || processing}
            >
              <Send size={18} />
            </button>
          </footer>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className="chatbot-toggle-btn">
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
      </button>

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

      <style>{`
        :root {
          --text-main: #0f172a;
          --text-muted: #64748b;
          --pink-main: #ec4899;
          --pink-light: #fdf2f8;
          --pink-gradient: linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%);
          --bg-slate: #f8fafc;
          --border-soft: #e2e8f0;
          --shadow-lg: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
          --shadow-pink: 0 15px 30px -10px rgba(236, 72, 153, 0.4);
        }

        .chatbot-wrapper {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-family: var(--font-sans);
        }

        /* --- Hint Pill --- */
        .chatbot-hint {
          margin-bottom: 1.25rem;
        }

        .hint-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--pink-gradient);
          color: white;
          padding: 10px 18px;
          border-radius: 100px;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          position: relative;
          box-shadow: var(--shadow-pink);
          animation: float 3s ease-in-out infinite;
        }

        .hint-arrow {
          position: absolute;
          bottom: -4px;
          right: 28px;
          width: 10px;
          height: 10px;
          background: var(--pink-main);
          transform: rotate(45deg);
        }

        /* --- Chat Window --- */
        .chatbot-window {
          width: 380px;
          height: 500px;
          max-height: calc(100vh - 120px);
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
          background: #ffffff;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-soft);
          border-radius: 20px;
        }

        /* --- Header --- */
        .chatbot-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-soft);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #ffffff;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon-wrapper {
          width: 36px;
          height: 36px;
          background: var(--pink-gradient);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(236, 72, 153, 0.2);
        }

        .header-text {
          display: flex;
          flex-direction: column;
        }

        .title-main {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1.2;
        }

        .title-sub {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--pink-main);
        }

        .close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.2s ease;
          padding: 4px;
        }
        .close-btn:hover {
          color: var(--text-main);
        }

        /* --- Messages Area --- */
        .chatbot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: #ffffff;
        }

        .message-row {
          display: flex;
          width: 100%;
        }

        .user-row { justify-content: flex-end; }
        .bot-row { justify-content: flex-start; }

        .message-bubble {
          max-width: 85%;
          padding: 1rem 1.25rem;
          border-radius: 18px;
          font-size: 0.9rem;
          line-height: 1.5;
          font-weight: 500;
        }

        .user-row .message-bubble {
          background: var(--pink-gradient);
          color: white;
          border-bottom-right-radius: 4px;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2);
        }

        .bot-row .message-bubble {
          background: var(--bg-slate);
          color: var(--text-main);
          border: 1px solid var(--border-soft);
          border-bottom-left-radius: 4px;
        }

        /* --- Action Buttons Inside Chat --- */
        .chatbot-action-btn {
          margin-top: 1rem;
          width: 100%;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 10px 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .bot-action {
          background: #ffffff;
          border: 1px solid var(--pink-main);
          color: var(--pink-main);
        }

        .bot-action:hover {
          background: var(--pink-light);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.1);
        }

        .loading-bubble {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-main);
          font-weight: 700;
          font-size: 0.85rem;
        }
        
        .text-pink-main { color: var(--pink-main); }

        /* --- Input Footer --- */
        .chatbot-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border-soft);
          display: flex;
          gap: 0.75rem;
          background: #ffffff;
          align-items: center;
        }

        .chatbot-input {
          flex: 1;
          padding: 12px 18px;
          font-size: 0.9rem;
          border-radius: 100px;
          background: var(--bg-slate);
          border: 1px solid var(--border-soft);
          color: var(--text-main);
          outline: none;
          transition: all 0.2s ease;
        }
        
        .chatbot-input:focus {
          border-color: #fbcfe8;
          background: #ffffff;
          box-shadow: 0 0 0 3px var(--pink-light);
        }

        .chatbot-send-btn {
          width: 44px;
          height: 44px;
          background: var(--pink-gradient);
          color: white;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 10px rgba(236, 72, 153, 0.2);
        }
        
        .chatbot-send-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 6px 14px rgba(236, 72, 153, 0.3);
        }

        .chatbot-send-btn:disabled {
          background: #cbd5e1;
          box-shadow: none;
          cursor: not-allowed;
        }

        /* --- Toggle Main Button --- */
        .chatbot-toggle-btn {
          width: 60px;
          height: 60px;
          background: var(--pink-gradient);
          color: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-pink);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 1001;
        }

        .chatbot-toggle-btn:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 20px 35px -10px rgba(236, 72, 153, 0.6);
        }

        .hidden { display: none; }

        /* --- Animations --- */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease forwards;
        }

        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95) translateY(20px); transform-origin: bottom right; }
          to { opacity: 1; transform: scale(1) translateY(0); transform-origin: bottom right; }
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @media (max-width: 480px) {
          .chatbot-window {
            width: calc(100vw - 2rem);
            height: 500px;
            bottom: 5rem;
            right: 1rem;
          }
          .chatbot-wrapper {
            bottom: 1rem;
            right: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
