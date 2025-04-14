'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/server';

export default function PostForm() {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const supabase =await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('Not authenticated');
      return;
    }

    const { error } = await supabase
      .from('messages')
      .insert({ content, admin_id: user.id });

    if (error) {
      setError(error.message);
    } else {
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Post a traffic update..."
        className="w-full p-2 border rounded resize-none text-sm"
        rows={3}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      <button
        type="submit"
        className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
      >
        Publish
      </button>
    </form>
  );
}