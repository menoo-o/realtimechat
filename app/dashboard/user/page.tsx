'use client'

// import ProfileInfo from '@/components/profile/ProfileInfo';
// import { getUserInfo } from './loaders';

// export default async function UserDashboard() {


//   const info = await getUserInfo();

//   if (!info) {
//     throw new Error('Failed to load profile.');
//   }

//   return <ProfileInfo info={info} />;
// }





'use client';

type Message = {
  id: number;
  content: string;
  sender_id: string;
  inserted_at: string;
};


import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    supabase.realtime.setAuth(); // only if private channels
  
    const channel = supabase
      .channel('chatroom')
      .on('broadcast', { event: 'INSERT' }, ({ payload }) => {
        console.log('🔴 Received:', payload);
        setMessages((msgs) => [...msgs, payload.new]); // Make sure `payload.new` has content
      })
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  


  return (
    <div>
      <h1>User Dashboard</h1>
      <div className="chat-box">
        {messages.map((m) => (
          <p key={m.id}>
            <strong>{m.sender_id.slice(0, 8)}:</strong> {m.content}
          </p>
        ))}
      </div>
    </div>
  );
}
