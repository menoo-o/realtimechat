'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Message } from '@/lib/types/types';

interface MessageListProps {
  initialMessages: Message[];
}

export default function MessageList({ initialMessages }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    const supabase = createClient();

    // Realtime subscription
    const channel = supabase
      .channel('traffic-updates')
      .on('broadcast', { event: 'message_change' }, (payload) => {
        setMessages((prev) => [payload.payload, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-2">
      {messages.length === 0 && <p className="text-gray-500 text-sm">No updates yet.</p>}
      {messages.map((msg) => (
        <div key={msg.id} className="p-3 border rounded bg-white text-sm">
          <p>{msg.content}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(msg.created_at).toLocaleTimeString()}
          </p>
        </div>
      ))}
    </div>
  );
}