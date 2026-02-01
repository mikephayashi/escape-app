'use client';

import { useEffect, useRef, useCallback } from 'react';
import Pusher from 'pusher-js';

type EventHandler = (data: unknown) => void;

export function usePusher() {
  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<ReturnType<Pusher['subscribe']> | null>(null);
  const handlersRef = useRef<Map<string, EventHandler>>(new Map());

  useEffect(() => {
    // Initialize Pusher client
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!pusherKey || !pusherCluster) {
      console.warn('Pusher not configured. Set NEXT_PUBLIC_PUSHER_KEY and NEXT_PUBLIC_PUSHER_CLUSTER');
      return;
    }

    pusherRef.current = new Pusher(pusherKey, {
      cluster: pusherCluster,
    });

    // Subscribe to the escape-room channel
    channelRef.current = pusherRef.current.subscribe('escape-room');

    // Cleanup on unmount
    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
      }
      if (pusherRef.current) {
        pusherRef.current.unsubscribe('escape-room');
        pusherRef.current.disconnect();
      }
    };
  }, []);

  const subscribe = useCallback((eventType: string, handler: EventHandler) => {
    if (channelRef.current) {
      channelRef.current.bind(eventType, handler);
      handlersRef.current.set(eventType, handler);
    }
  }, []);

  const unsubscribe = useCallback((eventType: string) => {
    if (channelRef.current) {
      const handler = handlersRef.current.get(eventType);
      if (handler) {
        channelRef.current.unbind(eventType, handler);
        handlersRef.current.delete(eventType);
      }
    }
  }, []);

  return { subscribe, unsubscribe };
}
