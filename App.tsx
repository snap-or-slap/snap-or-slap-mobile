import { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, Animated, StatusBar,
} from 'react-native';

const { width } = Dimensions.get('window');
const PRIMARY = '#8B2E0D';
const PRIMARY_LIGHT = '#FFF0E8';
const CREAM = '#FDF6F2';

// ─── SPLASH ────────────────────────────────────────────────────
function SplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const t = setTimeout(onFinish, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={ss.container}>
      <StatusBar barStyle="light-content" />
      <Text style={ss.logo}>SoS</Text>
      <View style={ss.wave} />
    </View>
  );
}

const ss = StyleSheet.create({
  container: { flex: 1, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center' },
  logo: { color: '#fff', fontSize: 52, fontWeight: '700', letterSpacing: 6, marginBottom: 120 },
  wave: {
    position: 'absolute', bottom: -40, width: '130%', height: 180,
    backgroundColor: '#fff', borderRadius: 999,
  },
});

// ─── SHARED COMPONENTS ─────────────────────────────────────────
function Dots({ total, active }: { total: number; active: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            width: i === active ? 20 : 8, height: 8, borderRadius: 4,
            backgroundColor: i === active ? PRIMARY : '#D9C5BC',
          }}
        />
      ))}
    </View>
  );
}

function Btn({ label, onPress, outline }: { label: string; onPress: () => void; outline?: boolean }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: outline ? 'transparent' : PRIMARY,
        borderRadius: 30, paddingVertical: 16, alignItems: 'center',
        marginHorizontal: 24,
      }}
    >
      <Text style={{ color: outline ? PRIMARY : '#fff', fontSize: 16, fontWeight: '700' }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── AVATAR CIRCLE ─────────────────────────────────────────────
function Avatar({ size = 44, border, style }: { size?: number; border?: 'red' | 'green'; style?: object }) {
  return (
    <View style={[{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: '#C8A99A', alignItems: 'center', justifyContent: 'center',
      borderWidth: border ? 2 : 0,
      borderColor: border === 'red' ? '#E53935' : border === 'green' ? '#43A047' : 'transparent',
    }, style]}>
      <Text style={{ fontSize: size * 0.45 }}>🧑</Text>
    </View>
  );
}

// ─── SCREEN 1 ──────────────────────────────────────────────────
function S1() {
  return (
    <View style={sc.illus}>
      {/* floating avatars */}
      <Avatar size={38} style={{ position: 'absolute', top: 0, left: 50 }} />
      <Avatar size={52} style={{ position: 'absolute', top: -16, left: 110 }} />
      <Avatar size={38} style={{ position: 'absolute', top: 0, right: 60 }} />

      {/* stacked cards */}
      <View style={[sc.card, { transform: [{ rotate: '-8deg' }], backgroundColor: '#F5E0D5', top: 30 }]} />
      <View style={[sc.card, { transform: [{ rotate: '6deg' }], backgroundColor: '#EDD6C8', top: 30 }]} />

      {/* main card */}
      <View style={[sc.card, { top: 30, elevation: 6, shadowOpacity: 0.15 }]}>
        <View style={sc.iconBox}><Text style={{ fontSize: 26 }}>🤩</Text></View>
        <Text style={{ color: PRIMARY, fontWeight: '700', marginTop: 4 }}>Challage</Text>
        <Text style={{ color: '#555', fontSize: 13, marginTop: 2 }}>Wake up at 5AM</Text>
      </View>
    </View>
  );
}

// ─── SCREEN 2 ──────────────────────────────────────────────────
function S2() {
  return (
    <View style={sc.illus}>
      <View style={sc.photoBox}>
        <Text style={{ fontSize: 64 }}>🤳</Text>
        <View style={sc.badge}><Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>✓ Proof submitted</Text></View>
      </View>
      <View style={sc.camBtn}><Text style={{ fontSize: 22 }}>📷</Text></View>
    </View>
  );
}

// ─── TEAM CARD (shared by S3 & S4) ─────────────────────────────
function TeamCard({ showSlap }: { showSlap: boolean }) {
  return (
    <View style={sc.teamCard}>
      <View style={{ flexDirection: 'row', gap: 4, marginBottom: 6 }}>
        {['❤️', '❤️', '❤️', '🤍'].map((h, i) => (
          <Text key={i} style={{ fontSize: 18 }}>{h}</Text>
        ))}
      </View>
      <Text style={{ color: '#555', fontSize: 13, marginBottom: 10 }}>Wake up at 5AM</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
        <Avatar border="green" />
        <Avatar border="green" />
        <Avatar border="green" />
        <Avatar border="red" />
      </View>
      {showSlap && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 }}>
          <Avatar size={36} border="red" />
          <TouchableOpacity style={sc.slapBtn}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>⏱ Slap</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ─── SCREEN 5 ──────────────────────────────────────────────────
function S5() {
  return <View style={{ height: 200 }} />;
}

const sc = StyleSheet.create({
  illus: { alignItems: 'center', justifyContent: 'center', height: 260, width: '100%' },
  card: {
    width: 180, height: 120, borderRadius: 20, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center', position: 'absolute',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  iconBox: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: PRIMARY_LIGHT,
    alignItems: 'center', justifyContent: 'center',
  },
  photoBox: {
    width: 220, height: 160, borderRadius: 20, backgroundColor: '#E8D5CC',
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  badge: {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: '#43A047', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  camBtn: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: PRIMARY,
    alignItems: 'center', justifyContent: 'center', marginTop: 12,
  },
  teamCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20,
    alignItems: 'center', shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
    width: 220,
  },
  slapBtn: {
    backgroundColor: PRIMARY, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8,
  },
});

// ─── ONBOARDING PAGES ──────────────────────────────────────────
const PAGES = [
  {
    Illus: S1,
    title: 'Discipline feels easier together',
    body: 'SnapOrSlap turns daily habits into social challenges with photo proof, team accountability, and playful pressure.',
    btn: 'Get started',
    link: 'I already have an account',
    isFirst: true,
  },
  {
    Illus: S2,
    title: 'Check in with real photo proof',
    body: 'Complete each step by uploading a real photo. It is fast, visual, and harder to fake than a simple tap.',
    btn: 'Next →',
  },
  {
    Illus: () => <View style={sc.illus}><TeamCard showSlap={false} /></View>,
    title: 'One team - One challenge - Shared consequences',
    body: 'Every member matters. If someone misses a step, the whole team gets closer to losing a Heart.',
    btn: 'Next →',
  },
  {
    Illus: () => <View style={sc.illus}><TeamCard showSlap /></View>,
    title: 'Miss a step, risk a Heart',
    body: 'Slap reminders, visible team status, and shared Hearts keep everyone moving before time runs out.',
    btn: 'Next →',
  },
  {
    Illus: S5,
    title: 'Ready for your first challenge?',
    body: 'Create an account, join your squad, and begin your first photo-based challenge today.',
    btn: 'Create account',
    link: 'Log in',
    isLast: true,
  },
];

// ─── ONBOARDING ────────────────────────────────────────────────
function Onboarding() {
  const [step, setStep] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;

  const go = (next) => {
    if (next < 0 || next >= PAGES.length) return;
    Animated.sequence([
      Animated.timing(fade, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setTimeout(() => setStep(next), 150);
  };

  const p = PAGES[step];
  const { Illus } = p;

  return (
    <View style={ob.container}>
      <StatusBar barStyle="dark-content" />

      {/* curved header */}
      <View style={ob.header} />

      {/* nav row */}
      <View style={ob.nav}>
        {step > 0 ? (
          <TouchableOpacity onPress={() => go(step - 1)}>
            <Text style={ob.back}>← Back</Text>
          </TouchableOpacity>
        ) : <View style={{ width: 60 }} />}
        {!p.isLast && (
          <TouchableOpacity onPress={() => go(PAGES.length - 1)}>
            <View style={ob.skipBox}><Text style={ob.skip}>Skip</Text></View>
          </TouchableOpacity>
        )}
      </View>

      {/* illustration */}
      <Animated.View style={{ opacity: fade, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Illus />
      </Animated.View>

      {/* text */}
      <Animated.View style={[ob.textBlock, { opacity: fade }]}>
        <Text style={ob.title}>{p.title}</Text>
        <Text style={ob.body}>{p.body}</Text>
      </Animated.View>

      {/* dots + buttons */}
      <View style={ob.footer}>
        <Dots total={PAGES.length} active={step} />
        <View style={{ height: 24 }} />
        <Btn label={p.btn} onPress={() => go(step + 1)} />
        {p.link && (
          <TouchableOpacity style={{ marginTop: 14, alignItems: 'center' }}>
            <Text style={{ color: PRIMARY, fontWeight: '600', fontSize: 15 }}>{p.link}</Text>
          </TouchableOpacity>
        )}
        <View style={{ height: 24 }} />
      </View>
    </View>
  );
}

const ob = StyleSheet.create({
  container: { flex: 1, backgroundColor: CREAM },
  header: {
    position: 'absolute', top: -80, width: '120%', height: 200,
    backgroundColor: PRIMARY_LIGHT, borderRadius: 999, alignSelf: 'center',
  },
  nav: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 56,
  },
  back: { color: PRIMARY, fontSize: 15, fontWeight: '600' },
  skipBox: { borderWidth: 1.5, borderColor: PRIMARY, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
  skip: { color: PRIMARY, fontSize: 14, fontWeight: '600' },
  textBlock: { paddingHorizontal: 28 },
  title: { fontSize: 26, fontWeight: '800', color: '#1A1A1A', marginBottom: 12, lineHeight: 34 },
  body: { fontSize: 15, color: '#666', lineHeight: 22 },
  footer: { paddingHorizontal: 0, paddingTop: 28, alignItems: 'center' },
});

// ─── ROOT ──────────────────────────────────────────────────────
export default function App() {
  const [ready, setReady] = useState(false);
  return ready ? <Onboarding /> : <SplashScreen onFinish={() => setReady(true)} />;
}
