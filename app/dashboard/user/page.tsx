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
    // Authorize the realtime client (private channels)
    supabase.realtime.setAuth();

    // Subscribe to the "chat-room" broadcast channel
    const subscription = supabase
      .channel('chat-room', { config: { private: true } })
      .on('broadcast', { event: 'INSERT' }, ({ payload }) => {
        setMessages((msgs) => [...msgs, payload.new]);
      })
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(subscription);
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
