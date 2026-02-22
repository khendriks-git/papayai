const STORAGE_KEY = 'meditation_history';

export function getHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveSession(session) {
  const history = getHistory();
  const newSession = {
    id: Date.now(),
    ...session,
    date: new Date().toISOString(),
  };
  history.unshift(newSession);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 100)));
  return newSession;
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getTotalMinutes() {
  return getHistory().reduce((sum, s) => sum + Math.floor(s.duration / 60), 0);
}
