'use client';

import { useState, useEffect } from 'react';
import { devFlags } from '../config/development';

export function useDevelopment() {
  const [useMockData, setUseMockData] = useState(true);
  
  useEffect(() => {
    // In a real implementation, this could check environment variables or other conditions
    // For now, we'll just use the devFlags
    setUseMockData(devFlags.useMockData);
  }, []);
  
  return {
    useMockData,
    showDevTools: devFlags.showDevTools,
    simulateNetworkDelay: devFlags.simulateNetworkDelay,
    networkDelayMs: devFlags.networkDelayMs
  };
} 