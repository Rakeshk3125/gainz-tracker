import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, Alert, Animated
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { C } from '../utils/theme';
import { getData, saveData, getItem, setItem, todayStr, fmtDate } from '../utils/storage';
import { CURRICULUM, generateSchedule, getTopic, getSessionContent } from '../utils/curriculum';

const CONF_LABELS = { 5: '🟢 Solid — got it', 4: '🔵 Good — mostly clear', 3: '🟡 Okay — needs review', 2: '🟠 Shaky', 1: '🔴 Struggling' };
const SESSION_TYPE_LABEL = { new: 'NEW TOPIC', review: '1st REVIEW', deep: 'DEEP REVIEW' };
const SESSION_TYPE_COLOR = { new: C.accent, review: C.amber, deep: C.green };
const PHASE_COLOR = { Foundation: C.accent, Data: C.amber, Journeys: C.green, APIs: C.coral, Content: C.purple, Automation: C.amber, Einstein: C.green, Integration: C.coral, Governance: C.purple, Advanced: C.accent, 'Interview Prep': C.coral };

export default function LearnScreen() {
  const [tab, setTab] = useState('today');
  const [schedule, setSchedule] = useState([]);
  const [todaySlot, setTodaySlot] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [logs, setLogs] = useState([]);
  const [notes, setNotes] = useState('');
  const [conf, setConf] = useState(3);
  const [activeSessionIdx, setActiveSessionIdx] = useState(0);
  const [weekView, setWeekView] = useState([]);

  useFocusEffect(useCallback(() => { init(); }, []));

  async function init() {
    let sd = await getItem('learn_start');
    if (!sd) {
      // First time — set start date to today
      const today = todayStr();
      await setItem('learn_start', today);
      sd = today;
    }
    setStartDate(sd);

    const sched = generateSchedule(new Date(sd + 'T00:00:00'));
    setSchedule(sched);

    const today = todayStr();
    const slot = sched.find(s => s.date === today) || sched[0];
    setTodaySlot(slot);

    // Build this week's slots (Mon-Fri)
    const thisWeek = sched.filter(s => {
      const d = new Date(s.date + 'T00:00:00');
      const now = new Date(today + 'T00:00:00');
      const diffDays = Math.round((d - now) / (1000*60*60*24));
      return diffDays >= -4 && diffDays <= 4;
    }).slice(0, 5);
    setWeekView(thisWeek);

    const all = await getData('learn');
    setLogs(all);
  }

  async function logSession() {
    if (!todaySlot) return;
    const session = todaySlot.sessions[activeSessionIdx];
    if (!session) return;
    const topic = getTopic(session.topicId);
    const all = await getData('learn');
    all.unshift({
      date: todayStr(),
      topicId: session.topicId,
      topicName: topic.topic,
      tech: topic.tech,
      phase: topic.phase,
      sessionType: session.sessionType,
      conf,
      notes,
      workDay: todaySlot.workDay,
    });
    await saveData('learn', all);
    setLogs(all);
    setNotes('');
    // Move to next session if there are multiple today
    if (activeSessionIdx < todaySlot.sessions.length - 1) {
      setActiveSessionIdx(activeSessionIdx + 1);
    }
    Alert.alert('📚 Session Logged!', `${SESSION_TYPE_LABEL[session.sessionType]} complete. Streak building!`);
  }

  function isCompleted(topicId, sessionType) {
    return logs.some(l => l.topicId === topicId && l.sessionType === sessionType && l.date === todayStr());
  }

  const today = todayStr();
  const totalWorkDays = 130;
  const completedDays = logs.length > 0 ? [...new Set(logs.map(l => l.date))].length : 0;
  const currentWorkDay = todaySlot?.workDay || 0;
  const progressPct = Math.round((currentWorkDay / totalWorkDays) * 100);

  return (
    <View style={s.container}>
      {/* Tab bar */}
      <View style={s.tabs}>
        {[['today','📅 Today'], ['week','📆 Week'], ['curriculum','📚 Curriculum'], ['history','🗂 History']].map(([t, label]) => (
          <TouchableOpacity key={t} style={[s.tab, tab === t && s.tabActive]} onPress={() => setTab(t)}>
            <Text style={[s.tabText, tab === t && s.tabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content}>

        {/* ── TODAY ── */}
        {tab === 'today' && <>
          {/* Progress banner */}
          <View style={s.progressBanner}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={s.progressTitle}>6-MONTH GRIND — DAY {currentWorkDay + 1}/130</Text>
              <Text style={s.progressPct}>{progressPct}%</Text>
            </View>
            <View style={s.progressBg}>
              <View style={[s.progressFill, { width: `${progressPct}%` }]} />
            </View>
            <Text style={s.progressSub}>Mon–Fri · 1hr/day · 1-4-7 Spaced Repetition</Text>
          </View>

          {!todaySlot ? (
            <View style={s.card}><Text style={s.empty}>Loading today's session...</Text></View>
          ) : (
            todaySlot.sessions.map((session, idx) => {
              const topic = getTopic(session.topicId);
              const content = getSessionContent(topic, session.sessionType);
              const done = isCompleted(session.topicId, session.sessionType);
              const isActive = idx === activeSessionIdx;

              return (
                <View key={idx} style={[s.card, done && { opacity: 0.6 }]}>
                  {/* Session header */}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                        <View style={[s.pill, { backgroundColor: SESSION_TYPE_COLOR[session.sessionType] + '22' }]}>
                          <Text style={[s.pillText, { color: SESSION_TYPE_COLOR[session.sessionType] }]}>
                            {SESSION_TYPE_LABEL[session.sessionType]}
                          </Text>
                        </View>
                        <View style={[s.pill, { backgroundColor: (PHASE_COLOR[topic.phase] || C.muted) + '22' }]}>
                          <Text style={[s.pillText, { color: PHASE_COLOR[topic.phase] || C.muted }]}>{topic.phase}</Text>
                        </View>
                        <View style={[s.pill, { backgroundColor: C.purple + '22' }]}>
                          <Text style={[s.pillText, { color: C.purple }]}>{topic.tech}</Text>
                        </View>
                        {done && <View style={[s.pill, { backgroundColor: C.green + '22' }]}><Text style={[s.pillText, { color: C.green }]}>✓ DONE</Text></View>}
                      </View>
                      <Text style={s.sessionTitle}>{content.title}</Text>
                    </View>
                  </View>

                  {/* 1-hour breakdown */}
                  <View style={s.timeBlock}>
                    <Text style={s.timeBlockLabel}>
                      {session.sessionType === 'new' ? '⏱ 0–20 min' : session.sessionType === 'review' ? '⏱ 0–30 min' : '⏱ 0–30 min'}
                    </Text>
                    <Text style={s.timeBlockTitle}>
                      {session.sessionType === 'new' ? '📖 STUDY CONCEPTS' : session.sessionType === 'review' ? '🧠 RECALL & QUIZ' : '🔥 DEEP MASTERY'}
                    </Text>
                  </View>
                  {content.concepts.map((c, i) => (
                    <View key={i} style={[s.conceptRow, i === content.concepts.length - 1 && { borderBottomWidth: 0 }]}>
                      <Text style={s.conceptNum}>{i + 1}</Text>
                      <Text style={s.conceptText}>{c}</Text>
                    </View>
                  ))}

                  <View style={[s.timeBlock, { marginTop: 14 }]}>
                    <Text style={s.timeBlockLabel}>
                      {session.sessionType === 'new' ? '⏱ 20–40 min' : '⏱ 30–45 min'}
                    </Text>
                    <Text style={s.timeBlockTitle}>⚡ HANDS-ON PRACTICE</Text>
                  </View>
                  <View style={s.practiceBox}>
                    <Text style={s.practiceText}>{content.practice}</Text>
                  </View>

                  <View style={[s.timeBlock, { marginTop: 14 }]}>
                    <Text style={s.timeBlockLabel}>
                      {session.sessionType === 'new' ? '⏱ 40–60 min' : '⏱ 45–60 min'}
                    </Text>
                    <Text style={s.timeBlockTitle}>🎤 INTERVIEW PREP</Text>
                  </View>
                  {content.interviews.map((q, i) => (
                    <View key={i} style={s.interviewCard}>
                      <Text style={s.interviewLabel}>Q{i + 1}</Text>
                      <Text style={s.interviewQ}>{q}</Text>
                    </View>
                  ))}

                  {'resource' in content && (
                    <View style={s.resourceBox}>
                      <Text style={s.resourceText}>📚 {content.resource}</Text>
                    </View>
                  )}

                  {/* Log this session */}
                  {!done && isActive && (
                    <View style={{ marginTop: 16 }}>
                      <Text style={s.fieldLabel}>Confidence after this session</Text>
                      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                        {[5,4,3,2,1].map(v => (
                          <TouchableOpacity key={v} style={[s.confBtn, conf === v && { borderColor: C.purple, backgroundColor: C.purple + '22' }]} onPress={() => setConf(v)}>
                            <Text style={[s.confBtnText, conf === v && { color: C.purple }]}>{CONF_LABELS[v]}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      <Text style={s.fieldLabel}>Notes / Takeaways</Text>
                      <TextInput
                        style={[s.input, { height: 80, textAlignVertical: 'top' }]}
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Key concepts learned, things to revisit, insights..."
                        placeholderTextColor={C.muted}
                        multiline
                      />
                      <TouchableOpacity style={[s.logBtn, { backgroundColor: C.purple }]} onPress={logSession}>
                        <Text style={s.logBtnText}>✓ MARK SESSION COMPLETE</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {done && (
                    <View style={[s.resourceBox, { backgroundColor: C.green + '11', borderColor: C.green + '33', borderWidth: 0.5, marginTop: 12 }]}>
                      <Text style={{ fontSize: 13, color: C.green, fontWeight: '600' }}>✓ Completed today — keep the streak!</Text>
                    </View>
                  )}
                </View>
              );
            })
          )}

          {/* 1-4-7 explainer */}
          <View style={s.card}>
            <Text style={s.cardTitle}>🔁 HOW 1-4-7 WORKS</Text>
            <View style={s.ruleRow}>
              <View style={[s.ruleDay, { backgroundColor: C.accent + '22' }]}><Text style={[s.ruleDayText, { color: C.accent }]}>DAY 1</Text></View>
              <Text style={s.ruleDesc}>Learn the topic NEW — full 1hr session</Text>
            </View>
            <View style={s.ruleRow}>
              <View style={[s.ruleDay, { backgroundColor: C.amber + '22' }]}><Text style={[s.ruleDayText, { color: C.amber }]}>DAY 4</Text></View>
              <Text style={s.ruleDesc}>First REVIEW — recall + quiz + practice</Text>
            </View>
            <View style={s.ruleRow}>
              <View style={[s.ruleDay, { backgroundColor: C.green + '22' }]}><Text style={[s.ruleDayText, { color: C.green }]}>DAY 7</Text></View>
              <Text style={s.ruleDesc}>Deep REVIEW — mastery level, senior scenarios</Text>
            </View>
            <Text style={{ fontSize: 12, color: C.muted, marginTop: 10, lineHeight: 18 }}>
              Each topic appears 3× across 7 working days. Reviews are automatically scheduled. By Day 7, the knowledge is locked in long-term memory.
            </Text>
          </View>
        </>}

        {/* ── WEEK VIEW ── */}
        {tab === 'week' && (
          <View style={s.card}>
            <Text style={s.cardTitle}>THIS WEEK'S SCHEDULE</Text>
            {weekView.length === 0 && <Text style={s.empty}>Loading schedule...</Text>}
            {weekView.map((slot, i) => {
              const isToday = slot.date === today;
              const isPast = slot.date < today;
              return (
                <View key={i} style={[s.weekSlot, isToday && { backgroundColor: C.accent + '11', borderRadius: 12, padding: 10 }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <Text style={[s.weekDayLabel, isToday && { color: C.accent, fontWeight: '800' }]}>
                      {new Date(slot.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {isToday ? ' ← TODAY' : ''}
                    </Text>
                    <Text style={{ fontSize: 10, color: C.muted }}>Day {slot.workDay + 1}</Text>
                  </View>
                  {slot.sessions.map((session, j) => {
                    const topic = getTopic(session.topicId);
                    const done = logs.some(l => l.topicId === session.topicId && l.sessionType === session.sessionType && l.date === slot.date);
                    return (
                      <View key={j} style={s.weekSession}>
                        <View style={[s.pill, { backgroundColor: SESSION_TYPE_COLOR[session.sessionType] + '22' }]}>
                          <Text style={[s.pillText, { color: SESSION_TYPE_COLOR[session.sessionType] }]}>{SESSION_TYPE_LABEL[session.sessionType]}</Text>
                        </View>
                        <Text style={s.weekTopicName}>{topic.topic}</Text>
                        {done && <Text style={{ fontSize: 11, color: C.green }}>✓</Text>}
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        )}

        {/* ── CURRICULUM ── */}
        {tab === 'curriculum' && (
          <>
            <View style={[s.card, { padding: 12 }]}>
              <Text style={s.cardTitle}>6-MONTH SFMC SENIOR DEV CURRICULUM</Text>
              <Text style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>24 topics · 3 sessions each · Mon–Fri · 1hr/day</Text>
              <View style={s.progressBg}>
                <View style={[s.progressFill, { width: `${progressPct}%` }]} />
              </View>
              <Text style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Day {currentWorkDay + 1} of 130 — {progressPct}% complete</Text>
            </View>

            {/* Group by phase */}
            {(() => {
              const phases = {};
              CURRICULUM.forEach(t => {
                if (!phases[t.phase]) phases[t.phase] = [];
                phases[t.phase].push(t);
              });
              return Object.entries(phases).map(([phase, topics]) => (
                <View key={phase} style={s.card}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <View style={[s.pill, { backgroundColor: (PHASE_COLOR[phase] || C.muted) + '22' }]}>
                      <Text style={[s.pillText, { color: PHASE_COLOR[phase] || C.muted, fontSize: 11 }]}>{phase.toUpperCase()}</Text>
                    </View>
                    <Text style={{ fontSize: 12, color: C.muted }}>{topics.length} topics</Text>
                  </View>
                  {topics.map((t, i) => {
                    const newDone = logs.some(l => l.topicId === t.id && l.sessionType === 'new');
                    const reviewDone = logs.some(l => l.topicId === t.id && l.sessionType === 'review');
                    const deepDone = logs.some(l => l.topicId === t.id && l.sessionType === 'deep');
                    return (
                      <View key={i} style={[s.currRow, i === topics.length - 1 && { borderBottomWidth: 0 }]}>
                        <View style={{ flex: 1 }}>
                          <Text style={s.currTopicName}>{t.topic}</Text>
                          <View style={{ flexDirection: 'row', gap: 4, marginTop: 4 }}>
                            <View style={[s.miniPill, { backgroundColor: newDone ? C.accent + '33' : C.bg2 }]}>
                              <Text style={[s.miniPillText, { color: newDone ? C.accent : C.muted }]}>D1 {newDone ? '✓' : '○'}</Text>
                            </View>
                            <View style={[s.miniPill, { backgroundColor: reviewDone ? C.amber + '33' : C.bg2 }]}>
                              <Text style={[s.miniPillText, { color: reviewDone ? C.amber : C.muted }]}>D4 {reviewDone ? '✓' : '○'}</Text>
                            </View>
                            <View style={[s.miniPill, { backgroundColor: deepDone ? C.green + '33' : C.bg2 }]}>
                              <Text style={[s.miniPillText, { color: deepDone ? C.green : C.muted }]}>D7 {deepDone ? '✓' : '○'}</Text>
                            </View>
                          </View>
                        </View>
                        <View style={[s.pill, { backgroundColor: C.purple + '22' }]}>
                          <Text style={[s.pillText, { color: C.purple }]}>{t.tech}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ));
            })()}
          </>
        )}

        {/* ── HISTORY ── */}
        {tab === 'history' && (
          <View style={s.card}>
            <Text style={s.cardTitle}>SESSION HISTORY</Text>
            {logs.length === 0
              ? <Text style={s.empty}>No sessions yet. Start today! 📚</Text>
              : logs.slice(0, 30).map((l, i) => (
                <View key={i} style={[s.logEntry, i === Math.min(logs.length, 30) - 1 && { borderBottomWidth: 0 }]}>
                  <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                    <View style={[s.pill, { backgroundColor: (SESSION_TYPE_COLOR[l.sessionType] || C.muted) + '22' }]}>
                      <Text style={[s.pillText, { color: SESSION_TYPE_COLOR[l.sessionType] || C.muted }]}>{SESSION_TYPE_LABEL[l.sessionType]}</Text>
                    </View>
                    <View style={[s.pill, { backgroundColor: C.purple + '22' }]}>
                      <Text style={[s.pillText, { color: C.purple }]}>{l.tech}</Text>
                    </View>
                    <Text style={s.logDate}>{fmtDate(l.date)}</Text>
                    <Text style={{ fontSize: 12 }}>{['','🔴','🟠','🟡','🔵','🟢'][l.conf] || ''}</Text>
                  </View>
                  <Text style={s.logTitle}>{l.topicName}</Text>
                  {l.notes ? <Text style={s.logDetail}>{l.notes}</Text> : null}
                </View>
              ))
            }
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  tabs: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: C.border, backgroundColor: C.bg },
  tab: { flex: 1, paddingVertical: 11, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: C.accent },
  tabText: { fontSize: 10, fontWeight: '600', color: C.muted },
  tabTextActive: { color: C.accent },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: C.card, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 0.5, borderColor: C.border },
  cardTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, color: C.muted, textTransform: 'uppercase', marginBottom: 12 },
  progressBanner: { backgroundColor: C.card, borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 0.5, borderColor: C.border },
  progressTitle: { fontSize: 11, fontWeight: '800', color: C.accent, letterSpacing: 1 },
  progressPct: { fontSize: 11, fontWeight: '700', color: C.green },
  progressBg: { backgroundColor: C.bg3, borderRadius: 99, height: 8, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: 8, backgroundColor: C.accent, borderRadius: 99 },
  progressSub: { fontSize: 11, color: C.muted },
  pill: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  pillText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  sessionTitle: { fontSize: 16, fontWeight: '700', color: C.text, lineHeight: 22 },
  timeBlock: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  timeBlockLabel: { fontSize: 10, color: C.muted, fontWeight: '600' },
  timeBlockTitle: { fontSize: 11, fontWeight: '800', color: C.text, letterSpacing: 0.5 },
  conceptRow: { flexDirection: 'row', gap: 10, paddingVertical: 9, borderBottomWidth: 0.5, borderBottomColor: C.border, alignItems: 'flex-start' },
  conceptNum: { fontSize: 13, fontWeight: '700', color: C.accent, width: 20, marginTop: 1 },
  conceptText: { fontSize: 13, color: C.text, flex: 1, lineHeight: 20 },
  practiceBox: { backgroundColor: C.accent + '0d', borderRadius: 10, padding: 12, borderLeftWidth: 2, borderLeftColor: C.accent },
  practiceText: { fontSize: 13, color: C.text, lineHeight: 20 },
  interviewCard: { backgroundColor: C.purple + '11', borderLeftWidth: 2, borderLeftColor: C.purple, borderRadius: 0, padding: 12, marginBottom: 8, borderTopRightRadius: 8, borderBottomRightRadius: 8 },
  interviewLabel: { fontSize: 10, fontWeight: '700', color: C.purple, letterSpacing: 1, marginBottom: 4 },
  interviewQ: { fontSize: 13, color: C.text, lineHeight: 19 },
  resourceBox: { backgroundColor: C.bg2, borderRadius: 8, padding: 10, marginTop: 10 },
  resourceText: { fontSize: 12, color: C.muted },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: C.muted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  confBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: C.bg3 },
  confBtnText: { fontSize: 11, fontWeight: '600', color: C.muted },
  input: { backgroundColor: C.bg3, borderRadius: 12, borderWidth: 0.5, borderColor: C.border, color: C.text, fontSize: 14, padding: 12, marginBottom: 12 },
  logBtn: { borderRadius: 14, padding: 16, alignItems: 'center' },
  logBtnText: { color: '#fff', fontSize: 15, fontWeight: '800', letterSpacing: 1 },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  ruleDay: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, width: 54, alignItems: 'center' },
  ruleDayText: { fontSize: 11, fontWeight: '800' },
  ruleDesc: { fontSize: 13, color: C.text, flex: 1 },
  weekSlot: { paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: C.border, marginBottom: 2 },
  weekDayLabel: { fontSize: 12, fontWeight: '700', color: C.muted },
  weekSession: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' },
  weekTopicName: { fontSize: 12, color: C.text, flex: 1 },
  currRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: C.border, gap: 8 },
  currTopicName: { fontSize: 13, fontWeight: '600', color: C.text },
  miniPill: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  miniPillText: { fontSize: 9, fontWeight: '700' },
  logEntry: { paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: C.border },
  logDate: { fontSize: 11, color: C.muted },
  logTitle: { fontSize: 14, fontWeight: '500', color: C.text, marginBottom: 2 },
  logDetail: { fontSize: 12, color: C.muted },
  empty: { textAlign: 'center', color: C.muted, fontSize: 13, paddingVertical: 24 },
});
