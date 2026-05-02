import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';

function App() {
  const [currentView, setCurrentView] = useState('chat'); // 'chat' or 'dashboard'

  return (
    <div className="w-full h-screen overflow-hidden bg-dark-900">
      {currentView === 'chat' ? (
        <ChatInterface onNavigate={() => setCurrentView('dashboard')} />
      ) : (
        <Dashboard onNavigate={() => setCurrentView('chat')} />
      )}
    </div>
  );
}

export default App;
