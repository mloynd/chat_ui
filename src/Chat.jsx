import React, { useState } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://bridge-y5on.onrender.com/bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      });

      const data = await response.json();
      const reply = data.reply || JSON.stringify(data, null, 2);
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: '⚠️ Error connecting to bridge.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`max-w-xl px-4 py-2 rounded-lg shadow-md whitespace-pre-wrap ${msg.role === 'user' ? 'bg-blue-100 self-end text-right' : 'bg-green-100 self-start text-left'}`}>
            <span className="block text-sm text-gray-500 mb-1">{msg.role}</span>
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-sm text-gray-400">Assistant is typing...</div>}
      </div>
      <div className="p-4 border-t flex items-center">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className="flex-1 border rounded-lg px-3 py-2 mr-2"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Send
        </button>
      </div>
    </div>
  );
}
