'use_client';

// 'use client';

// import { useEffect, useState } from 'react';
// import { createClient } from '@/utils/supabase/client';

// interface Message {
//   id: string;
//   text: string;
//   timestamp: string;
// }

// export default function AdminMessageDisplay() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const supabase = createClient();

//   // Fetch initial messages
//   useEffect(() => {
//     const fetchMessages = async () => {
//       const { data, error } = await supabase
//         .from('announcements')
//         .select('id, text, timestamp')
//         .eq('topic', 'announcements')
//         .order('timestamp', { ascending: true });

//       if (error) {
//         console.error('Admin failed to fetch messages:', error);
//         return;
//       }
//       setMessages(data || []);
//     };

//     fetchMessages();
//   }, [supabase]);

//   // Subscribe to real-time broadcasts
//   useEffect(() => {
//     const setupRealtime = async () => {
//       await supabase.realtime.setAuth();

//       const channel = supabase
//         .channel('topic:announcements', { config: { broadcast: { self: true }, private: false } })
//         .on('broadcast', { event: 'new_message' }, (payload) => {
//           console.log('AdminMessageDisplay received new_message:', payload);
//           const { text, timestamp } = payload.payload;
//           if (text && timestamp) {
//             setMessages((prev) => [
//               ...prev,
//               {
//                 id: `${timestamp}-${text.slice(0, 10)}`,
//                 text,
//                 timestamp,
//               },
//             ]);
//           }
//         })
//         .subscribe((status) => {
//           console.log('Admin subscription status:', status);
//           if (status !== 'SUBSCRIBED') {
//             console.error('Admin not subscribed:', status);
//           } else {
//             console.log('Admin subscribed to topic:announcements');
//           }
//         });

//       return () => {
//         console.log('Unsubscribing Admin from topic:announcements');
//         supabase.removeChannel(channel);
//       };
//     };

//     setupRealtime();
//   }, [supabase]);


//   return (
//     <div className="mt-4">
//       <h2 className="text-xl mb-2">Admin Announcements</h2>
//       {messages.length === 0 ? (
//         <p>No announcements yet.</p>
//       ) : (
//         <ul className="border p-2">
//           {messages.map((msg) => (
//             <li key={msg.id} className="mb-2">
//               <strong>{new Date(msg.timestamp).toLocaleString()}:</strong> {msg.text}
//             </li>
//           ))}
//         </ul>
//       )}
//     </ div>
//   );
// }



import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Message {
  id: string;
  text: string;
  timestamp: string;
}

export default function AdminMessageDisplay() {
  const [messages, setMessages] = useState<Message[]>([]);
  const supabase = createClient();

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('id, text, timestamp')
        .eq('topic', 'announcements')
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Admin failed to fetch messages:', error);
        return;
      }
      setMessages(data || []);
    };

    fetchMessages();
  }, [supabase]);

  // Subscribe to real-time broadcasts
  useEffect(() => {
    const setupRealtime = async () => {
      await supabase.realtime.setAuth();

      const channel = supabase
        .channel('topic:announcements', { config: { broadcast: { self: true }, private: true } })
        .on('broadcast', { event: 'new_message' }, (payload) => {
          console.log('Admin received new_message:', payload);
          const { id, text, timestamp } = payload.payload;
          if (id && text && timestamp) {
            setMessages((prev) => [
              ...prev,
              { id, text, timestamp },
            ]);
          }
        })
        
        .on('broadcast', { event: 'update_message' }, (payload) => {
          console.log('Admin received update_message:', payload);
          const { id, text, timestamp } = payload.payload;
          if (id && text && timestamp) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === id ? { id, text, timestamp } : msg
              )
            );
          }
        })

        .on('broadcast', { event: 'delete_message' }, (payload) => {
          console.log('Admin received delete_message:', payload);
          const { id } = payload.payload;
          if (id) {
            setMessages((prev) => prev.filter((msg) => msg.id !== id));
          }
        })
        .subscribe((status) => {
          console.log('Admin subscription status:', status);
          if (status !== 'SUBSCRIBED') {
            console.error('Admin not subscribed:', status);
          } else {
            console.log('Admin subscribed to topic:announcements');
          }
        });

      return () => {
        console.log('Unsubscribing Admin from topic:announcements');
        supabase.removeChannel(channel);
      };
    };

    setupRealtime();
  }, [supabase]);

  return (
    <div className="mt-4">
      <h2 className="text-xl mb-2">Admin Announcements</h2>
      {messages.length === 0 ? (
        <p>No announcements yet.</p>
      ) : (
        <ul className="border p-2">
          {messages.map((msg) => (
            <li key={msg.id} className="mb-2">
              <strong>{new Date(msg.timestamp).toLocaleString()}:</strong> {msg.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}