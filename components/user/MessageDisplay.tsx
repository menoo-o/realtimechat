// components/user/MessageDisplay.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Message {
  text: string;
  timestamp: string;
}

export default function MessageDisplay() {
  const [messages, setMessages] = useState<Message[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // Set auth for Realtime
    supabase.realtime.setAuth();

    // Subscribe to the announcements channel
    const channel = supabase
      .channel('topic:announcements', { config: { private: false } })
      .on('broadcast', { event: 'new_message' }, (payload) => {
        setMessages((prev) => [
          ...prev,
          { text: payload.payload.text, timestamp: payload.payload.timestamp },
        ]);
      })
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="mt-4">
      <h2 className="text-xl mb-2">Announcements</h2>
      {messages.length === 0 ? (
        <p>No announcements yet.</p>
      ) : (
        <ul className="border p-2">
          {messages.map((msg, index) => (
            <li key={index} className="mb-2">
              <strong>{new Date(msg.timestamp).toLocaleString()}:</strong> {msg.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}