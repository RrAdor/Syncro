import { useState } from 'react';
import { JoinPage } from './pages/JoinPage';
import { ChatPage } from './pages/ChatPage';
import './App.css';

export function App() {
  const [username, setUsername] = useState<string | null>(null);

  const handleJoin = (name: string) => {
    setUsername(name);
  };

  const handleLeave = () => {
    setUsername(null);
  };

  return (
    <div className="app-root">
      {!username ? (
        <JoinPage onJoin={handleJoin} />
      ) : (
        <ChatPage username={username} onLeave={handleLeave} />
      )}
    </div>
  );
}

export default App;

