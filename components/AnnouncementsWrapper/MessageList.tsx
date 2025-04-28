'use client'

import { Message } from '@/lib/types/types';

export function Loading() {
    return <div className="text-gray-500">Loading announcements...</div>;
  }
  
  // Wrap the message display logic in a component that can be suspended
export function MessageList({ messages }: { messages: Message[] }) {
    // This component will suspend until messages are available
    if (messages.length === 0) {
      return <p>No announcements yet.</p>;
    }
  
    return (
      <ul className="border p-2">
        {messages.map((msg) => (
          <li key={msg.id} className="mb-2">
            <strong>{new Date(msg.timestamp).toLocaleString()}:</strong> {msg.text}
          </li>
        ))}
      </ul>
    );
  }
  