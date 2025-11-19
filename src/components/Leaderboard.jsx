import { motion } from 'framer-motion';
import { X, Trophy, Medal } from 'lucide-react';

export default function Leaderboard({ onClose, userData, currentWater }) {
  // 1. The "Fake" Community
  const fakeUsers = [
    { name: "HydroKing", goal: 3000, current: 2800, streak: 12 },
    { name: "AquaGirl", goal: 2000, current: 1500, streak: 5 },
    { name: "GymRat99", goal: 4000, current: 1200, streak: 3 },
    { name: "SipSip", goal: 2500, current: 200, streak: 0 },
  ];

  // 2. Add REAL user to the list
  const allUsers = [
    ...fakeUsers, 
    { 
      name: userData.name + " (You)", 
      goal: userData.goal, 
      current: currentWater, 
      streak: 0, 
      isMe: true 
    }
  ];

  // 3. Sort by % complete (Who is winning today?)
  const sortedUsers = allUsers.sort((a, b) => {
    const percentA = (a.current / a.goal);
    const percentB = (b.current / b.goal);
    return percentB - percentA; // Highest first
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-end justify-end sm:justify-center sm:items-center">
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        className="w-full max-w-md bg-slate-900 rounded-t-3xl sm:rounded-3xl border-t sm:border border-slate-700 overflow-hidden h-[80vh] sm:h-auto flex flex-col"
      >
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Daily Leaders</h2>
              <p className="text-xs text-slate-400">Vs. Nearby Sippers</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sortedUsers.map((user, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-xl flex items-center gap-4 border ${
                user.isMe 
                ? 'bg-blue-600/20 border-blue-500/50' 
                : 'bg-slate-800 border-slate-700'
              }`}
            >
              {/* Rank */}
              <div className={`font-bold text-lg w-8 text-center ${
                index === 0 ? 'text-yellow-400' : 
                index === 1 ? 'text-slate-300' : 
                index === 2 ? 'text-amber-600' : 'text-slate-600'
              }`}>
                #{index + 1}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-bold ${user.isMe ? 'text-blue-300' : 'text-white'}`}>
                    {user.name}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {Math.round((user.current / user.goal) * 100)}%
                  </span>
                </div>
                
                {/* Mini Progress Bar */}
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((user.current / user.goal) * 100, 100)}%` }}
                    className={`h-full ${user.isMe ? 'bg-blue-500' : 'bg-slate-600'}`}
                  />
                </div>
              </div>

              {/* Streak */}
              <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                <Medal className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold text-orange-400">{user.streak}</span>
              </div>
            </div>
          ))}
        </div>

      </motion.div>
    </div>
  );
}