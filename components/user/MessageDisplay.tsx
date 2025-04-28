// components/user/MessageDisplay.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Message {
  id: string;
  text: string;
  timestamp: string;
}

export default function MessageDisplay() {
  const [messages, setMessages] = useState<Message[]>([]);
  const supabase = createClient();

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('id, text, timestamp')
        .eq('topic', 'announcements')
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Failed to fetch messages:', error);
        return;
      }
      setMessages(data || []);
    };

    fetchMessages();
  }, [supabase]);

  // Subscribe to real-time changes
  useEffect(() => {
    const setupRealtime = async () => {
      await supabase.realtime.setAuth();

      const changes = supabase
        .channel('topic:announcements', { 
          config: {
             private: false, 
             presence: { key: `user-${Math.random()}` }, // ✅ Add presence key here
            
            }, 
            
          })
        .on('broadcast', { event: 'new_message' }, (payload) => {
          console.log('Received new_message event:', payload); // Debug
          const { text, timestamp } = payload.payload;
          if (text && timestamp) {
            setMessages((prev) => [
              ...prev,
              {
                id: `${timestamp}-${text.slice(0, 10)}`, // Temporary ID for UI
                text,
                timestamp,
              },
            ]);
          }
        })

       await changes.subscribe(async (status) => {
          console.log('Subscription status:', status); // Debug
          if (status !== 'SUBSCRIBED') {
            console.error('Not subscribed:', status);
          } else {
            const userStatus = {
              user: 'user-1', // Replace with actual user ID if you have authentication
              online_at: new Date().toISOString(),
            };
  
            // Track user presence
            await changes.track(userStatus); // Track user's state to the channel
            console.log('User state tracked:', userStatus);
            console.log('Subscribed to announcements');
          }
        });

      return () => {
        console.log('Unsubscribing from channel'); // Debug
        supabase.removeChannel(changes);
      };
    };

    setupRealtime();
  }, [supabase]);

  return (
    <div className="mt-4">
      <h2 className="text-xl mb-2">Announcements</h2>
      {messages.length === 0 ? (
        <p>No announcements yet.</p>
      ) : (
        <ul className="border p-2">
          {messages.map((msg) => (
            <li key={msg.id} className="mb-2">
              <strong>{new Date(msg.timestamp).toLocaleString()}:</strong> {msg.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}