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
      // Set auth for Realtime
      await supabase.realtime.setAuth();

      const changes = supabase
        .channel('topic:announcements', { config: { private: false } })
        .on('broadcast', { event: 'INSERT' }, (payload) => {
          console.log('Received INSERT event:', payload); // Debug
          const newMessage = payload.new;
          if (newMessage && newMessage.id && newMessage.text && newMessage.timestamp) {
            setMessages((prev) => [
              ...prev,
              {
                id: newMessage.id,
                text: newMessage.text,
                timestamp: newMessage.timestamp,
              },
            ]);
          }
        })
        .subscribe((status) => {
          console.log('Subscription status:', status); // Debug
          if (status !== 'SUBSCRIBED') {
            console.error('Not subscribed:', status);
          } else {
            console.log('Subscribed to announcements');
          }
        });

      // Cleanup
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