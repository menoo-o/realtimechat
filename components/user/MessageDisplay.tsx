// components/user/MessageDisplay.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Message } from '@/lib/types/types';
import { UserId } from '@/lib/types/types';
import { Suspense  } from 'react';
import { MessageList, Loading } from '../AnnouncementsWrapper/MessageList';




//user message display
export default function MessageDisplay({authId}: UserId) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true)
    try{
      const { data, error } = await supabase
      .from('announcements')
      .select('id, text, timestamp')
      .eq('topic', 'announcements')
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Failed to fetch messages:', error);
      return;
    }
    setMessages(data || []);
    }
    finally {
      setIsLoading(false);
    }
     
    };

    fetchMessages();
  }, [supabase]);

  // Subscribe to real-time changes
  useEffect(() => {
    const setupRealtime = async () => {
      await supabase.realtime.setAuth();

      const changes = supabase
        .channel('topic:announcements', { 
          config: {
             private: false, 
             presence: {}, // ✅ Add presence key here
            
            }, 
            
          })
        .on('broadcast', { event: 'new_message' }, (payload) => {

          console.log('Received new_message event:', payload); // Debug

          const { text, timestamp } = payload.payload;
          if (text && timestamp) {
            setMessages((prev) => [
              ...prev,
              {
                id: `${timestamp}-${text.slice(0, 10)}`, // Temporary ID for UI
                text,
                timestamp,
              },
            ]);
          }
        })

       changes.subscribe(async (status) => {
          console.log('Subscription status:', status); // Debug
          if (status !== 'SUBSCRIBED') {
            console.error('Not subscribed:', status);
          } else {
            const userStatus = {
              user: {authId}, // Hardcoded id and it is working but how to track every other user?
              online_at: new Date().toISOString(),
            };
  
            // Track user presence
            await changes.track(userStatus); // Track user's state to the channel
           
          }
        });

      return () => {
        console.log('Unsubscribing from channel'); // Debug
        supabase.removeChannel(changes);
      };
    };

    setupRealtime();
  }, [supabase, authId]);

  return (
    <div className="mt-4">
      <h2 className="text-xl mb-2"> Announcements</h2>
      
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