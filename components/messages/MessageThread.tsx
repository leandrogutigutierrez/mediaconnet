'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { useThread } from '@/hooks/useMessages';
import { Avatar } from '@/components/ui/Avatar';
import { cn, formatDate } from '@/lib/utils';
import type { User } from '@/types';

interface MessageThreadProps {
  partner: User;
}

export function MessageThread({ partner }: MessageThreadProps) {
  const { user }                    = useAuth();
  const { t }                       = useI18n();
  const { messages, loading, send } = useThread(partner._id);
  const [input, setInput]           = useState('');
  const [sending, setSending]       = useState(false);
  const bottomRef                   = useRef<HTMLDivElement>(null);

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
    return (
      <div className="flex-1 flex items-center justify-center text-content-subtle text-sm">
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Thread header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-bg-surface">
        <Avatar src={partner.avatar} name={partner.name} size="sm" />
        <div>
          <p className="font-semibold text-content-primary text-sm">{partner.name}</p>
          <p className="text-xs text-content-subtle capitalize">{partner.role}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-bg">
        {messages.length === 0 && (
          <p className="text-center text-sm text-content-subtle py-8">
            {t('messages.noMessages')}
          </p>
        )}

        {messages.map((msg, idx) => {
          const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender._id?.toString();
          const isMe     = senderId === user?._id?.toString();
          const showDate = idx === 0 ||
            new Date(msg.createdAt).toDateString() !== new Date(messages[idx - 1].createdAt).toDateString();

          return (
            <React.Fragment key={msg._id}>
              {showDate && (
                <p className="text-center text-xs text-content-subtle my-2 font-medium">
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
                <div className={cn(
                  'max-w-[72%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                  isMe
                    ? 'bg-usc-700 text-white rounded-br-sm'
                    : 'bg-bg-card text-content-primary border border-border rounded-bl-sm'
                )}>
                  {msg.content}
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex items-center gap-2 p-3 bg-bg-surface border-t border-border">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('messages.placeholder')}
          className="flex-1 rounded-xl border border-border bg-bg-card px-4 py-2.5 text-sm
                     text-content-primary placeholder:text-content-subtle
                     focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50
                     transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="p-2.5 bg-primary-500 text-bg rounded-xl hover:bg-primary-400 transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed shadow-glow-sm"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
