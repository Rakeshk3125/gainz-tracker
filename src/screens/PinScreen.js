import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Vibration } from 'react-native';
import { C } from '../utils/theme';
import { getItem, setItem } from '../utils/storage';

export default function PinScreen({ onUnlock }) {
  const [mode, setMode] = useState('checking'); // checking | login | create | confirm
  const [pin, setPin] = useState('');
  const [tempPin, setTempPin] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    getItem('pin').then(stored => {
      setMode(stored ? 'login' : 'create');
    });
  }, []);

  const handlePress = async (digit) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    setError('');

    if (newPin.length === 4) {
      setTimeout(async () => {
        if (mode === 'login') {
          const stored = await getItem('pin');
          if (newPin === stored) {
            onUnlock();
          } else {
            Vibration.vibrate(400);
            setError('Incorrect PIN. Try again.');
            setPin('');
          }
        } else if (mode === 'create') {
          setTempPin(newPin);
          setPin('');
          setMode('confirm');
        } else if (mode === 'confirm') {
          if (newPin === tempPin) {
            await setItem('pin', newPin);
            onUnlock();
          } else {
            Vibration.vibrate(400);
            setError('PINs do not match. Try again.');
            setPin('');
            setTempPin('');
            setMode('create');
          }
        }
      }, 150);
    }
  };

  const handleDel = () => setPin(p => p.slice(0, -1));

  const title = mode === 'login' ? 'Enter PIN' : mode === 'create' ? 'Create PIN' : 'Confirm PIN';
  const sub = mode === 'login' ? 'Enter your 4-digit PIN'
    : mode === 'create' ? 'Choose a 4-digit PIN to secure your tracker'
    : 'Enter the same PIN again';

  if (mode === 'checking') return null;

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        <Text style={s.logo}>GAINZ</Text>
        <Text style={s.logoSub}>DAILY PERFORMANCE TRACKER</Text>
        <Text style={s.title}>{title}</Text>
        <Text style={s.sub}>{sub}</Text>
        <View style={s.dots}>
          {[0,1,2,3].map(i => (
            <View key={i} style={[s.dot, pin.length > i && s.dotFilled]} />
          ))}
        </View>
        {error ? <Text style={s.error}>{error}</Text> : <View style={{height:20}} />}
        <View style={s.keypad}>
          {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k, i) => (
            <TouchableOpacity
              key={i}
              style={[s.key, k === '' && s.keyEmpty]}
              onPress={() => k === '⌫' ? handleDel() : k !== '' ? handlePress(k) : null}
              activeOpacity={0.7}
            >
              <Text style={[s.keyText, k === '⌫' && s.keyDel]}>{k}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  logo: { fontFamily: 'System', fontSize: 56, fontWeight: '900', color: C.accent, letterSpacing: 6, marginBottom: 4 },
  logoSub: { fontSize: 11, color: C.muted, letterSpacing: 3, marginBottom: 40 },
  title: { fontSize: 18, fontWeight: '600', color: C.text, marginBottom: 6 },
  sub: { fontSize: 13, color: C.muted, textAlign: 'center', marginBottom: 32 },
  dots: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: C.border, backgroundColor: 'transparent' },
  dotFilled: { backgroundColor: C.accent, borderColor: C.accent },
  error: { fontSize: 13, color: C.coral, height: 20, marginBottom: 8, textAlign: 'center' },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', width: 264, gap: 12, marginTop: 8 },
  key: { width: 80, height: 64, borderRadius: 16, backgroundColor: C.bg3, alignItems: 'center', justifyContent: 'center' },
  keyEmpty: { backgroundColor: 'transparent' },
  keyText: { fontSize: 24, fontWeight: '500', color: C.text },
  keyDel: { fontSize: 18, color: C.muted },
});
