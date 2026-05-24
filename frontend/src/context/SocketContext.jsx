// ============================================================
// QuizVerse AI — Socket Context (Socket.IO Client)
// ============================================================
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !socketRef.current) {
      const socket = io(`${import.meta.env.VITE_SOCKET_URL}/multiplayer`, {
        withCredentials: true,
        transports: ['websocket'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.on('connect', () => { setConnected(true); console.log('🔌 Socket connected'); });
      socket.on('disconnect', () => { setConnected(false); console.log('🔌 Socket disconnected'); });

      socketRef.current = socket;
    }

    return () => {
      if (socketRef.current && !isAuthenticated) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
    };
  }, [isAuthenticated]);

  const emit = (event, data, callback) => {
    if (socketRef.current?.connected) {
      if (callback) socketRef.current.emit(event, data, callback);
      else socketRef.current.emit(event, data);
    }
  };

  const on = (event, handler) => {
    socketRef.current?.on(event, handler);
    return () => socketRef.current?.off(event, handler);
  };

  const off = (event, handler) => socketRef.current?.off(event, handler);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected, emit, on, off }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within SocketProvider');
  return ctx;
};
