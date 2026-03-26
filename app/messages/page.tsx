'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from '@/hooks/useMessages';
import { MessageThread } from '@/components/messages/MessageThread';
import { Avatar } from '@/components/ui/Avatar';
import { PageLoader } from '@/components/ui/Loading';
import type { User } from '@/types';
import { timeAgo, truncate, cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const searchParams   = useSearchParams();
  const toId           = searchParams.get('to');
  const { conversations, loading } = useConversations();
  const [partner, setPartner] = useState<User | null>(null);

  // If ?to= param is present, load that user as partner immediately
  useEffect(() => {
    if (!toId) return;
    fetch(`/api/users/${toId}`)
      .then((r) => r.json())
      .then((j) => setPartner(j.data ?? null));
  }, [toId]);

  if (authLoading || !user) return <PageLoader />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Messages</h1>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[70vh]">
          {/* Conversation list */}
          <div className="border-r border-slate-100 overflow-y-auto">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-700">Conversations</p>
            </div>

            {loading ? (
              <p className="p-4 text-sm text-slate-400">Loading…</p>
            ) : conversations.length === 0 && !partner ? (
              <div className="p-6 text-center">
                <MessageSquare size={32} className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No conversations yet.</p>
              </div>
            ) : (
              <div>
                {/* Show ?to partner at top if not already in list */}
                {partner && !conversations.find((c) => c.partner._id === partner._id) && (
                  <button
                    onClick={() => setPartner(partner)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-primary-50 border-b border-slate-100"
                  >
                    <Avatar src={partner.avatar} name={partner.name} size="sm" />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-slate-900 truncate">{partner.name}</p>
                      <p className="text-xs text-slate-400">New conversation</p>
                    </div>
                  </button>
                )}

                {conversations.map((conv) => (
                  <button
                    key={conv.partner._id}
                    onClick={() => setPartner(conv.partner)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors text-left',
                      partner?._id === conv.partner._id && 'bg-primary-50'
                    )}
                  >
                    <Avatar src={conv.partner.avatar} name={conv.partner.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-900 truncate">{conv.partner.name}</p>
                        {conv.lastMessage && (
                          <p className="text-xs text-slate-400 shrink-0 ml-2">
                            {timeAgo(conv.lastMessage.createdAt)}
                          </p>
                        )}
                      </div>
                      {conv.lastMessage && (
                        <p className="text-xs text-slate-500 truncate">
                          {truncate(conv.lastMessage.content, 40)}
                        </p>
                      )}
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="shrink-0 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message thread */}
          <div className="md:col-span-2 flex flex-col">
            {partner ? (
              <MessageThread partner={partner} />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
                <MessageSquare size={48} className="opacity-30" />
                <p className="text-sm">Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
