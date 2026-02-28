import { ChevronLeft, Maximize, Settings, Volume2 } from "lucide-react";

const VideoPlayer = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top Bar */}
      <div className="p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft size={24} />
          <span className="font-bold">Back to Course Home</span>
        </button>
        <div className="text-center">
          <h1 className="font-bold text-lg">4. Core Concepts Deep Dive</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            Introduction to Computer Science
          </p>
        </div>
        <div className="w-24"></div> {/* Spacer */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center relative group">
        <div className="w-full max-w-5xl aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl relative">
          {/* Mock Video UI */}
          <img
            src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1200&q=80"
            alt="Video Content"
            className="w-full h-full object-cover opacity-50"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2"></div>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-full bg-gray-600 h-1.5 rounded-full mb-4 cursor-pointer relative">
              <div className="absolute left-0 top-0 bottom-0 bg-primary-500 w-1/3 rounded-full">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent"></div>
                <div className="flex items-center space-x-2">
                  <Volume2 size={20} />
                  <div className="w-20 bg-gray-600 h-1 rounded-full overflow-hidden">
                    <div className="bg-white w-3/4 h-full"></div>
                  </div>
                </div>
                <span className="text-sm font-mono text-gray-300">
                  04:20 / 12:45
                </span>
              </div>

              <div className="flex items-center space-x-6">
                <Settings
                  size={20}
                  className="text-gray-400 hover:text-white cursor-pointer"
                />
                <Maximize
                  size={20}
                  className="text-gray-400 hover:text-white cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Info */}
      <div className="p-8 bg-gray-900 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">About this lesson</h2>
            <button className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-lg font-bold transition-colors">
              Next Lesson
            </button>
          </div>
          <p className="text-gray-400 leading-relaxed">
            In this deep dive, we explore the fundamental building blocks of
            modern computing. We'll cover binary logic, memory management, and
            how high-level code eventually gets executed by the CPU.
            Understanding these "under the hood" mechanics is crucial for any
            serious software engineer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
