'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, EyeOff, Lock, Mail, 
  BrainCircuit, Zap, Sparkles, ArrowRight, Check,
  Shield, Lightbulb, ChevronRight
} from 'lucide-react';

// Enhanced particle animation component with depth effect
const ParticleField = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(50)].map((_, i) => {
        const size = Math.random() * 8 + 1;
        const depth = Math.random();
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: size,
              height: size,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.1 + depth * 0.6,
              filter: `blur(${(1 - depth) * 2}px)`,
              zIndex: Math.floor(depth * 10)
            }}
            animate={{
              y: [0, -Math.random() * 150 - 50],
              x: [0, (Math.random() - 0.5) * 50],
              scale: [0, 1, depth],
              opacity: [0, 0.1 + depth * 0.6, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        );
      })}
    </div>
  );
};

// Enhanced meteor animation component
const Meteors = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => {
        const width = Math.random() * 300 + 50;
        const speed = Math.random() * 2 + 2;
        const opacity = Math.random() * 0.6 + 0.2;
        const hue = Math.floor(Math.random() * 40) + 230; // Blue to purple range
        
        return (
          <motion.div
            key={i}
            className="absolute h-[1px] md:h-[2px]"
            style={{
              background: `linear-gradient(90deg, hsla(${hue}, 100%, 70%, 0) 0%, hsla(${hue}, 100%, 70%, ${opacity}) 50%, hsla(${hue}, 100%, 70%, 0) 100%)`,
              width: `${width}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              rotate: `${Math.random() * 60 - 30}deg`,
              opacity: 0,
              boxShadow: `0 0 ${width * 0.05}px hsla(${hue}, 100%, 70%, ${opacity * 0.5})`
            }}
            animate={{
              x: [-100, width * 1.5],
              y: [0, width * 0.2],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: speed,
              repeat: Infinity,
              delay: Math.random() * 10,
              repeatDelay: Math.random() * 7 + 5,
            }}
          />
        );
      })}
    </div>
  );
};

// Ambient glowing orbs
const GlowingOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => {
        const size = Math.random() * 300 + 100;
        const xPos = Math.random() * 100;
        const yPos = Math.random() * 100;
        const hue = 250 + Math.random() * 60; // Purples and blues
        const opacity = 0.03 + Math.random() * 0.06;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              top: `${yPos}%`,
              left: `${xPos}%`,
              background: `radial-gradient(circle, hsla(${hue}, 100%, 70%, ${opacity}) 0%, hsla(${hue}, 100%, 50%, 0) 70%)`,
              filter: 'blur(40px)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [opacity, opacity * 1.3, opacity],
              x: [0, (Math.random() - 0.5) * 30, 0],
              y: [0, (Math.random() - 0.5) * 30, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
      })}
    </div>
  );
};

// Floating 3D objects
const FloatingObjects = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-[10%] left-[5%] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-xl h-20 w-20 shadow-xl"
        style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.15)' }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[30%] right-[15%] bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl rounded-full h-24 w-24 shadow-xl"
        style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.15)' }}
        animate={{
          y: [0, 30, 0],
          rotate: [0, -10, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[20%] bg-gradient-to-tl from-blue-500/20 to-fuchsia-500/20 backdrop-blur-xl rounded-xl h-16 w-16 shadow-xl"
        style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.15)' }}
        animate={{
          y: [0, -15, 0],
          rotate: [0, -5, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
};

// Neural network visualization with enhanced connections
const NeuralNetworkAnimation = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg width="100%" height="100%" viewBox="0 0 800 600" className="opacity-10">
        <g>
          {/* Neural network nodes */}
          {[...Array(20)].map((_, i) => (
            <motion.circle
              key={`node-${i}`}
              cx={200 + Math.cos(i * 0.5) * 180}
              cy={300 + Math.sin(i * 0.5) * 180}
              r="4"
              fill="#a855f7"
              animate={{ 
                r: [4, 6, 4],
                opacity: [0.3, 0.7, 0.3],
                fill: ['#a855f7', '#818cf8', '#a855f7']
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                delay: i * 0.2,
                ease: "easeInOut" 
              }}
            />
          ))}
          
          {/* Connection lines with pulse effect */}
          {[...Array(40)].map((_, i) => {
            const x1 = 200 + Math.cos(i * 0.25) * 180;
            const y1 = 300 + Math.sin(i * 0.25) * 180;
            const x2 = 200 + Math.cos((i + 3) * 0.25) * 180;
            const y2 = 300 + Math.sin((i + 3) * 0.25) * 180;
            
            return (
              <g key={`connection-${i}`}>
                <motion.line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#a855f7"
                  strokeWidth="1"
                  animate={{ 
                    strokeOpacity: [0.1, 0.2, 0.1],
                    stroke: ['#a855f7', '#818cf8', '#a855f7']
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    delay: i * 0.1,
                    ease: "easeInOut" 
                  }}
                />
                <motion.circle
                  cx={x1 + (x2 - x1) * 0.3}
                  cy={y1 + (y2 - y1) * 0.3}
                  r="1.5"
                  fill="#a855f7"
                  animate={{
                    cx: [x1, x2, x1],
                    cy: [y1, y2, y1],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.05,
                    ease: "easeInOut",
                    repeatDelay: Math.random() * 2
                  }}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

// Digital rain effect (Matrix-like)
const DigitalRain = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
      <div className="absolute top-0 left-0 w-full h-full flex">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="rain-column flex-1 flex flex-col items-center">
            {[...Array(15)].map((_, j) => {
              const characters = "01";
              const char = characters.charAt(Math.floor(Math.random() * characters.length));
              const delay = Math.random() * 5;
              const duration = Math.random() * 2 + 1;
              
              return (
                <motion.div
                  key={j}
                  className="text-xs sm:text-sm text-purple-300"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ 
                    opacity: [0, 0.7, 0],
                    y: [j * -30, window.innerHeight]
                  }}
                  transition={{
                    duration: duration,
                    repeat: Infinity,
                    delay: delay,
                    ease: "linear",
                    repeatDelay: Math.random() * 2
                  }}
                >
                  {char}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams?.get('returnUrl') || '/client-dashboard';
  const [hasInteracted, setHasInteracted] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Portal animation states
  const [portalActive, setPortalActive] = useState(false);
  const [showWelcomeText, setShowWelcomeText] = useState(false);
  const [hideWelcomeText, setHideWelcomeText] = useState(false);

  // Check if already logged in
  useEffect(() => {
    if (user) {
      router.push(returnUrl);
    }
  }, [user, router, returnUrl]);

  // Trigger welcome animation sequence with updated timing
  useEffect(() => {
    // Start portal animation after a brief delay
    const portalTimer = setTimeout(() => {
      setPortalActive(true);
    }, 800);

    // Don't show welcome text at all
    // Mark animation complete to enable form interaction
    const completeTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2500);
    
    // Clean up timers
    return () => {
      clearTimeout(portalTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  // Focus the email field after animations complete
  useEffect(() => {
    if (animationComplete && inputRef.current) {
      inputRef.current.focus();
    }
  }, [animationComplete]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasInteracted(true);
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await signIn(email, password);
      
      // The useEffect hook will handle redirecting once user is set
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle error messages
      if (err instanceof Error) {
        // Parse Firebase error messages to be more user-friendly
        if (err.message.includes('auth/wrong-password') || err.message.includes('auth/user-not-found')) {
          setError('Invalid email or password');
        } else if (err.message.includes('auth/too-many-requests')) {
          setError('Too many failed login attempts. Please try again later.');
        } else {
          setError('Login failed. Please try again.');
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      {/* Main background with darker gradient for more depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-[#170b35] to-black" />
      
      {/* Stars background layer */}
      <div className="absolute inset-0 bg-[url('/stars-bg.png')] bg-repeat opacity-30" />
      
      {/* Animation layers */}
      <GlowingOrbs />
      <ParticleField />
      <DigitalRain />
      <NeuralNetworkAnimation />
      <Meteors />
      
      {/* Portal effect animation - now centered properly with improved z-index */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <motion.div 
          className="relative w-full h-full flex items-center justify-center"
          initial={false}
        >
          <motion.div
            className="absolute rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(79, 70, 229, 0.1) 50%, transparent 70%)',
              boxShadow: '0 0 100px rgba(139, 92, 246, 0.4)',
            }}
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{ 
              width: portalActive ? ['0vh', '150vh'] : '0vh', 
              height: portalActive ? ['0vh', '150vh'] : '0vh',
              opacity: portalActive ? [0, 0.8, 0.5] : 0
            }}
            transition={{ 
              duration: 2, 
              ease: [0.16, 1, 0.3, 1]
            }}
          />
          
          <motion.div
            className="absolute rounded-full bg-white/5 backdrop-blur-md border border-purple-500/20"
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{ 
              width: portalActive ? ['0vh', '120vh'] : '0vh', 
              height: portalActive ? ['0vh', '120vh'] : '0vh',
              opacity: portalActive ? [0, 0.4, 0.2] : 0
            }}
            transition={{ 
              duration: 1.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.1
            }}
          />
        </motion.div>
      </div>
      
      {/* Main content container - improved positioning for two-column layout */}
      <div className="relative z-20 min-h-screen flex justify-center">
        {/* Container to constrain width and center content */}
        <div className="flex max-w-6xl w-full mx-auto">
          {/* Left panel: Immersive visual experience - better spacing */}
          <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-end p-4 pr-8">
            <FloatingObjects />
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: animationComplete ? 1 : 0, y: animationComplete ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 2.5 }}
              className="relative z-10 max-w-md"
            >
              {/* Enhanced 3D AI Brain visualization - adjusted positioning */}
              <div className="relative h-80">
                {/* Glowing base */}
                <div className="w-72 h-72 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-64 h-64 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  <motion.div 
                    className="w-48 h-48 rounded-full bg-purple-500/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(168, 85, 247, 0.2)',
                        '0 0 40px rgba(168, 85, 247, 0.4)',
                        '0 0 20px rgba(168, 85, 247, 0.2)'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                
                <motion.div
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 2, 0]
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="relative z-20"
                >
                  <div className="relative w-80 h-80 flex items-center justify-center">
                    {/* AI Brain with enhanced effects */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.05, 1],
                        filter: [
                          'drop-shadow(0 0 20px rgba(168, 85, 247, 0.3))',
                          'drop-shadow(0 0 40px rgba(168, 85, 247, 0.5))',
                          'drop-shadow(0 0 20px rgba(168, 85, 247, 0.3))'
                        ]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="relative"
                    >
                      {/* Circular glow behind the brain */}
                      <motion.div 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(168, 85, 247, 0) 70%)' }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                      
                      <BrainCircuit className="w-36 h-36 text-purple-300 relative z-10" />
                      
                      {/* Pulse rings */}
                      <motion.div 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-purple-500/30"
                        animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      />
                      <motion.div 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-indigo-500/30"
                        animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                      />
                    </motion.div>
                    
                    {/* Orbiting elements - increased distance from center */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute w-full h-full pointer-events-none"
                    >
                      <motion.div 
                        className="absolute -top-6 left-1/2 transform -translate-x-1/2"
                        whileHover={{ scale: 1.2 }}
                      >
                        <Zap className="h-8 w-8 text-purple-400" style={{ filter: 'drop-shadow(0 0 5px rgba(168, 85, 247, 0.5))' }} />
                      </motion.div>
                    </motion.div>
                    
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute w-full h-full pointer-events-none"
                    >
                      <motion.div 
                        className="absolute top-1/2 -right-10 transform -translate-y-1/2"
                        whileHover={{ scale: 1.2 }}
                      >
                        <Sparkles className="h-8 w-8 text-indigo-400" style={{ filter: 'drop-shadow(0 0 5px rgba(129, 140, 248, 0.5))' }} />
                      </motion.div>
                    </motion.div>
                    
                    <motion.div
                      animate={{ rotate: 180 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      className="absolute w-full h-full pointer-events-none"
                    >
                      <motion.div 
                        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
                        whileHover={{ scale: 1.2 }}
                      >
                        <Shield className="h-8 w-8 text-blue-400" style={{ filter: 'drop-shadow(0 0 5px rgba(96, 165, 250, 0.5))' }} />
                      </motion.div>
                    </motion.div>
                    
                    <motion.div
                      animate={{ rotate: -240 }}
                      transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                      className="absolute w-full h-full pointer-events-none"
                    >
                      <motion.div 
                        className="absolute top-1/2 -left-10 transform -translate-y-1/2"
                        whileHover={{ scale: 1.2 }}
                      >
                        <Lightbulb className="h-8 w-8 text-amber-400" style={{ filter: 'drop-shadow(0 0 5px rgba(251, 191, 36, 0.5))' }} />
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
              
              {/* Enhanced tagline - better spacing and shadows for readability */}
              <div className="text-center mt-8">
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold mb-4 text-white tracking-tight"
                  style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3, duration: 0.8 }}
                >
                  Step into the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">future of AI</span>
                </motion.h2>
                
                <motion.p 
                  className="text-lg text-purple-100/80 max-w-md"
                  style={{ textShadow: '0 1px 5px rgba(0, 0, 0, 0.5)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.2, duration: 0.8 }}
                >
                  Harness the power of artificial intelligence to transform your business with customized solutions
                </motion.p>
              </div>
              
              {/* Enhanced features list with icons - increased spacing between items */}
              <motion.div 
                className="mt-10 text-white/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.4, duration: 0.8 }}
              >
                <ul className="space-y-4">
                  {[
                    { text: 'AI strategy tailored to your business goals', icon: <BrainCircuit className="h-5 w-5 text-purple-300" /> },
                    { text: 'Real-time implementation tracking dashboard', icon: <Zap className="h-5 w-5 text-indigo-300" /> },
                    { text: 'Enterprise-grade security and compliance', icon: <Shield className="h-5 w-5 text-blue-300" /> },
                    { text: 'Measurable ROI analytics and reporting', icon: <Sparkles className="h-5 w-5 text-amber-300" /> }
                  ].map((feature, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 3.5 + (index * 0.15), duration: 0.5 }}
                    >
                      <div className="rounded-full bg-gradient-to-r from-purple-600/20 to-indigo-600/20 p-2 backdrop-blur-sm">
                        {feature.icon}
                      </div>
                      <span className="text-base">{feature.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Right panel: Sign in form - adjusted to ensure good visibility and no overlap */}
          <div className="w-full lg:w-1/2 flex items-center justify-start p-6 md:p-12 relative z-30">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: animationComplete ? 1 : 0 }}
              transition={{ delay: 2.8, duration: 0.8 }}
              className="max-w-md w-full"
            >
              {/* Card container with frosted glass effect */}
              <motion.div
                className="backdrop-blur-xl bg-black/50 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: animationComplete ? 1 : 0, 
                  y: animationComplete ? 0 : 20 
                }}
                transition={{ delay: 3.2, duration: 0.6 }}
                style={{ boxShadow: '0 10px 30px -5px rgba(79, 70, 229, 0.2)' }}
              >
                {/* Form header */}
                <div className="p-8 pb-6 text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Access your portal
                  </h2>
                  <p className="text-indigo-200/80 text-sm">
                    Sign in to your AI implementation dashboard
                  </p>
                </div>
                
                {/* Animated divider */}
                <div className="relative h-px w-full overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                
                {/* Form body */}
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error display with enhanced animation */}
                    <AnimatePresence mode="wait">
                      {error && (
                        <motion.div
                          key="error"
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="p-3 bg-red-900/30 backdrop-blur-sm border border-red-500/30 text-red-100 rounded-lg text-sm flex items-start"
                        >
                          <div className="bg-red-500/20 rounded-full p-1 mr-2 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-100" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span>{error}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Email field with enhanced animation */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-indigo-200 mb-1.5">
                        Email address
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-purple-300 group-focus-within:text-purple-200 transition-colors duration-200" />
                        </div>
                        <input
                          ref={inputRef}
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-black/30 text-white placeholder-indigo-300/50 border border-indigo-500/30 focus:border-indigo-400 block w-full pl-11 pr-3 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
                          placeholder="name@company.com"
                        />
                        {/* Animated underline effect */}
                        <motion.div 
                          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500"
                          initial={{ width: '0%' }}
                          animate={{ width: email ? '100%' : '0%' }}
                          transition={{ duration: 0.3 }}
                        />
                        
                        {/* Subtle glow effect on focus */}
                        <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-500" 
                          style={{ boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)', zIndex: -1 }}
                        />
                      </div>
                    </div>
                    
                    {/* Password field with enhanced animation */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-indigo-200 mb-1.5">
                        Password
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-purple-300 group-focus-within:text-purple-200 transition-colors duration-200" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-black/30 text-white placeholder-indigo-300/50 border border-indigo-500/30 focus:border-indigo-400 block w-full pl-11 pr-12 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-indigo-300 hover:text-indigo-100 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                        {/* Animated underline effect */}
                        <motion.div 
                          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500"
                          initial={{ width: '0%' }}
                          animate={{ width: password ? '100%' : '0%' }}
                          transition={{ duration: 0.3 }}
                        />
                        
                        {/* Subtle glow effect on focus */}
                        <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-500" 
                          style={{ boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)', zIndex: -1 }}
                        />
                      </div>
                    </div>
                    
                    {/* Remember me and forgot password */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-purple-500 focus:ring-indigo-500 border-indigo-400/30 rounded bg-black/30"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-indigo-200">
                          Remember me
                        </label>
                      </div>
                      
                      <div className="text-sm">
                        <Link 
                          href="/forgot-password" 
                          className="font-medium text-purple-300 hover:text-white transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                    
                    {/* Submit button with enhanced effects */}
                    <div className="pt-4">
                      <motion.button
                        type="submit"
                        disabled={loading}
                        className={`${
                          loading 
                            ? 'bg-purple-900/50 cursor-not-allowed border-purple-800/50' 
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border-purple-500/50'
                        } relative w-full flex justify-center items-center py-3 px-4 border shadow-lg text-sm font-medium text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 overflow-hidden`}
                        whileHover={!loading ? { scale: 1.02 } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                        style={{
                          boxShadow: !loading ? '0 4px 20px -5px rgba(168, 85, 247, 0.5)' : undefined
                        }}
                      >
                        {/* Button glow effect */}
                        {!loading && (
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-400/30 to-indigo-600/0"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          />
                        )}
                        
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Authenticating...</span>
                          </>
                        ) : (
                          <div className="flex items-center relative z-10">
                            <span className="mr-1">Enter portal</span>
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        )}
                      </motion.button>
                    </div>
                  </form>
                </div>
                
                {/* Footer links with subtle hover effects */}
                <div className="p-8 pt-4 text-center">
                  <p className="text-sm text-indigo-200">
                    {"Don't have an account? "}
                    <Link href="/contact" className="font-medium text-purple-300 hover:text-white transition-colors hover:underline">
                      Contact us to get started
                    </Link>
                  </p>
                  
                  <div className="mt-4">
                    <Link 
                      href="/client-dashboard" 
                      className="inline-flex items-center text-xs text-indigo-300 hover:text-white transition-colors group"
                    >
                      <span>View demo dashboard</span>
                      <motion.div
                        animate={{ x: 0 }}
                        whileHover={{ x: 3 }}
                        className="inline-block ml-1"
                      >
                        <ArrowRight className="h-3 w-3" />
                      </motion.div>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 