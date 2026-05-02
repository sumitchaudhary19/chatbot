import React from 'react';
import { 
  LayoutDashboard, UserCircle, GraduationCap, 
  Coffee, Settings, MessageSquare, Menu, Activity,
  Calendar, FileText, Bus, BookOpen
} from 'lucide-react';

const Dashboard = ({ onNavigate }) => {
  return (
    <div className="flex h-screen w-full bg-dark-900 text-gray-100 font-sans overflow-hidden relative">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-hero-glow rounded-full blur-[100px] opacity-30 pointer-events-none z-0"></div>

      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-white/5 bg-dark-800/40 backdrop-blur-xl flex flex-col justify-between hidden lg:flex z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-dark-900 border border-brand-purple/50 flex items-center justify-center font-bold text-brand-purple shadow-[0_0_10px_rgba(157,78,221,0.3)]">
              M
            </div>
            <h1 className="text-lg font-display font-bold text-white tracking-wide">Command Center</h1>
          </div>

          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-purple/10 text-brand-purple border border-brand-purple/20 font-medium transition-all">
              <LayoutDashboard size={18} />
              <span>Dashboard Home</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all">
              <UserCircle size={18} />
              <span>My Profile</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all">
              <GraduationCap size={18} />
              <span>Campus Hub</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all">
              <Coffee size={18} />
              <span>Mess & Hostel</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all">
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-700/50 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple to-brand-pink p-[2px]">
              <div className="w-full h-full bg-dark-800 rounded-full"></div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Student Name</h4>
              <p className="text-xs text-brand-purple font-medium">B.Tech - CSE</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col z-10 overflow-y-auto hide-scrollbar">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 glass-panel sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-dark-900 border border-brand-purple/50 flex items-center justify-center font-bold text-brand-purple">
              M
            </div>
            <h1 className="text-lg font-display font-bold">Command Center</h1>
          </div>
          <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400">
            <Menu size={20} />
          </button>
        </header>

        <div className="p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8">
          
          {/* Hero Section */}
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 tracking-tight">
              Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-pink neon-text">Student Name</span> 👋
            </h2>
            <p className="text-gray-400 text-lg">
              You're crushing it! Attendance: <span className="text-white font-semibold">82%</span> | Current CGPA: <span className="text-brand-purple font-bold">8.4</span>
            </p>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Attendance Card */}
            <div className="glass-card p-6 relative overflow-hidden group hover:border-brand-purple/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-gray-400 font-medium text-sm mb-1">Overall Attendance</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-white">82</span>
                    <span className="text-gray-500 font-medium pb-1">%</span>
                  </div>
                </div>
                <div className="p-2 bg-dark-600/50 rounded-lg text-brand-green">
                  <Activity size={20} />
                </div>
              </div>
              
              {/* Circular Progress Mockup */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-dark-600" />
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="175" strokeDashoffset="31.5" className="text-brand-green" strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-xs font-bold">82%</span>
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <p><span className="text-brand-green font-medium">On track</span> to meet 75% criteria.</p>
                  <p>Next class: <span className="text-white">Data Structures (10 AM)</span></p>
                </div>
              </div>
            </div>

            {/* CGPA Card */}
            <div className="glass-card p-6 relative overflow-hidden group hover:border-brand-purple/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-gray-400 font-medium text-sm mb-1">Current CGPA</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-white">8.4</span>
                    <span className="text-gray-500 font-medium pb-1">/ 10</span>
                  </div>
                </div>
                <div className="p-2 bg-dark-600/50 rounded-lg text-brand-purple">
                  <BookOpen size={20} />
                </div>
              </div>
              
              <div className="mt-6">
                <div className="h-2 w-full bg-dark-600 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-purple to-brand-pink w-[84%] rounded-full relative">
                    <div className="absolute right-0 top-0 w-4 h-full bg-white/30 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                  </div>
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                  <span>Target: 8.5</span>
                  <span className="text-brand-purple">Top 15%</span>
                </div>
              </div>
            </div>

            {/* Credits Card */}
            <div className="glass-card p-6 relative overflow-hidden group hover:border-brand-purple/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-gray-400 font-medium text-sm mb-1">Credits Earned</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-white">46</span>
                    <span className="text-gray-500 font-medium pb-1">/ 160</span>
                  </div>
                </div>
                <div className="p-2 bg-dark-600/50 rounded-lg text-brand-pink">
                  <GraduationCap size={20} />
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-sm">
                  <span className="text-gray-400">Core Subjects</span>
                  <span className="font-semibold text-white">32 Credits</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-sm">
                  <span className="text-gray-400">Electives</span>
                  <span className="font-semibold text-white">14 Credits</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Title */}
          <div className="pt-4">
            <h3 className="text-xl font-display font-semibold text-white mb-4">Quick Access</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-dark-800 border border-white/5 hover:bg-dark-700 hover:border-brand-purple/30 transition-all group">
                <div className="w-12 h-12 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple group-hover:scale-110 transition-transform">
                  <Coffee size={24} />
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">Mess Menu</span>
              </button>
              
              <button className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-dark-800 border border-white/5 hover:bg-dark-700 hover:border-brand-pink/30 transition-all group">
                <div className="w-12 h-12 rounded-full bg-brand-pink/10 flex items-center justify-center text-brand-pink group-hover:scale-110 transition-transform">
                  <Bus size={24} />
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">Bus Tracker</span>
              </button>
              
              <button className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-dark-800 border border-white/5 hover:bg-dark-700 hover:border-brand-green/30 transition-all group">
                <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green group-hover:scale-110 transition-transform">
                  <FileText size={24} />
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">Gate Pass</span>
              </button>
              
              <button className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-dark-800 border border-white/5 hover:bg-dark-700 hover:border-blue-500/30 transition-all group">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Calendar size={24} />
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">Academic Calendar</span>
              </button>
            </div>
          </div>

        </div>

        {/* Floating Action Button */}
        <button 
          onClick={onNavigate}
          className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink text-white shadow-[0_0_20px_rgba(157,78,221,0.6)] hover:shadow-[0_0_30px_rgba(157,78,221,0.8)] hover:-translate-y-1 transition-all z-50 group font-medium"
        >
          <MessageSquare size={20} />
          <span className="mr-1">AskMNIT</span>
          <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
        </button>

      </main>
    </div>
  );
};

export default Dashboard;
