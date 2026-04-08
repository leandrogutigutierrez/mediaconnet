'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { useConversations } from '@/hooks/useMessages';
import { MessageThread } from '@/components/messages/MessageThread';
import { Avatar } from '@/components/ui/Avatar';
import { PageLoader } from '@/components/ui/Loading';
import type { User } from '@/types';
import { timeAgo, truncate, cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useI18n();
  const searchParams   = useSearchParams();
  const toId           = searchParams.get('to');
  const { conversations, loading } = useConversations();
  const [partner, setPartner] = useState<User | null>(null);

  useEffect(() => {
    if (!toId) return;
    fetch(`/api/users/${toId}`).then((r) => r.json()).then((j) => setPartner(j.data ?? null));
  }, [toId]);

  if (authLoading || !user) return <PageLoader />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-content-primary tracking-tight mb-6">{t('messages.title')}</h1>

      <div className="bg-bg-card rounded-2xl border border-border overflow-hidden shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[70vh]">
          {/* Conversation list */}
          <div className="border-r border-border overflow-y-auto bg-bg-surface">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs font-semibold text-content-subtle uppercase tracking-widest">
                {t('messages.conversations')}
              </p>
            </div>

            {loading ? (
              <p className="p-4 text-sm text-content-subtle">{t('common.loading')}</p>
            ) : conversations.length === 0 && !partner ? (
              <div className="p-8 text-center">
                <MessageSquare size={28} className="text-content-subtle mx-auto mb-3 opacity-40" />
                <p className="text-sm text-content-subtle">{t('messages.noConversations')}</p>
              </div>
            ) : (
              <div>
                {partner && !conversations.find((c) => c.partner._id === partner._id) && (
                  <button onClick={() => setPartner(partner)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-primary-500/8 border-b border-border hover:bg-primary-500/10 transition-colors">
                    <Avatar src={partner.avatar} name={partner.name} size="sm" />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-content-primary truncate">{partner.name}</p>
                      <p className="text-xs text-content-subtle">{t('messages.newConversation')}</p>
                    </div>
                  </button>
                )}

                {conversations.map((conv) => (
                  <button key={conv.partner._id} onClick={() => setPartner(conv.partner)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 border-b border-border/50 hover:bg-bg-hover transition-colors text-left',
                      partner?._id === conv.partner._id && 'bg-primary-500/8 border-l-2 border-l-primary-500'
                    )}>
                    <Avatar src={conv.partner.avatar} name={conv.partner.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-content-primary truncate">{conv.partner.name}</p>
                        {conv.lastMessage && (
                          <p className="text-xs text-content-subtle shrink-0 ml-2">{timeAgo(conv.lastMessage.createdAt)}</p>
                        )}
                      </div>
                      {conv.lastMessage && (
                        <p className="text-xs text-content-subtle truncate mt-0.5">
                          {truncate(conv.lastMessage.content, 40)}
                        </p>
                      )}
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="shrink-0 w-5 h-5 bg-primary-500 text-bg text-xs rounded-full flex items-center justify-center font-semibold">
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
              <div className="flex-1 flex flex-col items-center justify-center text-content-subtle gap-3">
                <MessageSquare size={40} className="opacity-20" />
                <p className="text-sm">{t('messages.select')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
