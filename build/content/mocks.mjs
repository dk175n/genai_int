import { code, table, flow, diagram, callout } from "../render.mjs";

export const MOCKS = [];
const M = (o) => MOCKS.push({ kind: "mock", group: "mocks", ...o });

const stdRubric = { headers: ["Dimension", "1–2 (weak)", "3 (solid)", "4–5 (strong)"], rows: [
  ["Correctness", "Wrong/vague core concepts", "Mostly correct", "Precise, with nuance"],
  ["Tradeoffs", "None mentioned", "Names some", "Leads with them, justifies"],
  ["Production thinking", "Demo-level", "Mentions eval/cost/safety", "Designs for them by default"],
  ["Communication", "Rambles / no structure", "Structured", "Crisp, time-boxed, checks in"],
  ["Depth on follow-ups", "Folds under probing", "Holds for one layer", "Holds 2–3 layers deep"],
]};

// Weekly plan (overview of how to run mocks)
MOCKS.push({ kind: "mock", group: "mocks", num: "01", title: "Weekly Mock Interview Plan", path: "mocks/weekly-plan.html",
  kw: "weekly mock interview plan schedule practice rounds debrief",
  data: {
    eyebrow: "Mock Interviews", title: "Weekly Mock Interview Plan", pills: [{ t: "Plan", cls: "blue" }],
    lead: "Mocks are where preparation becomes performance. Run one mock per round-type per week in the final phase, always recorded, always debriefed against a rubric. This page is the schedule; the others are the scripts.",
    intro: ["Do mocks out loud, recorded (audio is enough). The recording is the point — you'll hear the rambling, the missing tradeoffs, the unsupported claims. Debrief each one against the rubric and turn every weakness into a study task or a new <a href='../pages/llm-evaluation.html'>golden-set</a>-style note."],
    timing: { headers: ["Week", "Mocks to run", "Focus"], rows: [
      ["9", "<a href='rag-mock.html'>RAG mock</a> + <a href='python-coding-mock.html'>Python coding mock</a>", "Core technical fluency"],
      ["10", "<a href='agent-mock.html'>Agent mock</a> + <a href='system-design-mock.html'>System design mock</a>", "Depth + design narrative"],
      ["11", "<a href='behavioral-mock.html'>Behavioral mock</a> + repeat your weakest round", "Story + close gaps"],
      ["12", "Full loop simulation (all rounds in a day)", "Stamina + consistency"],
    ] },
    script: ["For each mock: 45 min (5 clarify, 30 core, 10 follow-ups/debrief). Use a peer or self-interview from the question list. Record. Score with the rubric. Write 3 concrete fixes. Re-run the weakest round the next week."],
    strong: ["You finish with energy and structure", "You named tradeoffs unprompted", "You said 'I don't know, here's how I'd find out' when stuck — cleanly", "Your project stories had metrics"],
    weak: ["Ran out of time on the happy path", "No eval/cost/safety mentioned", "Folded on the second follow-up", "Listed tools, not reasoning"],
    rubric: stdRubric,
    debrief: ["Recorded it", "Scored every rubric dimension", "Wrote 3 concrete fixes", "Logged any new concept gap", "Scheduled a re-run of the weakest area"],
  } });

M({ num: "02", title: "RAG Mock Interview", path: "mocks/rag-mock.html",
  kw: "rag mock interview chunking retrieval evaluation hallucination questions rubric",
  data: { eyebrow: "Mock Interviews", title: "Mock · RAG Deep-Dive Round", pills: [{ t: "Technical deep-dive", cls: "blue" }],
    lead: "A 45-minute simulated RAG deep-dive. The interviewer opens broad, then drills into retrieval quality, chunking, hallucination and evaluation — the four places RAG candidates crack.",
    intro: ["Tests whether you've <em>built and debugged</em> RAG, not just read about it. Strong candidates separate retrieval from generation, cite metrics, and lead with tradeoffs. Pair with <a href='../pages/rag-mastery.html'>RAG Mastery</a>."],
    script: ["“Tell me about a RAG system you built.” → “Walk me through the pipeline.” → “Your retrieval returns junk — debug it.” → “How would you know it's good?” → “When would you not use RAG?” Probe each answer twice; if they stay at demo-level, push to production concerns."],
    timing: { headers: ["Min", "Segment"], rows: [["0–5", "Project intro + clarify"], ["5–20", "Pipeline walkthrough + chunking/retrieval drill"], ["20–35", "Hallucination + evaluation"], ["35–45", "Tradeoffs + follow-ups + debrief"]] },
    questions: [
      { q: "Walk me through your RAG pipeline and where it most commonly fails.", difficulty: "Intermediate", round: "technical deep-dive", seniority: "Senior", frequency: "high", region: "Both",
        model: ["Offline: load, chunk, embed, index the documents. Online: retrieve relevant chunks (hybrid: semantic + keyword), rerank, put them in the prompt with a 'answer only from this context' instruction, generate with citations, then validate.", "It most commonly fails at <strong>retrieval</strong> — if the right chunks aren't found, no amount of model quality helps."],
        senior: "A strong answer separates retrieval failures from generation failures, names hybrid search + reranking as the fix for poor retrieval, and describes evaluating both halves.",
        followups: ["Why those chunk sizes?", "Hybrid or semantic-only — and why?"], redflag: "Describing only embed → cosine search → stuff into the prompt, with no reranking or evaluation." },
      { q: "Retrieval looks fine but the answers are still wrong — what now?", difficulty: "Advanced", round: "technical deep-dive", seniority: "Senior", frequency: "medium", region: "Both",
        model: ["If the right chunks were retrieved, it's a generation problem. Likely causes: the prompt doesn't force context-only answers, too much context dilutes the answer ('lost in the middle'), or chunks contradict each other.", "Fixes: use fewer, reranked chunks; add a strict 'cite or say I don't know' instruction; resolve conflicts explicitly."],
        senior: "A strong answer isolates the layers first (by logging the retrieved chunks) and verifies the fix with a faithfulness metric, rather than guessing.",
        followups: ["What is 'lost in the middle'?"], redflag: "Immediately swapping to a bigger/more expensive model without isolating the cause." },
      { q: "How do you evaluate this and gate deploys?", difficulty: "Advanced", round: "technical deep-dive", seniority: "Senior", frequency: "high", region: "Both",
        model: ["Build a small 'golden' set of test questions with expected answers. Measure retrieval (recall@k) and generation (faithfulness) separately. Run it automatically on every change and block the deploy if quality drops.", "Also sample real production traffic and score it the same way."],
        senior: "A strong answer calibrates the LLM judge against human labels and grows the test set from real production failures.",
        followups: ["How big should the golden set be?"], redflag: "'We just eyeball a few answers.'" },
    ],
    strong: ["Separates retrieval from generation", "Quotes recall@k / faithfulness", "Names hybrid + rerank + abstain unprompted", "Knows when RAG is the wrong tool"],
    weak: ["Conflates retrieval & generation failures", "No metrics", "'Just use a bigger model'", "No abstain/citation story"],
    rubric: stdRubric,
    debrief: ["Did I split retrieval vs generation?", "Did I cite metrics?", "Did I lead with tradeoffs?", "Did I hold up on the 2nd follow-up?"],
  } });

M({ num: "03", title: "Agent Mock Interview", path: "mocks/agent-mock.html",
  kw: "agent mock interview tool calling react reliability guardrails questions rubric",
  data: { eyebrow: "Mock Interviews", title: "Mock · Agentic AI Round", pills: [{ t: "Technical deep-dive", cls: "blue" }],
    lead: "A 45-minute agent round. Drills the loop, control patterns, reliability and safety — and whether you know when NOT to build an agent.",
    intro: ["Tests engineering judgment around the loop, not prompt cleverness. Pair with <a href='../pages/agentic-ai.html'>Agentic AI</a>."],
    script: ["“Describe an agent you built.” → “How does tool calling actually work?” → “How does it not loop forever / call the wrong tool?” → “Where's prompt injection a risk?” → “When would a workflow be better?” Push on reliability and safety twice each."],
    timing: { headers: ["Min", "Segment"], rows: [["0–5", "Intro + clarify"], ["5–20", "Loop + tool calling + control pattern"], ["20–35", "Reliability + safety/injection"], ["35–45", "Workflow-vs-agent + debrief"]] },
    questions: [
      { q: "How does tool calling work end to end?", difficulty: "Intermediate", round: "technical deep-dive", seniority: "Senior", frequency: "high", region: "Both",
        model: ["The model is given tools with input schemas. It outputs a structured request to call one. Your code runs the real function and returns the result into the conversation. The model then decides the next step or finishes. Repeat, with a step limit.", "The model only proposes the call — your runtime executes it."],
        senior: "A strong answer frames it as 'model proposes, runtime disposes': the runtime validates arguments, keeps tools least-privilege, and bounds the loop.",
        followups: ["What stops infinite loops?"], redflag: "Thinking the LLM itself runs the tool/code." },
      { q: "How do you make an agent reliable in production?", difficulty: "Advanced", round: "technical deep-dive", seniority: "Senior", frequency: "high", region: "Both",
        model: ["Bound the loop (max steps) and set a token/cost budget. Validate every tool call against its schema. Make tools least-privilege and idempotent. Add timeouts and retries. Guard inputs and outputs."],
        senior: "A strong answer adds checkpointed state (retry one step, not the whole run), human-in-the-loop on risky actions, and treating tool outputs as untrusted (injection risk).",
        followups: ["Where do you put human-in-the-loop?"], redflag: "No bound on the loop — trusting the model to stop on its own." },
      { q: "When would you build a workflow instead of an agent?", difficulty: "Intermediate", round: "system design", seniority: "Senior", frequency: "medium", region: "Both",
        model: ["When the steps are known in advance. A deterministic workflow is then cheaper, faster, easier to test, and more reliable than a free-running agent loop."],
        senior: "A strong answer defaults to the least-agentic solution that works and only uses a full agent when the path is genuinely dynamic.",
        followups: ["Give an example."], redflag: "Reaching for an agent for everything." },
    ],
    strong: ["'Model proposes, runtime disposes'", "Bounds the loop + budgets", "Names indirect injection via tool output", "Knows when a workflow wins"],
    weak: ["Thinks LLM executes tools", "No loop bound", "Only direct injection", "Over-uses agents"],
    rubric: stdRubric,
    debrief: ["Did I frame the trust boundary?", "Did I cover reliability + safety?", "Did I show workflow-vs-agent judgment?"],
  } });

M({ num: "04", title: "System Design Mock Interview", path: "mocks/system-design-mock.html",
  kw: "system design mock interview genai architecture framework rubric clarifying tradeoffs",
  data: { eyebrow: "Mock Interviews", title: "Mock · GenAI System Design Round", pills: [{ t: "System design", cls: "purple" }],
    lead: "A 45-minute GenAI design round on a realistic prompt (e.g. 'enterprise knowledge assistant'). Tests whether you can drive the <a href='../pages/genai-system-design.html'>framework</a> and lead with tradeoffs.",
    intro: ["Often the level-deciding round. Pair with <a href='../pages/genai-system-design.html'>GenAI System Design</a> and the seven worked <a href='../systemdesign/enterprise-knowledge-assistant.html'>designs</a>."],
    script: ["Give the prompt; expect clarifying questions (if none → that's a flag). Let them drive the framework. Interrupt with the standard probes: cost, retrieval-empty, permissions, provider outage, 'how do you know it's good'. Reserve 8 min for tradeoffs + failure modes."],
    timing: { headers: ["Min", "Segment"], rows: [["0–5", "Clarify + requirements"], ["5–15", "High-level architecture (layers)"], ["15–32", "Deep-dive layers + interruptions"], ["32–45", "Tradeoffs, failure modes, debrief"]] },
    questions: [
      { q: "Design an assistant over our internal docs that respects permissions.", difficulty: "Senior", round: "system design", seniority: "Senior/Staff", frequency: "high", region: "Both",
        model: ["Run the framework: clarify sources/permissions/freshness/scale; set requirements; draw the layers (ingestion → retrieval → orchestration → safety → evaluation → observability); close with tradeoffs and failure modes.", "The defining requirement is permissions: enforce access control at retrieval so restricted docs are never even candidates, and cite sources for trust."],
        senior: "A strong answer front-loads the non-functional bar (latency, cost, no leaks) because it drives every choice, and treats evaluation and observability as parts of the architecture.",
        followups: ["How do you keep it fresh?", "What changes at 100M docs?"], redflag: "Describing only the happy path with no safety or evaluation." },
      { q: "It's too expensive. Fix it.", difficulty: "Advanced", round: "system design", seniority: "Senior", frequency: "high", region: "Both",
        model: ["Cache repeated/similar queries, route easy traffic to a cheaper model and reserve the big model for hard cases, and trim the context. Re-run evaluation to confirm quality didn't drop."],
        senior: "A strong answer measures cost-per-request first to optimize where the money actually is, and never downgrades quality blindly.",
        followups: ["When is semantic caching risky?"], redflag: "Downgrading the model with no eval to confirm quality held." },
    ],
    strong: ["Clarifies before drawing", "Treats eval/observability as design", "Leads with tradeoffs + failure modes", "Handles interruptions without losing the thread"],
    weak: ["Jumps to architecture without requirements", "Happy path only", "No eval/safety layer", "Derailed by interruptions"],
    rubric: stdRubric,
    debrief: ["Did I clarify first?", "Did I cover all layers?", "Did I spend a third on tradeoffs/failures?", "Did I time-box well?"],
  } });

M({ num: "05", title: "Python Coding Mock Round", path: "mocks/python-coding-mock.html",
  kw: "python coding mock round llm api structured output retry async pytest rubric",
  data: { eyebrow: "Mock Interviews", title: "Mock · Python Coding Round", pills: [{ t: "Coding", cls: "green" }],
    lead: "A 45-minute applied coding round — not LeetCode, but realistic GenAI-engineering tasks: call an LLM with structured output + retry, build a small retrieval function, write the eval loop, handle async/batching.",
    intro: ["Tests production Python for AI: clean code, error handling, testing, and the LLM-integration patterns from <a href='../pages/prompting-llm-apis.html'>Prompting & LLM APIs</a>."],
    script: ["Task 1 (15 min): function that calls an LLM, forces structured output, validates, retries on invalid. Task 2 (15 min): implement top-k retrieval over precomputed embeddings + a recall@k eval. Task 3 (10 min): make N calls concurrently with a rate limit. Debrief (5 min). Watch for tests, types, and error handling."],
    timing: { headers: ["Min", "Task"], rows: [["0–15", "Structured output + validate + retry"], ["15–30", "Retrieval + recall@k"], ["30–40", "Async/batched calls with rate limit"], ["40–45", "Debrief"]] },
    questions: [
      { q: "Implement a function that returns validated JSON from an LLM, retrying on schema failure.", difficulty: "Intermediate", round: "coding", seniority: "Senior", frequency: "high", region: "Both", model: "Pydantic schema + tool/structured call + validate; bounded repair loop feeding the error back; low temperature; log failure rate.", senior: "Treats schema as source of truth; bounds retries; adds a metric.", followups: ["What if it never validates?", "How do you test it?"], redflag: "Regex on prose, no validation.", task: "<a href='../pages/prompting-llm-apis.html#hands-on'>Prompting hands-on</a>." },
      { q: "Compute recall@k for a retriever given labeled query→relevant-doc pairs.", difficulty: "Intermediate", round: "coding", seniority: "Mid–Senior", frequency: "medium", region: "Both", model: "For each query, fraction of relevant docs in top-k; average. Handle ties and empty results.", senior: "Vectorizes, adds edge-case handling and a quick test.", followups: ["MRR too?"], redflag: "Off-by-one / no edge cases." },
      { q: "Make 100 LLM calls concurrently without exceeding a rate limit.", difficulty: "Advanced", round: "coding", seniority: "Senior", frequency: "medium", region: "Both", model: "asyncio + a semaphore (or token-bucket) to cap concurrency; gather with error handling; backoff on 429.", senior: "Bounds concurrency, retries with jittered backoff, surfaces partial failures.", followups: ["How do you handle 429s?"], redflag: "Fires all 100 at once." },
    ],
    strong: ["Writes a test", "Uses types + Pydantic", "Handles errors/retries/edge cases", "Explains tradeoffs while coding"],
    weak: ["No validation/tests", "Ignores rate limits/errors", "Silent failure paths", "Can't explain choices"],
    rubric: stdRubric,
    debrief: ["Did I validate + test?", "Did I handle errors/limits?", "Was the code production-shaped?"],
  } });

M({ num: "06", title: "Senior Behavioral Mock Round", path: "mocks/behavioral-mock.html",
  kw: "senior behavioral mock round leadership ownership impact conflict star rubric",
  data: { eyebrow: "Mock Interviews", title: "Mock · Senior Engineer Behavioral Round", pills: [{ t: "Behavioral", cls: "amber" }],
    lead: "A 45-minute behavioral round calibrated to 5–10 yr seniority: ownership, impact with metrics, ambiguity, conflict, and influence. Strong engineers lose offers here by under-selling scope or rambling.",
    intro: ["Tests communication and seniority signal. Use STAR, lead with impact and metrics, and own decisions. Pair with the <a href='../mocks/final-revision.html'>revision sheets</a>.",
      callout("tip", "Practice with your strongest real project →", "<p>Use the Indorama Digitization Project to practice senior behavioral answers around ownership, production debugging, API design, Kubernetes deployment, stakeholder communication, and connecting production ML experience to GenAI roles.</p><p style='margin:8px 0 0'><a class='btn sm' href='../projects/indorama-interview-questions.html'>Open Indorama Project Interview Questions →</a></p><p style='margin:10px 0 0;font-size:13px;color:var(--text-muted)'>Use this before behavioral rounds where the interviewer asks: “Tell me about your most complex project”, “Describe a production issue you solved”, or “Why are you a good fit for GenAI roles?”</p>")],
    script: ["“Tell me about yourself.” (2 min, structured) → “A GenAI project you owned end to end.” → “A time you were wrong / it failed.” → “A disagreement with a stakeholder.” → “How you measured impact.” Probe for <em>your</em> specific decisions and the metric."],
    timing: { headers: ["Min", "Segment"], rows: [["0–5", "Self-intro + warm-up"], ["5–35", "3–4 STAR stories with probing"], ["35–45", "Influence/seniority + debrief"]] },
    questions: [
      { q: "Tell me about a GenAI project you owned and its impact.", difficulty: "Senior", round: "behavioral", seniority: "Senior", frequency: "high", region: "Both", model: "STAR: situation, your specific decisions, the architecture, the metric moved (latency/cost/quality/adoption).", senior: "Leads with business impact + a number; owns tradeoffs; credits the team without hiding own role.", followups: ["What was the hardest tradeoff?", "What would you change?"], redflag: "'We' with no 'I'; no metric." },
      { q: "Tell me about a time you were wrong or a project failed.", difficulty: "Senior", round: "behavioral", seniority: "Senior", frequency: "high", region: "Both", model: "Honest failure, what you learned, what changed afterward.", senior: "Shows reflection + a systemic fix (e.g. added eval to prevent recurrence).", followups: ["What did you change systemically?"], redflag: "A humblebrag or 'I work too hard'." },
    ],
    strong: ["Structured, 2-min answers", "Leads with impact + metric", "Owns decisions ('I decided…')", "Reflective on failure"],
    weak: ["Rambles, no structure", "All 'we', no 'I'", "No metrics", "Defensive about failure"],
    rubric: stdRubric,
    debrief: ["Did I use STAR?", "Did every story have a metric?", "Did I own decisions?", "Was I concise?"],
  } });

// Resume, GitHub & Portfolio Guide — custom page (learning-order item #18)
MOCKS.push({ kind: "custom", group: "mocks", num: "07", title: "Resume, GitHub & Portfolio Guide", path: "mocks/resume-portfolio.html",
  kw: "resume github portfolio guide cv bullet points metrics readme project explanation linkedin recruiter ats senior genai engineer",
  data: { eyebrow: "Mocks & Revision", title: "Resume, GitHub & Portfolio Guide", resumeGuide: true,
    lead: "Your resume and GitHub are the first interview you pass. This is how a 5–10 yr engineer repositions an existing backend/ML resume for GenAI roles — with metric-driven bullets, a portfolio that proves production thinking, and a script for explaining projects." } });

// Final Revision Sheets — custom page (learning-order item #19)
MOCKS.push({ kind: "custom", group: "mocks", num: "08", title: "Final Revision Sheets", path: "mocks/final-revision.html",
  kw: "final revision sheets cheat sheet flashcards last minute summary one pager",
  data: { eyebrow: "Mock Interviews", title: "Final Revision Sheets", finalRevision: true,
    lead: "One-page-per-topic crib sheets for the 48 hours before an interview. If you can recreproduce these from memory, you're ready." } });

export default MOCKS;
