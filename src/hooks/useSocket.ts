'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketReturn<T = any> {
  socket: Socket | null;
  isConnected: boolean;
  subscribe: (eventName: string, callback: (data: T) => void) => void;
  unsubscribe: (eventName: string, callback: (data: T) => void) => void;
  emit: (eventName: string, data?: any) => void;
}

const useSocket = (): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket without token
    const socket = io('http://localhost:5000', {
      path: '/socket.io/',
      transports: ['websocket'],
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connection-success', (data) => {
      console.log('Server:', data);
    });

    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, []);

  const subscribe = useCallback((event: string, callback: (data: any) => void) => {
    socketRef.current?.on(event, callback);
  }, []);

  const unsubscribe = useCallback((event: string, callback: (data: any) => void) => {
    socketRef.current?.off(event, callback);
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { socket: socketRef.current, isConnected, subscribe, unsubscribe, emit };
};

export default useSocket;
