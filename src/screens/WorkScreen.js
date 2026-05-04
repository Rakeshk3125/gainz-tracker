import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { C } from '../utils/theme';
import { getData, saveData, todayStr, fmtDate } from '../utils/storage';

const FOCUS = { 5: '🎯 Laser focused', 4: '💪 Good focus', 3: '👍 Moderate', 2: '😐 Distracted', 1: '😴 Low energy' };

export default function WorkScreen() {
  const [task, setTask] = useState('');
  const [hours, setHours] = useState('');
  const [focus, setFocus] = useState(3);
  const [notes, setNotes] = useState('');
  const [logs, setLogs] = useState([]);

  useFocusEffect(useCallback(() => { loadLogs(); }, []));
  async function loadLogs() { setLogs(await getData('work')); }

  async function logWork() {
    if (!task.trim()) { Alert.alert('Add a task description'); return; }
    const all = await getData('work');
    all.unshift({ date: todayStr(), task, hrs: parseFloat(hours) || 0, focus, notes });
    await saveData('work', all);
    setTask(''); setHours(''); setNotes('');
    loadLogs();
    Alert.alert('💻 Logged!', 'Work session saved.');
  }

  const weekHrs = logs.filter(l => {
    const d = new Date(); d.setDate(d.getDate() - 7);
    return new Date(l.date + 'T00:00:00') >= d;
  }).reduce((a, l) => a + (l.hrs || 0), 0);

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>
      <View style={s.statsRow}>
        <View style={s.statCard}><Text style={s.statVal}>{weekHrs.toFixed(1)}</Text><Text style={s.statLabel}>hrs this week</Text></View>
        <View style={s.statCard}><Text style={s.statVal}>{logs.filter(l => l.date === todayStr()).reduce((a,l)=>a+(l.hrs||0),0).toFixed(1)}</Text><Text style={s.statLabel}>hrs today</Text></View>
        <View style={s.statCard}><Text style={[s.statVal,{color:C.amber}]}>{logs.filter(l=>l.date===todayStr()).length}</Text><Text style={s.statLabel}>sessions today</Text></View>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>LOG WORK SESSION</Text>

        <Text style={s.fieldLabel}>Project / Task</Text>
        <TextInput style={s.input} value={task} onChangeText={setTask} placeholder="e.g. Journey Builder Q3 campaign..." placeholderTextColor={C.muted} />

        <Text style={s.fieldLabel}>Hours Worked</Text>
        <TextInput style={s.input} value={hours} onChangeText={setHours} placeholder="6.5" placeholderTextColor={C.muted} keyboardType="decimal-pad" />

        <Text style={s.fieldLabel}>Focus Level</Text>
        <View style={{ gap: 8, marginBottom: 14 }}>
          {[5,4,3,2,1].map(v => (
            <TouchableOpacity key={v} style={[s.focusBtn, focus === v && s.focusBtnActive]} onPress={() => setFocus(v)}>
              <Text style={[s.focusBtnText, focus === v && { color: C.amber }]}>{FOCUS[v]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={s.fieldLabel}>Wins / Notes</Text>
        <TextInput style={[s.input, { height: 90, textAlignVertical: 'top' }]} value={notes} onChangeText={setNotes} placeholder="What did you accomplish today?" placeholderTextColor={C.muted} multiline />

        <TouchableOpacity style={[s.logBtn, { backgroundColor: C.amber }]} onPress={logWork}>
          <Text style={[s.logBtnText, { color: '#1a0e00' }]}>LOG WORK SESSION</Text>
        </TouchableOpacity>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>HISTORY</Text>
        {logs.length === 0 ? <Text style={s.empty}>No sessions logged yet.</Text> :
          logs.slice(0, 12).map((l, i) => (
            <View key={i} style={[s.logEntry, i === Math.min(logs.length, 12) - 1 && { borderBottomWidth: 0 }]}>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                <View style={[s.badge, { backgroundColor: C.amber + '22' }]}>
                  <Text style={[s.badgeText, { color: C.amber }]}>{l.hrs}h · {FOCUS[l.focus] || ''}</Text>
                </View>
                <Text style={s.logDate}>{fmtDate(l.date)}</Text>
              </View>
              <Text style={s.logTitle}>{l.task}</Text>
              {l.notes ? <Text style={s.logDetail}>{l.notes}</Text> : null}
            </View>
          ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  content: { padding: 16, paddingBottom: 32 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  statCard: { flex: 1, backgroundColor: C.bg3, borderRadius: 14, padding: 12, alignItems: 'center' },
  statVal: { fontSize: 24, fontWeight: '800', color: C.accent },
  statLabel: { fontSize: 10, color: C.muted, marginTop: 2, textAlign: 'center' },
  card: { backgroundColor: C.card, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 0.5, borderColor: C.border },
  cardTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: C.muted, textTransform: 'uppercase', marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: C.muted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  input: { backgroundColor: C.bg3, borderRadius: 12, borderWidth: 0.5, borderColor: C.border, color: C.text, fontSize: 16, padding: 14, marginBottom: 14 },
  focusBtn: { padding: 14, borderRadius: 12, borderWidth: 0.5, borderColor: C.border, backgroundColor: C.bg3 },
  focusBtnActive: { borderColor: C.amber, backgroundColor: C.amber + '22' },
  focusBtnText: { fontSize: 14, color: C.muted, fontWeight: '500' },
  logBtn: { borderRadius: 16, padding: 18, alignItems: 'center', marginTop: 4 },
  logBtnText: { fontSize: 17, fontWeight: '800', letterSpacing: 2 },
  logEntry: { paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: C.border },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  logDate: { fontSize: 11, color: C.muted },
  logTitle: { fontSize: 14, fontWeight: '500', color: C.text, marginBottom: 2 },
  logDetail: { fontSize: 12, color: C.muted },
  empty: { textAlign: 'center', color: C.muted, fontSize: 13, paddingVertical: 20 },
});
