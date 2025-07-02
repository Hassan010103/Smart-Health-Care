import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  _id?: string;
  sender: { id: string; role: string; name?: string };
  message: string;
  timestamp: string;
}

interface ChatBoxProps {
  appointmentId: string;
  token: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ appointmentId, token }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat history
  useEffect(() => {
    if (!appointmentId || !token) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/chat/${appointmentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        setMessages(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load chat history.');
        setLoading(false);
      });
  }, [appointmentId, token]);

  // Socket.io for real-time chat
  useEffect(() => {
    if (!appointmentId || !token) return;
    console.log('[ChatBox] Connecting to Socket.io with token:', token);
    const socket = io('http://localhost:5000', { auth: { token } });
    socketRef.current = socket;
    socket.on('connect', () => {
      socket.emit('join', { appointmentId });
    });
    socket.on('message', (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
    });
    socket.on('connect_error', (err) => {
      console.error('[ChatBox] Socket.io connect_error:', err.message);
      setError('Socket connection failed: ' + err.message);
    });
    return () => { socket.disconnect(); };
  }, [appointmentId, token]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socketRef.current) return;
    socketRef.current.emit('message', { appointmentId, message: input });
    setInput('');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 flex flex-col h-96 max-h-96 w-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <div className="text-center text-slate-400">Loading chat...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-slate-400">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg, idx) => (
            <div key={msg._id || idx} className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                {msg.sender.name || msg.sender.role} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <div className="bg-cyan-100 dark:bg-cyan-900/40 text-slate-800 dark:text-slate-100 rounded-lg px-3 py-2 max-w-xs self-start">
                {msg.message}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-cyan-600 transition-colors" disabled={!input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox; 