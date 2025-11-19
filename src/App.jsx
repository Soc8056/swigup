import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ScanLine } from 'lucide-react';

import Onboarding from './components/Onboarding';
import Scanner from './components/Scanner';
import Leaderboard from './components/Leaderboard';

export default function App() {
  // -----------------------------
  // State
  // -----------------------------
  const [userData, setUserData] = useState(null);
  const [waterLevel, setWaterLevel] = useState(0);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  const [showScanner, setShowScanner] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // -----------------------------
  // Load saved user
  // -----------------------------
  useEffect(() => {
    const savedUser = localStorage.getItem('swigup_user');
    if (savedUser) setUserData(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  // -----------------------------
  // Finish onboarding
  // -----------------------------
  const handleOnboardingComplete = (data) => {
    setUserData(data);
    localStorage.setItem('swigup_user', JSON.stringify(data));
  };

  // -----------------------------
  // Add water
  // -----------------------------
  const addWater = (amount) => {
    if (!userData) return;

    const newAmount = current + amount;
    setCurrent(newAmount);

    const percentage = Math.min((newAmount / userData.goal) * 100, 100);
    setWaterLevel(percentage);

    setShowScanner(false);
  };

  // -----------------------------
  // Show loading / onboarding
  // -----------------------------
  if (loading) return <div className="min-h-screen bg-slate-900" />;
  if (!userData) return <Onboarding onComplete={handleOnboardingComplete} />;

  // -----------------------------
  // App UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col items-center justify-between p-6 font-sans relative overflow-hidden">

      {/* --- Popups ---------------------------------------------------- */}
      {showScanner && (
        <Scanner
          onScan={addWater}
          onClose={() => setShowScanner(false)}
        />
      )}

      {showLeaderboard && (
        <Leaderboard
          userData={userData}
          currentWater={current}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {/* --- Header ---------------------------------------------------- */}
      <div className="w-full flex justify-between items-center pt-4">
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            Hi, {userData.name}
          </h1>
          <p className="text-xs text-slate-400">Goal: {userData.goal}ml</p>
        </div>

        {/* Trophy Button */}
        <button
          onClick={() => setShowLeaderboard(true)}
          className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 hover:bg-slate-700 active:scale-95 transition-all"
        >
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-bold">Rank #4</span>
        </button>
      </div>

      {/* --- Water Bottle ---------------------------------------------- */}
      <div className="relative w-56 h-96 bg-slate-800/50 border-4 border-slate-600 rounded-[3rem] overflow-hidden backdrop-blur-sm shadow-2xl shadow-blue-900/20 mt-8">

        {/* Water Fill */}
        <motion.div
          initial={{ height: '0%' }}
          animate={{ height: `${waterLevel}%` }}
          transition={{ type: 'spring', bounce: 0.2, duration: 1.5 }}
          className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-cyan-400 opacity-90"
        />

        {/* Bubbles */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute bottom-4 left-8 w-3 h-3 bg-white/30 rounded-full animate-bounce"
            style={{ animationDuration: '2.5s' }}
          />
          <div
            className="absolute bottom-12 right-8 w-2 h-2 bg-white/20 rounded-full animate-bounce"
            style={{ animationDuration: '3.5s' }}
          />
        </div>

        {/* Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 drop-shadow-md">
          <span className="text-5xl font-bold text-white">
            {Math.round(waterLevel)}%
          </span>
          <span className="text-sm text-blue-100 opacity-80 mt-1">
            {current} ml
          </span>
        </div>
      </div>

      {/* --- Scan Button ----------------------------------------------- */}
      <div className="w-full max-w-xs mt-6">
        <button
          onClick={() => setShowScanner(true)}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white p-4 rounded-2xl font-bold shadow-lg shadow-purple-900/20 active:scale-95 transition-all"
        >
          <ScanLine className="w-6 h-6" />
          <span>Scan Refill Station</span>
        </button>
      </div>

      {/* --- Manual Water Controls ------------------------------------- */}
      <div className="w-full max-w-xs pb-8 mt-4">
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => addWater(250)}
            className="bg-slate-700 p-3 rounded-xl text-xs font-medium hover:bg-slate-600"
          >
            Cup
          </button>

          <button
            onClick={() => addWater(500)}
            className="bg-slate-700 p-3 rounded-xl text-xs font-medium hover:bg-slate-600"
          >
            Bottle
          </button>

          <button
            onClick={() => addWater(750)}
            className="bg-slate-700 p-3 rounded-xl text-xs font-medium hover:bg-slate-600"
          >
            Big Gulp
          </button>
        </div>
      </div>

    </div>
  );
}
