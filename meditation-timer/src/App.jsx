import { useState } from 'react';
import Timer from './components/Timer';
import WorldMap from './components/WorldMap';
import History from './components/History';
import './App.css';

export default function App() {
  const [isUserMeditating, setIsUserMeditating] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);
  const [activeTab, setActiveTab] = useState('timer'); // timer | history

  function handleSessionComplete() {
    setIsUserMeditating(false);
    setHistoryKey(k => k + 1);
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-mark">◎</span>
            <span className="logo-text">Stil</span>
          </div>
          <nav className="tab-nav">
            <button
              className={`tab-btn ${activeTab === 'timer' ? 'active' : ''}`}
              onClick={() => setActiveTab('timer')}
            >
              Timer
            </button>
            <button
              className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              Geschiedenis
            </button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="app-main">
        {activeTab === 'timer' && (
          <div className="timer-layout">
            <Timer
              onSessionStart={() => setIsUserMeditating(true)}
              onSessionComplete={handleSessionComplete}
            />
            <WorldMap isUserMeditating={isUserMeditating} />
          </div>
        )}

        {activeTab === 'history' && (
          <History refreshKey={historyKey} />
        )}
      </main>

      <footer className="app-footer">
        <p>Adem in. Adem uit. Wees hier.</p>
      </footer>
    </div>
  );
}
