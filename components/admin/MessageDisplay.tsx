'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Message } from '@/lib/types/types';
import { MessageList, Loading } from '../AnnouncementsWrapper/MessageList';


import { Suspense  } from 'react';

export default function AdminMessageDisplay() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('id, text, timestamp')
          .eq('topic', 'announcements')
          .order('timestamp', { ascending: true });

        if (error) {
          console.error('failed to fetch messages:', error);
          return;
        }
        setMessages(data || []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [supabase]);

  // Subscribe to real-time broadcasts
  useEffect(() => {
    const setupRealtime = async () => {
      await supabase.realtime.setAuth();

      const channel = supabase
        .channel('topic:announcements', { 
          config: { 
            broadcast: { self: true }, 
            private: false,
          } 
        })
        .on('broadcast', { event: 'new_message' }, (payload) => {
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
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          setOnlineUsers(Object.keys(state).length);
          console.log('Presence state:', state);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('join', key, newPresences);
          setOnlineUsers((prevCount) => prevCount + 1);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('leave', key, leftPresences);
          setOnlineUsers((prevCount) => prevCount - 1);
        })
        .subscribe((status) => {
          console.log('Admin subscription status:', status);
          if (status !== 'SUBSCRIBED') {
            console.error('Admin not subscribed:', status);
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupRealtime();
  }, [supabase]);

  return (
    <div className="mt-4">
      <h2 className="text-xl mb-2">Admin Announcements</h2>
      <div className="text-green-600 font-semibold">
        👀 {onlineUsers} users viewing the messages
      </div>
      
      <Suspense fallback={<Loading />}>
        {isLoading ? (
          <Loading />
        ) : (
          <MessageList messages={messages} />
        )}
      </Suspense>
    </div>
  );
}