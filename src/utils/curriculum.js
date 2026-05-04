// ─── 6-MONTH SFMC SENIOR DEV CURRICULUM ───
// 45 topics × 3 appearances (Day 1 NEW, Day 4 REVIEW, Day 7 DEEP REVIEW)
// Mon–Fri only. Start date = app first open date (stored in AsyncStorage)

export const CURRICULUM = [
  {
    id: 1, week: 1, phase: 'Foundation',
    topic: 'AMPscript Core Fundamentals',
    tech: 'AMPscript',
    newSession: {
      title: 'AMPscript Core — Learn It',
      concepts: [
        'Variable declaration: %%[SET @var = "value"]%%',
        'Output: %%=v(@var)=%% vs %%[@var]%%',
        'String functions: Substring(), Concat(), Replace(), Length()',
        'Conditional: IF/THEN/ELSEIF/ELSE/ENDIF blocks',
        'AttributeValue() to pull subscriber attributes',
      ],
      practice: 'Build a personalised email footer using AMPscript that outputs subscriber first name, email, and a dynamic unsubscribe message based on country attribute.',
      resource: 'Salesforce Docs → AMPscript Reference + Trailhead: AMPscript Basics',
      interviews: [
        'What is the difference between %%=v(@var)=%% and %%[@var]%% in AMPscript?',
        'How does AMPscript execution order work in an email send?',
        'Explain the difference between AttributeValue() and a Data Extension lookup.',
      ],
    },
    reviewSession: {
      title: 'AMPscript Core — First Review',
      concepts: [
        'Quiz: Write the syntax for a variable declaration and output',
        'Recall: What are the 5 string functions you learned?',
        'Practice: Write an IF/THEN block checking if @country == "AU"',
        'Explain: What does AttributeValue() pull and from where?',
      ],
      practice: 'Without looking at docs, recreate last week\'s personalised footer from memory. Then add a conditional block that shows different content for AU vs UK subscribers.',
      interviews: [
        'A colleague says AMPscript runs server-side. Explain what that means and the implications.',
        'How would you debug an AMPscript variable that\'s rendering blank?',
      ],
    },
    deepSession: {
      title: 'AMPscript Core — Deep Mastery',
      concepts: [
        'Edge cases: null handling with IIF() and empty string checks',
        'Combine AttributeValue() with conditional blocks in production pattern',
        'Performance: AMPscript in large send volumes — what to avoid',
        'Syntax gotchas that trip up senior devs in interviews',
      ],
      practice: 'Mock scenario: A client email is rendering %%[name]%% literally for some subscribers. Debug and fix it. Write the corrected code.',
      interviews: [
        'SENIOR Q: Design an AMPscript solution that handles 5 different subscriber segments with different content blocks, error-safe for null values.',
        'What happens if AMPscript throws an error mid-email render during a send?',
      ],
    },
  },
  {
    id: 2, week: 1, phase: 'Foundation',
    topic: 'AMPscript Advanced — Lookups & Loops',
    tech: 'AMPscript',
    newSession: {
      title: 'AMPscript Advanced — Learn It',
      concepts: [
        'Lookup(): single row single field from a DE',
        'LookupRows(): returns a rowset — multiple rows',
        'LookupOrderedRows(): rowset sorted by a field',
        'FOR loop with RowCount() and Field() to iterate rowsets',
        'BuildRowsetFromString(): parse delimited strings into rowsets',
      ],
      practice: 'Build a dynamic product recommendation block: lookup last 3 purchases from a DE for each subscriber and render them as a list in an email.',
      resource: 'SFMC Docs → Lookup Functions + AMPscript for Loops',
      interviews: [
        'What is the difference between Lookup() and LookupRows()?',
        'How do you iterate over a rowset in AMPscript?',
        'When would you use BuildRowsetFromString() and give a real example?',
      ],
    },
    reviewSession: {
      title: 'AMPscript Lookups — First Review',
      concepts: [
        'Recall: Syntax for Lookup() vs LookupRows() — write from memory',
        'Explain: What does RowCount() return and how is it used?',
        'Trace: Walk through a FOR loop iteration step by step',
        'Quiz: What happens if Lookup() finds no matching row?',
      ],
      practice: 'Recreate the product recommendation block without notes. Add a fallback message if the subscriber has no purchase history.',
      interviews: [
        'A Lookup() is returning blank even though data exists in the DE. What are 3 things you\'d check?',
        'How would you handle a scenario where LookupRows() returns more than 200 rows?',
      ],
    },
    deepSession: {
      title: 'AMPscript Lookups — Deep Mastery',
      concepts: [
        'Performance trap: Lookup() inside a FOR loop — O(n²) issue',
        'Pattern: pre-fetch all rows then iterate — correct approach',
        'LookupOrderedRows for ranking (e.g. top N by purchase value)',
        'Combining BuildRowsetFromString with a lookup for multi-value filters',
      ],
      practice: 'SENIOR SCENARIO: Build a "top 3 recommended categories" block that fetches from 2 DEs, handles null/empty cases, and limits to 3 results with a fallback CTA.',
      interviews: [
        'SENIOR Q: A client has 500k subscribers and each email does 5 Lookup() calls. What performance issues arise and how do you solve them?',
        'Design a reusable AMPscript lookup pattern that can be dropped into any email template.',
      ],
    },
  },
  {
    id: 3, week: 2, phase: 'Foundation',
    topic: 'AMPscript API Calls & HTTPGet/Post',
    tech: 'AMPscript',
    newSession: {
      title: 'AMPscript HTTP Functions — Learn It',
      concepts: [
        'HTTPGet(url, throwOnError, timeout): fetch from external API',
        'HTTPPost(url, contentType, data, throwOnError): post data',
        'TreatAsContent(): render dynamic AMPscript from a string',
        'EncryptSymmetric() / DecryptSymmetric(): secure data passing',
        'IIF() for inline conditionals — cleaner than full IF blocks',
      ],
      practice: 'Build a CloudPage that calls an external weather API using HTTPGet, parses the JSON response, and displays personalised content based on the subscriber\'s city.',
      resource: 'SFMC Docs → HTTP Functions + TreatAsContent',
      interviews: [
        'What is TreatAsContent() and when would you use it?',
        'How do you handle an HTTPGet that fails or times out in AMPscript?',
        'Explain a real use case for EncryptSymmetric() in SFMC.',
      ],
    },
    reviewSession: {
      title: 'AMPscript HTTP — First Review',
      concepts: [
        'Recall: Write the HTTPGet() syntax from memory',
        'Explain: What does throwOnError do and when would you set it to true vs false?',
        'Trace: Walk through TreatAsContent() — what does it actually do?',
        'Quiz: What content type would you use for a JSON POST?',
      ],
      practice: 'Without notes, rebuild the weather API block. Add error handling so the email renders a fallback if the API call fails.',
      interviews: [
        'What security risks exist when using HTTPGet in an email and how do you mitigate them?',
        'How would you pass subscriber data securely to an external endpoint from AMPscript?',
      ],
    },
    deepSession: {
      title: 'AMPscript HTTP — Deep Mastery',
      concepts: [
        'Timeout strategy: what value is safe for email sends vs CloudPages?',
        'Caching pattern: store API response in DE to avoid repeat calls',
        'TreatAsContent() with parameterised content stored in a DE',
        'Combining EncryptSymmetric with URL params for secure CloudPage links',
      ],
      practice: 'SENIOR SCENARIO: Design a system where a triggered send calls an external loyalty API, encrypts the subscriber token, and passes it to a CloudPage for a secure redemption flow.',
      interviews: [
        'SENIOR Q: A client wants real-time personalisation using an API in triggered emails at 50k/day. What architectural concerns do you raise and how do you solve them?',
        'How do you test HTTPGet calls in SFMC without triggering real sends?',
      ],
    },
  },
  {
    id: 4, week: 2, phase: 'Foundation',
    topic: 'Server-Side JavaScript (SSJS)',
    tech: 'SSJS',
    newSession: {
      title: 'SSJS Fundamentals — Learn It',
      concepts: [
        'Platform.Load("core","1.1.1") — always first line',
        'Variable(name, value) vs Platform.Variable.GetValue()',
        'DataExtension.Add(key, {field:value}) — insert row',
        'DataExtension.Init(key).Rows.Add({}) — alternative pattern',
        'HTTP.Get(url) and HTTP.Post(url, contentType, payload)',
      ],
      practice: 'Build an SSJS CloudPage that: (1) reads a subscriber key from URL param, (2) looks up their record from a DE, (3) posts their data to an external webhook, (4) updates their DE row.',
      resource: 'SFMC SSJS Reference Guide + GitHub: SFMC SSJS Examples',
      interviews: [
        'What is Platform.Load() and why is it required?',
        'How does SSJS differ from AMPscript — when do you choose one over the other?',
        'How do you insert a row into a DE using SSJS?',
      ],
    },
    reviewSession: {
      title: 'SSJS Fundamentals — First Review',
      concepts: [
        'Recall: Write the DataExtension.Add() syntax from memory',
        'Explain: What does Platform.Load() actually do under the hood?',
        'Compare: AMPscript Lookup() vs SSJS DataExtension lookup — when each?',
        'Quiz: How do you read a URL query parameter in SSJS?',
      ],
      practice: 'Rebuild the CloudPage from memory. Add error handling with try/catch and log errors to a separate DE.',
      interviews: [
        'SSJS vs AMPscript: give a real scenario where you\'d choose SSJS over AMPscript.',
        'How do you handle errors in SSJS — what does a production-safe pattern look like?',
      ],
    },
    deepSession: {
      title: 'SSJS — Deep Mastery',
      concepts: [
        'WSProxy: the most powerful SSJS tool — what it is and why it matters',
        'WSProxy.invoke("TriggeredSend", "create", {}) — sending from SSJS',
        'Async vs sync patterns — SSJS is synchronous, implications',
        'SSJS debugging: Platform.Response.Write() as console.log',
        'When SSJS fails silently — common traps senior devs know',
      ],
      practice: 'SENIOR SCENARIO: Build a SSJS CloudPage that accepts form submissions, validates inputs, upserts to a DE, triggers a welcome email via WSProxy TriggeredSend, and redirects on success.',
      interviews: [
        'SENIOR Q: What is WSProxy and how does it differ from using the REST API directly from SSJS?',
        'A SSJS CloudPage is throwing a white page error in production. Walk me through your debugging process.',
      ],
    },
  },
  {
    id: 5, week: 3, phase: 'Foundation',
    topic: 'SSJS Advanced — WSProxy & SOAP',
    tech: 'SSJS',
    newSession: {
      title: 'WSProxy Deep Dive — Learn It',
      concepts: [
        'var proxy = new Script.Util.WSProxy() — initialisation',
        'proxy.retrieve("DataExtension", ["Name","CustomerKey"], {Property:"CustomerKey",SimpleOperator:"equals",Value:"X"})',
        'proxy.createItem("TriggeredSend", {TriggeredSendDefinition:{CustomerKey:"X"},Subscribers:[{EmailAddress:"x",SubscriberKey:"x"}]})',
        'proxy.updateItem() and proxy.deleteItem() patterns',
        'Paging with proxy.retrieve() — ContinueRequest for large datasets',
      ],
      practice: 'Use WSProxy to: (1) retrieve all active journeys, (2) get all DEs in a BU, (3) fire a triggered send. Log results to console.',
      resource: 'SFMC SOAP API WSDL + WSProxy documentation',
      interviews: [
        'What is the WSProxy object and what does it give you access to?',
        'How do you page through large WSProxy retrieve results?',
        'When would you use WSProxy vs the REST API?',
      ],
    },
    reviewSession: {
      title: 'WSProxy — First Review',
      concepts: [
        'Recall: Write the WSProxy retrieve syntax for a DE query',
        'Explain: What is ContinueRequest and when do you need it?',
        'Compare: WSProxy vs REST API — advantages of each',
        'Trace: Walk through firing a TriggeredSend via WSProxy step by step',
      ],
      practice: 'Build a SSJS utility function that retrieves all subscribers from a DE with paging — handles any size dataset correctly.',
      interviews: [
        'You need to retrieve 50,000 rows from a DE in SSJS. How do you handle this?',
        'How do you authenticate WSProxy — does it need credentials?',
      ],
    },
    deepSession: {
      title: 'WSProxy — Deep Mastery',
      concepts: [
        'WSProxy.invoke() for operations not in retrieve/create/update/delete',
        'Batch operations: creating multiple items in one call',
        'Error handling: checking Status and StatusMessage in responses',
        'WSProxy for journey management: FireEvent, startJourney patterns',
        'Rate limits and performance considerations at scale',
      ],
      practice: 'SENIOR SCENARIO: Build a SSJS admin utility that audits all DEs in a BU, flags ones with no sends in 90 days, and generates a report into a master DE.',
      interviews: [
        'SENIOR Q: Design a SSJS solution to migrate subscriber data from one BU to another using WSProxy.',
        'What are the limitations of WSProxy and how do you work around them?',
      ],
    },
  },
  {
    id: 6, week: 3, phase: 'Data',
    topic: 'Data Extensions — Architecture & Design',
    tech: 'Data & SQL',
    newSession: {
      title: 'Data Extensions — Learn It',
      concepts: [
        'Sendable vs Non-sendable DEs — when to use each',
        'Data types: Text, Number, Date, Boolean, EmailAddress, Phone, Decimal',
        'Primary keys, nullable fields, default values',
        'Data retention policies — impact on data volume and compliance',
        'DE relationships: None, Relate, Reference — what they enable',
      ],
      practice: 'Design the DE schema for an e-commerce email programme: Customers, Orders, Products, EmailPreferences, SuppresionList. Define keys, types, relationships.',
      resource: 'SFMC Data Extension documentation + Trailhead: Data Management',
      interviews: [
        'What is the difference between a sendable and non-sendable DE?',
        'How do DE relationships work and when would you use them?',
        'What happens to a DE record when data retention expires?',
      ],
    },
    reviewSession: {
      title: 'Data Extensions — First Review',
      concepts: [
        'Recall: What are the 3 types of DE relationships?',
        'Design: Sketch the Customers → Orders → Products schema from memory',
        'Explain: Why would you set a field to nullable?',
        'Quiz: What data type would you use for a purchase timestamp?',
      ],
      practice: 'Review your e-commerce schema. Now add: a BrowseHistory DE, a CartAbandonment DE, and a ReEngagement segment DE. Define all keys and relationships.',
      interviews: [
        'A client has 10M subscriber records and sends daily. How do you design their DE architecture for performance?',
        'Explain a scenario where wrong data retention settings caused a real problem.',
      ],
    },
    deepSession: {
      title: 'Data Extensions — Deep Mastery',
      concepts: [
        'DE vs All Subscribers list — pros/cons for large programmes',
        'Shared DEs across Business Units — architecture and access patterns',
        'Import activity DE mapping — field mapping best practices',
        'Indexed fields — when SFMC auto-indexes and manual considerations',
        'DE auditing: tracking who changed what and when',
      ],
      practice: 'SENIOR SCENARIO: A client is hitting DE size limits (4GB) and queries are slow. Diagnose the issue and design a partitioning/archiving strategy.',
      interviews: [
        'SENIOR Q: Design a multi-BU data architecture where each BU has its own subscriber pool but shares a global suppression list.',
        'How do you handle GDPR data subject deletion requests in SFMC DEs?',
      ],
    },
  },
  {
    id: 7, week: 4, phase: 'Data',
    topic: 'SQL in SFMC — Fundamentals',
    tech: 'Data & SQL',
    newSession: {
      title: 'SFMC SQL Basics — Learn It',
      concepts: [
        'SELECT, FROM, WHERE, ORDER BY in Query Studio',
        'SFMC SQL limitations: no subqueries in FROM, no CTEs, no stored procs',
        'JOIN types: INNER JOIN, LEFT JOIN, RIGHT JOIN with DE examples',
        'Date functions: GETDATE(), DATEADD(day,-7,GETDATE()), DATEDIFF()',
        'CASE WHEN THEN ELSE END for conditional columns',
      ],
      practice: 'Write SQL to: (1) find all subscribers who opened in last 30 days, (2) join with purchases DE to get high-value engaged subscribers, (3) exclude global suppressions.',
      resource: 'SFMC Query Activity documentation + SQL reference',
      interviews: [
        'What SQL features are NOT available in SFMC Query Studio?',
        'Write a query to find subscribers who have not opened in 90 days.',
        'What is the difference between INNER JOIN and LEFT JOIN?',
      ],
    },
    reviewSession: {
      title: 'SFMC SQL — First Review',
      concepts: [
        'Recall: Write the 90-day non-opener query from memory',
        'Explain: Why can\'t you use subqueries in FROM in SFMC SQL?',
        'Practice: Add a CASE WHEN block to segment subscribers by engagement tier',
        'Quiz: What does DATEDIFF(day, LastOpen, GETDATE()) return?',
      ],
      practice: 'Build a complete segmentation query: Active (opened last 30d), Winback (31-90d), Dormant (91-180d), Lapsed (180d+). Output to a single DE with a Segment column.',
      interviews: [
        'How do you union results from two query activities into one DE?',
        'A query that worked yesterday is timing out today. What do you investigate?',
      ],
    },
    deepSession: {
      title: 'SFMC SQL — Deep Mastery',
      concepts: [
        'UNION vs UNION ALL — when and why, performance implications',
        'De-duplication patterns: ROW_NUMBER() equivalent workaround in SFMC',
        'NULL handling: ISNULL(), COALESCE(), IS NULL / IS NOT NULL',
        'String manipulation: SUBSTRING(), LEN(), CHARINDEX(), REPLACE()',
        'Overwrite vs Append query activity modes — choosing correctly',
      ],
      practice: 'SENIOR SCENARIO: Build a de-duplication query that keeps only the most recent record per email address from a dirty import DE with 200k rows.',
      interviews: [
        'SENIOR Q: A client has 5 separate segment queries all writing to the same target DE. Design the sequencing and overwrite/append strategy.',
        'How would you identify and remove duplicate subscriber records across 3 DEs?',
      ],
    },
  },
  {
    id: 8, week: 4, phase: 'Data',
    topic: 'SQL Advanced — Complex Queries & Automation',
    tech: 'Data & SQL',
    newSession: {
      title: 'Advanced SQL Patterns — Learn It',
      concepts: [
        'Multi-join queries: linking 4+ DEs in a single query',
        'Aggregations: COUNT(), SUM(), MAX(), MIN(), AVG() in SFMC',
        'GROUP BY and HAVING clause usage',
        'Date bucketing patterns for cohort analysis',
        'Query chaining in Automation Studio — output of one feeds next',
      ],
      practice: 'Build a revenue-weighted engagement score query: join subscribers, send logs, open logs, click logs, and purchase DE. Score each subscriber 0-100.',
      resource: 'SFMC SQL best practices + Automation Studio query chaining guide',
      interviews: [
        'How do you use GROUP BY in an SFMC query — give an example?',
        'What is query chaining and when would you use it?',
        'How do you calculate a rolling 30-day open rate per subscriber in SFMC SQL?',
      ],
    },
    reviewSession: {
      title: 'Advanced SQL — First Review',
      concepts: [
        'Recall: Write the engagement scoring query structure',
        'Explain: How does query chaining work in Automation Studio?',
        'Practice: Add a HAVING clause to filter out subscribers with fewer than 3 sends',
        'Quiz: What\'s the difference between WHERE and HAVING?',
      ],
      practice: 'Extend the scoring query: add purchase recency as a factor, bucket scores into Gold/Silver/Bronze tiers, and output only subscribers who changed tier vs last month.',
      interviews: [
        'A complex 5-table join query is running for 30 minutes and hitting timeout. How do you optimise it?',
        'How do you calculate month-over-month growth using only SFMC SQL?',
      ],
    },
    deepSession: {
      title: 'Advanced SQL — Deep Mastery',
      concepts: [
        'Performance patterns: filter early, join less, SELECT only what you need',
        'SFMC Send Log analysis — using _Sent, _Open, _Click system DEs',
        'Building a suppression query: global opt-outs + bounces + manual exclusions',
        'Incremental load pattern: only process records added since last run',
        'SQL for RFM segmentation: Recency, Frequency, Monetary scoring',
      ],
      practice: 'SENIOR SCENARIO: Design and write a full RFM segmentation query across a 2M row transactions DE. Must run in under 15 minutes. Explain your optimisation decisions.',
      interviews: [
        'SENIOR Q: Walk me through building a complete suppression logic query from scratch.',
        'How do you build an incremental query that only processes new records since the last automation run?',
      ],
    },
  },
  {
    id: 9, week: 5, phase: 'Journeys',
    topic: 'Journey Builder — Architecture & Design',
    tech: 'Journey Builder',
    newSession: {
      title: 'Journey Builder Architecture — Learn It',
      concepts: [
        'Entry sources: DE entry, API entry, Salesforce entry, Audience Builder',
        'Contact re-entry rules: not allowed, allowed, allowed on new version',
        'Decision splits: attribute-based routing logic',
        'Engagement splits: open, click, conversion-based branching',
        'Wait activities: duration, specific date, contact attribute date',
      ],
      practice: 'Design a 6-email welcome series journey: API entry, 3-way engagement split after email 2, re-entry not allowed, 7-day waits. Draw the flow then build it.',
      resource: 'Trailhead: Journey Builder Deep Dive + SFMC JB documentation',
      interviews: [
        'What are the 4 types of entry sources in Journey Builder?',
        'Explain the difference between a decision split and an engagement split.',
        'How do you prevent a contact from re-entering a journey they\'re already in?',
      ],
    },
    reviewSession: {
      title: 'Journey Builder — First Review',
      concepts: [
        'Recall: List all 4 entry source types and a use case for each',
        'Explain: What happens to a contact already in v1 of a journey when you publish v2?',
        'Trace: Walk through a contact\'s path through your welcome series design',
        'Quiz: What is the maximum number of versions a journey can have?',
      ],
      practice: 'Redesign the welcome series: add a conversion goal (purchase within 14 days), exit criteria (unsubscribe), and a re-engagement path for non-openers.',
      interviews: [
        'A journey is sending duplicate emails to some contacts. What are the possible causes?',
        'How do you test a journey without sending to real subscribers?',
      ],
    },
    deepSession: {
      title: 'Journey Builder — Deep Mastery',
      concepts: [
        'Custom split activities — build vs configure',
        'Update Contact activity: writing back to contact data during journey',
        'Journey Builder + Salesforce: update lead/contact status mid-journey',
        'Journey analytics: interpreting population reports, exit analytics',
        'Multi-channel journeys: Email + SMS + Push + Ads in one flow',
      ],
      practice: 'SENIOR SCENARIO: Design an abandoned cart journey that: triggers via API, waits 1hr, checks if purchased, sends email, 4hr wait, SMS if no click, syncs back to Salesforce CRM.',
      interviews: [
        'SENIOR Q: A high-volume journey (100k contacts/day) is causing email delays. Diagnose and fix.',
        'How do you design a journey for a global brand with contacts in 15 time zones?',
      ],
    },
  },
  {
    id: 10, week: 5, phase: 'Journeys',
    topic: 'Journey Builder — Advanced Patterns',
    tech: 'Journey Builder',
    newSession: {
      title: 'JB Advanced Patterns — Learn It',
      concepts: [
        'Journey versioning strategy — when to version vs clone',
        'Path optimizer: AI-driven send time and content optimisation',
        'Transactional journeys vs marketing journeys — key differences',
        'Random split activity: A/B/n testing within journeys',
        'Goal and exit criteria configuration — conversion tracking',
      ],
      practice: 'Build a win-back journey: DE entry of 90d+ dormant subscribers, random 50/50 split testing two subject lines, goal = open within 7 days, 3 path maximum.',
      resource: 'SFMC Path Optimizer docs + Journey Builder analytics guide',
      interviews: [
        'When would you use a transactional journey vs a triggered send?',
        'What is the path optimizer and how does it work?',
        'How do you set up A/B testing within Journey Builder?',
      ],
    },
    reviewSession: {
      title: 'JB Advanced — First Review',
      concepts: [
        'Recall: Explain journey versioning rules from memory',
        'Compare: Transactional journey vs triggered send — 3 differences',
        'Explain: How does path optimizer make decisions?',
        'Quiz: What happens to a contact if they hit the goal after exiting the journey?',
      ],
      practice: 'Extend the win-back journey: add a Salesforce activity that logs a "Winback Attempted" task on the contact, and an SMS channel for the highest-engagement group.',
      interviews: [
        'How would you migrate a complex journey from one BU to another?',
        'A path optimizer is consistently choosing one path — how do you investigate if it\'s a data issue?',
      ],
    },
    deepSession: {
      title: 'JB Advanced — Deep Mastery',
      concepts: [
        'Custom journey events: injecting contacts mid-journey via API',
        'FireEvent API call — format, authentication, error handling',
        'Journey Builder limits: max contacts, max activities, rate limits',
        'Journey suppression: suppression lists, opt-out handling mid-journey',
        'Reporting: journey population waterfall analysis interpretation',
      ],
      practice: 'SENIOR SCENARIO: Design a B2B nurture journey for 500k leads. Monthly entry, 12-touch sequence, Salesforce sync at each stage, A/B content testing, full analytics setup.',
      interviews: [
        'SENIOR Q: How do you inject a contact into the middle of an active journey and why would you need to?',
        'Describe your ideal journey governance framework for a large enterprise SFMC implementation.',
      ],
    },
  },
  {
    id: 11, week: 6, phase: 'APIs',
    topic: 'REST API — Authentication & Core Endpoints',
    tech: 'REST API',
    newSession: {
      title: 'SFMC REST API — Learn It',
      concepts: [
        'OAuth 2.0: Client Credentials flow — clientId, clientSecret, grant_type',
        'Token endpoint: POST /v2/token → access_token, expires_in',
        'Base URI structure: {subdomain}.rest.marketingcloudapis.com',
        'Core endpoints: /contacts/v1/contacts, /messaging/v1/messageDefinitionSends',
        'Request headers: Authorization: Bearer {token}, Content-Type: application/json',
      ],
      practice: 'Using Postman: (1) generate a token, (2) GET a list of DEs, (3) POST a new contact, (4) trigger a triggered send. Screenshot each successful response.',
      resource: 'SFMC REST API docs + Postman collection (GitHub: salesforce-marketingcloud)',
      interviews: [
        'Explain the OAuth 2.0 client credentials flow for SFMC.',
        'What is the access token expiry and how do you handle token refresh?',
        'What is the difference between the tenant subdomain and the MID?',
      ],
    },
    reviewSession: {
      title: 'REST API Auth — First Review',
      concepts: [
        'Recall: Write the token request payload from memory (all fields)',
        'Explain: What happens when an access token expires mid-process?',
        'Trace: Walk through the auth flow from clientId to successful API call',
        'Quiz: What HTTP status code do you get with an expired token?',
      ],
      practice: 'Build a JavaScript/Node function that: requests a token, caches it with expiry, automatically refreshes when expired, and wraps any API call.',
      interviews: [
        'How do you securely store SFMC API credentials in a production integration?',
        'A REST API call is returning 401 intermittently. What are the likely causes?',
      ],
    },
    deepSession: {
      title: 'REST API — Deep Mastery',
      concepts: [
        'REST API rate limits: 2000 req/min default — throttling strategy',
        'Bulk import API vs single record upsert — when to use each',
        'Async API operations: job status polling pattern',
        'REST API for Journey Builder: /interaction/v1/events (FireEvent)',
        'Error response structure: reading and handling fault codes',
      ],
      practice: 'SENIOR SCENARIO: Build a Node.js integration that syncs 50k records from an external CRM to SFMC DE using the bulk import API, with retry logic and error logging.',
      interviews: [
        'SENIOR Q: Design a REST API integration architecture that handles 500k daily upserts to SFMC reliably.',
        'How do you handle partial failures in a bulk API import to SFMC?',
      ],
    },
  },
  {
    id: 12, week: 6, phase: 'APIs',
    topic: 'REST API — Advanced Endpoints & Messaging',
    tech: 'REST API',
    newSession: {
      title: 'REST API Advanced — Learn It',
      concepts: [
        'Transactional Messaging API: /messaging/v1/email/messages',
        'Triggered sends vs transactional — API structure differences',
        'Contact upsert: /contacts/v1/contacts with attributes payload',
        'Journey entry via API: /interaction/v1/events',
        'Asset API: creating/updating content blocks and templates programmatically',
      ],
      practice: 'Build a transactional email flow: REST API call triggers a personalised receipt email with dynamic order data injected via the payload. Test with Postman.',
      resource: 'SFMC Transactional Messaging API docs',
      interviews: [
        'What is the Transactional Messaging API and how does it differ from the messageDefinitionSends endpoint?',
        'How do you inject subscriber data into a triggered email via REST API?',
        'What is the FireEvent endpoint and what does it do?',
      ],
    },
    reviewSession: {
      title: 'REST API Advanced — First Review',
      concepts: [
        'Recall: Write the transactional message API payload structure',
        'Explain: How does contact upsert handle existing vs new contacts?',
        'Trace: Walk through a FireEvent call and what happens in Journey Builder',
        'Quiz: How do you specify personalisation attributes in the API payload?',
      ],
      practice: 'Build a complete purchase confirmation flow: external system → REST API → transactional email with order details + fire event to post-purchase journey.',
      interviews: [
        'An API-triggered email is delivering but personalisation is blank. Debug process?',
        'How do you handle idempotency in transactional email API calls?',
      ],
    },
    deepSession: {
      title: 'REST API Advanced — Deep Mastery',
      concepts: [
        'Asset API: programmatic template management at scale',
        'Data Extension API: bulk CRUD operations on DEs',
        'Automation API: triggering automations programmatically',
        'Webhooks from SFMC: using REST callbacks for event notification',
        'Multi-org API patterns: managing multiple BUs with one integration',
      ],
      practice: 'SENIOR SCENARIO: Design an API-first SFMC integration architecture that handles: contact sync, triggered sends, journey entry, preference updates, and unsubscribes — all from one integration platform.',
      interviews: [
        'SENIOR Q: A client wants all 20 of their Salesforce orgs connected to one SFMC instance. Design the API architecture.',
        'How do you monitor and alert on SFMC API failures in a production integration?',
      ],
    },
  },
  {
    id: 13, week: 7, phase: 'APIs',
    topic: 'SOAP API & Triggered Sends',
    tech: 'SOAP API',
    newSession: {
      title: 'SOAP API — Learn It',
      concepts: [
        'SOAP API endpoint: {subdomain}.soap.marketingcloudapis.com/Service.asmx',
        'Authentication: UsernameToken or OAuth header',
        'Core objects: Subscriber, SendDefinition, TriggeredSend, DataExtension',
        'TriggeredSend via SOAP: Create object with Subscribers array',
        'When SOAP over REST: legacy endpoints, complex batch operations',
      ],
      practice: 'Using SoapUI: (1) authenticate, (2) retrieve a subscriber by email, (3) fire a triggered send to 3 test addresses, (4) check delivery status.',
      resource: 'SFMC SOAP API WSDL + SoapUI setup guide',
      interviews: [
        'When would you use the SOAP API over the REST API?',
        'How do you fire a triggered send using the SOAP API?',
        'What is the WSDL and why is it important?',
      ],
    },
    reviewSession: {
      title: 'SOAP API — First Review',
      concepts: [
        'Recall: What are the 4 main SOAP API objects you\'d use day-to-day?',
        'Compare: SOAP TriggeredSend vs REST Transactional Messaging — pros/cons',
        'Explain: How does SOAP authentication differ from REST OAuth?',
        'Quiz: What envelope structure does a SOAP request require?',
      ],
      practice: 'Write the SSJS WSProxy equivalent of the SOAP TriggeredSend you built in SoapUI. Understand how WSProxy wraps SOAP calls.',
      interviews: [
        'A SOAP TriggeredSend is not delivering emails. What are 5 things you check?',
        'How do you batch multiple subscriber sends in a single SOAP API call?',
      ],
    },
    deepSession: {
      title: 'SOAP API — Deep Mastery',
      concepts: [
        'Asynchronous SOAP calls and checking RequestID status',
        'SOAP for subscriber management: unsubscribe, status updates at scale',
        'Creating and managing DEs via SOAP API',
        'SOAP vs REST feature parity gaps in 2024 — what\'s SOAP-only',
        'Migrating SOAP integrations to REST — strategy and gotchas',
      ],
      practice: 'SENIOR SCENARIO: A legacy system only supports SOAP. Design a middleware layer that translates modern REST-style requests into SOAP calls for SFMC, with proper error handling.',
      interviews: [
        'SENIOR Q: A client has a 5-year-old SOAP integration sending 1M triggered emails/month. It\'s becoming unreliable. How do you assess and modernise it?',
        'What SOAP endpoints have no REST equivalent and how do you handle those in modern integrations?',
      ],
    },
  },
  {
    id: 14, week: 7, phase: 'Content',
    topic: 'Email Studio — Dynamic Content & Personalisation',
    tech: 'Email Studio',
    newSession: {
      title: 'Dynamic Content & Personalisation — Learn It',
      concepts: [
        'Dynamic content blocks: rule-based content swapping in Content Builder',
        'Personalisation strings: %%FirstName%%, %%emailaddr%%',
        'AMPscript vs dynamic content blocks — when each is appropriate',
        'Profile attributes vs DE attributes in personalisation',
        'Preview and test: send preview, test send, subscriber preview',
      ],
      practice: 'Build an email template with: (1) 3-rule dynamic content block (gender-based hero), (2) AMPscript personalised subject line, (3) conditional footer based on country.',
      resource: 'Content Builder documentation + Dynamic Content guide',
      interviews: [
        'What is the difference between a personalisation string and AMPscript?',
        'How do dynamic content rules get evaluated — what order?',
        'How would you personalise a subject line in SFMC?',
      ],
    },
    reviewSession: {
      title: 'Dynamic Content — First Review',
      concepts: [
        'Recall: How many rules can a dynamic content block have?',
        'Explain: Rule evaluation order in dynamic content blocks',
        'Compare: Dynamic content blocks vs AMPscript IF/THEN — when each?',
        'Quiz: How do you preview an email as a specific subscriber?',
      ],
      practice: 'Extend your email template: add a product recommendation block using AMPscript (Lookup from DE), and a countdown timer using AMPscript date functions.',
      interviews: [
        'A dynamic content block is showing the default for all subscribers. Debug it.',
        'How would you implement 1:1 personalisation for 1M subscribers in an email?',
      ],
    },
    deepSession: {
      title: 'Dynamic Content — Deep Mastery',
      concepts: [
        'TreatAsContent() for meta-personalisation — content from a DE',
        'Nested dynamic content: blocks within blocks pattern',
        'Einstein Content Selection vs manual dynamic content',
        'Personalisation at send time vs build time — critical distinction',
        'A/B testing subject lines, from names, content in Email Studio',
      ],
      practice: 'SENIOR SCENARIO: Design a single email template that serves 12 different segments with different hero images, copy, and CTAs — without creating 12 separate emails.',
      interviews: [
        'SENIOR Q: What are the performance implications of heavy AMPscript personalisation in a 2M send? How do you optimise?',
        'A client wants every email to show a live product price from their website. How do you architect this?',
      ],
    },
  },
  {
    id: 15, week: 8, phase: 'Content',
    topic: 'CloudPages & SmartCapture',
    tech: 'CloudPages',
    newSession: {
      title: 'CloudPages — Learn It',
      concepts: [
        'CloudPage types: Landing Page, Microsite, Code Resource, CloudPage App',
        'SmartCapture: drag-drop form builder → DE mapping',
        'URL parameters: passing data via query string to CloudPage',
        'AMPscript in CloudPages: reading params, writing to DE',
        'CloudPage publishing: preview URL vs live URL vs collection',
      ],
      practice: 'Build a preference centre CloudPage: subscriber lands via email link with encrypted key, sees their current preferences, updates them, and data writes back to DE.',
      resource: 'SFMC CloudPages documentation + SmartCapture guide',
      interviews: [
        'What types of CloudPages exist and when would you use each?',
        'How do you pass subscriber data to a CloudPage from an email link?',
        'How does SmartCapture map form fields to a DE?',
      ],
    },
    reviewSession: {
      title: 'CloudPages — First Review',
      concepts: [
        'Recall: List all CloudPage types and a use case for each',
        'Trace: Walk through the preference centre flow — from email click to DE update',
        'Explain: How do you read a URL query parameter in AMPscript?',
        'Quiz: What\'s the difference between the preview URL and the live URL?',
      ],
      practice: 'Extend the preference centre: add a double opt-in confirmation step, store the timestamp of preference change, and trigger a confirmation email after submission.',
      interviews: [
        'A CloudPage is accessible without the expected URL parameters — how do you secure it?',
        'How would you build a multi-step registration flow using CloudPages?',
      ],
    },
    deepSession: {
      title: 'CloudPages — Deep Mastery',
      concepts: [
        'CloudPage as API endpoint: accepting POST requests from external systems',
        'SSJS in CloudPages vs AMPscript — choosing the right tool',
        'CloudPage performance: server-side rendering, caching considerations',
        'Code Resource CloudPage: serving JSON, XML, CSS, JS dynamically',
        'Security patterns: token validation, rate limiting, input sanitisation',
      ],
      practice: 'SENIOR SCENARIO: Build a CloudPage API endpoint that accepts webhook POSTs from a third-party system, validates a shared secret, writes to a DE, and fires a Journey event.',
      interviews: [
        'SENIOR Q: Design a complete web preference centre with CloudPages that supports 5M subscribers and GDPR compliance.',
        'How do you protect a CloudPage from being scraped or abused?',
      ],
    },
  },
  {
    id: 16, week: 8, phase: 'Automation',
    topic: 'Automation Studio — Mastery',
    tech: 'Automation Studio',
    newSession: {
      title: 'Automation Studio — Learn It',
      concepts: [
        'Trigger types: Scheduled, File Drop, API, Automation Chain',
        'Activity types: Query, Import, Export, Filter, Send, Script',
        'Step sequencing: activities in sequence vs parallel',
        'Error notifications: configure who gets alerted and when',
        'Automation monitoring: run history, error logs, activity status',
      ],
      practice: 'Build a daily data automation: (1) import FTP file, (2) SQL query to segment, (3) send to segment, (4) export results report. Set up error email notification.',
      resource: 'SFMC Automation Studio documentation',
      interviews: [
        'What is the difference between a scheduled and file-drop triggered automation?',
        'How do you chain automations together?',
        'What do you check first when an automation fails silently?',
      ],
    },
    reviewSession: {
      title: 'Automation Studio — First Review',
      concepts: [
        'Recall: What are the 6 activity types in Automation Studio?',
        'Explain: How does the file drop trigger work — what exactly triggers it?',
        'Design: Sketch an automation that runs hourly during business hours only',
        'Quiz: Can two activities in the same step run in parallel?',
      ],
      practice: 'Redesign the data automation: add a SSJS script activity that validates the import file row count before proceeding, aborts if count is wrong.',
      interviews: [
        'An automation runs daily and sometimes duplicates data. What causes this and how do you fix it?',
        'How do you build an automation that only runs if new data is available?',
      ],
    },
    deepSession: {
      title: 'Automation Studio — Deep Mastery',
      concepts: [
        'Automation Studio vs Journey Builder — choosing the right tool',
        'High-volume automation design: optimising for speed and reliability',
        'SFMC automation API: triggering automations programmatically',
        'Incremental processing pattern: tracking last-run timestamp',
        'Enterprise automation governance: naming conventions, versioning, docs',
      ],
      practice: 'SENIOR SCENARIO: A daily automation is taking 4 hours to run and missing its send window. Profile each step, identify bottlenecks, and redesign for under 45 minutes.',
      interviews: [
        'SENIOR Q: Design an enterprise automation framework for 15 business units sharing one SFMC instance.',
        'How do you ensure data integrity when multiple automations write to the same DE concurrently?',
      ],
    },
  },
  {
    id: 17, week: 9, phase: 'Einstein',
    topic: 'Einstein — Engagement Scoring & Send Time',
    tech: 'Einstein',
    newSession: {
      title: 'Einstein AI Features — Learn It',
      concepts: [
        'Einstein Engagement Scoring: 0-10 score per subscriber per channel',
        'Score tiers: Loyalists, Actives, Dormants, Winback, Never Active',
        'What data Einstein uses: send, open, click history (90-180 days)',
        'Einstein Send Time Optimization (STO): per-contact optimal send hour',
        'STO setup: enable in Business Unit settings, apply in send flow',
      ],
      practice: 'In your SFMC instance: (1) view engagement scores for a DE, (2) build a segment of Dormant subscribers, (3) schedule a test send with STO enabled. Note what you observe.',
      resource: 'Trailhead: Marketing AI Specialist + Einstein documentation',
      interviews: [
        'How does Einstein Engagement Scoring calculate a subscriber\'s score?',
        'What is STO and how does it affect your scheduled send time?',
        'What happens to a subscriber\'s score if they haven\'t received emails in 6 months?',
      ],
    },
    reviewSession: {
      title: 'Einstein AI — First Review',
      concepts: [
        'Recall: What are the 5 Einstein engagement score tiers?',
        'Explain: How does STO change the delivery window of your scheduled send?',
        'Quiz: How many days of send history does Einstein need to calculate STO?',
        'Apply: Design a segment strategy using engagement score tiers',
      ],
      practice: 'Build a re-engagement campaign strategy: different content and cadence for each Einstein tier. Define the rules for moving subscribers between tiers.',
      interviews: [
        'A client says Einstein STO is delaying all their sends — how do you diagnose this?',
        'How would you prove to a client that Einstein STO is improving results?',
      ],
    },
    deepSession: {
      title: 'Einstein AI — Deep Mastery',
      concepts: [
        'Einstein Content Selection: dynamic creative optimisation',
        'Einstein Recommendations: product/content recommendations setup',
        'Einstein Copy Insights: subject line performance analysis',
        'Predictive audiences: Einstein-powered look-alike modelling',
        'Einstein data requirements: what you need to get value from each feature',
      ],
      practice: 'SENIOR SCENARIO: A client wants to use all available Einstein features. Assess their current data maturity (90d history, 10k+ subscribers, engagement data) and create an Einstein activation roadmap.',
      interviews: [
        'SENIOR Q: A client with 500k subscribers has poor engagement. Design a 6-month Einstein-powered re-engagement strategy.',
        'What are the limitations of Einstein features and when do they NOT work well?',
      ],
    },
  },
  {
    id: 18, week: 9, phase: 'Integration',
    topic: 'Marketing Cloud Connect — SFMC + Salesforce CRM',
    tech: 'MC Connect',
    newSession: {
      title: 'MC Connect — Learn It',
      concepts: [
        'MC Connect: the bridge between SFMC and Salesforce CRM',
        'Synchronised DEs: Leads, Contacts, Accounts, Campaigns auto-synced',
        'Sync configuration: field mapping, frequency, filter criteria',
        'Triggered sends from Salesforce: Process Builder/Flow → SFMC',
        'Journey Builder Salesforce activities: Update Lead/Contact, Create Task',
      ],
      practice: 'Configure MC Connect: (1) map 5 custom fields from Contact to SFMC, (2) set sync to every 15 minutes, (3) build a Journey that updates Salesforce when an email is opened.',
      resource: 'Trailhead: Marketing Cloud Connect + MC Connect documentation',
      interviews: [
        'How does MC Connect sync data between Salesforce and SFMC?',
        'What objects are synchronised by default in MC Connect?',
        'How do you trigger an SFMC email from a Salesforce Process Builder?',
      ],
    },
    reviewSession: {
      title: 'MC Connect — First Review',
      concepts: [
        'Recall: What are the 4 default synced objects in MC Connect?',
        'Explain: How often does MC Connect sync and how do you change frequency?',
        'Trace: Walk through a Salesforce-triggered send from trigger to delivery',
        'Quiz: How do you sync a custom Salesforce object to SFMC?',
      ],
      practice: 'Design a lead nurture system: Salesforce Campaign → MC Connect → SFMC Journey → engagement data back to Salesforce Lead status.',
      interviews: [
        'MC Connect sync is 3 hours behind. What are the causes and fixes?',
        'How do you handle a Salesforce object with 50 custom fields in MC Connect?',
      ],
    },
    deepSession: {
      title: 'MC Connect — Deep Mastery',
      concepts: [
        'Synchronized Contact builder: linking SFMC contact to Salesforce record',
        'MC Connect vs direct API: performance and reliability comparison',
        'Multi-org scenarios: multiple Salesforce orgs → one SFMC instance',
        'MC Connect limitations: sync lag, field type restrictions, relationship limits',
        'Troubleshooting MC Connect: sync logs, field validation errors',
      ],
      practice: 'SENIOR SCENARIO: A client has 3 Salesforce orgs (NA, EMEA, APAC) feeding one SFMC instance. Design the MC Connect architecture including data segregation and BU strategy.',
      interviews: [
        'SENIOR Q: What are the hardest problems you\'ve faced with MC Connect at enterprise scale?',
        'How do you architect SFMC for a company that\'s migrating from Salesforce Classic to Lightning?',
      ],
    },
  },
  {
    id: 19, week: 10, phase: 'Governance',
    topic: 'Business Units, Security & Governance',
    tech: 'Security',
    newSession: {
      title: 'BU Architecture & Security — Learn It',
      concepts: [
        'Business Unit hierarchy: Parent BU → Child BUs → User access',
        'Role-based access control (RBAC): built-in roles and custom roles',
        'User permissions: API user vs marketing user vs admin',
        'Shared content, shared DEs: what can be shared across BUs',
        'Sender Authentication Package (SAP): domain, IP, reply mail management',
      ],
      practice: 'Design a BU architecture for a global brand with 5 regional teams, shared global suppression list, region-specific DEs, and locked global template.',
      resource: 'SFMC Security documentation + SAP guide',
      interviews: [
        'How do you structure Business Units for a multi-brand company?',
        'What is SAP and what does it include?',
        'How does RBAC work in SFMC — what are the key roles?',
      ],
    },
    reviewSession: {
      title: 'BU & Security — First Review',
      concepts: [
        'Recall: List 5 built-in SFMC roles and their permission levels',
        'Explain: How do shared DEs work across Business Units?',
        'Design: BU structure for 3 brands, 2 regions each',
        'Quiz: Can a child BU see the parent BU\'s subscriber data?',
      ],
      practice: 'Create a complete user access matrix for your global brand: define roles for Admin, Developer, Content Creator, Analyst, Read-Only. Map to SFMC permissions.',
      interviews: [
        'A data breach occurred in a child BU. How does BU isolation limit the damage?',
        'How do you audit who has API access in SFMC?',
      ],
    },
    deepSession: {
      title: 'BU & Security — Deep Mastery',
      concepts: [
        'IP warming strategy: new SAP → inbox reputation building plan',
        'Dedicated vs shared IPs: when to recommend which',
        'DKIM, SPF, DMARC in SFMC context — what SAP sets up',
        'Compliance: CAN-SPAM requirements, GDPR data subject rights in SFMC',
        'Package Manager: managing installed packages and API credentials',
      ],
      practice: 'SENIOR SCENARIO: A client is moving from a shared IP to dedicated IPs. Design their 8-week IP warming plan with volume ramps, engagement monitoring, and fallback criteria.',
      interviews: [
        'SENIOR Q: Design the governance framework for a 20-BU SFMC enterprise instance.',
        'How do you handle a GDPR right-to-erasure request across multiple BUs in SFMC?',
      ],
    },
  },
  {
    id: 20, week: 10, phase: 'Governance',
    topic: 'GDPR, Compliance & Deliverability',
    tech: 'Compliance',
    newSession: {
      title: 'Compliance & Deliverability — Learn It',
      concepts: [
        'CAN-SPAM requirements: physical address, unsubscribe within 10 days, no deceptive headers',
        'GDPR: consent basis, right to erasure, data portability, DPA requirements',
        'SFMC all-subscribers list: global unsubscribe mechanism',
        'Deliverability factors: sender reputation, content, list health, infrastructure',
        'Bounce types: hard bounce (permanent) vs soft bounce (temporary) handling',
      ],
      practice: 'Audit a fictional email programme for CAN-SPAM and GDPR compliance. Identify 8 violations and write the fix for each.',
      resource: 'SFMC Compliance documentation + Litmus deliverability guide',
      interviews: [
        'What are the 3 key CAN-SPAM requirements for commercial email?',
        'How does GDPR affect your email sending in SFMC?',
        'What is a hard bounce and how should SFMC handle it automatically?',
      ],
    },
    reviewSession: {
      title: 'Compliance — First Review',
      concepts: [
        'Recall: List 5 GDPR rights that affect email marketing',
        'Explain: How does SFMC handle unsubscribes and bounces automatically?',
        'Trace: Walk through a GDPR erasure request process in SFMC',
        'Quiz: How many days does CAN-SPAM give to honour an opt-out?',
      ],
      practice: 'Design a consent management system in SFMC: capture consent at signup, store consent timestamp and source, honour preference changes, and produce a GDPR audit report.',
      interviews: [
        'A subscriber submits a GDPR erasure request. Walk me through the process in SFMC.',
        'Your client\'s sender reputation has dropped and emails are hitting spam. What\'s your 30-day recovery plan?',
      ],
    },
    deepSession: {
      title: 'Compliance — Deep Mastery',
      concepts: [
        'Double opt-in implementation in SFMC: flow and DE design',
        'Suppression list management: multiple suppression sources in one automation',
        'Inbox placement monitoring: tools and SFMC-native signals',
        'List hygiene automation: automatic bounce management, engagement pruning',
        'CASL (Canada), PECR (UK), PDPA (Thailand) — international compliance overview',
      ],
      practice: 'SENIOR SCENARIO: Build a complete list hygiene automation that runs weekly: removes hard bounces, suppresses 18-month non-openers, flags unconfirmed opt-ins, and generates a compliance report.',
      interviews: [
        'SENIOR Q: A client wants to send to a purchased list in SFMC. Walk them through why this is problematic and what you recommend instead.',
        'Design a global consent management architecture for a brand operating in EU, US, Canada, and Australia.',
      ],
    },
  },
  {
    id: 21, week: 11, phase: 'Advanced',
    topic: 'Connected Apps, OAuth & Package Manager',
    tech: 'Integration',
    newSession: {
      title: 'Connected Apps & OAuth — Learn It',
      concepts: [
        'Installed Package in SFMC: creating API credentials',
        'Package components: API Integration, Script Activity, Journey Builder Activity',
        'OAuth scopes: choosing minimum required permissions',
        'Server-to-server vs Web App OAuth flows',
        'Managing multiple installed packages for different integrations',
      ],
      practice: 'Create an Installed Package with API Integration, configure correct scopes for: (1) DE read/write, (2) email send, (3) Journey entry. Test each scope with Postman.',
      resource: 'SFMC Package Manager documentation',
      interviews: [
        'What is an Installed Package and how do you create one?',
        'What OAuth scopes would you need to: read a DE, fire a triggered send, inject into a Journey?',
        'What is the difference between Server-to-Server and Web App OAuth in SFMC?',
      ],
    },
    reviewSession: {
      title: 'Connected Apps — First Review',
      concepts: [
        'Recall: Write the OAuth token request parameters from memory',
        'Explain: Why do you use minimum required scopes?',
        'Design: What installed packages would you create for a CRM integration vs a web app?',
        'Quiz: How do you rotate credentials for an installed package without downtime?',
      ],
      practice: 'Design a credential rotation strategy: document all installed packages, their scopes, which systems use them, and the steps to rotate without breaking integrations.',
      interviews: [
        'An API integration broke overnight. The only change was a package credential rotation. What happened and how do you fix it?',
        'How do you limit an installed package so a third-party vendor can only send emails, nothing else?',
      ],
    },
    deepSession: {
      title: 'Connected Apps — Deep Mastery',
      concepts: [
        'Custom Journey Builder activities: build a custom activity via App Center',
        'Custom split activities: making Journey Builder extensible',
        'SFMC App Center: registering and managing apps',
        'Security review for installed packages: what to audit regularly',
        'Multi-environment strategy: Dev/QA/Prod installed packages',
      ],
      practice: 'SENIOR SCENARIO: Design a custom Journey Builder activity that calls an external loyalty API, waits for a response, and routes contacts based on loyalty tier.',
      interviews: [
        'SENIOR Q: A third-party vendor wants API access to your client\'s SFMC. How do you provision, restrict, and monitor this?',
        'How do you build a custom Journey Builder activity from scratch?',
      ],
    },
  },
  {
    id: 22, week: 11, phase: 'Advanced',
    topic: 'Data Cloud & CDP Integration',
    tech: 'Data Cloud',
    newSession: {
      title: 'Data Cloud Basics — Learn It',
      concepts: [
        'Data Cloud: Salesforce\'s CDP — unified customer profile across all data sources',
        'Data Cloud → SFMC integration: segments, identity resolution',
        'Unified Individual vs Contact Point — the Data Cloud data model',
        'Data Cloud segments flowing into SFMC journeys',
        'Real-time data stream ingestion vs batch ingestion',
      ],
      practice: 'Map the data flow: external data source → Data Cloud ingestion → unified profile → segment → SFMC Journey → engagement data back to Data Cloud.',
      resource: 'Trailhead: Data Cloud Basics + Salesforce Data Cloud documentation',
      interviews: [
        'What is Data Cloud and how does it differ from a standard SFMC DE?',
        'How do Data Cloud segments connect to Journey Builder?',
        'What is identity resolution in Data Cloud?',
      ],
    },
    reviewSession: {
      title: 'Data Cloud — First Review',
      concepts: [
        'Recall: Explain the Data Cloud → SFMC data flow in 4 steps',
        'Explain: What is a Unified Individual and why does it matter?',
        'Compare: Data Cloud segmentation vs SFMC SQL segmentation',
        'Quiz: What is the typical latency for a real-time data stream in Data Cloud?',
      ],
      practice: 'Design a use case: a customer browses product X on the website → Data Cloud captures the event → segment updates → SFMC sends a personalised email within 1 hour.',
      interviews: [
        'A client says Data Cloud is too expensive. What\'s your ROI argument?',
        'How does Data Cloud handle conflicting customer records from 5 different source systems?',
      ],
    },
    deepSession: {
      title: 'Data Cloud — Deep Mastery',
      concepts: [
        'Data Cloud activation: publishing segments to SFMC, Ads, custom endpoints',
        'Data Model Objects (DMOs): standard vs custom',
        'Calculated Insights: computed metrics stored on the unified profile',
        'Data Cloud + Einstein: AI features powered by unified data',
        'Data Cloud governance: consent data, privacy policies, data retention',
      ],
      practice: 'SENIOR SCENARIO: A retail client wants a "next best product" recommendation engine. Design the full stack: data ingestion → Data Cloud unification → Calculated Insights → SFMC personalised email.',
      interviews: [
        'SENIOR Q: When would you recommend Data Cloud vs a traditional SFMC DE-based approach?',
        'How do you architect a real-time abandonment trigger using Data Cloud and SFMC?',
      ],
    },
  },
  {
    id: 23, week: 12, phase: 'Advanced',
    topic: 'System Architecture & Senior Design Patterns',
    tech: 'Architecture',
    newSession: {
      title: 'SFMC System Architecture — Learn It',
      concepts: [
        'Enterprise SFMC architecture: data layer, process layer, channel layer',
        'Hub-and-spoke vs federated BU model — when each fits',
        'Integration patterns: event-driven, batch, real-time API',
        'Data warehouse → SFMC: ETL design patterns',
        'Scalability limits: send volumes, DE sizes, API rate limits',
      ],
      practice: 'Draw the full architecture diagram for a global e-commerce brand: 3 regions, 2 brands, Salesforce CRM, external data warehouse, SFMC. Include all integration points.',
      resource: 'SFMC Architect certification guide + Salesforce Architecture diagrams',
      interviews: [
        'Explain the hub-and-spoke BU model and when you\'d recommend it.',
        'How do you design SFMC to handle Black Friday volumes — 10x normal send rate?',
        'What are the key scalability limits in SFMC that a senior developer must know?',
      ],
    },
    reviewSession: {
      title: 'Architecture — First Review',
      concepts: [
        'Recall: List 5 SFMC architectural constraints that affect design',
        'Explain: Event-driven integration vs batch — trade-offs',
        'Design: A startup needs SFMC fast — minimal viable architecture',
        'Compare: 2 different enterprise architectures you\'d propose for different clients',
      ],
      practice: 'Architecture review: given a broken SFMC implementation (slow automations, DE bloat, no BU structure), write a remediation plan with priorities.',
      interviews: [
        'A client is migrating from a competitor ESP to SFMC. Design the migration architecture.',
        'How do you design SFMC to be resilient to Salesforce CRM downtime?',
      ],
    },
    deepSession: {
      title: 'Architecture — Deep Mastery',
      concepts: [
        'SFMC as part of the broader MarTech stack: CDP, analytics, attribution',
        'Technical debt in SFMC: identifying and addressing legacy patterns',
        'Architecture documentation: what a senior dev produces and maintains',
        'Estimating SFMC implementations: sizing, scoping, risk identification',
        'Making architecture decisions with imperfect information — senior judgement',
      ],
      practice: 'SENIOR SCENARIO: Present a 30-minute SFMC architecture proposal for a new enterprise client. Cover: data model, BU structure, integration points, governance, and delivery roadmap.',
      interviews: [
        'SENIOR Q: You\'re brought in to rescue a failing SFMC implementation with $2M invested and poor results. What\'s your assessment process and 90-day plan?',
        'How do you communicate complex SFMC architecture decisions to non-technical stakeholders?',
      ],
    },
  },
  {
    id: 24, week: 12, phase: 'Interview Prep',
    topic: 'Senior Developer Interview — Technical Deep Dive',
    tech: 'Interview',
    newSession: {
      title: 'Technical Interview Mastery — Learn It',
      concepts: [
        'Senior SFMC roles: what they actually look for beyond tool knowledge',
        'STAR method for technical scenarios: S-T-A-R structured answers',
        'Common senior interview patterns: "Design a...", "Debug this...", "Architect..."',
        'Technical whiteboard: drawing SFMC flows under pressure',
        'Questions to ask the interviewer: showing senior-level curiosity',
      ],
      practice: 'Record yourself answering 5 questions out loud. Watch it back. Assess: clarity, structure, confidence, technical accuracy. Redo the weak ones.',
      resource: 'Senior SFMC job descriptions (LinkedIn) + Glassdoor interview reports',
      interviews: [
        'Tell me about the most complex SFMC implementation you\'ve led.',
        'How do you stay current with SFMC releases and new features?',
        'What\'s the biggest mistake you\'ve made in SFMC and what did you learn?',
      ],
    },
    reviewSession: {
      title: 'Interview Practice — Review',
      concepts: [
        'Practice: Answer 3 technical questions with STAR structure',
        'Whiteboard: Draw a complete SFMC architecture from a brief',
        'Debug: Given broken AMPscript, find and fix all errors',
        'Design: "Design a real-time cart abandonment system in SFMC"',
      ],
      practice: 'Full mock interview: 45 minutes, mix of technical and behavioural questions. Have a friend or colleague interview you if possible. Record and review.',
      interviews: [
        'Walk me through your approach to a new SFMC client onboarding.',
        'How do you handle a situation where a client wants something that\'s technically impossible in SFMC?',
        'Describe your experience with SFMC performance optimisation at scale.',
      ],
    },
    deepSession: {
      title: 'Interview — Final Mastery',
      concepts: [
        'Salary negotiation for senior SFMC roles: know your market value',
        'Portfolio: what to show from your SFMC work (sanitised examples)',
        'Certification strategy: which certs matter most for senior roles',
        'Career path: from Senior Dev → Architect → Consultant',
        'Building your SFMC personal brand: community, blog, speaking',
      ],
      practice: 'Final prep: Write your 3 strongest SFMC stories (situation, what you built, impact). These are your anchor stories for any interview. Polish them until they\'re perfect.',
      interviews: [
        'FINAL Q: You\'re now the hiring manager. What question would you ask a candidate for your own role — and what\'s the perfect answer?',
        'Where do you see SFMC evolving in the next 3 years and how are you preparing?',
      ],
    },
  },
];

// Generate the full 6-month Mon-Fri schedule with 1-4-7 rule
// Returns array of {dayIndex, date (Mon-Fri), topicId, sessionType: 'new'|'review'|'deep'}
export function generateSchedule(startDate) {
  const schedule = [];
  const pendingReviews = []; // {topicId, reviewType: 'review'|'deep', dueDay}

  let dayIndex = 0; // calendar day index from startDate (including weekends)
  let workDay = 0;  // Mon-Fri day count

  const maxWorkDays = 130; // ~6 months
  let topicIndex = 0;

  while (workDay < maxWorkDays) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayIndex);
    const dow = date.getDay(); // 0=Sun, 6=Sat

    if (dow === 0 || dow === 6) { dayIndex++; continue; } // skip weekends

    const slot = { workDay, dayIndex, date: date.toISOString().split('T')[0], sessions: [] };

    // Check for due reviews (review on day 4, deep on day 7 from original workDay)
    const dueReviews = pendingReviews.filter(r => r.dueWorkDay <= workDay);
    dueReviews.sort((a, b) => a.dueWorkDay - b.dueWorkDay);

    if (dueReviews.length > 0) {
      // Take the most overdue review
      const review = dueReviews[0];
      pendingReviews.splice(pendingReviews.indexOf(review), 1);
      slot.sessions.push({ topicId: review.topicId, sessionType: review.sessionType });

      // Also add a new topic (40 min new + 20 min review in the 1hr)
      if (topicIndex < CURRICULUM.length) {
        const topic = CURRICULUM[topicIndex % CURRICULUM.length];
        slot.sessions.push({ topicId: topic.id, sessionType: 'new' });
        // Schedule its review on workDay+3 (4th day from now = 3 days later)
        pendingReviews.push({ topicId: topic.id, sessionType: 'review', dueWorkDay: workDay + 3 });
        // Schedule deep review on workDay+6 (7th day from now = 6 days later)
        pendingReviews.push({ topicId: topic.id, sessionType: 'deep', dueWorkDay: workDay + 6 });
        topicIndex++;
      }
    } else {
      // New topic only
      if (topicIndex < CURRICULUM.length) {
        const topic = CURRICULUM[topicIndex % CURRICULUM.length];
        slot.sessions.push({ topicId: topic.id, sessionType: 'new' });
        pendingReviews.push({ topicId: topic.id, sessionType: 'review', dueWorkDay: workDay + 3 });
        pendingReviews.push({ topicId: topic.id, sessionType: 'deep', dueWorkDay: workDay + 6 });
        topicIndex++;
      } else {
        // All topics covered — do extra deep reviews of oldest topics
        const oldTopic = CURRICULUM[workDay % CURRICULUM.length];
        slot.sessions.push({ topicId: oldTopic.id, sessionType: 'deep' });
      }
    }

    schedule.push(slot);
    workDay++;
    dayIndex++;
  }

  return schedule;
}

export function getTopic(id) {
  return CURRICULUM.find(t => t.id === id) || CURRICULUM[0];
}

export function getSessionContent(topic, sessionType) {
  if (sessionType === 'new') return topic.newSession;
  if (sessionType === 'review') return topic.reviewSession;
  return topic.deepSession;
}
