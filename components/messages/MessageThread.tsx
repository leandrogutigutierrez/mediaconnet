'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useThread } from '@/hooks/useMessages';
import { Avatar } from '@/components/ui/Avatar';
import { cn, formatDate } from '@/lib/utils';
import type { User } from '@/types';

interface MessageThreadProps {
  partner: User;
}

export function MessageThread({ partner }: MessageThreadProps) {
  const { user }              = useAuth();
  const { messages, loading, send } = useThread(partner._id);
  const [input, setInput]     = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef             = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    await send(input.trim());
    setInput('');
    setSending(false);
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Loading…</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Thread header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-white">
        <Avatar src={partner.avatar} name={partner.name} size="sm" />
        <div>
          <p className="font-semibold text-slate-900 text-sm">{partner.name}</p>
          <p className="text-xs text-slate-500 capitalize">{partner.role}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {messages.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-8">
            No messages yet. Start the conversation!
          </p>
        )}

        {messages.map((msg, idx) => {
          const isMe = msg.sender._id === user?._id || msg.sender === user?._id;
          const showDate = idx === 0 ||
            new Date(msg.createdAt).toDateString() !==
            new Date(messages[idx - 1].createdAt).toDateString();

          return (
            <React.Fragment key={msg._id}>
              {showDate && (
                <p className="text-center text-xs text-slate-400 my-2">
                  {formatDate(msg.createdAt)}
                </p>
              )}
              <div className={cn('flex items-end gap-2', isMe && 'flex-row-reverse')}>
                {!isMe && (
                  <Avatar
                    src={(msg.sender as unknown as User).avatar}
                    name={(msg.sender as unknown as User).name ?? 'User'}
                    size="xs"
                  />
                )}
                <div
                  className={cn(
                    'max-w-[72%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                    isMe
                      ? 'bg-primary-600 text-white rounded-br-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm shadow-sm'
                  )}
                >
                  {msg.content}
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex items-center gap-2 p-3 bg-white border-t border-slate-100">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
