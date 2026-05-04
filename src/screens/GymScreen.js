import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, ActivityIndicator, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { C, GYM_SPLIT, DAY_SPLIT } from '../utils/theme';
import { getData, saveData, todayStr, fmtDate } from '../utils/storage';

const DAYS_LABEL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TYPE_COLOR = { push: C.accent, pull: C.green, legs: C.amber, strength: C.coral, cardio: C.muted, rest: C.purple };

function normKey(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
}

function buildOverloadMap(logs) {
  const map = {};
  [...logs].reverse().forEach(session => {
    if (!session.exercises) return;
    session.exercises.forEach(ex => {
      const key = normKey(ex.name);
      if (!map[key]) map[key] = { name: ex.name, history: [] };
      map[key].history.push({
        date: session.date,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        unit: ex.unit || 'kg',
        volume: ex.sets * ex.reps * ex.weight,
      });
    });
  });
  return map;
}

function getNextTarget(history) {
  if (!history || history.length === 0) return null;
  const last = history[history.length - 1];
  const prev = history.length >= 2 ? history[history.length - 2] : null;
  const next = { ...last };

  if (last.reps >= 10) {
    next.weight = parseFloat((last.weight + 2.5).toFixed(1));
    next.reps = Math.max(6, last.reps - 2);
    next.note = `↑ Add 2.5kg (hit ${last.reps} reps last time)`;
  } else if (prev && last.volume < prev.volume * 0.95) {
    next.note = `= Same weight — volume dipped, focus on reps first`;
  } else if (last.reps <= 5 && last.sets >= 4) {
    next.weight = parseFloat((last.weight + 2.5).toFixed(1));
    next.note = `↑ Add 2.5kg (strength range nailed)`;
  } else {
    next.reps = last.reps + 1;
    next.note = `→ Same weight, aim for ${last.reps + 1} reps`;
  }
  return next;
}

export default function GymScreen() {
  const [tab, setTab] = useState('log');
  const [workoutText, setWorkoutText] = useState('');
  const [workoutType, setWorkoutType] = useState(DAY_SPLIT[new Date().getDay()]);
  const [loading, setLoading] = useState(false);
  const [lastParsed, setLastParsed] = useState(null);
  const [nextTargets, setNextTargets] = useState([]);
  const [logs, setLogs] = useState([]);
  const [overloadMap, setOverloadMap] = useState({});

  useFocusEffect(useCallback(() => { loadAll(); }, []));

  async function loadAll() {
    const all = await getData('gym');
    setLogs(all);
    setOverloadMap(buildOverloadMap(all));
  }

  async function analyzeAndLog() {
    if (!workoutText.trim()) { Alert.alert('Describe your workout!'); return; }
    setLoading(true);
    setLastParsed(null);
    setNextTargets([]);

    const prompt = `You are a strength training expert. Parse this workout log and extract each exercise.

Workout: "${workoutText}"
Day type: ${workoutType}

Return ONLY valid JSON, no markdown, no extra text:
{
  "workout_type": "${workoutType}",
  "duration_min": 60,
  "total_volume_kg": 0,
  "summary": "one line workout summary",
  "overall_intensity": "Beast or Strong or Solid or Average or Light",
  "session_notes": "key observations about the session",
  "exercises": [
    {
      "name": "Full Exercise Name",
      "sets": 4,
      "reps": 8,
      "weight": 80,
      "unit": "kg",
      "notes": "any PR or form note"
    }
  ]
}

Rules:
- Normalize names: "bench" → "Barbell Bench Press", "ohp" → "Overhead Press", "rdl" → "Romanian Deadlift"
- If lbs mentioned, convert to kg (divide by 2.205), set unit to "kg"
- total_volume_kg = sum of sets*reps*weight across all exercises
- If sets/reps/weight unclear from text, make a reasonable inference`;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1200,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await res.json();
      const raw = data.content.map(c => c.text || '').join('');
      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());

      const entry = {
        date: todayStr(),
        type: workoutType,
        raw: workoutText,
        summary: parsed.summary,
        duration: parsed.duration_min,
        totalVolume: parsed.total_volume_kg,
        intensity: parsed.overall_intensity,
        exercises: parsed.exercises,
        sessionNotes: parsed.session_notes,
      };

      const all = await getData('gym');
      all.unshift(entry);
      await saveData('gym', all);

      const newMap = buildOverloadMap(all);
      setOverloadMap(newMap);
      setLogs(all);
      setLastParsed(parsed);
      setWorkoutText('');

      // Compute next targets for today's exercises
      const targets = parsed.exercises.map(ex => {
        const key = normKey(ex.name);
        const h = newMap[key]?.history || [];
        return { name: ex.name, target: getNextTarget(h) };
      }).filter(x => x.target);
      setNextTargets(targets);

    } catch (e) {
      Alert.alert('Parse failed', 'Check your connection and try again.');
      console.error(e);
    }
    setLoading(false);
  }

  const intensityColor = { Beast: C.coral, Strong: C.accent, Solid: C.green, Average: C.amber, Light: C.muted };

  return (
    <View style={s.container}>
      <View style={s.tabs}>
        {[['log','📝 Log'], ['history','📋 History'], ['overload','📈 Progress'], ['plan','🗓 Plan']].map(([t, label]) => (
          <TouchableOpacity key={t} style={[s.tab, tab === t && s.tabActive]} onPress={() => setTab(t)}>
            <Text style={[s.tabText, tab === t && s.tabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">

        {/* ── LOG ── */}
        {tab === 'log' && <>
          <View style={s.card}>
            <Text style={s.cardTitle}>LOG TODAY'S WORKOUT</Text>
            <Text style={s.hint}>Just type what you did — exercises, sets, reps, weights in any format. AI parses it and tracks your progressive overload automatically.</Text>

            <Text style={s.fieldLabel}>Workout Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {Object.keys(GYM_SPLIT).map(t => (
                  <TouchableOpacity key={t}
                    style={[s.typeChip, workoutType === t && { backgroundColor: (TYPE_COLOR[t] || C.accent) + '33', borderColor: TYPE_COLOR[t] || C.accent }]}
                    onPress={() => setWorkoutType(t)}>
                    <Text style={[s.typeChipText, workoutType === t && { color: TYPE_COLOR[t] || C.accent }]}>
                      {GYM_SPLIT[t].label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <Text style={s.fieldLabel}>What did you do?</Text>
            <TextInput
              style={[s.input, { minHeight: 150, textAlignVertical: 'top' }]}
              value={workoutText}
              onChangeText={setWorkoutText}
              placeholder={"e.g. Bench 4x8 at 80kg felt strong, hit 9 reps on last set. Incline DB press 3x10 with 28kg each. Cable lateral raise 3x15 at 12kg. Tricep pushdown rope 3x12 at 35kg. OHP 3x8 at 55kg — new PR!"}
              placeholderTextColor={C.muted}
              multiline
            />

            <TouchableOpacity
              style={[s.logBtn, loading && { opacity: 0.6 }]}
              onPress={analyzeAndLog}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.logBtnText}>🤖  ANALYZE & SAVE</Text>}
            </TouchableOpacity>
            {loading && <Text style={{ color: C.muted, fontSize: 12, textAlign: 'center', marginTop: 10 }}>Parsing workout & computing overload targets...</Text>}
          </View>

          {lastParsed && <>
            <View style={s.card}>
              <Text style={[s.cardTitle, { color: C.green }]}>✓ SAVED — {lastParsed.summary}</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                <Chip label={`⏱ ${lastParsed.duration_min} min`} color={C.accent} />
                <Chip label={`📦 ${Math.round(lastParsed.total_volume_kg)}kg volume`} color={C.green} />
                <Chip label={lastParsed.overall_intensity} color={intensityColor[lastParsed.overall_intensity] || C.muted} />
              </View>

              {lastParsed.exercises.map((ex, i) => (
                <View key={i} style={[s.exRow, i === lastParsed.exercises.length - 1 && { borderBottomWidth: 0 }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.exName}>{ex.name}</Text>
                    {ex.notes ? <Text style={s.exTip}>{ex.notes}</Text> : null}
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={s.exSets}>{ex.sets}×{ex.reps}</Text>
                    <Text style={[s.exWeight, { color: C.accent }]}>{ex.weight}{ex.unit || 'kg'}</Text>
                    <Text style={s.exVol}>{Math.round(ex.sets * ex.reps * ex.weight)}kg vol</Text>
                  </View>
                </View>
              ))}
              {lastParsed.session_notes ? <View style={s.noteBox}><Text style={s.noteText}>💬 {lastParsed.session_notes}</Text></View> : null}
            </View>

            {nextTargets.length > 0 && (
              <View style={s.card}>
                <Text style={s.cardTitle}>🎯 NEXT SESSION TARGETS</Text>
                <Text style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>Personalised progressive overload targets based on your history</Text>
                {nextTargets.map((item, i) => (
                  <View key={i} style={[s.targetRow, i === nextTargets.length - 1 && { borderBottomWidth: 0 }]}>
                    <Text style={s.targetName}>{item.name}</Text>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[s.targetWeight, { color: item.target.note?.startsWith('↑') ? C.green : item.target.note?.startsWith('=') ? C.amber : C.accent }]}>
                        {item.target.weight}{item.target.unit || 'kg'} × {item.target.reps} reps
                      </Text>
                      <Text style={s.targetNote}>{item.target.note}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>}
        </>}

        {/* ── HISTORY ── */}
        {tab === 'history' && (
          <View style={s.card}>
            <Text style={s.cardTitle}>WORKOUT HISTORY</Text>
            {logs.length === 0
              ? <Text style={s.empty}>No workouts logged yet. Let's go! 🏋️</Text>
              : logs.slice(0, 25).map((l, i) => (
                <View key={i} style={[s.histEntry, i === Math.min(logs.length, 25) - 1 && { borderBottomWidth: 0 }]}>
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                    <Chip label={GYM_SPLIT[l.type]?.label || l.type?.toUpperCase()} color={TYPE_COLOR[l.type] || C.accent} />
                    <Text style={s.logDate}>{fmtDate(l.date)}{l.duration ? ` · ${l.duration}min` : ''}</Text>
                    {l.totalVolume ? <Text style={[s.logDate, { color: C.green }]}>📦{Math.round(l.totalVolume)}kg</Text> : null}
                    {l.intensity ? <Text style={[s.logDate, { color: intensityColor[l.intensity] || C.muted }]}>{l.intensity}</Text> : null}
                  </View>
                  {l.summary ? <Text style={s.histSummary}>{l.summary}</Text> : null}
                  {l.exercises?.map((ex, j) => (
                    <View key={j} style={s.histExRow}>
                      <Text style={s.histExName}>{ex.name}</Text>
                      <Text style={s.histExDetail}>{ex.sets}×{ex.reps} @ {ex.weight}{ex.unit || 'kg'}</Text>
                      <Text style={[s.histExDetail, { color: C.green }]}>{Math.round(ex.sets * ex.reps * ex.weight)}kg</Text>
                    </View>
                  ))}
                  {!l.exercises && l.notes ? <Text style={s.logDetail}>{l.notes}</Text> : null}
                </View>
              ))
            }
          </View>
        )}

        {/* ── PROGRESSIVE OVERLOAD ── */}
        {tab === 'overload' && (
          Object.keys(overloadMap).length === 0
            ? <View style={s.card}><Text style={s.cardTitle}>PROGRESSIVE OVERLOAD</Text><Text style={s.empty}>Log workouts with weights to track progress per exercise here.</Text></View>
            : Object.entries(overloadMap).map(([key, data]) => {
              const h = data.history;
              const last = h[h.length - 1];
              const first = h[0];
              const weightGain = parseFloat((last.weight - first.weight).toFixed(1));
              const volTrend = h.map(e => e.volume);
              const maxVol = Math.max(...volTrend, 1);
              const next = getNextTarget(h);

              return (
                <View key={key} style={s.card}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={s.exCardName}>{data.name}</Text>
                    <View style={{ alignItems: 'flex-end' }}>
                      {weightGain > 0 && <Text style={{ fontSize: 12, fontWeight: '700', color: C.green }}>+{weightGain}kg gained</Text>}
                      <Text style={{ fontSize: 10, color: C.muted }}>{h.length} session{h.length !== 1 ? 's' : ''}</Text>
                    </View>
                  </View>

                  {/* Volume sparkline */}
                  <View style={s.miniChart}>
                    {volTrend.slice(-10).map((vol, i, arr) => {
                      const pct = (vol / maxVol) * 100;
                      const isLast = i === arr.length - 1;
                      return (
                        <View key={i} style={{ flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                          <View style={{ height: `${Math.max(6, pct)}%`, backgroundColor: isLast ? C.accent : C.accent + '44', borderRadius: 3 }} />
                        </View>
                      );
                    })}
                  </View>
                  <Text style={{ fontSize: 10, color: C.muted, marginBottom: 10 }}>Volume trend (last {Math.min(h.length, 10)} sessions)</Text>

                  {/* Last session */}
                  <View style={s.lastRow}>
                    <Text style={s.lastLabel}>LAST SESSION — {fmtDate(last.date)}</Text>
                    <Text style={s.lastVal}>{last.sets} sets × {last.reps} reps @ {last.weight}{last.unit} = {Math.round(last.volume)}kg total volume</Text>
                  </View>

                  {/* Next target */}
                  {next && (
                    <View style={[s.nextRow, { borderColor: next.note?.startsWith('↑') ? C.green + '44' : C.accent + '44', backgroundColor: next.note?.startsWith('↑') ? C.green + '11' : C.accent + '11' }]}>
                      <Text style={[s.nextLabel, { color: next.note?.startsWith('↑') ? C.green : C.accent }]}>🎯 NEXT TARGET</Text>
                      <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text style={[s.nextVal, { color: next.note?.startsWith('↑') ? C.green : C.accent }]}>
                          {next.sets}×{next.reps} @ {next.weight}{next.unit}
                        </Text>
                        <Text style={s.nextNote}>{next.note}</Text>
                      </View>
                    </View>
                  )}

                  {/* Full session history table */}
                  {h.length > 1 && (
                    <View style={{ marginTop: 12 }}>
                      <Text style={[s.fieldLabel, { marginBottom: 6 }]}>ALL SESSIONS</Text>
                      <View style={{ flexDirection: 'row', paddingBottom: 4, borderBottomWidth: 0.5, borderBottomColor: C.border, marginBottom: 2 }}>
                        <Text style={{ flex: 1, fontSize: 10, color: C.muted }}>Date</Text>
                        <Text style={{ width: 90, fontSize: 10, color: C.muted }}>Sets×Reps</Text>
                        <Text style={{ width: 54, fontSize: 10, color: C.muted }}>Weight</Text>
                        <Text style={{ width: 54, fontSize: 10, color: C.muted, textAlign: 'right' }}>Volume</Text>
                      </View>
                      {h.slice().reverse().slice(0, 8).map((entry, i, arr) => {
                        const prevEntry = i < arr.length - 1 ? arr[i + 1] : null;
                        const volUp = prevEntry ? entry.volume > prevEntry.volume : false;
                        return (
                          <View key={i} style={{ flexDirection: 'row', paddingVertical: 5, borderBottomWidth: i < Math.min(h.length, 8) - 1 ? 0.5 : 0, borderBottomColor: C.border }}>
                            <Text style={{ flex: 1, fontSize: 11, color: C.muted }}>{fmtDate(entry.date)}</Text>
                            <Text style={{ width: 90, fontSize: 11, color: C.text }}>{entry.sets}×{entry.reps}</Text>
                            <Text style={{ width: 54, fontSize: 11, color: C.text }}>{entry.weight}{entry.unit}</Text>
                            <Text style={{ width: 54, fontSize: 11, color: volUp ? C.green : C.text, textAlign: 'right' }}>{Math.round(entry.volume)}kg {volUp ? '↑' : ''}</Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })
        )}

        {/* ── PLAN ── */}
        {tab === 'plan' && <>
          <View style={s.card}>
            <Text style={s.cardTitle}>TODAY'S PLAN</Text>
            {(() => {
              const type = DAY_SPLIT[new Date().getDay()];
              const plan = GYM_SPLIT[type];
              return <>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Chip label={plan.label} color={TYPE_COLOR[type] || C.accent} large />
                  <Text style={{ fontSize: 13, color: C.muted, flex: 1 }}>{plan.focus}</Text>
                </View>
                {plan.warmup ? <View style={[s.noteBox, { backgroundColor: C.accent + '11', marginBottom: 12 }]}><Text style={{ fontSize: 12, color: C.accent }}>🔥 Warm-up: {plan.warmup}</Text></View> : null}
                {plan.exercises.map((ex, i) => {
                  const key = normKey(ex.name);
                  const h = overloadMap[key]?.history || [];
                  const next = getNextTarget(h);
                  return (
                    <View key={i} style={[s.exRow, i === plan.exercises.length - 1 && { borderBottomWidth: 0 }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={s.exName}>{ex.name}</Text>
                        <Text style={s.exTip}>{ex.tip}</Text>
                        {next
                          ? <Text style={{ fontSize: 11, color: C.green, marginTop: 3 }}>🎯 {next.weight}kg × {next.reps} reps ({next.note})</Text>
                          : <Text style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>Target: {ex.sets}×{ex.reps} · rest {ex.rest}</Text>
                        }
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={s.exSets}>{ex.sets}×{ex.reps}</Text>
                        <Text style={s.exRest}>rest {ex.rest}</Text>
                      </View>
                    </View>
                  );
                })}
                <View style={s.noteBox}><Text style={s.noteText}>💡 Green targets are personalised from your history. Add 2.5kg when you hit top of rep range on all sets.</Text></View>
              </>;
            })()}
          </View>

          <View style={s.card}>
            <Text style={s.cardTitle}>WEEKLY SPLIT</Text>
            {DAYS_LABEL.map((day, i) => {
              const type = DAY_SPLIT[i];
              const plan = GYM_SPLIT[type];
              const isToday = new Date().getDay() === i;
              return (
                <View key={i} style={[s.splitRow, i === 6 && { borderBottomWidth: 0 }, isToday && { backgroundColor: C.accent + '11', borderRadius: 10, paddingHorizontal: 8 }]}>
                  <Text style={[s.splitDay, isToday && { color: C.accent, fontWeight: '800' }]}>{day}{isToday ? '←' : ''}</Text>
                  <Chip label={plan.label} color={TYPE_COLOR[type] || C.muted} />
                  <Text style={s.splitFocus}>{plan.focus}</Text>
                </View>
              );
            })}
          </View>
        </>}

      </ScrollView>
    </View>
  );
}

function Chip({ label, color, large }) {
  return (
    <View style={{ borderRadius: 20, paddingHorizontal: large ? 14 : 10, paddingVertical: large ? 6 : 4, backgroundColor: color + '22' }}>
      <Text style={{ fontSize: large ? 12 : 10, fontWeight: '700', color, letterSpacing: 0.5 }}>{label}</Text>
    </View>
  );
}

const intensityColor = { Beast: C.coral, Strong: C.accent, Solid: C.green, Average: C.amber, Light: C.muted };

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  tabs: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: C.border, backgroundColor: C.bg },
  tab: { flex: 1, paddingVertical: 11, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: C.accent },
  tabText: { fontSize: 11, fontWeight: '600', color: C.muted },
  tabTextActive: { color: C.accent },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: C.card, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 0.5, borderColor: C.border },
  cardTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: C.muted, textTransform: 'uppercase', marginBottom: 12 },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: C.muted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  hint: { fontSize: 13, color: C.muted, lineHeight: 19, marginBottom: 14 },
  input: { backgroundColor: C.bg3, borderRadius: 12, borderWidth: 0.5, borderColor: C.border, color: C.text, fontSize: 15, padding: 14, marginBottom: 14, lineHeight: 22 },
  typeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: C.bg3 },
  typeChipText: { fontSize: 11, fontWeight: '700', color: C.muted },
  logBtn: { backgroundColor: C.accent, borderRadius: 16, padding: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  logBtnText: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 1 },
  exRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: C.border, gap: 10 },
  exName: { fontSize: 14, fontWeight: '600', color: C.text, marginBottom: 2 },
  exTip: { fontSize: 11, color: C.purple },
  exSets: { fontSize: 13, fontWeight: '700', color: C.text },
  exWeight: { fontSize: 13, fontWeight: '700', marginTop: 2 },
  exVol: { fontSize: 10, color: C.muted, marginTop: 2 },
  exRest: { fontSize: 10, color: C.muted, marginTop: 2 },
  noteBox: { backgroundColor: C.bg2, borderRadius: 10, padding: 10, marginTop: 10 },
  noteText: { fontSize: 12, color: C.muted, lineHeight: 18 },
  targetRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: C.border, gap: 8 },
  targetName: { fontSize: 13, fontWeight: '600', color: C.text, flex: 1 },
  targetWeight: { fontSize: 14, fontWeight: '700' },
  targetNote: { fontSize: 11, color: C.muted, marginTop: 2, textAlign: 'right' },
  histEntry: { paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: C.border },
  histSummary: { fontSize: 13, color: C.text, fontStyle: 'italic', marginBottom: 8 },
  histExRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3, gap: 8 },
  histExName: { fontSize: 12, color: C.muted, flex: 1 },
  histExDetail: { fontSize: 12, color: C.text, fontWeight: '500' },
  logDate: { fontSize: 11, color: C.muted },
  logDetail: { fontSize: 12, color: C.muted, marginTop: 4, fontStyle: 'italic' },
  exCardName: { fontSize: 15, fontWeight: '700', color: C.text, flex: 1, marginRight: 8 },
  miniChart: { flexDirection: 'row', height: 48, gap: 4, alignItems: 'flex-end', backgroundColor: C.bg2, borderRadius: 8, padding: 6, marginBottom: 4 },
  lastRow: { backgroundColor: C.bg3, borderRadius: 10, padding: 10, marginBottom: 8 },
  lastLabel: { fontSize: 10, fontWeight: '700', color: C.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  lastVal: { fontSize: 13, color: C.text },
  nextRow: { borderRadius: 10, padding: 12, flexDirection: 'row', alignItems: 'flex-start', borderWidth: 0.5 },
  nextLabel: { fontSize: 11, fontWeight: '700', width: 90, lineHeight: 20 },
  nextVal: { fontSize: 15, fontWeight: '800' },
  nextNote: { fontSize: 11, color: C.muted, marginTop: 2, textAlign: 'right' },
  splitRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: C.border },
  splitDay: { fontSize: 12, fontWeight: '700', color: C.muted, width: 44 },
  splitFocus: { fontSize: 12, color: C.muted, flex: 1 },
  empty: { textAlign: 'center', color: C.muted, fontSize: 13, paddingVertical: 24 },
});
