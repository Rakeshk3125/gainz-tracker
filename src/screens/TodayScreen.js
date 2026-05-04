import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { C, MACRO_GOALS } from '../utils/theme';
import { getData, todayStr, calcStreak } from '../utils/storage';

export default function TodayScreen({ navigation }) {
  const [metrics, setMetrics] = useState({ gym: 0, learn: 0, work: 0, protein: 0 });
  const [checks, setChecks] = useState({ gym: false, protein: false, learn: false, work: false });
  const [macros, setMacros] = useState({ p: 0, c: 0, f: 0, kcal: 0 });

  useFocusEffect(useCallback(() => { load(); }, []));

  async function load() {
    const t = todayStr();
    const [gym, food, learn, work] = await Promise.all([
      getData('gym'), getData('food'), getData('learn'), getData('work')
    ]);
    const todayFood = food.filter(f => f.date === t);
    const p = todayFood.reduce((a, f) => a + (f.p || 0), 0);
    const c = todayFood.reduce((a, f) => a + (f.c || 0), 0);
    const fat = todayFood.reduce((a, f) => a + (f.f || 0), 0);
    const kcal = todayFood.reduce((a, f) => a + (f.kcal || 0), 0);
    setMetrics({
      gym: calcStreak(gym), learn: calcStreak(learn), work: calcStreak(work), protein: Math.round(p)
    });
    setChecks({
      gym: gym.some(l => l.date === t),
      protein: p >= MACRO_GOALS.protein,
      learn: learn.some(l => l.date === t),
      work: work.some(l => l.date === t),
    });
    setMacros({ p: Math.round(p), c: Math.round(c), f: Math.round(fat), kcal: Math.round(kcal) });
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const goals = [
    { label: 'Workout logged', done: checks.gym, tab: 'Gym', icon: '🏋️' },
    { label: `Protein goal (${metrics.protein}/${MACRO_GOALS.protein}g)`, done: checks.protein, tab: 'Food', icon: '🥩' },
    { label: 'SFMC learning session', done: checks.learn, tab: 'Learn', icon: '📚' },
    { label: 'Work session logged', done: checks.work, tab: 'Work', icon: '💻' },
  ];

  const progress = (val, max) => Math.min(100, Math.round((val / max) * 100));

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>
      <Text style={s.date}>{today}</Text>

      <View style={s.grid}>
        <MetricCard label="Gym Streak" value={metrics.gym} unit="🔥" sub="days" color={C.accent} />
        <MetricCard label="Protein" value={metrics.protein} unit="g" sub={`goal ${MACRO_GOALS.protein}g`} color={C.green} />
        <MetricCard label="Learn Streak" value={metrics.learn} unit="📚" sub="days" color={C.purple} />
        <MetricCard label="Work Streak" value={metrics.work} unit="💻" sub="days" color={C.amber} />
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>TODAY'S GOALS</Text>
        {goals.map((g, i) => (
          <View key={i} style={[s.checkRow, i === goals.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={[s.circle, g.done && s.circleDone]}>
              <Text style={{ fontSize: 13, color: g.done ? '#fff' : 'transparent' }}>✓</Text>
            </View>
            <Text style={[s.checkLabel, g.done && s.checkDone]}>{g.icon} {g.label}</Text>
            {!g.done && (
              <TouchableOpacity onPress={() => navigation.navigate(g.tab)}>
                <Text style={s.goBtn}>LOG →</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>MACROS TODAY</Text>
        {macros.kcal === 0 ? (
          <Text style={s.empty}>No meals logged today 🍽</Text>
        ) : (
          <>
            <MacroBar label="Protein" val={macros.p} max={MACRO_GOALS.protein} color={C.accent} unit="g" />
            <MacroBar label="Carbs" val={macros.c} max={MACRO_GOALS.carbs} color={C.amber} unit="g" />
            <MacroBar label="Fat" val={macros.f} max={MACRO_GOALS.fat} color={C.coral} unit="g" />
            <MacroBar label="Calories" val={macros.kcal} max={MACRO_GOALS.calories} color={C.green} unit="kcal" />
          </>
        )}
      </View>
    </ScrollView>
  );
}

function MetricCard({ label, value, unit, sub, color }) {
  return (
    <View style={s.metricCard}>
      <Text style={s.metricLabel}>{label}</Text>
      <Text style={[s.metricVal, { color }]}>{value}<Text style={s.metricUnit}> {unit}</Text></Text>
      <Text style={s.metricSub}>{sub}</Text>
    </View>
  );
}

function MacroBar({ label, val, max, color, unit }) {
  const pct = Math.min(100, Math.round((val / max) * 100));
  return (
    <View style={s.macroRow}>
      <Text style={s.macroLabel}>{label}</Text>
      <View style={s.macroBarBg}>
        <View style={[s.macroBarFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={s.macroNum}>{val}{unit === 'kcal' ? '' : 'g'}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  content: { padding: 16, paddingBottom: 32 },
  date: { fontSize: 13, color: C.muted, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  metricCard: { width: '48%', backgroundColor: C.bg3, borderRadius: 16, padding: 14, flexGrow: 1 },
  metricLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, color: C.muted, textTransform: 'uppercase', marginBottom: 6 },
  metricVal: { fontSize: 34, fontWeight: '800', lineHeight: 38 },
  metricUnit: { fontSize: 16, fontWeight: '400' },
  metricSub: { fontSize: 11, color: C.muted, marginTop: 2 },
  card: { backgroundColor: C.card, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 0.5, borderColor: C.border },
  cardTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: C.muted, textTransform: 'uppercase', marginBottom: 14 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 0.5, borderBottomColor: C.border },
  circle: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  circleDone: { backgroundColor: C.green, borderColor: C.green },
  checkLabel: { flex: 1, fontSize: 14, color: C.text },
  checkDone: { textDecorationLine: 'line-through', color: C.muted },
  goBtn: { fontSize: 11, fontWeight: '700', color: C.accent },
  empty: { textAlign: 'center', color: C.muted, fontSize: 13, paddingVertical: 16 },
  macroRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  macroLabel: { fontSize: 12, color: C.muted, width: 62 },
  macroBarBg: { flex: 1, backgroundColor: C.bg3, borderRadius: 99, height: 10, overflow: 'hidden' },
  macroBarFill: { height: 10, borderRadius: 99 },
  macroNum: { fontSize: 13, fontWeight: '600', color: C.text, width: 46, textAlign: 'right' },
});
