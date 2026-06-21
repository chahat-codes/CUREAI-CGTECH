"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, UploadCloud, FileText, FileImage, ShieldCheck, Search, Activity, Sparkles, FolderOpen } from "lucide-react";

export default function HealthVault() {
  const folders = ["All", "Prescriptions", "Blood Reports", "X-Rays", "MRI Scans", "Vaccination", "Insurance"];
  const [activeFolder, setActiveFolder] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const initialFiles = [
    { id: 1, name: "Dr. Sharma Prescription", folder: "Prescriptions", date: "Oct 12, 2024", size: "1.2 MB", type: "pdf" },
    { id: 2, name: "Complete Blood Count", folder: "Blood Reports", date: "Oct 05, 2024", size: "3.4 MB", type: "pdf" },
    { id: 3, name: "Chest X-Ray", folder: "X-Rays", date: "Sep 28, 2024", size: "8.1 MB", type: "image" },
    { id: 4, name: "Health Insurance Policy", folder: "Insurance", date: "Jan 10, 2024", size: "2.5 MB", type: "pdf" },
  ];

  const [files, setFiles] = useState(initialFiles);

  const filteredFiles = files.filter(f => 
    (activeFolder === "All" || f.folder === activeFolder) &&
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading) return;
    
    setIsUploading(true);
    // Simulate AI upload and organization
    setTimeout(() => {
      setFiles([{
        id: Date.now(),
        name: "New Scanned Document",
        folder: "Prescriptions",
        date: "Just now",
        size: "2.1 MB",
        type: "pdf"
      }, ...files]);
      setIsUploading(false);
      setActiveFolder("Prescriptions"); // Auto-switch to show the AI sorted it
    }, 2000);
  };

  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/3 h-full bg-gradient-to-l from-white to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Copy */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#0A66FF] font-semibold tracking-wider uppercase text-sm mb-4 block flex items-center">
              <ShieldCheck className="w-4 h-4 mr-2" /> Digital Health Vault
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-outfit font-extrabold text-slate-900 mb-6 tracking-tight">
              Your Medical History. <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-[#0A66FF]">
                Organized Forever.
              </span>
            </h2>
            <p className="text-lg text-slate-600 font-sans mb-8 leading-relaxed max-w-lg">
              Say goodbye to lost prescriptions and scattered lab reports. Our AI automatically tags, organizes, and securely stores every piece of your medical journey.
            </p>

            <ul className="space-y-6">
              {[
                { title: "Drag-and-drop upload", desc: "Easily add new records from any device." },
                { title: "Instant Search", desc: "Find any document in seconds with AI-powered search." },
                { title: "AI Organization", desc: "Documents are automatically sorted into correct folders." },
                { title: "Bank-Grade Security", desc: "End-to-end encryption keeps your data private." }
              ].map((feature, i) => (
                <li key={i} className="flex items-start space-x-4">
                  <div className="bg-white border border-slate-200 shadow-sm p-2 rounded-xl mt-0.5"><Activity className="w-5 h-5 text-[#0A66FF]" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900 font-outfit text-lg">{feature.title}</h4>
                    <p className="text-sm text-slate-500 font-sans">{feature.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Column - Interactive UI Simulator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-2xl border border-slate-200/60 overflow-hidden flex flex-col h-[650px] relative"
          >
            {/* Topbar */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold font-outfit text-xl text-slate-800 flex items-center">
                <FolderOpen className="w-5 h-5 mr-2 text-[#0A66FF]" /> My Vault
              </h3>
              <div className="relative w-48 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search records..." 
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/30 transition-all"
                />
              </div>
            </div>

            {/* Folder List (Horizontal Scroll) */}
            <div className="px-6 py-4 border-b border-slate-100 flex space-x-2 overflow-x-auto no-scrollbar">
              {folders.map(folder => (
                <button
                  key={folder}
                  onClick={() => setActiveFolder(folder)}
                  className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    activeFolder === folder 
                      ? "bg-[#0A66FF] text-white shadow-md" 
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {folder}
                </button>
              ))}
            </div>

            {/* Main Area: Upload Dropzone & File List */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 relative">
              
              {/* Dropzone */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full p-8 rounded-2xl border-2 border-dashed mb-8 transition-all flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden ${
                  isDragging 
                    ? "border-[#0A66FF] bg-blue-50/50" 
                    : isUploading 
                      ? "border-purple-400 bg-purple-50/50" 
                      : "border-slate-300 bg-white hover:border-[#0A66FF]/50 hover:bg-slate-50"
                }`}
              >
                <AnimatePresence mode="wait">
                  {isUploading ? (
                    <motion.div
                      key="uploading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      <Sparkles className="w-10 h-10 text-purple-500 mb-3 animate-pulse" />
                      <p className="font-semibold text-slate-800">AI is organizing your document...</p>
                      <p className="text-sm text-slate-500">Extracting data & tagging safely.</p>
                      {/* Loading bar */}
                      <div className="w-48 h-2 bg-slate-200 rounded-full mt-4 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: "100%" }} 
                          transition={{ duration: 1.8 }} 
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500" 
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center pointer-events-none"
                    >
                      <div className="bg-slate-100 p-3 rounded-full mb-3">
                        <UploadCloud className={`w-8 h-8 ${isDragging ? "text-[#0A66FF]" : "text-slate-400"}`} />
                      </div>
                      <p className="font-semibold text-slate-800">
                        {isDragging ? "Drop your file here" : "Drag & drop to upload"}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">or click to browse (PDF, JPG, PNG)</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* File List */}
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredFiles.length > 0 ? filteredFiles.map((file) => (
                    <motion.div
                      key={file.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-[#0A66FF]/30 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${file.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                          {file.type === 'pdf' ? <FileText className="w-6 h-6" /> : <FileImage className="w-6 h-6" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm group-hover:text-[#0A66FF] transition-colors">{file.name}</h4>
                          <div className="flex items-center text-xs text-slate-500 mt-1 space-x-3 font-medium">
                            <span>{file.date}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span>{file.size}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="text-[#0A66FF] bg-blue-50 px-1.5 py-0.5 rounded">{file.folder}</span>
                          </div>
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-[#0A66FF] px-3 py-1.5 rounded-lg border border-transparent hover:bg-blue-50 transition-colors text-sm font-semibold">
                        View
                      </button>
                    </motion.div>
                  )) : (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="text-center py-12"
                    >
                      <Folder className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">No records found in this folder.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
