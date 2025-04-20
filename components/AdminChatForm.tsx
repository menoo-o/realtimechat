'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

type Props = {
  userId: string;
};

export default function AdminChatForm({ userId }: Props) {
  const supabase = createClient();
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    if (!content.trim()) return;

    setSending(true);

    const { error } = await supabase.from('msgs_room').insert({
      sender_id: userId,
      content,
    });

    if (error) {
      console.error('Message send failed:', error.message);
    } else {
      setContent('');
    }

    setSending(false);
  };

  return (
    <div className="space-y-4">
      <textarea
        className="w-full border rounded-md p-2"
        rows={4}
        placeholder="Type your announcement..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={sendMessage}
        disabled={sending}
        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
      >
        {sending ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}
