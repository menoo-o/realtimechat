'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Message {
  id: string;
  text: string;
  timestamp: string;
}

export default function AdminMessageDisplay() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);

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
        console.error('Admin failed to fetch messages:', error);
        return;
      }
      setMessages(data || []);
    };

    fetchMessages();
  }, [supabase]);

  // Subscribe to real-time broadcasts
  useEffect(() => {
    const setupRealtime = async () => {
      await supabase.realtime.setAuth();

      const channel = supabase
        .channel('topic:announcements', { 
          config: { 
            broadcast: { self: true }, 
            private: false,
            presence: {
              key: `admin-${Math.random()}`, // admin also joins
            },
          } })
        .on('broadcast', { event: 'new_message' }, (payload) => {
         
          const { text, timestamp } = payload.payload;
          if (text && timestamp) {
            setMessages((prev) => [
              ...prev,
              {
                id: `${timestamp}-${text.slice(0, 10)}`,
                text,
                timestamp,
              },
            ]);
          }
        })
        // Add presence tracking
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState(); // Get the list of online users
          setOnlineUsers(Object.keys(state).length); // Count the users (keys are the user IDs)
          console.log('Presence state:', state); // Debug log
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('join', key, newPresences)
          setOnlineUsers((prevCount) => prevCount + 1);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('leave', key, leftPresences)
          setOnlineUsers((prevCount) => prevCount - 1); // Decrement the count
        })
      
        .subscribe((status) => {
          console.log('Admin subscription status:', status);
          if (status !== 'SUBSCRIBED') {
            console.error('Admin not subscribed:', status);
          } else {
            console.log('Admin subscribed to topic:announcements');
          }
        });

      return () => {
        console.log('Unsubscribing Admin from topic:announcements');
        supabase.removeChannel(channel);
      };
    };

    setupRealtime();
  }, [supabase]);



  return (
    <div className="mt-4">
      <h2 className="text-xl mb-2">Admin Announcements</h2>
      <br />
      <div className="text-green-600 font-semibold">
        👀 {onlineUsers} users viewing the messages
      </div>
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
    </ div>
  );
}