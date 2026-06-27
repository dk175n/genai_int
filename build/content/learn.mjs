import { code, table, flow, diagram, callout } from "../render.mjs";

// Each entry: { kind, group, num, title, path, kw, data }
// kind 'learn' -> renderLearningPage; 'custom' -> data.bodyHtml + toc.
export const LEARN = [];

// ───────────────────────────── GET STARTED ─────────────────────────────

LEARN.push({
  kind: "custom", group: "start", num: "01", title: "Start Here", path: "pages/start-here.html",
  kw: "start here positioning who is this for interview readiness genai roles india remote",
  data: {
    eyebrow: "Get Started",
    title: "Start Here",
    lead: "This is <strong>not</strong> a textbook GenAI course. It is a practical, interview-first preparation hub for experienced Python / backend / ML engineers (5–10 years) who need to become <strong>interview-ready</strong> for GenAI roles — in India and at global remote companies.",
    bodyBuilder: true,
  },
});

LEARN.push({
  kind: "learn", group: "start", num: "02", title: "Role Roadmap", path: "pages/role-roadmap.html",
  kw: "role roadmap genai engineer applied ai ml engineer llm platform titles skills jd hiring signals",
  data: {
    eyebrow: "Get Started",
    title: "Role Roadmap — which GenAI role, and what they test",
    lead: "Five overlapping titles, one shared skill core. This page maps the roles you'll actually see on LinkedIn/Naukri to the exact competencies each interview loop tests, so you study the right things.",
    audience: "Python / backend / ML engineers with 5–10 years targeting their first (or stronger) GenAI role.",
    goal: "Pick a target role, read its real JD signals, and know which sections of this hub matter most for it.",
    learn: ["The 5 common GenAI job titles and how they differ", "What each interview loop actually tests", "How to read a JD and reverse-engineer the loop", "Where to focus given your background"],
    pills: [{ t: "Foundational" }, { t: "Screening round prep", cls: "blue" }],
    whyInterviews: ["Candidates waste weeks studying model internals when the role is 90% applied RAG + API plumbing — or vice-versa. Knowing the role's true weighting is the highest-leverage thing you can do before studying anything else."],
    answer60: "“I'm targeting <strong>Applied/GenAI Engineer</strong> roles. In practice that means building production LLM features — RAG pipelines, tool-calling agents, evaluation and guardrails — on top of FastAPI services, not training foundation models. My ML background helps with evaluation and retrieval quality; my backend background helps with latency, cost and reliability.”",
    answer3: ["Frame it as a spectrum. On one end, <strong>Applied AI / GenAI Engineer</strong>: integrate LLMs into products — RAG, agents, prompt orchestration, evaluation, guardrails. Middle, <strong>AI Platform Engineer</strong>: build the shared infra — gateways, caching, observability, eval harnesses, model routing. Other end, <strong>ML Engineer (LLMs) / Research</strong>: fine-tuning, distillation, serving optimization, sometimes pre-training.", "For a 5–10 yr Python/backend engineer, the fastest, highest-demand entry is Applied/GenAI Engineer, then growing toward Platform or Staff/Architect. I'd position my existing strengths — production services, data pipelines, evaluation thinking — as direct transfers, and close the gap on RAG internals, agent patterns and LLMOps."],
    concept: [
      "<p>There is one shared skill core across every GenAI title. The titles mostly differ in <em>where</em> on the stack you spend your day.</p>",
      table(["Role", "Day-to-day", "Interview weights heavily", "Your transfer advantage"], [
        ["<strong>Applied / GenAI Engineer</strong>", "Ship LLM product features: RAG, agents, prompting, eval", "RAG, agents, eval, prompt design, FastAPI", "Backend + ML both transfer directly"],
        ["<strong>AI Platform Engineer</strong>", "Shared infra: gateway, caching, routing, observability", "LLMOps, system design, cost/latency, reliability", "Backend/infra experience"],
        ["<strong>ML Engineer (LLMs)</strong>", "Fine-tuning, serving, quantization, evaluation", "Transformers, training, serving, eval metrics", "ML/DL fundamentals"],
        ["<strong>AI Architect / Staff</strong>", "Design enterprise GenAI systems, set standards", "System design, tradeoffs, safety, org-level thinking", "Seniority + breadth"],
        ["<strong>AI Solutions / Forward-deployed</strong>", "Customer-facing builds, POCs, integration", "RAG, agents, demos, communication", "Communication + product sense"],
      ]),
    ],
    diagram: diagram(
      "flowchart LR\n  Core[Shared core: LLM APIs, RAG, Agents, Eval, Guardrails] --> A[Applied/GenAI Eng]\n  Core --> P[Platform Eng]\n  Core --> M[ML Eng / LLMs]\n  Core --> S[Architect / Staff]",
      flow([{ t: "Shared core", s: "LLM APIs · RAG · Agents · Eval · Guardrails", accent: true }, { t: "Applied / Platform / ML / Architect", s: "specialization is mostly where on the stack you sit" }], "lr"),
      "Same core, different center of gravity. Study the core first; specialize second."
    ),
    tradeoffs: { headers: ["If your background is…", "Fastest target", "Close this gap"], rows: [
      ["Backend / API engineer", "Applied or Platform", "RAG internals, embeddings, eval"],
      ["Data scientist / ML", "Applied or ML(LLMs)", "Production serving, FastAPI, latency/cost"],
      ["Data engineer", "Platform or Applied", "Agent patterns, prompt design, eval"],
    ] },
    questions: [
      { q: "Walk me through the difference between an ML Engineer and a GenAI/Applied AI Engineer.", difficulty: "Beginner", round: "screening", seniority: "Mid–Senior", frequency: "high", region: "Both",
        model: "ML Engineers typically own the model lifecycle — training, fine-tuning, serving, metrics. GenAI/Applied Engineers compose pre-trained foundation models into products: retrieval, prompting, agents, evaluation and guardrails, optimizing the surrounding system rather than the model weights.",
        senior: "I'd add that the boundary is blurring: applied engineers increasingly do lightweight fine-tuning (LoRA), and platform teams own eval/serving. What stays constant is that applied work is judged on <em>product</em> metrics — groundedness, latency, cost, user trust — not just model accuracy.",
        followups: ["Which do you want and why?", "Where does fine-tuning fit for an applied engineer?"],
        redflag: "Claiming every GenAI role involves training models from scratch — signals no production exposure.",
        task: "Read 5 real JDs for your target title and list the recurring requirements." },
      { q: "How do you read a job description to predict the interview loop?", difficulty: "Intermediate", round: "screening", seniority: "Senior", frequency: "medium", region: "Both",
        model: "Map each JD bullet to a likely round: 'build RAG over docs' → RAG deep-dive; 'optimize cost/latency' → LLMOps/system design; 'evaluate quality' → eval round; 'Python/FastAPI' → coding round. Requirements listed first usually carry the most weight.",
        senior: "I also infer maturity: a JD heavy on 'eval, observability, guardrails' signals a team already in production (expect rigor on metrics and incidents). A JD heavy on 'POCs, demos' signals early stage (expect breadth and speed over depth).",
        followups: ["Show me how you'd prep differently for a startup vs an enterprise loop."],
        redflag: "Treating all JDs as identical and preparing one generic story." },
    ],
    hands: ["Collect 5 real JDs for your target title (LinkedIn/Naukri/Wellfound). For each, tag every requirement to a hub section. Build a personal study weighting from the frequency counts."],
    portfolio: ["Your target role determines which 2–3 of the <a href='../projects/build-first-rag.html'>hands-on projects</a> you build first. Applied → RAG + Agent + eval dashboard. Platform → monitoring dashboard + system design writeups."],
    mistakes: ["Studying transformer internals for an applied role that never asks them", "Preparing one resume for five very different roles", "Ignoring the coding round because the role 'is about LLMs'"],
    checklist: ["I can name 5 GenAI titles and what each tests", "I've tagged 5 real JDs to hub sections", "I've chosen a primary target role"],
    sources: ["Synthesized from the researched hiring-signal corpus (sections 11, 14, 15, 20 of the source material)."],
  },
});

LEARN.push({
  kind: "learn", group: "start", num: "03", title: "30 / 60 / 90 Day Plan", path: "pages/30-60-90-plan.html",
  kw: "30 60 90 day plan study schedule preparation timeline roadmap weekly",
  data: {
    eyebrow: "Get Started",
    title: "30 / 60 / 90 Day Interview Prep Plan",
    lead: "A concrete, week-by-week plan that takes a working Python/ML/backend engineer from “I know Python” to “I can pass a GenAI loop”. Built around shipping projects, because every strong answer in this hub traces back to something you actually built.",
    audience: "Engineers preparing alongside a full-time job (~8–10 focused hours/week).",
    goal: "Have a non-negotiable weekly schedule with deliverables, not a vague reading list.",
    learn: ["A 90-day phased plan with weekly deliverables", "Which projects to build and when", "How to interleave study, building and mock interviews", "How to compress it to 30 days if needed"],
    pills: [{ t: "Plan" }, { t: "Action over reading", cls: "green" }],
    whyInterviews: ["Interviewers can tell within minutes whether you've <em>built</em> things or just read about them. This plan front-loads building so that by week 4 you have stories, and by week 12 you have a portfolio."],
    answer60: "“I gave myself 90 days: Days 1–30 are foundations plus a working RAG app; Days 31–60 add agents, evaluation and a second project; Days 61–90 are system design, LLMOps and mock interviews. The plan is project-driven — every concept gets exercised in something I shipped.”",
    answer3: ["Phase 1 (foundations + first RAG app), Phase 2 (agents + eval + second app), Phase 3 (system design + LLMOps + mocks). I keep one rule: each week ends with a deliverable — a commit, a benchmark, a written design, or a recorded mock — never just 'read more'."],
    concept: [
      "<h3>Phase 1 · Days 1–30 — Foundations + first RAG app</h3>",
      table(["Week", "Study", "Build / deliverable"], [
        ["1", "<a href='core-foundations.html'>Core foundations</a>, <a href='prompting-llm-apis.html'>LLM APIs</a>", "Call an LLM API from Python; structured output; streaming"],
        ["2", "<a href='embeddings-vector-search.html'>Embeddings & vector search</a>", "Embed a doc set, run similarity search in a vector DB"],
        ["3", "<a href='rag-mastery.html'>RAG mastery</a> (chunking, retrieval)", "<a href='../projects/build-first-rag.html'>Build First RAG App</a> — minimal end to end"],
        ["4", "RAG eval basics, citations", "<a href='../projects/pdf-qna.html'>PDF Q&A app</a> with citations + a tiny golden set"],
      ]),
      "<h3>Phase 2 · Days 31–60 — Agents + evaluation</h3>",
      table(["Week", "Study", "Build / deliverable"], [
        ["5", "<a href='agentic-ai.html'>Agentic AI</a>, tool/function calling, ReAct", "<a href='../projects/build-first-agent.html'>Build First Agent App</a> with 2 tools"],
        ["6", "Planner-executor, agent memory, guardrails", "<a href='../projects/sql-agent.html'>SQL agent</a> or <a href='../projects/email-triage.html'>email triage agent</a>"],
        ["7", "<a href='llm-evaluation.html'>LLM evaluation</a>, golden datasets, LLM-as-judge", "Add an eval harness to your RAG app; publish scores"],
        ["8", "<a href='guardrails-security.html'>Guardrails & prompt-injection defense</a>", "Add input/output validation + injection tests"],
      ]),
      "<h3>Phase 3 · Days 61–90 — System design, LLMOps, mocks</h3>",
      table(["Week", "Study", "Build / deliverable"], [
        ["9", "<a href='llmops-observability.html'>LLMOps & observability</a>, tracing, cost/latency", "<a href='../projects/monitoring-dashboard.html'>Monitoring dashboard</a> with traces"],
        ["10", "<a href='genai-system-design.html'>GenAI system design</a> patterns", "Write 2 design docs (<a href='../systemdesign/enterprise-knowledge-assistant.html'>knowledge assistant</a>, support bot)"],
        ["11", "Question bank sweep + resume/portfolio polish", "Polish GitHub READMEs; record a project walkthrough"],
        ["12", "Mock interviews across all rounds", "<a href='../mocks/rag-mock.html'>RAG</a>, <a href='../mocks/system-design-mock.html'>system design</a>, <a href='../mocks/behavioral-mock.html'>behavioral</a> mocks"],
      ]),
      callout("tip", "Compress to 30 days", "If you're short on time: Week 1 = foundations + RAG app, Week 2 = agent + eval, Week 3 = system design + LLMOps reading, Week 4 = question bank + mocks. Skip the second/third projects; keep the first RAG app polished and the design docs."),
    ],
    questions: [
      { q: "How would you ramp up on GenAI in 90 days given a strong backend background?", difficulty: "Intermediate", round: "behavioral", seniority: "Senior", frequency: "medium", region: "Both",
        model: "Project-driven: foundations + a RAG app in month 1, agents + evaluation in month 2, system design + LLMOps + mocks in month 3. Each week ends with a concrete deliverable.",
        senior: "I'd emphasize leverage: I reuse my backend strengths (services, pipelines, observability) and spend my new-learning budget on the genuinely new parts — retrieval quality, agent control flow, and eval. I'd also build in public to create proof and feedback.",
        followups: ["What would you cut if you only had 30 days?", "How do you know you're making progress?"],
        redflag: "A pure reading plan with no built artifacts." },
    ],
    hands: ["Copy the Phase 1 table into your calendar with real dates. Commit to the Week-1 deliverable today."],
    portfolio: ["By Day 90 you should have 2–3 deployed/recorded projects, 2 design docs, and an eval dashboard — exactly the artifacts the <a href='../mocks/final-revision.html'>final revision</a> and resume guide build on."],
    mistakes: ["Reading for 60 days then panicking about projects", "Building 6 shallow demos instead of 2 deep ones", "Skipping mocks until the week of the interview"],
    checklist: ["My plan has dated weekly deliverables", "Week 1 deliverable is scheduled", "I know my 30-day fallback"],
    sources: ["Adapted from the launch-ready roadmap and revision-drills material (sections 16, 25)."],
  },
});

export default LEARN;
