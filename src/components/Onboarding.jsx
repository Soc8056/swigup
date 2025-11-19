import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Activity, Ruler, User } from 'lucide-react';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    weight: '',
    activity: 'moderate', // low, moderate, active
  });

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else calculateAndFinish();
  };

  const calculateAndFinish = () => {
    // The "Scientific" Formula
    // Base: 35ml per kg of body weight
    // Activity: +500ml for moderate, +1000ml for active
    const weightInKg = formData.weight * 0.453592; // assuming input is lbs
    let goal = weightInKg * 35;
    
    if (formData.activity === 'moderate') goal += 500;
    if (formData.activity === 'active') goal += 1000;

    // Round to nearest 50ml
    goal = Math.ceil(goal / 50) * 50;

    onComplete({ ...formData, goal });
  };

  // Animation variants for the "slide" effect
  const variants = {
    enter: { x: 100, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-800 rounded-full mb-12">
          <motion.div 
            className="h-full bg-blue-500 rounded-full"
            animate={{ width: `${((step + 1) / 3) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div 
              key="step0"
              variants={variants} initial="enter" animate="center" exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <User className="w-12 h-12 text-blue-400 mb-4" />
              <h2 className="text-3xl font-bold mb-2">Let's get personal.</h2>
              <p className="text-slate-400 mb-8">What should we call you?</p>
              <input 
                type="text" 
                placeholder="Your Name"
                className="w-full bg-transparent border-b-2 border-slate-700 text-2xl py-2 focus:border-blue-500 focus:outline-none transition-colors"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div 
              key="step1"
              variants={variants} initial="enter" animate="center" exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Ruler className="w-12 h-12 text-blue-400 mb-4" />
              <h2 className="text-3xl font-bold mb-2">Analyze Mass.</h2>
              <p className="text-slate-400 mb-8">How much do you weigh? (lbs)</p>
              <input 
                type="number" 
                placeholder="150"
                className="w-full bg-transparent border-b-2 border-slate-700 text-2xl py-2 focus:border-blue-500 focus:outline-none transition-colors"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              variants={variants} initial="enter" animate="center" exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Activity className="w-12 h-12 text-blue-400 mb-4" />
              <h2 className="text-3xl font-bold mb-2">Sweat Level.</h2>
              <p className="text-slate-400 mb-8">How active are you usually?</p>
              
              <div className="space-y-3">
                {['low', 'moderate', 'active'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setFormData({...formData, activity: level})}
                    className={`w-full p-4 rounded-xl border text-left capitalize transition-all ${
                      formData.activity === level 
                      ? 'border-blue-500 bg-blue-500/10 text-white' 
                      : 'border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={handleNext}
          disabled={step === 0 && !formData.name || step === 1 && !formData.weight}
          className="mt-12 w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          {step === 2 ? 'Calculate Goal' : 'Next'} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}