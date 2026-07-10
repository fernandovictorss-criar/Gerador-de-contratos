"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function LoginIntro({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true);
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const enterFrame = requestAnimationFrame(() => setEntered(true));
    const leaveTimer = setTimeout(() => setLeaving(true), 1000);
    const removeTimer = setTimeout(() => setVisible(false), 1300);
    return () => {
      cancelAnimationFrame(enterFrame);
      clearTimeout(leaveTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      {visible && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-brand-navy transition-opacity duration-300 ${
            leaving ? "opacity-0" : "opacity-100"
          }`}
        >
          <div
            className={`flex flex-col items-center gap-4 transition-all duration-500 ${
              entered ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
          >
            <div className="w-20 h-20 rounded-full bg-brand-light flex items-center justify-center shadow-xl overflow-hidden">
              <Image
                src="/prosperar360-logo.png"
                alt="Prosperar 360"
                width={153}
                height={153}
                priority
              />
            </div>
            <p className="text-brand-light font-bold tracking-widest text-sm uppercase">
              Prosperar<span className="text-brand-gold">360°</span>
            </p>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
