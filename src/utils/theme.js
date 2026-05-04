export const C = {
  bg: '#0a0a0f',
  bg2: '#13131c',
  bg3: '#1c1c2a',
  card: '#16161f',
  border: 'rgba(255,255,255,0.07)',
  accent: '#4f8ef7',
  green: '#38c98a',
  amber: '#f5a623',
  coral: '#f76f6f',
  purple: '#a78bfa',
  text: '#f0f0f5',
  muted: '#7a7a9a',
};

export const GYM_SPLIT = {
  push: {
    label: 'PUSH DAY', color: '#4f8ef7', focus: 'Chest · Shoulders · Triceps',
    warmup: '5 min: arm circles, band pull-aparts, light cable fly',
    exercises: [
      { name: 'Barbell Bench Press', sets: '4', reps: '6–8', rest: '3 min', tip: 'Control the eccentric, pause at chest' },
      { name: 'Incline Dumbbell Press', sets: '3', reps: '8–10', rest: '2 min', tip: '45° incline targets upper chest' },
      { name: 'Overhead Press (DB)', sets: '3', reps: '8–10', rest: '2 min', tip: 'Brace core, avoid flaring elbows' },
      { name: 'Cable Lateral Raise', sets: '3', reps: '12–15', rest: '90s', tip: 'Lead with elbow, not wrist' },
      { name: 'Pec-Deck Fly', sets: '3', reps: '12–15', rest: '90s', tip: 'Squeeze at peak contraction' },
      { name: 'Tricep Pushdown (rope)', sets: '3', reps: '12–15', rest: '60s', tip: 'Flare at bottom for full extension' },
      { name: 'Overhead Tricep Extension', sets: '2', reps: '10–12', rest: '60s', tip: 'Keep elbows close to head' },
    ],
  },
  pull: {
    label: 'PULL DAY', color: '#38c98a', focus: 'Back · Rear Delts · Biceps',
    warmup: '5 min: band pull-aparts, scapular pull-ups, face pulls',
    exercises: [
      { name: 'Weighted Pull-Ups', sets: '4', reps: '5–8', rest: '3 min', tip: 'Dead hang start, pull elbows to hips' },
      { name: 'Barbell Row', sets: '4', reps: '6–8', rest: '3 min', tip: '45° hinge, row to lower chest' },
      { name: 'Seated Cable Row', sets: '3', reps: '10–12', rest: '2 min', tip: 'Retract scapula before pulling' },
      { name: 'Single-Arm DB Row', sets: '3', reps: '10–12', rest: '90s', tip: 'Rotate torso slightly for full ROM' },
      { name: 'Face Pull', sets: '3', reps: '15–20', rest: '60s', tip: 'Pull to forehead, thumbs back' },
      { name: 'Barbell Curl', sets: '3', reps: '8–10', rest: '90s', tip: 'No swinging, supinate at top' },
      { name: 'Hammer Curl', sets: '2', reps: '10–12', rest: '60s', tip: 'Targets brachialis for arm thickness' },
    ],
  },
  legs: {
    label: 'LEG DAY', color: '#f5a623', focus: 'Quads · Hamstrings · Glutes · Calves',
    warmup: '5 min: hip circles, goblet squat, leg swings',
    exercises: [
      { name: 'Barbell Back Squat', sets: '4', reps: '5–8', rest: '3 min', tip: 'Break parallel, knees track toes' },
      { name: 'Romanian Deadlift', sets: '3', reps: '8–10', rest: '2 min', tip: 'Hip hinge, soft knee, feel hamstring stretch' },
      { name: 'Leg Press', sets: '3', reps: '10–12', rest: '2 min', tip: 'High feet placement = more glute/ham' },
      { name: 'Bulgarian Split Squat', sets: '3', reps: '10–12/leg', rest: '2 min', tip: 'Front shin vertical, torso upright' },
      { name: 'Leg Curl (machine)', sets: '3', reps: '12–15', rest: '90s', tip: 'Curl explosively, slow descent' },
      { name: 'Leg Extension', sets: '3', reps: '12–15', rest: '60s', tip: 'Full extension, 2s pause at top' },
      { name: 'Standing Calf Raise', sets: '4', reps: '15–20', rest: '60s', tip: 'Full stretch at bottom each rep' },
    ],
  },
  strength: {
    label: 'STRENGTH', color: '#f76f6f', focus: 'Heavy Compounds · Power',
    warmup: '10 min: dynamic stretch, bar warm-up sets, hip activation',
    exercises: [
      { name: 'Deadlift', sets: '5', reps: '3–5', rest: '4–5 min', tip: 'Setup: hips over bar, lat tightness, push floor away' },
      { name: 'Squat', sets: '4', reps: '4–6', rest: '3–4 min', tip: 'Brace 360°, sit back, drive knees out' },
      { name: 'Bench Press', sets: '4', reps: '4–6', rest: '3 min', tip: 'Leg drive, arch, tight scapula' },
      { name: 'Barbell Row', sets: '3', reps: '5–6', rest: '3 min', tip: 'Heavy, controlled, no momentum' },
      { name: 'Weighted Dip', sets: '3', reps: '6–8', rest: '2 min', tip: 'Forward lean for chest, upright for tris' },
      { name: 'Farmer Carry', sets: '3', reps: '40m walk', rest: '2 min', tip: 'Heavy, tall posture, crush the handles' },
    ],
  },
  cardio: {
    label: 'CARDIO', color: '#7a7a9a', focus: 'Active Recovery',
    warmup: '',
    exercises: [
      { name: 'Incline Treadmill Walk', sets: '1', reps: '20–30 min', rest: '—', tip: '10% incline, 3.5mph, zone 2 HR' },
      { name: 'Rowing Machine', sets: '1', reps: '15 min', rest: '—', tip: 'Drive with legs first, then pull' },
      { name: 'Foam Roll + Stretch', sets: '1', reps: '10 min', rest: '—', tip: 'Focus on previous training day muscles' },
    ],
  },
  rest: {
    label: 'REST DAY', color: '#a78bfa', focus: 'Recovery',
    warmup: '',
    exercises: [
      { name: 'Walk outside', sets: '1', reps: '20–30 min', rest: '—', tip: 'Light movement aids recovery' },
      { name: 'Mobility work', sets: '1', reps: '15 min', rest: '—', tip: 'Hip flexors, thoracic spine, ankles' },
      { name: 'Sleep priority', sets: '1', reps: '8h target', rest: '—', tip: 'Muscle grows during sleep' },
    ],
  },
};

export const DAY_SPLIT = ['push', 'pull', 'legs', 'strength', 'push', 'pull', 'rest'];

export const SFMC_TOPICS = [
  { week: 1, topic: 'AMPscript Fundamentals', tech: 'AMPscript', subtopics: ['Variable declaration & scoping', 'String functions: Substring, Concat, Replace', 'Lookup vs LookupRows vs LookupOrderedRows', 'AttributeValue() in CloudPages', 'TreatAsContent() for dynamic content'], interviews: ['Explain AMPscript execution order in Email Studio', 'Difference between Lookup and LookupRows with example', 'How do you handle null values in AMPscript?'], resources: 'Trailhead: AMPscript Basics + SFMC Docs' },
  { week: 1, topic: 'AMPscript Advanced', tech: 'AMPscript', subtopics: ['IIF() vs IF/THEN/ELSE blocks', 'FOR loop with array handling', 'HTTPGet/HTTPPost for API calls in CloudPages', 'EncryptSymmetric & DecryptSymmetric', 'BuildRowsetFromString patterns'], interviews: ['How would you paginate results from a large DE using AMPscript?', 'Explain a use case for HTTPPost in AMPscript', 'How do you pass data between CloudPages securely?'], resources: 'SFMC Blog + GitHub examples' },
  { week: 2, topic: 'Server-Side JavaScript (SSJS)', tech: 'SSJS', subtopics: ['Platform.Load vs require()', 'DataExtension.Add/Rows/Remove', 'HTTP.Get and HTTP.Post', 'WSProxy for SOAP API in SSJS', 'When to use SSJS vs AMPscript'], interviews: ['SSJS vs AMPscript: when would you choose each?', 'How do you use WSProxy to query data?', 'How do you handle errors in SSJS?'], resources: 'Salesforce SSJS reference + community examples' },
  { week: 2, topic: 'Data Extensions & SQL', tech: 'Data & SQL', subtopics: ['Sendable vs non-sendable DEs', 'Data retention & relationship types', 'SQL in Automation Studio: SELECT, JOIN, WHERE', 'UNION vs UNION ALL in SFMC', 'Date functions: GETDATE, DATEADD, DATEDIFF'], interviews: ['Explain DE relationship types with real examples', 'How would you deduplicate records in SFMC SQL?', 'What are the limitations of SQL in SFMC?'], resources: 'SFMC SQL reference + Query Studio' },
  { week: 3, topic: 'Journey Builder Architecture', tech: 'Journey Builder', subtopics: ['Entry sources: DE, API, Audience Builder', 'Decision splits vs engagement splits', 'Update Contact activity patterns', 'Custom split activities', 'Wait-by-attribute vs fixed wait'], interviews: ['How do you prevent contacts re-entering a journey?', 'Explain a multi-channel nurture journey design', 'How do you handle journey versioning?'], resources: 'Trailhead: Journey Builder Deep Dive' },
  { week: 3, topic: 'REST & SOAP API Integration', tech: 'APIs', subtopics: ['OAuth 2.0 auth flow for SFMC', 'REST API: /messaging/v1/messageDefinitionSends', 'SOAP API: SendEmailToList, TriggeredSend', 'Transactional Messaging API vs Triggered Sends', 'Error handling and retry logic'], interviews: ['Walk through SFMC OAuth token refresh flow', 'REST vs SOAP: when to use each in SFMC?', 'How would you trigger a journey entry via API?'], resources: 'SFMC API docs + Postman collection' },
  { week: 4, topic: 'Einstein Analytics & AI Features', tech: 'Einstein', subtopics: ['Einstein Engagement Scoring setup', 'Einstein Send Time Optimization', 'Einstein Content Selection', 'Einstein Recommendations DE structure', 'Predictive audience building'], interviews: ['How does Einstein STO determine optimal send time?', 'What data does SFMC need for Einstein Engagement Scoring?', 'Explain Einstein Content Selection setup'], resources: 'Trailhead: Marketing AI Specialist' },
  { week: 4, topic: 'CloudPages & SmartCapture', tech: 'CloudPages', subtopics: ['CloudPage types: landing page, microsite', 'SmartCapture form to DE mapping', 'URL parameter passing via AMPscript', 'Form validation patterns', 'Preference center build patterns'], interviews: ['How do you pass data between CloudPages?', 'Explain SmartCapture vs custom form to DE', 'How would you build a preference center?'], resources: 'SFMC CloudPages docs' },
  { week: 5, topic: 'Marketing Cloud Connect', tech: 'Integration', subtopics: ['MC Connect architecture overview', 'Synchronized DEs from Salesforce Objects', 'Triggered Sends from Salesforce', 'Journey Builder Salesforce activities', 'Data mapping and field sync'], interviews: ['Explain MC Connect architecture', 'How do you sync a custom Salesforce object to SFMC?', 'What are the limitations of MC Connect?'], resources: 'Trailhead: Marketing Cloud Connect' },
  { week: 5, topic: 'Automation Studio Deep Dive', tech: 'Automation', subtopics: ['Schedule vs file drop triggers', 'SQL query activity best practices', 'Filter activity vs SQL', 'Fire-and-forget vs wait pattern', 'Error notifications and monitoring'], interviews: ['How would you design an automation for daily data sync?', 'Difference between filter and SQL query activity', 'How do you handle automation failures?'], resources: 'SFMC Automation Studio docs' },
  { week: 6, topic: 'Personalization & Dynamic Content', tech: 'Personalization', subtopics: ['Dynamic content blocks in Email Studio', 'Profile attributes vs DE attributes', 'AMPscript for conditional content', 'Predictive content with Einstein', 'A/B testing setup and analysis'], interviews: ['How do you implement 1:1 personalization at scale?', 'Explain dynamic content vs AMPscript personalization', 'How would you set up an A/B test in SFMC?'], resources: 'SFMC Personalization docs' },
  { week: 6, topic: 'Security & Governance', tech: 'Security', subtopics: ['Business Units architecture', 'Role-based access control (RBAC)', 'Data encryption at rest and transit', 'CAN-SPAM and GDPR in SFMC', 'Sender Authentication Package (SAP)'], interviews: ['How do you structure Business Units for a global company?', 'Explain SAP and its components', 'How does SFMC handle GDPR data subject requests?'], resources: 'SFMC Security documentation' },
];

export const MACRO_GOALS = { protein: 160, carbs: 250, fat: 70, calories: 2800 };
