'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Video as VideoIcon, Phone as PhoneIcon, MessageSquare, X, Loader } from 'lucide-react';

// Define the Daily iframe type
declare global {
  interface Window {
    DailyIframe: {
      createFrame: (options: any) => any;
    };
  }
}

export default function InstantConsultation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consultationType, setConsultationType] = useState<'video' | 'phone' | 'chat' | null>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [callFrame, setCallFrame] = useState<any>(null);

  // Function to create a new Daily.co room
  const createRoom = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the API endpoint to create a room
      const response = await fetch('/api/daily/create-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create video call room');
      }
      
      const data = await response.json();
      
      // Return the room URL
      return data.url;
    } catch (error) {
      console.error('Error creating room:', error);
      setError(error instanceof Error ? error.message : 'Failed to create video call room');
      return null;
    }
  };

  // Function to start a video call
  const startVideoCall = async () => {
    try {
      setConsultationType('video');
      
      // Create a new room
      const url = await createRoom();
      
      if (!url) {
        throw new Error('Failed to get room URL');
      }
      
      setRoomUrl(url);
      
      // Load the Daily.co library if not already loaded
      if (!window.DailyIframe) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@daily-co/daily-js';
        script.async = true;
        document.body.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }
      
      // Create and join the call
      const frame = window.DailyIframe.createFrame({
        iframeStyle: {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          border: 'none',
          zIndex: '50',
        },
        showLeaveButton: true,
        showFullscreenButton: true,
      });
      
      setCallFrame(frame);
      
      frame.join({ url });
      
      // Listen for call events
      frame.on('joined-meeting', () => {
        console.log('Joined meeting');
        setLoading(false);
      });
      
      frame.on('left-meeting', () => {
        console.log('Left meeting');
        endCall();
      });
      
      frame.on('error', (e: any) => {
        console.error('Daily.co error:', e);
        setError('Error joining video call: ' + e.errorMsg);
        endCall();
      });
      
    } catch (error) {
      console.error('Error starting video call:', error);
      setError(error instanceof Error ? error.message : 'Failed to start video call');
      setLoading(false);
      setConsultationType(null);
    }
  };

  // Function to start a phone call
  const startPhoneCall = () => {
    setConsultationType('phone');
    // In a real app, you would trigger a phone call here
    // For now, we'll just redirect to the contact page
    router.push('/contact?from=instant-consultation&type=phone');
  };

  // Function to start a chat
  const startChat = () => {
    setConsultationType('chat');
    // Redirect to the chat interface
    router.push('/chat?mode=consultation');
  };

  // Function to end the call
  const endCall = () => {
    if (callFrame) {
      callFrame.destroy();
      setCallFrame(null);
    }
    setConsultationType(null);
    setRoomUrl(null);
    setLoading(false);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (callFrame) {
        callFrame.destroy();
      }
    };
  }, [callFrame]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Instant Consultation</h1>
              <p className="text-gray-600 mb-8">
                Connect with an AI specialist immediately through your preferred communication method.
              </p>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  <div className="flex items-center">
                    <X className="w-5 h-5 mr-2" />
                    <p>{error}</p>
                  </div>
                  <p className="mt-2 text-sm">Please try another consultation method or try again later.</p>
                </div>
              )}
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="mb-4"
                  >
                    <Loader className="h-12 w-12 text-purple-600" />
                  </motion.div>
                  <h2 className="text-xl font-semibold text-gray-900">Setting up your {consultationType} call</h2>
                  <p className="mt-2 text-gray-600">This will just take a moment...</p>
                </div>
              ) : !consultationType ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startVideoCall}
                    className="bg-purple-600 text-white rounded-lg p-6 flex flex-col items-center text-center hover:bg-purple-700 transition-colors"
                  >
                    <VideoIcon className="h-12 w-12 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Video Call</h3>
                    <p className="text-purple-100 text-sm">Face-to-face consultation with screen sharing</p>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startPhoneCall}
                    className="bg-blue-600 text-white rounded-lg p-6 flex flex-col items-center text-center hover:bg-blue-700 transition-colors"
                  >
                    <PhoneIcon className="h-12 w-12 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Phone Call</h3>
                    <p className="text-blue-100 text-sm">Direct call with an AI specialist</p>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startChat}
                    className="bg-green-600 text-white rounded-lg p-6 flex flex-col items-center text-center hover:bg-green-700 transition-colors"
                  >
                    <MessageSquare className="h-12 w-12 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                    <p className="text-green-100 text-sm">Text-based consultation with our team</p>
                  </motion.button>
                </div>
              ) : null}
              
              {consultationType === 'video' && roomUrl && !loading && (
                <div className="py-4">
                  <p className="text-green-600 mb-4">Video call is active! If the call doesn't appear automatically, you can also join directly.</p>
                  <a 
                    href={roomUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Join Video Call
                  </a>
                  <button
                    onClick={endCall}
                    className="ml-4 inline-block border border-red-600 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    End Call
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-purple-300 mb-2">Rather schedule for later?</p>
            <a 
              href="/schedule-consultation" 
              className="text-white font-medium hover:text-purple-200 transition-colors"
            >
              Schedule a Consultation →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 