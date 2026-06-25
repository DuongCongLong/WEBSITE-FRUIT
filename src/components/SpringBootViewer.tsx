import { useState } from "react";
import { FolderGit, Copy, Check, FileCode, Server, Database, ArrowRight, CornerDownRight } from "lucide-react";
import { springBootFiles, SpringCodeFile } from "../data/springbootSource";

export default function SpringBootViewer() {
  const [selectedFile, setSelectedFile] = useState<SpringCodeFile>(springBootFiles[1]); // Default to Fruit.java
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8" id="springboot-viewer-root">
      {/* Title & Banner intro */}
      <div className="border-b border-slate-100 pb-5 mb-6">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">
          Mã Nguồn Java Spring Boot Backend
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-3xl font-medium">
          Dưới đây là bộ mã nguồn **Java Spring Boot 3 + Spring Data JPA + H2/PostgreSQL Database** 
          hoàn chỉnh, tương thích 100% với các API React frontend đang chạy ở trên. Bạn có thể sao chép trực tiếp để triển khai môn học!
        </p>
      </div>

      {/* Spring Boot Request Architecture Diagram */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-5 sm:p-6 rounded-2xl border border-indigo-150/40 mb-8 bg-indigo-50/10">
        <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-100">
          <Server className="w-6 h-6" />
        </div>
        <div className="flex-1 space-y-2">
          <h4 className="text-sm font-extrabold text-slate-900 leading-none">Kiến trúc liên kết Full-Stack (React ↔ Spring Boot 3)</h4>
          <p className="text-[11px] sm:text-xs text-slate-605 text-slate-600 leading-relaxed font-sans">
            Yêu cầu từ client **React (Port 3000)** gửi truy vấn REST API qua cổng **Spring Boot (Port 8080/8081)**. 
            Bộ xử lý Controller nhận request, điều hướng qua Services, kết nối Spring Data JPA Repository giao tiếp lưu dữ liệu thực thể vào Database.
          </p>
          <div className="flex flex-wrap items-center gap-1.5 pt-1.5 text-[10px] sm:text-xs font-bold text-slate-700">
            <span className="bg-slate-200 px-2.5 py-1 rounded-md">Vite/React Client</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-md">REST Controller</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="bg-indigo-50 text-indigo-900 px-2.5 py-1 rounded-md">JPA Repository</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md justify-center flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-amber-600" />
              H2 / Postgres Database
            </span>
          </div>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left column: File Explorer tree */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
            <FolderGit className="w-4 h-4 text-slate-400" />
            <span>Cấu trúc mã nguồn</span>
          </div>
          
          <div className="space-y-1.5">
            {springBootFiles.map((file) => (
              <button
                key={file.name}
                id={`spring-file-btn-${file.name.replace(/[^a-zA-Z0-9]/g, "-")}`}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex flex-col gap-1 ${
                  selectedFile.name === file.name
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileCode className={`w-4 h-4 ${selectedFile.name === file.name ? "text-indigo-200" : "text-slate-400"}`} />
                  <span className="text-xs font-bold truncate">{file.name}</span>
                </div>
                <span className={`text-[9px] truncate pl-6 ${selectedFile.name === file.name ? "text-indigo-200/80" : "text-slate-400"}`}>
                  {file.path.split("/").pop()}
                </span>
              </button>
            ))}
          </div>

          <div className="bg-amber-50 rounded-2xl border border-amber-200/50 p-4 text-xs font-medium text-amber-900">
            <h5 className="font-extrabold text-amber-950 mb-1 flex items-center gap-1">
              💡 Hướng dẫn chạy thử:
            </h5>
            <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed pl-1 text-amber-800 font-sans">
              <li>Cài đặt JDK 17+ và Maven</li>
              <li>Tạo dự án Spring Boot, chép các file này</li>
              <li>Mở <strong className="font-mono bg-white px-1">src/main/resources</strong></li>
              <li>Chạy file main, API sẽ khởi động tại cổng <strong className="font-mono">8080</strong>!</li>
            </ol>
          </div>
        </div>

        {/* Right column: Code Viewer */}
        <div className="md:col-span-3 flex flex-col bg-slate-950 rounded-2xl overflow-hidden shadow-lg border border-slate-800">
          
          {/* Header of code block containing path, language info, and copy action */}
          <div className="bg-slate-900 px-5 py-3.5 border-b border-slate-850 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CornerDownRight className="w-4 h-4 text-emerald-400" />
              <div className="text-[11px] md:text-xs">
                <span className="text-slate-400 font-sans">Đường dẫn: </span>
                <span className="font-mono text-emerald-300 font-semibold">{selectedFile.path}</span>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Đã sao chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép</span>
                </>
              )}
            </button>
          </div>

          {/* Code display stage */}
          <div className="relative flex-1 p-5 overflow-auto max-h-[500px] min-h-[380px]">
            <pre className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre font-medium p-1">
              <code>{selectedFile.code}</code>
            </pre>
          </div>

          {/* Code details description */}
          <div className="bg-slate-900 px-5 py-3.5 border-t border-slate-850 text-xs text-slate-400 leading-relaxed font-sans">
            <strong className="text-slate-300 font-bold">Giải thích: </strong>
            <span>{selectedFile.description}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
