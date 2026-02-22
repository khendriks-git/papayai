import { useState } from 'react';
import { getHistory, clearHistory, getTotalMinutes } from '../utils/storage';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('nl-NL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
}

function groupByDate(sessions) {
  const groups = {};
  sessions.forEach(s => {
    const dateKey = new Date(s.date).toLocaleDateString('nl-NL');
    if (!groups[dateKey]) groups[dateKey] = { label: formatDate(s.date), sessions: [] };
    groups[dateKey].sessions.push(s);
  });
  return Object.values(groups);
}

export default function History({ refreshKey }) {
  const [confirmClear, setConfirmClear] = useState(false);
  const history = getHistory();
  const totalMinutes = getTotalMinutes();
  const totalSessions = history.length;
  const avgMinutes = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

  function handleClear() {
    if (confirmClear) {
      clearHistory();
      setConfirmClear(false);
      window.location.reload();
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  }

  if (history.length === 0) {
    return (
      <div className="history-card">
        <h2 className="history-title">Meditatiegeschiedenis</h2>
        <div className="history-empty">
          <div className="empty-icon">◯</div>
          <p>Je eerste sessie wacht op je.</p>
          <p className="empty-sub">Begin een meditatie om je reis bij te houden.</p>
        </div>
      </div>
    );
  }

  const groups = groupByDate(history);

  return (
    <div className="history-card">
      <div className="history-header">
        <h2 className="history-title">Meditatiegeschiedenis</h2>
        <button
          className={`clear-btn ${confirmClear ? 'confirm' : ''}`}
          onClick={handleClear}
        >
          {confirmClear ? 'Zeker?' : 'Wissen'}
        </button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-item">
          <span className="stat-value">{totalSessions}</span>
          <span className="stat-label">sessies</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value">{totalMinutes}</span>
          <span className="stat-label">minuten totaal</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value">{avgMinutes}</span>
          <span className="stat-label">gem. per sessie</span>
        </div>
      </div>

      {/* Session list grouped by date */}
      <div className="session-groups">
        {groups.map(group => (
          <div key={group.label} className="session-group">
            <div className="session-date-label">{group.label}</div>
            {group.sessions.map(session => (
              <div key={session.id} className="session-item">
                <div className="session-icon">
                  {session.minutes >= 20 ? '◎' : session.minutes >= 10 ? '○' : '·'}
                </div>
                <div className="session-info">
                  <span className="session-duration">{session.minutes} minuten</span>
                  <span className="session-time">{formatTime(session.date)}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
