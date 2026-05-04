import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'gz_';

export async function getData(key) {
  try {
    const val = await AsyncStorage.getItem(PREFIX + key);
    return val ? JSON.parse(val) : [];
  } catch { return []; }
}

export async function saveData(key, value) {
  try {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {}
}

export async function getItem(key) {
  try {
    return await AsyncStorage.getItem(PREFIX + key);
  } catch { return null; }
}

export async function setItem(key, value) {
  try {
    await AsyncStorage.setItem(PREFIX + key, value);
  } catch {}
}

export function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export function fmtDate(d) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function calcStreak(logs) {
  const days = [...new Set(logs.map(l => l.date))].sort().reverse();
  if (!days.length) return 0;
  let streak = 0;
  const cur = new Date();
  for (let i = 0; i < 365; i++) {
    const d = cur.toISOString().split('T')[0];
    if (days.includes(d)) { streak++; cur.setDate(cur.getDate() - 1); }
    else if (i === 0) { cur.setDate(cur.getDate() - 1); }
    else break;
  }
  return streak;
}
