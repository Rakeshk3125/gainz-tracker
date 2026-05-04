import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { C, MACRO_GOALS } from '../utils/theme';
import { getData, saveData, todayStr, fmtDate } from '../utils/storage';

const MEALS = ['🌅 Breakfast', '☀️ Lunch', '🌙 Dinner', '⚡ Pre-workout', '💪 Post-workout', '🍎 Snack'];
const MEAL_COLORS = { '🌅 Breakfast': C.amber, '☀️ Lunch': C.green, '🌙 Dinner': C.accent, '⚡ Pre-workout': C.coral, '💪 Post-workout': C.purple, '🍎 Snack': C.amber };

export default function FoodScreen() {
  const [meal, setMeal] = useState('🌅 Breakfast');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [logs, setLogs] = useState([]);
  const [dayTotals, setDayTotals] = useState({ p: 0, c: 0, f: 0, fibre: 0, sugar: 0, kcal: 0 });

  useFocusEffect(useCallback(() => { loadLogs(); }, []));

  async function loadLogs() {
    const all = await getData('food');
    setLogs(all);
    const today = all.filter(f => f.date === todayStr());
    setDayTotals({
      p: Math.round(today.reduce((a, f) => a + (f.p || 0), 0)),
      c: Math.round(today.reduce((a, f) => a + (f.c || 0), 0)),
      f: Math.round(today.reduce((a, f) => a + (f.f || 0), 0)),
      fibre: Math.round(today.reduce((a, f) => a + (f.fibre || 0), 0)),
      sugar: Math.round(today.reduce((a, f) => a + (f.sugar || 0), 0)),
      kcal: Math.round(today.reduce((a, f) => a + (f.kcal || 0), 0)),
    });
  }

  async function analyzeAndLog() {
    if (!desc.trim()) { Alert.alert('Describe what you ate'); return; }
    setLoading(true);
    setLastResult(null);
    try {
      const prompt = `You are a precise nutrition expert. The user ate: "${desc}"

Break this down into individual food items and calculate exact nutrition.

Respond ONLY with valid JSON, no markdown, no extra text:
{
  "meal_name": "brief meal name",
  "items": [
    {"name": "food item", "amount": "quantity with unit", "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0, "fibre_g": 0, "sugar_g": 0}
  ],
  "totals": {"calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0, "fibre_g": 0, "sugar_g": 0},
  "muscle_gain_note": "one sentence about how this meal supports or doesn't support muscle gain"
}`;

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await res.json();
      const text = data.content.map(c => c.text || '').join('');
      const clean = text.replace(/```json|```/g, '').trim();
      const nutrition = JSON.parse(clean);

      const all = await getData('food');
      const entry = {
        date: todayStr(), meal, desc,
        meal_name: nutrition.meal_name,
        items: nutrition.items,
        p: nutrition.totals.protein_g,
        c: nutrition.totals.carbs_g,
        f: nutrition.totals.fat_g,
        fibre: nutrition.totals.fibre_g,
        sugar: nutrition.totals.sugar_g,
        kcal: nutrition.totals.calories,
        note: nutrition.muscle_gain_note,
      };
      all.unshift(entry);
      await saveData('food', all);
      setLastResult(nutrition);
      setDesc('');
      loadLogs();
    } catch (e) {
      Alert.alert('Analysis failed', 'Check your connection and try again.');
      console.error(e);
    }
    setLoading(false);
  }

  const pct = (v, max) => Math.min(100, Math.round((v / max) * 100));

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>

      {/* AI Log Card */}
      <View style={s.card}>
        <Text style={s.cardTitle}>AI MEAL ANALYSIS</Text>
        <Text style={s.fieldLabel}>Meal Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {MEALS.map(m => (
              <TouchableOpacity key={m} style={[s.mealBtn, meal === m && { backgroundColor: (MEAL_COLORS[m] || C.accent) + '33', borderColor: MEAL_COLORS[m] || C.accent }]} onPress={() => setMeal(m)}>
                <Text style={[s.mealBtnText, meal === m && { color: MEAL_COLORS[m] || C.accent }]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Text style={s.fieldLabel}>Describe what you ate</Text>
        <TextInput
          style={[s.input, { height: 110, textAlignVertical: 'top' }]}
          value={desc}
          onChangeText={setDesc}
          placeholder={"e.g. I had 2 boiled eggs, a bowl of oatmeal with milk and honey, a banana, and black coffee"}
          placeholderTextColor={C.muted}
          multiline
        />

        <TouchableOpacity style={[s.logBtn, { backgroundColor: C.green }, loading && { opacity: 0.6 }]} onPress={analyzeAndLog} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.logBtnText}>🤖  ANALYZE & LOG MEAL</Text>}
        </TouchableOpacity>

        {loading && <Text style={{ color: C.muted, fontSize: 12, textAlign: 'center', marginTop: 10 }}>AI is breaking down your meal...</Text>}

        {lastResult && (
          <View style={s.resultBox}>
            <Text style={[s.resultTitle, { color: C.green }]}>✓ {lastResult.meal_name}</Text>
            <View style={s.nutritionGrid}>
              <NutCell val={Math.round(lastResult.totals.calories)} label="kcal" color={C.accent} />
              <NutCell val={Math.round(lastResult.totals.protein_g)} label="protein g" color={C.green} />
              <NutCell val={Math.round(lastResult.totals.carbs_g)} label="carbs g" color={C.amber} />
              <NutCell val={Math.round(lastResult.totals.fat_g)} label="fat g" color={C.coral} />
              <NutCell val={Math.round(lastResult.totals.fibre_g)} label="fibre g" color={C.green} />
              <NutCell val={Math.round(lastResult.totals.sugar_g)} label="sugar g" color={C.muted} />
            </View>
            <View style={{ borderTopWidth: 0.5, borderTopColor: C.border, paddingTop: 10 }}>
              {lastResult.items.map((it, i) => (
                <View key={i} style={s.itemRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.itemName}>{it.name}</Text>
                    <Text style={s.itemAmount}>{it.amount}</Text>
                  </View>
                  <Text style={s.itemMacros}>P:{Math.round(it.protein_g)}g C:{Math.round(it.carbs_g)}g F:{Math.round(it.fat_g)}g{'\n'}{Math.round(it.calories)}kcal</Text>
                </View>
              ))}
            </View>
            {lastResult.muscle_gain_note && (
              <View style={s.noteBox}>
                <Text style={s.noteText}>💪 {lastResult.muscle_gain_note}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Day Totals */}
      <View style={s.card}>
        <Text style={s.cardTitle}>FULL DAY NUTRITION</Text>
        {dayTotals.kcal === 0 ? <Text style={s.empty}>No meals logged today</Text> : (
          <>
            <View style={s.nutritionGrid}>
              <NutCell val={dayTotals.kcal} label="kcal total" color={C.accent} />
              <NutCell val={dayTotals.p} label="protein g" color={C.green} />
              <NutCell val={dayTotals.c} label="carbs g" color={C.amber} />
              <NutCell val={dayTotals.f} label="fat g" color={C.coral} />
              <NutCell val={dayTotals.fibre} label="fibre g" color={C.green} />
              <NutCell val={dayTotals.sugar} label="sugar g" color={C.muted} />
            </View>
            <MacroBar label="Protein" val={dayTotals.p} max={MACRO_GOALS.protein} color={C.accent} />
            <MacroBar label="Carbs" val={dayTotals.c} max={MACRO_GOALS.carbs} color={C.amber} />
            <MacroBar label="Fat" val={dayTotals.f} max={MACRO_GOALS.fat} color={C.coral} />
            <MacroBar label="Calories" val={dayTotals.kcal} max={MACRO_GOALS.calories} color={C.green} />
            <Text style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>
              Goals: {MACRO_GOALS.protein}g protein · {MACRO_GOALS.carbs}g carbs · {MACRO_GOALS.fat}g fat · {MACRO_GOALS.calories}kcal
            </Text>
          </>
        )}
      </View>

      {/* Meal Log */}
      <View style={s.card}>
        <Text style={s.cardTitle}>MEAL LOG</Text>
        {logs.length === 0 ? <Text style={s.empty}>No meals logged yet</Text> :
          logs.slice(0, 15).map((f, i) => (
            <View key={i} style={[s.logEntry, i === Math.min(logs.length, 15) - 1 && { borderBottomWidth: 0 }]}>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                <View style={[s.mealBadge, { backgroundColor: (MEAL_COLORS[f.meal] || C.accent) + '22' }]}>
                  <Text style={[s.mealBadgeText, { color: MEAL_COLORS[f.meal] || C.accent }]}>{f.meal}</Text>
                </View>
                <Text style={s.logDate}>{fmtDate(f.date)}</Text>
              </View>
              <Text style={s.logTitle}>{f.meal_name || f.desc}</Text>
              <Text style={s.logDetail}>P:{Math.round(f.p || 0)}g · C:{Math.round(f.c || 0)}g · F:{Math.round(f.f || 0)}g · Fibre:{Math.round(f.fibre || 0)}g · {Math.round(f.kcal || 0)}kcal</Text>
            </View>
          ))}
      </View>
    </ScrollView>
  );
}

function NutCell({ val, label, color }) {
  return (
    <View style={ns.cell}>
      <Text style={[ns.val, { color }]}>{val}</Text>
      <Text style={ns.label}>{label}</Text>
    </View>
  );
}
const ns = StyleSheet.create({
  cell: { width: '30%', backgroundColor: '#1c1c2a', borderRadius: 12, padding: 10, alignItems: 'center', margin: '1.5%' },
  val: { fontSize: 22, fontWeight: '800', lineHeight: 26 },
  label: { fontSize: 10, color: '#7a7a9a', marginTop: 2, textAlign: 'center' },
});

function MacroBar({ label, val, max, color }) {
  const pct = Math.min(100, Math.round((val / max) * 100));
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <Text style={{ fontSize: 12, color: C.muted, width: 64 }}>{label}</Text>
      <View style={{ flex: 1, backgroundColor: C.bg3, borderRadius: 99, height: 10, overflow: 'hidden' }}>
        <View style={{ height: 10, width: `${pct}%`, backgroundColor: color, borderRadius: 99 }} />
      </View>
      <Text style={{ fontSize: 13, fontWeight: '600', color: C.text, width: 36, textAlign: 'right' }}>{pct}%</Text>
    </View>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  content: { padding: 16, paddingBottom: 32 },
  card: { backgroundColor: C.card, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 0.5, borderColor: C.border },
  cardTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: C.muted, textTransform: 'uppercase', marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: C.muted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  input: { backgroundColor: C.bg3, borderRadius: 12, borderWidth: 0.5, borderColor: C.border, color: C.text, fontSize: 15, padding: 14, marginBottom: 14 },
  mealBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: C.bg3 },
  mealBtnText: { fontSize: 11, fontWeight: '600', color: C.muted },
  logBtn: { borderRadius: 16, padding: 18, alignItems: 'center', marginTop: 4, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  logBtnText: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 1 },
  resultBox: { marginTop: 16, backgroundColor: C.bg3, borderRadius: 14, padding: 14 },
  resultTitle: { fontSize: 14, fontWeight: '700', marginBottom: 12 },
  nutritionGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10, marginHorizontal: -4 },
  itemRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: C.border, gap: 8 },
  itemName: { fontSize: 13, fontWeight: '600', color: C.text },
  itemAmount: { fontSize: 11, color: C.muted },
  itemMacros: { fontSize: 11, color: C.muted, textAlign: 'right' },
  noteBox: { marginTop: 10, backgroundColor: C.purple + '11', borderRadius: 8, padding: 10 },
  noteText: { fontSize: 12, color: C.purple },
  empty: { textAlign: 'center', color: C.muted, fontSize: 13, paddingVertical: 20 },
  logEntry: { paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: C.border },
  mealBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  mealBadgeText: { fontSize: 10, fontWeight: '700' },
  logDate: { fontSize: 11, color: C.muted },
  logTitle: { fontSize: 14, fontWeight: '500', color: C.text, marginBottom: 2 },
  logDetail: { fontSize: 11, color: C.muted },
});
