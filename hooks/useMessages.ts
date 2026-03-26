'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Message, Conversation } from '@/types';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading,       setLoading]       = useState(true);

  const refresh = useCallback(() => {
    fetch('/api/messages')
      .then((r) => r.json())
      .then((j) => setConversations(j.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { conversations, loading, refresh };
}

export function useThread(partnerId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading,  setLoading]  = useState(false);

  const refresh = useCallback(() => {
    if (!partnerId) return;
    setLoading(true);
    fetch(`/api/messages/${partnerId}`)
      .then((r) => r.json())
      .then((j) => setMessages(j.data ?? []))
      .finally(() => setLoading(false));
  }, [partnerId]);

  useEffect(() => { refresh(); }, [refresh]);

  const send = useCallback(async (content: string) => {
    if (!partnerId || !content.trim()) return;
    const res = await fetch('/api/messages', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ receiverId: partnerId, content }),
    });
    const json = await res.json();
    if (res.ok) {
      setMessages((prev) => [...prev, json.data]);
    }
  }, [partnerId]);

  return { messages, loading, refresh, send };
}
