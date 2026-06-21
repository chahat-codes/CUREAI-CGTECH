"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Bot, Stethoscope, Calendar, FolderHeart, FileText, User, Bell, Search, Activity } from "lucide-react";

export default function ProductShowcase() {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Bot, label: "AI Assistant", active: false },
    { icon: Stethoscope, label: "Doctors", active: false },
    { icon: Calendar, label: "Appointments", active: false },
    { icon: FolderHeart, label: "Health Records", active: false },
    { icon: FileText, label: "Reports", active: false },
    { icon: User, label: "Profile", active: false }
  ];

  return (
    <section className="py-32 bg-[#F5FAFF] border-y border-blue-50 overflow-hidden relative">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-[#0A66FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-20 w-[500px] h-[500px] bg-[#00C2FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#0A66FF] font-semibold tracking-wider uppercase text-sm mb-4 block">The Platform</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-outfit font-extrabold text-slate-900 mb-6 tracking-tight">
            Everything You Need, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A66FF] to-[#00C2FF]">
              At Your Fingertips.
            </span>
          </h2>
          <p className="text-xl text-slate-600 font-sans max-w-3xl mx-auto">
            A beautiful, intuitive dashboard designed to give you complete control over your healthcare journey.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="rounded-[2rem] border border-white shadow-2xl bg-white/70 backdrop-blur-2xl flex flex-col md:flex-row overflow-hidden max-w-6xl mx-auto h-[700px]"
        >
          {/* Sidebar */}
          <div className="w-64 border-r border-slate-200/60 bg-white/90 p-6 hidden md:flex flex-col">
            <div className="flex items-center space-x-3 mb-10 pl-2">
              <div className="bg-[#0A66FF] p-2 rounded-xl shadow-md shadow-blue-500/20">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-outfit font-bold text-xl text-slate-900">Cure AI</span>
            </div>

            <nav className="space-y-2 flex-1">
              {sidebarItems.map((item, i) => (
                <button key={i} className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all font-medium text-sm ${item.active ? 'bg-[#0A66FF] text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>
                  <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            
            {/* User widget */}
            <div className="mt-auto border-t border-slate-200/60 pt-6">
              <div className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                <img src="https://i.pravatar.cc/150?img=11" alt="User" className="w-10 h-10 rounded-full border border-slate-200 shadow-sm" />
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900">Sarah Jenkins</p>
                  <p className="text-xs text-slate-500">Premium Member</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-slate-50/50">
            {/* Topbar */}
            <header className="h-20 border-b border-slate-200/60 flex items-center justify-between px-8 bg-white/50 backdrop-blur-md z-10">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search doctors, records, symptoms..." className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/30 shadow-sm transition-all" />
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-sm font-semibold text-[#0A66FF] bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors">
                  + Book Appointment
                </button>
                <button className="relative p-2.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors shadow-sm">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                </button>
              </div>
            </header>

            {/* Dashboard Content */}
            <div className="flex-1 p-8 overflow-y-auto no-scrollbar relative">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold font-outfit text-slate-900 mb-1">Good Morning, Sarah 👋</h1>
                  <p className="text-slate-500 text-sm">Here is your personalized health overview for today.</p>
                </div>
              </div>

              {/* Grid layout */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Health Summary Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm xl:col-span-2 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-800 mb-4 font-outfit flex justify-between items-center text-lg">
                    AI Health Summary
                    <span className="text-xs font-semibold text-[#0A66FF] bg-[#0A66FF]/10 px-2.5 py-1 rounded-md flex items-center">
                      <Bot className="w-3 h-3 mr-1" /> Just Updated
                    </span>
                  </h3>
                  <div className="flex items-start space-x-4 bg-gradient-to-r from-[#F5FAFF] to-white p-5 rounded-xl border border-blue-100/50">
                    <div className="bg-gradient-to-br from-[#0A66FF] to-[#00C2FF] p-3 rounded-full shrink-0 shadow-md">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">Your vitals look great this week. I noticed you have an upcoming appointment with Dr. Sharma for your routine checkup. Don&apos;t forget to bring your latest blood report!</p>
                      <button className="mt-3 text-xs font-semibold text-[#0A66FF] hover:underline">Ask AI a question</button>
                    </div>
                  </div>
                </div>

                {/* Upcoming Appointment */}
                <div className="bg-gradient-to-br from-[#0A66FF] to-blue-800 rounded-2xl p-6 border border-blue-500 shadow-lg shadow-blue-500/20 xl:col-span-1 text-white relative overflow-hidden transform hover:-translate-y-1 transition-transform">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#00C2FF]/20 rounded-full blur-xl"></div>
                  
                  <h3 className="font-bold mb-5 font-outfit text-white/90 flex items-center text-lg">
                    <Calendar className="w-5 h-5 mr-2 opacity-80" /> Next Appointment
                  </h3>
                  
                  <div className="flex items-center space-x-4 mb-6 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-md">
                    <div className="bg-white p-3 rounded-xl text-[#0A66FF] font-bold text-center leading-tight shadow-sm">
                      15<br/><span className="text-[10px] font-extrabold tracking-wider uppercase">Oct</span>
                    </div>
                    <div>
                      <p className="font-bold text-lg leading-tight">Dr. Rahul Sharma</p>
                      <p className="text-blue-100 text-xs mt-1 font-medium">General Physician • 10:30 AM</p>
                    </div>
                  </div>
                  
                  <button className="w-full bg-white text-[#0A66FF] hover:bg-blue-50 transition-colors py-2.5 rounded-xl text-sm font-bold shadow-md">
                    View Details & Directions
                  </button>
                </div>

                {/* Nearby Doctors */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm xl:col-span-2 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-800 mb-5 font-outfit flex justify-between items-center text-lg">
                    AI Recommended Specialists
                    <span className="text-[#0A66FF] text-sm font-semibold cursor-pointer hover:underline">See Directory</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: "Dr. Anita Desai", spec: "Cardiologist", rating: "4.9", exp: "12 Yrs", img: 32 },
                      { name: "Dr. Vikram Singh", spec: "Dermatologist", rating: "4.8", exp: "8 Yrs", img: 33 }
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 border border-slate-100 rounded-xl hover:border-[#0A66FF]/30 hover:shadow-md hover:bg-[#F5FAFF] transition-all cursor-pointer group">
                        <img src={`https://i.pravatar.cc/150?img=${doc.img}`} className="w-14 h-14 rounded-full border-2 border-white shadow-sm" alt={doc.name} />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900 group-hover:text-[#0A66FF] transition-colors">{doc.name}</p>
                          <p className="text-xs text-slate-500 font-medium mb-1">{doc.spec} • {doc.exp}</p>
                          <div className="flex items-center text-[10px] font-bold text-amber-500 bg-amber-50 w-fit px-1.5 py-0.5 rounded">
                            ★ {doc.rating}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Documents */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm xl:col-span-1 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-800 mb-5 font-outfit flex justify-between items-center text-lg">
                    Recent Files
                    <FolderHeart className="w-5 h-5 text-slate-400" />
                  </h3>
                  <div className="space-y-3">
                    {[ 
                      { name: "Complete Blood Count", date: "Oct 12, 2024", type: "PDF", color: "text-rose-500", bg: "bg-rose-50" }, 
                      { name: "Dr. Sharma Prescription", date: "Oct 05, 2024", type: "IMG", color: "text-emerald-500", bg: "bg-emerald-50" },
                      { name: "MRI Scan Details", date: "Sep 28, 2024", type: "PDF", color: "text-rose-500", bg: "bg-rose-50" }
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2.5 rounded-lg ${doc.bg} ${doc.color} group-hover:scale-110 transition-transform`}>
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{doc.name}</p>
                            <p className="text-xs text-slate-500 font-medium">{doc.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 text-xs font-bold text-[#0A66FF] bg-[#F5FAFF] py-2.5 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100">
                    Upload New Record
                  </button>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
