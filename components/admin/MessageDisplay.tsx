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
        .channel('topic:announcements', { config: { broadcast: { self: true }, private: false } })
        .on('broadcast', { event: 'new_message' }, (payload) => {
          console.log('AdminMessageDisplay received new_message:', payload);
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

  // Optional polling (disabled, as broadcasts are preferred)
  /*
  useEffect(() => {
    const pollMessages = async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('id, text, timestamp')
        .eq('topic', 'announcements')
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Admin polling failed:', error);
        return;
      }
      setMessages(data || []);
    };

    const interval = setInterval(pollMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [supabase]);
  */

  return (
    <div className="mt-4">
      <h2 className="text-xl mb-2">Admin Announcements</h2>
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