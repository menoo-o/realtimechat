// components/admin/MessageSender.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function MessageSender() {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const supabase = createClient();

  const handleSend = async () => {
    if (!message.trim()) return; // Prevent empty messages
    setIsSending(true);

    try {
      // Send Broadcast message
      await supabase.channel('topic:announcements').send({
        type: 'broadcast',
        event: 'new_message',
        payload: { text: message, timestamp: new Date().toISOString() },
      });
      setMessage(''); // Clear textarea
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