/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import ConfettiCanvas from "./components/ConfettiCanvas";

// Countdown Target: 17 August 2026, 12:00:00 AM (midnight)
// Timezone: Asia/Karachi (UTC +5) -> UTC equivalent: 16 August 2026, 07:00:00 PM (19:00:00 UTC)
const TARGET_TIME = new Date("2026-08-16T19:00:00Z").getTime();

export default function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    isEnded: false,
  });

  // Secret simulation toggle (A single click on "SHARK" triggers the end state instantly for previewing confetti/layouts)
  const [testMode, setTestMode] = useState(false);

  const handleShrkClick = () => {
    setTestMode((current) => !current);
  };

  useEffect(() => {
    const updateCountdown = () => {
      if (testMode) {
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
          isEnded: true,
        });
        return;
      }

      const now = Date.now();
      const difference = TARGET_TIME - now;

      if (difference <= 0) {
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
          isEnded: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days < 10 ? `0${days}` : String(days),
        hours: hours < 10 ? `0${hours}` : String(hours),
        minutes: minutes < 10 ? `0${minutes}` : String(minutes),
        seconds: seconds < 10 ? `0${seconds}` : String(seconds),
        isEnded: false,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [testMode]);

  const actuallyEnded = timeLeft.isEnded;

  return (
    <div id="countdown-root" className="min-h-screen w-full bg-[#000000] text-[#FFFFFF] select-none relative overflow-hidden flex flex-col justify-between p-6">
      {/* Background ambient lighting (extremely dark subtle vignette with breathing animation) */}
      <motion.div 
        id="vignette"
        animate={{
          background: [
            "radial-gradient(circle at center, rgba(16, 16, 16, 0.95) 0%, rgba(0, 0, 0, 1) 100%)",
            "radial-gradient(circle at center, rgba(28, 28, 28, 0.9) 0%, rgba(0, 0, 0, 1) 100%)",
            "radial-gradient(circle at center, rgba(16, 16, 16, 0.95) 0%, rgba(0, 0, 0, 1) 100%)"
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 pointer-events-none z-10" 
      />

      {/* Confetti Animation when reached zero */}
      {actuallyEnded && <ConfettiCanvas duration={35000} />}

      {/* Top spacer for luxury balance */}
      <div className="h-12 w-full z-20" />

      {/* Main Center Stage */}
      <div id="center-stage" className="flex-1 flex flex-col items-center justify-center z-20">
        <AnimatePresence mode="wait">
          {!actuallyEnded ? (
            <motion.div
              key="countdown-active"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center text-center w-full max-w-5xl px-4"
            >
              {/* Premium Category Header (bold, spacious luxury serif typography) */}
              <motion.div 
                animate={{ opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="font-serif-luxury font-bold text-2xl sm:text-4xl md:text-5xl tracking-[0.35em] text-white uppercase mb-10 sm:mb-16 md:mb-20 select-none"
              >
                Remaining
              </motion.div>

              {/* Countdown numbers */}
              <div 
                id="timer-row"
                className="flex items-center justify-center w-full max-w-4xl mx-auto space-x-1 sm:space-x-3 md:space-x-4"
              >
                {/* Days */}
                <div className="flex flex-col items-center flex-1 min-w-[64px] sm:min-w-[100px] md:min-w-[140px] lg:min-w-[180px]">
                  <div className="relative overflow-hidden h-[50px] sm:h-[80px] md:h-[120px] lg:h-[150px] w-full flex items-center justify-center">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={timeLeft.days}
                        initial={{ y: "35%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        exit={{ y: "-35%", opacity: 0 }}
                        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute font-serif-luxury text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight tabular-nums text-white select-none text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                      >
                        {timeLeft.days}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <span className="font-sans-luxury text-[7px] sm:text-[9px] md:text-[10px] tracking-[0.4em] text-zinc-500 font-semibold mt-2 sm:mt-5 -mr-[0.4em] uppercase select-none">
                    DAYS
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center h-[50px] sm:h-[80px] md:h-[120px] lg:h-[150px] pb-6 sm:pb-8 md:pb-12">
                  <span className="font-serif-luxury text-xl sm:text-3xl md:text-5xl lg:text-7xl font-light text-zinc-700 animate-pulse select-none">
                    :
                  </span>
                </div>

                {/* Hours */}
                <div className="flex flex-col items-center flex-1 min-w-[64px] sm:min-w-[100px] md:min-w-[140px] lg:min-w-[180px]">
                  <div className="relative overflow-hidden h-[50px] sm:h-[80px] md:h-[120px] lg:h-[150px] w-full flex items-center justify-center">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={timeLeft.hours}
                        initial={{ y: "35%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        exit={{ y: "-35%", opacity: 0 }}
                        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute font-serif-luxury text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight tabular-nums text-white select-none text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                      >
                        {timeLeft.hours}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <span className="font-sans-luxury text-[7px] sm:text-[9px] md:text-[10px] tracking-[0.4em] text-zinc-500 font-semibold mt-2 sm:mt-5 -mr-[0.4em] uppercase select-none">
                    HOURS
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center h-[50px] sm:h-[80px] md:h-[120px] lg:h-[150px] pb-6 sm:pb-8 md:pb-12">
                  <span className="font-serif-luxury text-xl sm:text-3xl md:text-5xl lg:text-7xl font-light text-zinc-700 animate-pulse select-none">
                    :
                  </span>
                </div>

                {/* Minutes */}
                <div className="flex flex-col items-center flex-1 min-w-[64px] sm:min-w-[100px] md:min-w-[140px] lg:min-w-[180px]">
                  <div className="relative overflow-hidden h-[50px] sm:h-[80px] md:h-[120px] lg:h-[150px] w-full flex items-center justify-center">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={timeLeft.minutes}
                        initial={{ y: "35%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        exit={{ y: "-35%", opacity: 0 }}
                        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute font-serif-luxury text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight tabular-nums text-white select-none text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                      >
                        {timeLeft.minutes}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <span className="font-sans-luxury text-[7px] sm:text-[9px] md:text-[10px] tracking-[0.4em] text-zinc-500 font-semibold mt-2 sm:mt-5 -mr-[0.4em] uppercase select-none">
                    MINUTES
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center h-[50px] sm:h-[80px] md:h-[120px] lg:h-[150px] pb-6 sm:pb-8 md:pb-12">
                  <span className="font-serif-luxury text-xl sm:text-3xl md:text-5xl lg:text-7xl font-light text-zinc-700 animate-pulse select-none">
                    :
                  </span>
                </div>

                {/* Seconds */}
                <div className="flex flex-col items-center flex-1 min-w-[64px] sm:min-w-[100px] md:min-w-[140px] lg:min-w-[180px]">
                  <div className="relative overflow-hidden h-[50px] sm:h-[80px] md:h-[120px] lg:h-[150px] w-full flex items-center justify-center">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={timeLeft.seconds}
                        initial={{ y: "35%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        exit={{ y: "-35%", opacity: 0 }}
                        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute font-serif-luxury text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight tabular-nums text-white select-none text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                      >
                        {timeLeft.seconds}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <span className="font-sans-luxury text-[7px] sm:text-[9px] md:text-[10px] tracking-[0.4em] text-zinc-500 font-semibold mt-2 sm:mt-5 -mr-[0.4em] uppercase select-none">
                    SECONDS
                  </span>
                </div>
              </div>

              {/* SHARK Label underneath */}
              <div 
                id="shrk-container"
                onClick={handleShrkClick}
                className="mt-16 sm:mt-24 md:mt-32 cursor-pointer active:scale-95 transition-transform duration-300 select-none pb-2 group"
                title="Tap to test countdown state"
              >
                <div className="font-sans-luxury text-xs sm:text-sm tracking-[0.95em] text-white font-light uppercase pl-[0.95em] opacity-75 group-hover:opacity-100 group-hover:tracking-[1.12em] transition-all duration-700 ease-out">
                  SHARK
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="countdown-ended"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center text-center w-full max-w-4xl px-4 select-none"
            >
              <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light italic leading-tight text-white mb-6 md:mb-8 select-none">
                Happy Birthday 🎉
              </h1>
              <div 
                onClick={handleShrkClick}
                className="cursor-pointer font-sans-luxury text-xs sm:text-sm tracking-[0.95em] text-white font-light uppercase pl-[0.95em] opacity-90 mt-2 hover:opacity-100 hover:tracking-[1.10em] transition-all duration-700"
              >
                SHARK
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle bottom placeholder for architectural balance */}
      <div 
        id="footer-spacer"
        className="text-center text-[9px] tracking-[0.2em] font-sans-luxury text-zinc-700/20 py-2 select-none self-center z-20"
      >
        {testMode && "DEVELOPMENT SIMULATED TARGET STATE"}
      </div>
    </div>
  );
}
