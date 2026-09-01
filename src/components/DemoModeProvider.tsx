"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface DemoModeContextType {
  isDemoMode: boolean;
  setDemoMode: (mode: boolean) => void;
  demoStep: number;
  setDemoStep: (step: number) => void;
  demoRunning: boolean;
  setDemoRunning: (running: boolean) => void;
}

const DemoModeContext = createContext<DemoModeContextType>({
  isDemoMode: true,
  setDemoMode: () => {},
  demoStep: 0,
  setDemoStep: () => {},
  demoRunning: false,
  setDemoRunning: () => {},
});

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setDemoMode] = useState(true);
  const [demoStep, setDemoStep] = useState(0);
  const [demoRunning, setDemoRunning] = useState(false);

  return (
    <DemoModeContext.Provider value={{ isDemoMode, setDemoMode, demoStep, setDemoStep, demoRunning, setDemoRunning }}>
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  return useContext(DemoModeContext);
}
