'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function MessageSender() {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const supabase = createClient();

  // Persistent channel
  const [channel] = useState(() => 
    supabase.channel('topic:announcements', {
    config: { broadcast: { self: true }, private: false },
  }));

  useEffect(() => {
    // Subscribe to channel
    channel.subscribe((status) => {
      if (status !== 'SUBSCRIBED') {
        console.error('MessageSender not subscribed:', status);
        return;
      }
      console.log('MessageSender subscribed to topic:announcements');
    });

    // Cleanup
    return () => {
      console.log('Unsubscribing MessageSender from topic:announcements');
      supabase.removeChannel(channel);
    };
  }, [channel, supabase]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setIsSending(true);

    try {
      // Insert into announcements
      const { error: insertError } = await supabase
        .from('announcements')
        .insert({ text: message, topic: 'announcements' });

      if (insertError) throw insertError;

      // Send broadcast
      channel.send({
        type: 'broadcast',
        event: 'new_message',
        payload: { text: message, timestamp: new Date().toISOString() },
      });

      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl mb-2">Send Announcement</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="border p-2 w-full h-24"
        disabled={isSending}
      />
      <button
        onClick={handleSend}
        disabled={isSending || !message.trim()}
        className="mt-2 bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
      >
        {isSending ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}