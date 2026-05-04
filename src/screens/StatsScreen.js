import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { C, MACRO_GOALS } from '../utils/theme';
import { getData, todayStr, calcStreak } from '../utils/storage';

export default function StatsScreen() {
  const [stats, setStats] = useState(null);

  useFocusEffect(useCallback(() => { load(); }, []));

  async function load() {
    const [gym, food, learn, work] = await Promise.all([getData('gym'), getData('food'), getData('learn'), getData('work')]);
    const last7 = [];
    for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); last7.push(d.toISOString().split('T')[0]); }
    const last28 = [];
    for (let i = 27; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); last28.push(d.toISOString().split('T')[0]); }

    const gSet = new Set(gym.map(l => l.date));
    const lSet = new Set(learn.map(l => l.date));
    const wSet = new Set(work.map(l => l.date));

    const proteinByDay = last7.map(d => Math.round(food.filter(f => f.date === d).reduce((a, f) => a + (f.p || 0), 0)));
    const dayLabels = last7.map(d => { const dt = new Date(d + 'T00:00:00'); return dt.toLocaleDateString('en-US', { weekday: 'short' }); });

    setStats({
      gymStreak: calcStreak(gym), learnStreak: calcStreak(learn), workStreak: calcStreak(work),
      gymW: last7.filter(d => gSet.has(d)).length,
      learnW: last7.filter(d => lSet.has(d)).length,
      workW: last7.filter(d => wSet.has(d)).length,
      workHrs: work.filter(l => last7.includes(l.date)).reduce((a, l) => a + (l.hrs || 0), 0),
      avgProt: Math.round(proteinByDay.reduce((a, b) => a + b, 0) / 7),
      proteinByDay, dayLabels, last28, gSet, lSet, wSet,
    });
  }

  if (!stats) return <View style={s.container}><Text style={{ color: C.muted, textAlign: 'center', marginTop: 40 }}>Loading...</Text></View>;

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>
      {/* Streaks */}
      <View style={s.card}>
        <Text style={s.cardTitle}>CURRENT STREAKS</Text>
        <View style={s.streakRow}>
          <StreakItem label="Gym" val={stats.gymStreak} icon="🔥" color={C.accent} />
          <StreakItem label="Learn" val={stats.learnStreak} icon="📚" color={C.purple} />
          <StreakItem label="Work" val={stats.workStreak} icon="💻" color={C.amber} />
        </View>
      </View>

      {/* This week */}
      <View style={s.card}>
        <Text style={s.cardTitle}>THIS WEEK</Text>
        <View style={s.weekGrid}>
          <WeekCell val={`${stats.gymW}/7`} label="Gym Days" color={C.accent} />
          <WeekCell val={`${stats.learnW}/7`} label="Learn Days" color={C.purple} />
          <WeekCell val={`${stats.workHrs.toFixed(1)}`} label="Work Hrs" color={C.amber} />
          <WeekCell val={`${stats.avgProt}g`} label="Avg Protein" color={C.green} />
        </View>
      </View>

      {/* Protein chart */}
      <View style={s.card}>
        <Text style={s.cardTitle}>PROTEIN — LAST 7 DAYS</Text>
        <View style={s.barChart}>
          {stats.proteinByDay.map((val, i) => {
            const pct = Math.min(100, Math.round((val / MACRO_GOALS.protein) * 100));
            const hit = val >= MACRO_GOALS.protein;
            return (
              <View key={i} style={s.barCol}>
                <Text style={[s.barVal, { color: hit ? C.green : C.muted }]}>{val}g</Text>
                <View style={s.barBg}>
                  <View style={[s.barFill, { height: `${pct}%`, backgroundColor: hit ? C.green : C.accent }]} />
                  <View style={s.barGoalLine} />
                </View>
                <Text style={s.barDay}>{stats.dayLabels[i]}</Text>
              </View>
            );
          })}
        </View>
        <Text style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>Dashed line = {MACRO_GOALS.protein}g goal</Text>
      </View>

      {/* 28-day heatmap */}
      <View style={s.card}>
        <Text style={s.cardTitle}>28-DAY ACTIVITY</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={{ fontSize: 10, color: C.muted }}>4 weeks ago</Text>
          <Text style={{ fontSize: 10, color: C.muted }}>Today</Text>
        </View>
        <View style={s.heatmap}>
          {stats.last28.map((d, i) => {
            const g = stats.gSet.has(d), l = stats.lSet.has(d), w = stats.wSet.has(d);
            let bg = 'rgba(255,255,255,0.06)';
            if (g && l && w) bg = C.purple;
            else if (g) bg = C.accent;
            else if (l) bg = C.green;
            else if (w) bg = C.amber;
            return <View key={i} style={[s.hmCell, { backgroundColor: bg }]} />;
          })}
        </View>
        <View style={{ flexDirection: 'row', gap: 14, flexWrap: 'wrap', marginTop: 10 }}>
          {[['rgba(255,255,255,0.06)', 'None'], [C.accent, 'Gym'], [C.green, 'Learn'], [C.amber, 'Work'], [C.purple, 'All 3']].map(([c, label]) => (
            <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: c }} />
              <Text style={{ fontSize: 11, color: C.muted }}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function StreakItem({ label, val, icon, color }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', padding: 12, backgroundColor: C.bg3, borderRadius: 14, marginHorizontal: 4 }}>
      <Text style={{ fontSize: 28, fontWeight: '800', color }}>{val}</Text>
      <Text style={{ fontSize: 18 }}>{icon}</Text>
      <Text style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function WeekCell({ val, label, color }) {
  return (
    <View style={{ width: '48%', backgroundColor: C.bg3, borderRadius: 12, padding: 12, alignItems: 'center', marginBottom: 8 }}>
      <Text style={{ fontSize: 26, fontWeight: '800', color }}>{val}</Text>
      <Text style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  content: { padding: 16, paddingBottom: 32 },
  container: { flex: 1, backgroundColor: C.bg },
  card: { backgroundColor: C.card, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 0.5, borderColor: C.border },
  cardTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: C.muted, textTransform: 'uppercase', marginBottom: 14 },
  streakRow: { flexDirection: 'row', gap: 8 },
  weekGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
  barChart: { flexDirection: 'row', height: 140, alignItems: 'flex-end', gap: 4 },
  barCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  barVal: { fontSize: 9, marginBottom: 4, fontWeight: '600' },
  barBg: { width: '100%', flex: 1, backgroundColor: C.bg3, borderRadius: 6, overflow: 'hidden', position: 'relative', justifyContent: 'flex-end' },
  barFill: { width: '100%', borderRadius: 6 },
  barGoalLine: { position: 'absolute', left: 0, right: 0, top: '0%', height: 1.5, backgroundColor: C.coral, opacity: 0.6 },
  barDay: { fontSize: 10, color: C.muted, marginTop: 4 },
  heatmap: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  hmCell: { width: '11%', aspectRatio: 1, borderRadius: 4 },
});
