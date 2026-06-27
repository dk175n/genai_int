import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  page, renderLearningPage, renderProjectPage, renderSystemDesignPage, renderMockPage,
  renderSectionsPage, table, flow, diagram, callout, code, questionCard, SITE, TAGLINE,
} from "./render.mjs";
import LEARN from "./content/learn.mjs";
import CORE from "./content/core.mjs";
import CORE2 from "./content/core2.mjs";
import CORE3 from "./content/core3.mjs";
import PROJECTS from "./content/projects.mjs";
import SYSDESIGN from "./content/systemdesign.mjs";
import MOCKS from "./content/mocks.mjs";
import QBANK from "./content/qbank.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, ".."); // genai-interview-hub/

const GROUP_META = [
  { id: "start", label: "Get Started", mark: "1" },
  { id: "core", label: "Core Track", mark: "2" },
  { id: "projects", label: "Hands-on Projects", mark: "3" },
  { id: "sysdesign", label: "System Design", mark: "4" },
  { id: "mocks", label: "Mocks & Revision", mark: "5" },
  { id: "qbank", label: "Question Bank", mark: "Q" },
  { id: "myprojects", label: "My Projects & Experience", mark: "★" },
];

const ALL = [...LEARN, ...CORE, ...CORE2, ...CORE3, ...PROJECTS, ...SYSDESIGN, ...MOCKS, ...QBANK];

// ----- custom page body builders -----
function startHereBody(p) {
  const toc = [];
  const sec = (id, t) => toc.push({ id, title: t });
  sec("for", "Who this is for"); sec("not", "What this is NOT"); sec("interviews", "What it prepares you for");
  sec("build", "What you'll build"); sec("priorities", "What matters most in GenAI interviews now");
  sec("use", "How to use the roadmap"); sec("next", "Your next step");
  const body = `<div class="eyebrow"><span class="dot"></span> ${p.eyebrow}</div>
<h1>${p.title}</h1>
<p class="lead">${p.lead}</p>
<div class="meta-row"><span class="pill red">Interview-first</span><span class="pill">5–10 yrs experience</span><span class="pill purple">India &amp; Global Remote</span><span class="pill blue">Project-driven</span></div>

${callout("key", "The positioning, in one line", "<p>This is not a textbook GenAI course. It is a practical GenAI interview-preparation hub for experienced Python / backend / ML engineers who need to become <strong>interview-ready</strong> — fast, and with proof.</p>")}

<h2 id="for">Who this is for</h2>
<ul>
<li>Python / backend / ML engineers with <strong>5–10 years</strong> of experience.</li>
<li>You already know Python, services, and probably some ML — you don't need 'what is a function'.</li>
<li>You're targeting <strong>GenAI / Applied AI / ML(LLMs) / AI Platform / AI Architect</strong> roles in India or at global remote companies.</li>
<li>You learn fastest by building and explaining, not by reading theory.</li>
</ul>

<h2 id="not">What this is NOT</h2>
<ul>
<li>Not a model-internals deep dive for its own sake — only the theory that actually gets asked.</li>
<li>Not a tool tour — we introduce tools when a concept needs them, not all at once.</li>
<li>Not a question list without answers — every question has a model answer, a senior answer, follow-ups and the red-flag pattern.</li>
</ul>

<h2 id="interviews">What interviews this prepares you for</h2>
${table(["Round", "What it tests", "Where to prep"], [
  ["Screening", "LLM basics, RAG/agent fundamentals", "<a href='core-foundations.html'>Foundations</a>, <a href='../qbank/index.html'>Question Bank</a>"],
  ["Technical deep-dive", "RAG, embeddings, agents, eval, guardrails", "<a href='rag-mastery.html'>RAG</a>, <a href='agentic-ai.html'>Agents</a>, <a href='embeddings-vector-search.html'>Vector Search</a>"],
  ["Coding", "Production Python: structured output, async, eval", "<a href='prompting-llm-apis.html'>LLM APIs</a>, <a href='../mocks/python-coding-mock.html'>Coding mock</a>"],
  ["System design", "Enterprise GenAI architecture", "<a href='genai-system-design.html'>System Design</a> + 7 worked designs"],
  ["Behavioral", "Ownership, impact, seniority", "<a href='../mocks/behavioral-mock.html'>Behavioral mock</a>"],
])}

<h2 id="build">What you'll build</h2>
<p>Every strong answer here traces to something you built. By the end you'll have:</p>
${callout("note", "Already have production AI experience?", "<p>If you've shipped real AI/ML systems — like the <a href='../projects/indorama-digitization.html'>Indorama Digitization Project</a> (backend ML APIs, equipment monitoring, Kubernetes) — lead with it. It proves production maturity and maps straight onto RAG/agents/LLMOps. See the <a href='../projects/indorama-digitization.html'>project page</a> for the pitch and GenAI mapping.</p>")}
<div class="grid grid-2">
  <a class="card hover" href="../projects/ats-resume-screening-assistant.html"><span class="ico">📄</span><h4>ATS Resume Screening Assistant <span class="pill red" style="font-size:10px">High interview value</span></h4><p>RAG-based HR shortlisting: parsing, semantic JD matching, explainable scorecards, guardrails, FastAPI. A practical business GenAI project.</p></a>
  <a class="card hover" href="../projects/document-qna-rag-app.html"><span class="ico">📚</span><h4>Document QnA RAG App <span class="pill red" style="font-size:10px">High interview value</span></h4><p>Scalable RAG project for Q&amp;A over large PDF collections with citations, async ingestion, vector search, and latency optimization.</p></a>
  <a class="card hover" href="../projects/build-first-rag.html"><span class="ico">📚</span><h4>A RAG app with eval</h4><p>Hybrid retrieval, citations, abstain, and measured recall@k + faithfulness.</p></a>
  <a class="card hover" href="../projects/build-first-agent.html"><span class="ico">🤖</span><h4>A reliable agent</h4><p>Bounded loop, validated tools, guardrails, task-success eval.</p></a>
  <a class="card hover" href="../projects/monitoring-dashboard.html"><span class="ico">📡</span><h4>A monitoring dashboard</h4><p>Traces, cost/latency/quality, drift alerts — the LLMOps signal.</p></a>
  <a class="card hover" href="../systemdesign/enterprise-knowledge-assistant.html"><span class="ico">🏗️</span><h4>Design docs</h4><p>Two enterprise GenAI designs you can defend in a design round.</p></a>
</div>

<h2 id="priorities">What matters most in GenAI interviews right now</h2>
<p>From current hiring signals, prioritize in this order:</p>
${table(["Tier", "Topics", "Why"], [
  ["<span class='pill red'>Critical</span>", "RAG (chunking, hybrid, rerank, citations, eval), Agents (tools, reliability), Evaluation", "Asked in nearly every applied loop"],
  ["<span class='pill amber'>High</span>", "Embeddings/vector search, LLMOps (cost/latency/tracing), Guardrails & injection", "Production-readiness signals"],
  ["<span class='pill blue'>Strong plus</span>", "System design, multi-agent, frameworks (LangGraph)", "Decides level for senior roles"],
])}

<h2 id="use">How to use the roadmap</h2>
<div class="timeline">
  <div class="step"><h4>1 · Orient</h4><p>Read <a href='role-roadmap.html'>Role Roadmap</a>, then commit to the <a href='30-60-90-plan.html'>30/60/90 plan</a>.</p></div>
  <div class="step"><h4>2 · Learn the Core Track in order</h4><p>Foundations → Prompting → Embeddings → RAG → Agents → Eval → LLMOps → Guardrails → System Design. Each page has 60-sec &amp; 3-min interview answers and its own questions.</p></div>
  <div class="step"><h4>3 · Build as you go</h4><p>Each topic links to a <a href='../projects/build-first-rag.html'>hands-on project</a>. Build, don't just read.</p></div>
  <div class="step"><h4>4 · Drill &amp; mock</h4><p>Sweep the <a href='../qbank/index.html'>Question Bank</a>, then run the <a href='../mocks/weekly-plan.html'>weekly mocks</a> and the <a href='../mocks/final-revision.html'>final revision sheets</a>.</p></div>
</div>

<h2 id="next">Your next step</h2>
${callout("tip", "Start now", "<p>Open <a href='role-roadmap.html'>Role Roadmap</a> → pick a target role → start the <a href='30-60-90-plan.html'>30/60/90 plan</a> and schedule this week's deliverable. Then begin <a href='core-foundations.html'>Core GenAI Foundations</a>.</p>")}`;
  return { body, toc, prevNext: p.prevNext };
}

function finalRevisionBody(p) {
  const toc = [];
  const sheet = (id, title, items) => {
    toc.push({ id, title });
    return `<h2 id="${id}">${title}</h2><div class="callout note"><div class="c-ico">🗂️</div><div class="c-body"><ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul></div></div>`;
  };
  const body = `<div class="eyebrow"><span class="dot"></span> ${p.eyebrow}</div>
<h1>${p.title}</h1>
<p class="lead">${p.lead}</p>
${callout("warn", "How to use these", "<p>The night before: read one sheet, close the page, and say it out loud. If you can reproduce it, move on. These are deliberately terse — the depth is on the topic pages.</p>")}
${sheet("rag", "RAG", ["Offline: load·chunk·embed·index. Online: retrieve(hybrid)·rerank·ground·generate+cite·validate.", "Hybrid = dense + BM25, fuse (RRF), rerank (cross-encoder).", "Chunking: fixed+overlap baseline → structure-aware → parent-doc.", "Reduce hallucination: ground + cite-or-abstain + coverage gate + faithfulness metric.", "Eval: split retrieval (recall@k, MRR) vs generation (faithfulness, relevance). Eval as CI.", "RAG for changing/auditable knowledge; fine-tune for behavior."])}
${sheet("agents", "Agents", ["Loop: model proposes tool call → runtime executes → observation → loop (bounded).", "Patterns: ReAct (adaptive) · planner-executor (predictable) · graph (state+checkpoint+HITL).", "Reliability: bound loop, validate args, least-priv idempotent tools, retries, budgets, tracing.", "Memory: short-term (context) · long-term (RAG over history) · state (checkpointed).", "Workflow beats agent when steps are known.", "Tool output is untrusted (indirect injection)."])}
${sheet("embeddings", "Embeddings & Vector Search", ["Embedding = text→vector; cosine = semantic closeness.", "ANN/HNSW: trade recall for latency; ef_search tunes it.", "Dense=meaning, sparse=exact terms; hybrid+rerank is the default.", "Store: pgvector (moderate) · Qdrant/Milvus (large) · FAISS (in-process)."])}
${sheet("eval", "Evaluation", ["Golden set (30–200, tagged, adversarial slice).", "Metrics: faithfulness, answer relevance, correctness, recall@k.", "LLM-as-judge: rubric, low temp, calibrate vs humans, watch bias.", "Offline gates deploys; online samples; failures grow the set."])}
${sheet("llmops", "LLMOps", ["Trace the request tree: retrieval·prompts·calls·tokens·cost·latency·scores.", "Cost: cache (exact+semantic) + route to small model + trim context (eval-gated).", "Latency: stream + parallelize + smaller model + retrieval tuning.", "Reliability: timeouts, retries/backoff, fallback model, graceful degradation.", "Monitor: cost/req, p95, abstain/error rate, quality, drift."])}
${sheet("guardrails", "Guardrails & Security", ["Layers: input · retrieval(ACL) · output · action.", "Injection: direct (user) vs indirect (retrieved/tool content) — indirect is the dangerous one.", "Defense: untrusted content ≠ instructions, output validation, least-priv tools, defense in depth.", "Data leak: enforce access control at retrieval, not the prompt.", "Action agents: HITL on irreversible actions; safety from what tools can't do."])}
${sheet("design", "System Design", ["Framework: clarify → requirements (functional + non-functional) → layered architecture → tradeoffs → failure modes.", "Layers: ingestion · retrieval(ACL) · orchestration(routing) · safety · eval · observability.", "Lead with tradeoffs + failure modes; treat eval/observability as architecture.", "GenAI adds: probabilistic behavior, retrieval quality, hallucination, token cost, model latency, safety."])}
${sheet("behavioral", "Behavioral", ["STAR; lead with impact + a metric; own decisions ('I decided…').", "Have ready: a project you owned, a failure + systemic fix, a conflict, an influence-without-authority story.", "2-minute self-intro, structured. Concise > complete."])}`;
  return { body, toc, prevNext: p.prevNext };
}

function indoramaBody(p) {
  const toc = [];
  const sec = (id, t) => toc.push({ id, title: t });
  ["summary", "proves", "bullets", "explain", "architecture", "stack", "genai", "position", "next"].forEach((id, i) =>
    sec(id, ["Project summary", "What this project proves", "Resume bullets", "How to explain it in interviews", "Architecture", "Tech stack", "Why it matters for GenAI interviews", "How to position it", "Next step"][i]));
  const archMermaid = `flowchart TD
    A[Plant Historian / Elasticsearch / DB] --> B[Python Data Fetch Layer]
    B --> C[Cleaning, Pivoting, Validation]
    C --> D[Feature Engineering / KPI Calculation]
    D --> E[ML Inference / Anomaly Logic]
    E --> F[Health Score / Trip Score / Instrumentation Score]
    F --> G[FastAPI REST APIs]
    G --> H[TCG Mcube Dashboard]
    H --> I[Plant User Monitoring]`;
  const archFlow = flow([
    { t: "Plant historian / Elasticsearch / DB", s: "time-series plant data" },
    { t: "Python data fetch + clean + pivot + validate" },
    { t: "Feature engineering / KPI calculation", accent: true },
    { t: "ML inference / anomaly logic" },
    { t: "Health · trip · instrumentation scores" },
    { t: "FastAPI REST APIs" },
    { t: "TCG Mcube dashboard → plant users" },
  ], "lr");
  const body = `<div class="eyebrow"><span class="dot"></span> ${p.eyebrow}</div>
<h1>${p.title}</h1>
<p class="lead">${p.lead}</p>
<div class="meta-row"><span class="pill purple">Industrial AI · Oil &amp; Gas / Fertilizer</span><span class="pill">Data Scientist / Backend ML Engineer</span><span class="pill blue">Python · FastAPI</span><span class="pill amber">Elasticsearch · Time-series</span><span class="pill green">Docker · Kubernetes</span><span class="pill">Mcube integration</span></div>

${callout("tip", "▶ Prepare for interviews", "<p><strong><a href='indorama-interview-questions.html'>Practice Indorama project-specific interview questions →</a></strong> — 10 questions with model + senior answers, follow-ups, red flags, and GenAI-transition framing.</p>")}

${callout("key", "Why this page exists", "<p>This is real, production AI engineering on your resume. It's the credential that proves you can <strong>build and deploy</strong> AI systems — not just run notebooks — and it transfers directly to RAG, agents, LLMOps and GenAI system design. This page is <em>not</em> a tutorial; it's how to present this project in interviews. (Project-specific interview questions come in a later pass.)")}

<h2 id="summary">Project summary</h2>
<p>Built backend machine-learning and analytics APIs for multiple plant loops and equipment to support real-time monitoring on a digital dashboard. The work covered backend ML model serving, data analysis, KPI calculation, anomaly-detection logic, equipment health monitoring, and integration of APIs with the <strong>TCG Mcube</strong> internal application.</p>
<p><strong>Role positioning:</strong> Data Scientist / Backend ML Engineer / Production ML Engineer. <strong>Domain:</strong> Industrial AI — oil &amp; gas / fertilizer plant digitization.</p>

<h2 id="proves">What this project proves</h2>
<ul>
<li>End-to-end <strong>production ML</strong>: data ingestion → feature engineering → inference → API → dashboard → monitoring → deployment.</li>
<li>Backend <strong>API design at scale</strong> (hundreds of loop- and equipment-level REST APIs).</li>
<li><strong>Enterprise integration</strong> with a real internal application (Mcube), used by plant operators.</li>
<li><strong>Deployment &amp; ops</strong> maturity: Docker, Kubernetes, health checks, environment config, production debugging.</li>
</ul>

<h2 id="bullets">Resume bullets</h2>
<ul>
<li>Built Python-based backend machine-learning and analytics APIs for multiple plant loops and equipment-monitoring use cases.</li>
<li>Developed model inference, anomaly scoring, health scoring, trip-score, instrumentation-score, and process-KPI calculation logic for industrial equipment monitoring.</li>
<li>Created and maintained hundreds of REST APIs for loop-level and equipment-level monitoring on a digital dashboard.</li>
<li>Integrated backend APIs with the TCG Mcube internal application so plant users could monitor equipment health, anomalies, KPI trends, and operational deviations.</li>
<li>Worked with time-series plant data from Elasticsearch / databases — data fetching, cleaning, pivoting, validation, feature engineering, model inference, and JSON response generation.</li>
<li>Used Docker and Kubernetes for API packaging, deployment, service validation, environment configuration, health checks, and production debugging.</li>
</ul>

<h2 id="explain">How to explain it in interviews</h2>
${callout("note", "90-second pitch", "<p>“In the Indorama Digitization project, I worked on backend machine learning and API development for industrial equipment and loop monitoring. The goal was to digitize plant operations by exposing model predictions, anomaly scores, health scores, trip scores, instrumentation scores, and calculated KPIs through backend APIs, which were then integrated with TCG Mcube dashboards.</p><p>I worked mainly in Python and FastAPI, where I created multiple APIs for different loops and equipment. The backend pipeline fetched plant time-series data from Elasticsearch or databases, transformed it into model-ready format, calculated KPIs or predictions, generated equipment-level health outputs, and returned structured JSON for dashboard consumption.</p><p>The project also involved deployment using Docker and Kubernetes, including API packaging, environment configuration, service deployment, health checks, and integration testing. This project helped me understand end-to-end production ML: data ingestion, feature engineering, model inference, API design, dashboard integration, monitoring, and deployment.”</p>")}

<h2 id="architecture">Architecture</h2>
${archFlow}
${diagram(archMermaid, "", "Plant data → Python backend → ML/KPI → FastAPI → Mcube dashboard → plant users.")}

<h2 id="stack">Tech stack</h2>
${table(["Layer", "Tech"], [
  ["Language / API", "Python, FastAPI (Flask where relevant)"],
  ["ML / analytics", "Model inference, anomaly logic, KPI / health / trip / instrumentation scoring"],
  ["Data", "Elasticsearch / database time-series (fetch, clean, pivot, validate)"],
  ["Serving", "Hundreds of loop- &amp; equipment-level REST APIs returning structured JSON"],
  ["Deployment", "Docker, Kubernetes — packaging, health checks, env config, debugging"],
  ["Integration", "TCG Mcube internal application + dashboard"],
])}

<h2 id="genai">Why it matters for GenAI interviews</h2>
<p>Production GenAI is not only prompts. It needs backend APIs, data pipelines, model serving, observability, deployment, monitoring, debugging, and enterprise integration — exactly this project's foundation. Map it directly:</p>
${table(["Existing project experience", "GenAI equivalent"], [
  ["ML model APIs", "LLM / RAG / Agent APIs"],
  ["Equipment monitoring dashboard", "GenAI observability dashboard"],
  ["Elasticsearch / DB data fetch", "Document retrieval / vector retrieval"],
  ["Feature engineering", "Chunking, metadata enrichment, retrieval preparation"],
  ["Health score &amp; anomaly score", "Evaluation score, hallucination score, quality score"],
  ["API integration with Mcube", "Enterprise GenAI frontend integration"],
  ["Kubernetes deployment", "Production GenAI app deployment"],
  ["API debugging", "RAG / agent debugging"],
  ["Time-series data validation", "Document quality and retrieval validation"],
])}
${callout("tip", "Positioning statement", "<p>“This project is highly relevant for GenAI interviews because production GenAI systems are not only about prompts. They require backend APIs, data pipelines, model serving, observability, deployment, monitoring, debugging, and enterprise integration. The same engineering foundation used in this project can be applied to RAG systems, agentic workflows, LLM evaluation APIs, and GenAI monitoring dashboards.”</p>")}

<h2 id="position">How to position it</h2>
<ul>
<li>Lead with it — it proves <strong>production AI engineering</strong>, not notebooks.</li>
<li>Connect it explicitly to <a href="../pages/rag-mastery.html">RAG</a>, <a href="../pages/agentic-ai.html">Agents</a>, <a href="../pages/llmops-observability.html">LLMOps</a>, monitoring, FastAPI APIs and Kubernetes deployment.</li>
<li>Place it <strong>before</strong> smaller academic or demo GenAI projects — it shows enterprise-scale engineering maturity.</li>
<li>Be honest: it's production <strong>AI/ML</strong> backend experience that strongly supports a GenAI transition — don't claim it used GenAI if it didn't.</li>
</ul>

<h2 id="next">Next step</h2>
${callout("note", "", "<p>Use this project's framing in your <a href='../mocks/resume-portfolio.html'>Resume, GitHub &amp; Portfolio Guide</a> and rehearse the 90-second pitch in the <a href='../mocks/behavioral-mock.html'>behavioral mock</a>. Then build a small GenAI project (<a href='build-first-rag.html'>First RAG App</a>) so you can pair enterprise maturity with hands-on GenAI.</p>")}`;
  return { body, toc, prevNext: p.prevNext };
}

// shared custom question card with the two project-specific extra fields
function projectQCard(q, i) {
  const A = (x) => (Array.isArray(x) ? x : x == null ? [] : [x]);
  const tag = (cls, txt) => `<span class="qtag ${cls}">${txt}</span>`;
  const tags = [q.difficulty && tag(q.difficulty.toLowerCase(), q.difficulty), q.round && tag("", q.round), q.seniority && tag("", q.seniority)].filter(Boolean).join("");
  const b = [];
  if (q.why) b.push(`<h5>Why the interviewer asks this</h5><p>${q.why}</p>`);
  if (q.model) b.push(`<h5>Model answer</h5>${A(q.model).map((x) => (x.startsWith("<") ? x : `<p>${x}</p>`)).join("")}`);
  if (q.senior) b.push(`<h5>Strong senior-level answer</h5><div class="senioranswer">${A(q.senior).map((x) => (x.startsWith("<") ? x : `<p>${x}</p>`)).join("")}</div>`);
  if (q.followups) b.push(`<h5>Likely follow-ups</h5><ul>${A(q.followups).map((f) => `<li>${f}</li>`).join("")}</ul>`);
  if (q.redflag) b.push(`<h5>Red-flag answer pattern</h5><div class="redflag">${q.redflag}</div>`);
  if (q.mention) b.push(`<h5>What to mention from the project</h5><ul>${A(q.mention).map((m) => `<li>${m}</li>`).join("")}</ul>`);
  if (q.genai) b.push(`<h5>How to connect this to GenAI roles</h5><div class="callout note" style="margin:6px 0"><div class="c-ico">🔗</div><div class="c-body"><p style="margin:0">${q.genai}</p></div></div>`);
  return `<details class="qcard" id="q${i + 1}"><summary><span class="q-text"><span class="qx">Q${i + 1}</span><span>${q.q}</span></span><span class="q-tags">${tags}</span></summary><div class="q-body">${b.join("")}</div></details>`;
}

function docqnaBody(p) {
  const ids = [["summary", "Project summary"], ["proves", "What this proves in interviews"], ["features", "Core features"], ["architecture", "Architecture"], ["stack", "Tech stack"], ["scaling", "How it handles thousands of PDFs"], ["latency", "How to reduce latency & lag"], ["api", "API design"], ["datamodel", "Data model"], ["eval", "Evaluation plan"], ["benchmark", "Benchmarking & next steps"], ["failures", "Failure modes"], ["guardrails", "Guardrails & security"], ["demo", "3-minute demo script"], ["readme", "GitHub README structure"], ["explain", "How to explain it in interviews"], ["questions", "Interview questions"]];
  const toc = ids.map(([id, title]) => ({ id, title }));
  const archMermaid = `flowchart TD
    A[PDF Upload / Document Source] --> B[Async Ingestion Queue]
    B --> C[PDF Parsing / OCR if needed]
    C --> D[Text Cleaning + Metadata Extraction]
    D --> E[Chunking Strategy]
    E --> F[Batch Embedding Generation]
    F --> G[Vector DB Index + Metadata Store]
    H[User Question] --> I[Query Embedding]
    I --> J[Hybrid Search / Metadata Filter]
    J --> K[Reranking]
    K --> L[Context Assembly]
    L --> M[LLM Answer Generation]
    M --> N[Citations + Source Snippets]
    N --> O[Response Streaming + Trace Logging]`;
  const ingestFlow = flow([
    { t: "PDF upload / source" }, { t: "Async ingestion queue", accent: true }, { t: "Parse / OCR" },
    { t: "Clean + metadata" }, { t: "Chunk" }, { t: "Batch embed" }, { t: "Vector DB + metadata store" },
  ], "lr");
  const queryFlow = flow([
    { t: "User question" }, { t: "Query embedding" }, { t: "Hybrid search / metadata filter", accent: true },
    { t: "Rerank" }, { t: "Context assembly" }, { t: "LLM answer" }, { t: "Citations + stream + trace" },
  ], "lr");
  const body = `<div class="eyebrow"><span class="dot"></span> ${p.eyebrow}</div>
<h1>${p.title}</h1>
<p class="lead">${p.lead}</p>
<div class="meta-row"><span class="pill red">High interview value</span><span class="pill purple">Scalable RAG Project</span><span class="pill blue">Python · FastAPI · RAG</span><span class="pill amber">Vector DB · Async ingestion</span></div>
${callout("warn", "Honest positioning for interviews", "<p>Position this as a scalable GenAI/RAG portfolio project for question answering over large PDF collections. If benchmarked with thousands of PDFs, mention the tested scale and latency numbers. If not yet benchmarked, say it is <strong>designed with an architecture suitable for thousands of documents</strong>, using async ingestion, batch embedding, vector indexing, metadata filtering, caching, reranking, and streaming responses.")}

<h2 id="summary">Project summary</h2>
<p>Built a Document QnA RAG application that allows users to upload or index large collections of PDFs, ask natural-language questions, retrieve the most relevant document chunks, and generate grounded answers with citations. The system is designed for scalable ingestion, efficient retrieval, low-latency responses, hallucination reduction, and production-style monitoring.</p>
${table(["", ""], [
  ["<strong>Domain</strong>", "Enterprise Knowledge Search / Document Intelligence / RAG Application"],
  ["<strong>Role positioning</strong>", "GenAI Engineer / RAG Application Developer / Python Backend Engineer"],
])}

<h2 id="proves">What this project proves in interviews</h2>
<ul>
<li>Ability to design and build a real RAG application end to end.</li>
<li>PDF ingestion/parsing; chunking and metadata strategy; embedding generation at scale.</li>
<li>Vector database usage; hybrid retrieval and reranking; citation-based grounded answering.</li>
<li>Latency optimization; caching and streaming; async ingestion pipeline.</li>
<li>RAG evaluation; hallucination reduction; FastAPI backend design.</li>
<li>Production monitoring/observability and scalable GenAI system-design thinking.</li>
</ul>

<h2 id="features">Core features</h2>
<ul>
<li>Upload multiple PDFs; batch document ingestion; async background processing.</li>
<li>PDF text extraction; OCR support for scanned PDFs (implemented or planned).</li>
<li>Chunking with metadata; embedding generation; vector search; metadata filtering; hybrid-search option; reranking.</li>
<li>Answer generation with citations; source-snippet display; chat history.</li>
<li>Query caching; response streaming; admin view for ingestion status; trace logging + evaluation dashboard.</li>
</ul>

<h2 id="architecture">Architecture</h2>
<p><strong>Ingestion (offline / async):</strong></p>
${ingestFlow}
<p><strong>Query (online):</strong></p>
${queryFlow}
${diagram(archMermaid, "", "Offline ingestion builds the index; the online query path stays light: embed → retrieve → rerank → generate → stream.")}

<h2 id="stack">Tech stack</h2>
${table(["Concern", "Tech / note"], [
  ["Backend", "Python, FastAPI"],
  ["RAG plumbing", "LangChain or LlamaIndex"],
  ["LLM", "OpenAI / Gemini / Claude APIs"],
  ["Vector DB", "FAISS (local/demo) · Qdrant / Pinecone / pgvector (service/production-style)"],
  ["Metadata store", "PostgreSQL"],
  ["Cache", "Redis — caches repeated queries & intermediate results"],
  ["Async jobs", "Celery / RQ — process large document ingestion asynchronously"],
  ["Deploy", "Docker, Kubernetes"],
  ["Tracing", "Langfuse or LangSmith — trace prompts, retrieval, latency, answer quality"],
])}

<h2 id="scaling">How this system handles thousands of PDFs</h2>
<ul>
<li>Do not process all PDFs at query time — ingest and index offline/asynchronously.</li>
<li>Store chunks and metadata in a vector database; use batch embedding (not one-by-one).</li>
<li>Use document-level metadata filters to reduce the search space; use hybrid search when keyword precision matters.</li>
<li>Use approximate nearest-neighbor (ANN) search for fast retrieval; rerank only a small candidate set.</li>
<li>Cache frequent queries and retrieved contexts; stream the final answer so the user sees output quickly.</li>
<li>Use background workers for large ingestion jobs; track ingestion status per document.</li>
<li>Store citations and source chunk IDs; monitor retrieval latency, LLM latency, and total response time.</li>
</ul>

<h2 id="latency">How to reduce latency and lag</h2>
<p>Latency is reduced by moving expensive work out of the user query path. Document parsing, chunking, embedding generation, and indexing should happen asynchronously before the user asks a question. At query time, the system should only embed the query, retrieve a small candidate set from the vector DB, optionally rerank top results, build a compact prompt, and stream the LLM response. Additional optimizations: Redis caching, metadata filtering, ANN indexes, smaller/faster embedding models, prompt compression, top-k tuning, model fallback, and monitoring p95 latency.</p>
${table(["Optimization", "Benefit", "Tradeoff"], [
  ["Async ingestion", "Fast query-time response", "More backend complexity"],
  ["Batch embeddings", "Lower ingestion cost/time", "Needs queue and retry logic"],
  ["Metadata filtering", "Smaller search space", "Requires good metadata"],
  ["ANN vector search", "Faster retrieval", "Approximate results"],
  ["Reranking top 20 only", "Better relevance", "Adds extra latency"],
  ["Redis cache", "Faster repeated queries", "Cache invalidation needed"],
  ["Streaming", "Better user experience", "Does not reduce total compute"],
  ["Smaller LLM", "Lower latency/cost", "May reduce answer quality"],
  ["Prompt compression", "Faster LLM response", "Risk of losing context"],
])}

<h2 id="api">API design</h2>
${table(["Endpoint", "Purpose"], [
  ["POST /api/documents/upload", "Upload one or more PDFs for ingestion"],
  ["GET /api/documents/{document_id}/status", "Check ingestion/processing status of a document"],
  ["POST /api/collections", "Create a document collection (namespace)"],
  ["POST /api/collections/{collection_id}/ingest", "Trigger async ingestion of a collection"],
  ["POST /api/query", "Ask a question; returns a grounded answer with citations"],
  ["GET /api/query/{query_id}/trace", "Retrieve the trace (retrieval, prompt, latency) for a query"],
  ["GET /api/sources/{chunk_id}", "Fetch a source chunk/snippet behind a citation"],
  ["POST /api/feedback", "Capture user feedback on an answer"],
])}

<h2 id="datamodel">Data model</h2>
${table(["Entity", "Holds"], [
  ["Document", "Uploaded file metadata + ingestion state"],
  ["DocumentChunk", "A chunk of a document + position/metadata"],
  ["Collection", "A namespace/group of documents (access scope)"],
  ["EmbeddingRecord", "Vector + chunk reference"],
  ["Query", "A user question + parameters"],
  ["RetrievedChunk", "Chunks returned for a query + scores"],
  ["Answer", "Generated answer text"],
  ["Citation", "Link from a claim to a source chunk"],
  ["Feedback", "User rating/notes on an answer"],
  ["IngestionJob", "Async job + per-document status"],
  ["TraceLog", "Retrieval/prompt/latency trace for a query"],
])}

<h2 id="eval">Evaluation plan</h2>
<ul>
<li>Create a golden question–answer dataset with known source documents.</li>
<li>Measure retrieval precision@k, answer groundedness, citation accuracy, and hallucination rate.</li>
<li>Measure response latency p50/p95 and failed-ingestion rate.</li>
<li>Compare dense vs hybrid search, and with vs without reranking.</li>
<li>Add a human feedback loop; review bad answers and update chunking/retrieval strategy.</li>
</ul>

<h2 id="benchmark">Benchmarking & next steps</h2>
<p>The next step for this project is not more documentation. The next step is to build, test, and benchmark the system with real documents. Benchmark numbers make the project much stronger in interviews because they prove that the RAG system was not only designed, but also measured.</p>

<h3>What to track while building</h3>
<ul>
<li>Number of PDFs indexed</li>
<li>Number of pages processed</li>
<li>Number of chunks generated</li>
<li>Chunk size and overlap used</li>
<li>Embedding model used</li>
<li>Vector database used</li>
<li>Ingestion time</li>
<li>Average retrieval latency</li>
<li>p50 answer latency</li>
<li>p95 answer latency</li>
<li>Top-k retrieval accuracy</li>
<li>Citation accuracy</li>
<li>Hallucination or unsupported-answer cases</li>
<li>Failed document parsing count</li>
<li>OCR failure cases, if scanned PDFs are used</li>
<li>Token usage per query</li>
<li>Cost per 100 queries, if using paid APIs</li>
<li>Cache hit rate, if Redis/query caching is implemented</li>
</ul>

<h3>Why these metrics matter in interviews</h3>
${table(["Metric", "Why interviewers care"], [
  ["Number of PDFs indexed", "Shows actual scale, not only design intent"],
  ["Number of chunks generated", "Shows understanding of chunking and indexing volume"],
  ["Ingestion time", "Shows backend pipeline performance"],
  ["Retrieval latency", "Shows vector DB and search performance"],
  ["p50 / p95 answer latency", "Shows production-readiness thinking"],
  ["Citation accuracy", "Shows grounded generation quality"],
  ["Top-k retrieval accuracy", "Shows retrieval quality"],
  ["Hallucination cases", "Shows awareness of RAG failure modes"],
  ["Token usage / cost", "Shows practical LLMOps thinking"],
  ["Cache hit rate", "Shows optimization beyond basic RAG"],
])}

<h3>Interview-ready benchmark statement</h3>
<p>After benchmarking, convert the results into one crisp interview line. Do not invent numbers. Use actual tested values.</p>
${callout("note", "Example (sample wording — replace with your real tested numbers)", "<p><em>Example after benchmarking:</em> “I tested the RAG app with 1,000 PDFs, generated around 85,000 chunks, stored them in Qdrant, and kept retrieval latency under 400 ms for top-k retrieval. End-to-end answer latency was around 4–6 seconds depending on the LLM, with streaming enabled.”</p><p style='margin:6px 0 0;font-size:12.5px;color:var(--text-muted)'>These figures are illustrative placeholders, not measured results — substitute your own.</p>")}
${callout("warn", "Do not overclaim scale", "<p>Until real benchmarking is done, say the system is <strong>designed for large PDF collections</strong> or <strong>architected for thousands of documents</strong>. After testing, mention the actual number of PDFs, chunks, latency, and evaluation results.")}

<h3>Practical next build steps</h3>
<ol>
<li>Build the ingestion pipeline for PDF upload and parsing.</li>
<li>Add chunking with metadata such as file name, page number, section title, and chunk ID.</li>
<li>Generate embeddings in batches.</li>
<li>Store chunks in the chosen vector database.</li>
<li>Build the <code>/api/query</code> endpoint for retrieval and answer generation.</li>
<li>Add citations using source document ID, page number, and chunk ID.</li>
<li>Add Redis or simple query caching.</li>
<li>Add response streaming.</li>
<li>Create a small golden question-answer dataset.</li>
<li>Measure retrieval quality, citation accuracy, and latency.</li>
<li>Add a simple benchmark report section to the README.</li>
<li>Update the portal page later with real tested numbers.</li>
</ol>
${callout("tip", "Project upgrade path →", "<p>Once the app is built and benchmarked, update this page with real numbers: PDFs indexed, chunks generated, vector DB used, p50/p95 latency, citation accuracy, and known failure cases. These numbers will make the project much stronger in GenAI interviews.")}

<h2 id="failures">Failure modes</h2>
<ul>
<li>Bad PDF extraction; scanned PDFs without OCR; poor chunking; missing metadata.</li>
<li>Embedding model mismatch; vector DB returns semantically similar but wrong chunks.</li>
<li>Reranker latency too high; too many chunks in prompt; LLM hallucination; missing citations.</li>
<li>Stale document index; slow ingestion; query timeout; high token cost; user asks outside available documents.</li>
</ul>

<h2 id="guardrails">Guardrails & security</h2>
${callout("danger", "Document Q&A needs real guardrails", "<ul style='margin:0'><li>Answer only from retrieved documents where required; say “I could not find this in the documents” when evidence is missing.</li><li>Show citations for every factual claim.</li><li>Restrict access by collection or user role; never expose documents across users; protect sensitive documents.</li><li>Validate file type/size; scan uploads if needed.</li><li>Log prompts/responses carefully; don't store sensitive data in traces unless masked.</li><li>Handle prompt injection hidden inside documents (treat document text as untrusted).</li></ul>")}

<h2 id="demo">3-minute demo script</h2>
<ol>
<li>Upload or select a PDF collection.</li>
<li>Show ingestion status.</li>
<li>Ask a question.</li>
<li>Show retrieved source snippets.</li>
<li>Show the answer with citations.</li>
<li>Ask a follow-up question.</li>
<li>Show the latency/trace view.</li>
<li>Show the feedback button.</li>
<li>Explain how the system scales to thousands of documents.</li>
</ol>

<h2 id="readme">GitHub README structure</h2>
${code("markdown", "# Document QnA RAG App\n\n## Problem Statement\n## Features\n## Architecture\n## Tech Stack\n## Setup\n## Document Ingestion\n## Chunking Strategy\n## Vector DB Setup\n## API Endpoints\n## Query Flow\n## Evaluation Plan\n## Latency Optimization\n## Security and Guardrails\n## Demo Screenshots\n## Future Improvements")}

<h2 id="explain">How to explain it in interviews</h2>
${callout("note", "90-second answer", "<p>“I built a Document QnA RAG application for answering questions over large PDF collections. The system ingests PDFs, extracts text, chunks the content with metadata, generates embeddings, stores them in a vector database, and retrieves the most relevant chunks when a user asks a question. The LLM then generates an answer grounded in the retrieved context and returns citations to the original source documents.</p><p>The important design point is that expensive work like parsing, chunking, embedding, and indexing is done asynchronously before query time. At query time, the app only embeds the user question, performs vector or hybrid retrieval, optionally reranks the top candidates, builds a compact prompt, and streams the answer. This keeps the system usable even when the document collection is large.</p><p>From an interview perspective, this project demonstrates RAG architecture, vector search, chunking strategy, retrieval optimization, latency reduction, citation-based answering, hallucination control, FastAPI backend design, and production-style monitoring.</p><p>Once benchmarked, I would mention the actual tested document count, chunk count, retrieval latency, p50/p95 response latency, and citation accuracy to make the project explanation measurable.”</p>")}

<h2 id="questions">Interview questions</h2>
<p>Click any question for a model answer, a stronger senior-level answer, follow-ups, the red-flag pattern, what to mention, and how to connect it to GenAI roles.</p>
${p.questions.map((q, i) => projectQCard(q, i)).join("")}`;
  return { body, toc, prevNext: p.prevNext };
}

function atsBody(p) {
  const toc = [];
  const ids = [["summary", "Project summary"], ["proves", "What this proves in interviews"], ["features", "Core features"], ["architecture", "Architecture"], ["stack", "Tech stack"], ["api", "API design"], ["datamodel", "Data model"], ["eval", "Evaluation plan"], ["responsible", "Responsible AI & guardrails"], ["failures", "Failure modes"], ["demo", "3-minute demo script"], ["readme", "GitHub README structure"], ["explain", "How to explain it in interviews"], ["questions", "Interview questions"]];
  ids.forEach(([id, t]) => toc.push({ id, title: t }));
  const archMermaid = `flowchart TD
    A[Job Description Upload] --> B[JD Parsing and Skill Extraction]
    C[Resume Uploads] --> D[Resume Parsing and Chunking]
    B --> E[Embedding Generation]
    D --> E
    E --> F[Vector Search / Semantic Matching]
    F --> G[LLM-based Match Explanation]
    G --> H[Candidate Scorecard]
    H --> I[HR Review Dashboard]`;
  const archFlow = flow([
    { t: "JD upload + resume uploads" }, { t: "Parse + extract skills (JD & resumes)" },
    { t: "Embedding generation", accent: true }, { t: "Vector search / semantic match" },
    { t: "LLM match explanation" }, { t: "Candidate scorecard" }, { t: "HR review dashboard" },
  ], "lr");
  const body = `<div class="eyebrow"><span class="dot"></span> ${p.eyebrow}</div>
<h1>${p.title}</h1>
<p class="lead">${p.lead}</p>
<div class="meta-row"><span class="pill red">High interview value</span><span class="pill purple">GenAI HR Project</span><span class="pill blue">Python · FastAPI · RAG</span><span class="pill amber">Embeddings · Vector DB</span></div>
${callout("warn", "Honest positioning for interviews", "<p>Position this as a practical GenAI ATS project designed for HR resume screening and candidate shortlisting workflows. Do not claim it is a production HR system unless it is actually deployed or officially adopted. Present it as an interview-ready business GenAI project that demonstrates RAG, embeddings, structured extraction, evaluation, responsible AI, FastAPI backend design, and human-in-the-loop review.")}

<h2 id="summary">Project summary</h2>
<p>Built a GenAI-powered ATS assistant that compares resumes against job descriptions, extracts candidate skills and experience, ranks candidates using semantic matching, explains the match score, and helps HR teams shortlist candidates with human review.</p>
${table(["", ""], [
  ["<strong>Domain</strong>", "HR Tech / Recruitment Automation / GenAI Resume Screening"],
  ["<strong>Role positioning</strong>", "GenAI Engineer / Python Backend Engineer / RAG Application Developer"],
  ["<strong>Core stack</strong>", "Python, FastAPI, LLM APIs, Embeddings, Vector DB, RAG, PDF/resume parsing, JSON extraction, PostgreSQL or SQLite, Streamlit or React, Docker"],
  ["<strong>Optional tools</strong>", "LangChain or LlamaIndex · Chroma / Qdrant / FAISS · OpenAI / Gemini / Claude APIs"],
])}

<h2 id="proves">What this project proves in interviews</h2>
<ul>
<li>Ability to build a real GenAI business application end to end.</li>
<li>RAG pipeline design; resume and JD parsing.</li>
<li>Embedding-based semantic matching; structured extraction with LLMs.</li>
<li>Candidate ranking with explainability.</li>
<li>FastAPI backend design.</li>
<li>Responsible-AI awareness in HR workflows + human-in-the-loop review.</li>
<li>Evaluation and debugging of LLM outputs.</li>
</ul>

<h2 id="features">Core features</h2>
<ul>
<li>Upload a job description and multiple resumes (PDF/DOCX).</li>
<li>Extract skills, years of experience, education, projects, tools, certifications.</li>
<li>Generate a candidate–job match score and rank candidates.</li>
<li>Explain why a candidate is a good or weak fit; show missing skills.</li>
<li>Generate a recruiter summary; export shortlisted candidates.</li>
<li>Support human review before any final decision.</li>
</ul>

<h2 id="architecture">Architecture</h2>
${archFlow}
${diagram(archMermaid, "", "JD + resumes → parse/extract → embed → semantic match → LLM explanation → scorecard → HR review.")}

<h2 id="stack">Tech stack</h2>
${table(["Layer", "Tech"], [
  ["API / backend", "Python, FastAPI"],
  ["Parsing", "PDF/DOCX resume parsing, JD parsing, JSON/structured extraction"],
  ["Retrieval", "Embeddings + Vector DB (Chroma / Qdrant / FAISS), RAG, hybrid matching"],
  ["LLM", "OpenAI / Gemini / Claude APIs (optionally via LangChain / LlamaIndex)"],
  ["Storage", "PostgreSQL or SQLite"],
  ["UI", "Streamlit or React dashboard"],
  ["Deploy", "Docker"],
])}

<h2 id="api">API design</h2>
${table(["Endpoint", "Purpose"], [
  ["POST /api/jobs", "Create a job + parse the JD into structured requirements"],
  ["POST /api/resumes/upload", "Upload one or more resumes; parse + extract structured profiles"],
  ["POST /api/screen", "Run a screening: match resumes to a JD, score and rank"],
  ["GET /api/jobs/{job_id}/candidates", "List ranked candidates for a job"],
  ["GET /api/candidates/{candidate_id}/scorecard", "Match score, evidence, missing skills, explanation"],
  ["POST /api/feedback", "Capture recruiter feedback / override for a candidate"],
])}

<h2 id="datamodel">Data model</h2>
${table(["Entity", "Holds"], [
  ["JobDescription", "Raw JD + extracted requirements/skills"],
  ["Candidate", "Candidate identity (PII minimized)"],
  ["ResumeDocument", "Uploaded file + parsed text"],
  ["ExtractedProfile", "Structured skills, experience, education, tools, certs"],
  ["MatchScore", "Per-requirement + overall score, evidence, missing skills"],
  ["ScreeningRun", "A screening execution linking a JD to candidates"],
  ["RecruiterFeedback", "Human review, override, decision audit trail"],
])}

<h2 id="eval">Evaluation plan</h2>
<ul>
<li>Create 20–50 sample JD–resume pairs; manually label strong / medium / weak.</li>
<li>Compare the system's ranking with the human ranking.</li>
<li>Track extraction accuracy, hallucinated skills, and missing-skill correctness.</li>
<li>Track explanation quality, false positives and false negatives.</li>
<li>Add a human feedback loop so labels grow over time.</li>
</ul>

<h2 id="responsible">Responsible AI & guardrails</h2>
${callout("danger", "HR is high-risk — design for it", "<ul style='margin:0'><li>Do <strong>not</strong> make final hiring decisions automatically — keep the recruiter in the loop.</li><li>Do not use or rank on protected attributes: gender, age, religion, caste, race, photo, address, marital status.</li><li>Mask or ignore PII where possible.</li><li>Explain every score; store an audit trail of screening decisions.</li><li>Allow recruiter override; clearly mark the tool as decision-support, not decision-maker.</li></ul>")}

<h2 id="failures">Failure modes</h2>
<ul>
<li>Resume parsing errors; long resumes causing context issues; duplicate resumes.</li>
<li>Missing or hallucinated skills; overweighting keyword matches; underweighting transferable skills.</li>
<li>Bias from historical hiring data; poor JD quality.</li>
<li>Candidate ranking instability; LLM output-format failures.</li>
</ul>

<h2 id="demo">3-minute demo script</h2>
<ol>
<li>Upload a job description.</li>
<li>Upload 5 resumes.</li>
<li>Show the extracted skills per candidate.</li>
<li>Run screening.</li>
<li>Show ranked candidates.</li>
<li>Open a candidate scorecard.</li>
<li>Show the match explanation and missing skills.</li>
<li>Show the recruiter feedback option.</li>
<li>Explain the guardrails and human-review step.</li>
</ol>

<h2 id="readme">GitHub README structure</h2>
${code("markdown", "# ATS Resume Screening Assistant\n\n## Problem Statement\n## Features\n## Architecture\n## Tech Stack\n## Setup\n## API Endpoints\n## Data Flow\n## Evaluation Plan\n## Responsible AI Notes\n## Demo Screenshots\n## Future Improvements")}

<h2 id="explain">How to explain it in interviews</h2>
${callout("note", "90-second answer", "<p>“I built an ATS Resume Screening Assistant as a practical GenAI project for HR candidate shortlisting. The system takes a job description and multiple resumes, extracts structured information like skills, experience, education, projects, and tools, then compares candidates against the job description using embeddings and LLM-based reasoning.</p><p>The goal is not to replace recruiters, but to support them with faster shortlisting, explainable match scores, missing-skill analysis, and candidate summaries. The backend can be exposed through FastAPI APIs, with a simple dashboard for uploading resumes, viewing ranked candidates, and capturing recruiter feedback.</p><p>From a GenAI perspective, this project demonstrates RAG-style retrieval, embedding-based semantic matching, structured output extraction, prompt engineering, evaluation, responsible AI guardrails, and production-style API design. I position it as a practical business GenAI application with human-in-the-loop review.”</p>")}

<h2 id="questions">Interview questions</h2>
<p>Click any question for a model answer, a stronger senior-level answer, follow-ups, the red-flag pattern, what to mention, and how to connect it to GenAI roles.</p>
${p.questions.map((q, i) => projectQCard(q, i)).join("")}`;
  return { body, toc, prevNext: p.prevNext };
}

function realStoriesBody(p) {
  const toc = [{ id: "use", title: "How to use this page" }, { id: "stories", title: "Project stories" }];
  // story card: {title, tier, tierCls, use, proves, story, bridge, redflag, cta?}
  const storyCard = (s) => {
    const ctaHtml = s.cta ? `<p style="margin:10px 0 0"><a class="btn sm" href="${s.cta}">${s.ctaLabel || "Practice Indorama Project Interview Questions →"}</a></p>` : "";
    return `<div class="card" style="margin:14px 0">
<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px">
  <h3 style="margin:0">${s.title}</h3><span class="pill ${s.tierCls}">${s.tier}</span>
</div>
<p style="margin:0 0 8px"><strong>Best interview use:</strong> ${s.use}</p>
<p style="margin:0 0 8px"><strong>What it proves:</strong> ${s.proves}</p>
<details class="qcard" style="margin:8px 0"><summary><span class="q-text"><span class="qx">▶</span><span>90-second story</span></span></summary><div class="q-body"><p>${s.story}</p></div></details>
<p style="margin:8px 0 0;font-size:13.5px"><strong>GenAI bridge:</strong> ${s.bridge}</p>
<div class="redflag" style="margin:8px 0 0;font-size:13px"><strong>Red flag to avoid:</strong> ${s.redflag}</div>
${ctaHtml}
</div>`;
  };
  const stories = [
    { title: "1 · Indorama Digitization Project", tier: "Primary story", tierCls: "red",
      use: "Project deep-dive & senior behavioral — your strongest production-AI story.",
      proves: "End-to-end production ML: data pipelines, model serving, REST APIs, dashboard integration, Kubernetes deployment and debugging.",
      story: "Built backend ML & analytics APIs for industrial equipment and loop monitoring: fetched plant time-series from Elasticsearch/DB, cleaned/pivoted/validated it, computed KPIs and anomaly/health/trip/instrumentation scores, served them via hundreds of FastAPI endpoints, and integrated with the TCG Mcube dashboard used by plant operators — deployed on Docker/Kubernetes with health checks and production debugging.",
      bridge: "Production ML APIs → LLM/RAG/agent APIs; equipment dashboard → GenAI observability; Elasticsearch fetch → retrieval; Kubernetes → production GenAI deployment.",
      redflag: "Claiming it used GenAI/LLMs — it didn't. Present it as production AI/ML that supports a GenAI transition.",
      cta: "indorama-interview-questions.html" },
    { title: "2 · Yield Optimizer", tier: "Secondary story", tierCls: "amber",
      use: "ML + optimization and decision-support discussion.",
      proves: "Combining predictive ML with constrained optimization to drive real operational decisions.",
      story: "Built ML models to predict process yield, then wrapped them in a differential-evolution optimizer that searched the input space under operating constraints to recommend settings that maximize yield. The output was decision support — surfacing feasible, optimized operating points to engineers rather than a black-box number.",
      bridge: "Agentic optimization and decision-support agents; production model APIs feeding an optimization loop — the same 'model + search + constraints + recommend' pattern an agent uses with tools.",
      redflag: "Describing it as 'just trained a model' and omitting the optimization/constraints and the decision-support framing." },
    { title: "3 · Real-Time Optimization", tier: "Secondary story", tierCls: "amber",
      use: "Performance, scaling and backend-engineering discussion.",
      proves: "Backend performance engineering — turning a slow batch computation into a near-real-time one.",
      story: "Took an optimization workload that was too slow for real-time use and parallelized it with multiprocessing, cutting runtime by ~90%. The work was about profiling the bottleneck, splitting the computation across cores, and validating that results stayed correct under parallel execution.",
      bridge: "Latency optimization, parallel tool calls, and scalable inference workflows — the same instinct used to parallelize retrieval/tool calls and cut p95 latency in a GenAI service.",
      redflag: "Quoting '90% faster' with no explanation of how (multiprocessing, profiling) or how correctness was preserved." },
    { title: "4 · Oil & Gas Digital Twin", tier: "Supporting story", tierCls: "purple",
      use: "Systems / domain-modeling and scenario discussion.",
      proves: "Modeling a complex real-world system and using it for feasibility and decision support.",
      story: "Worked on a virtual model (digital twin) of a plant: representing process variables and their relationships so operators could test scenarios, check feasibility of operating conditions, and get decision support without touching the real plant.",
      bridge: "Enterprise simulation assistant / operational copilot — a GenAI layer that explains scenarios and 'what-if' outcomes over a system model.",
      redflag: "Hand-waving the domain — be specific about the variables/feasibility checks you worked on." },
    { title: "5 · PayPal Marketing Analytics", tier: "Supporting story", tierCls: "purple",
      use: "Analytics, stakeholder communication and BI discussion.",
      proves: "Turning data into business insight and communicating it to non-technical stakeholders.",
      story: "Built clustering/segmentation models on marketing data to group customers, and delivered the results through dashboards that marketing stakeholders used to target campaigns. The emphasis was translating model output into decisions stakeholders could act on.",
      bridge: "Customer-analytics copilot, RAG over campaign data, and BI assistants — analytics surfaced through a natural-language/dashboard interface.",
      redflag: "Listing algorithms without the business outcome or who used the dashboards and why." },
    { title: "6 · NVIDIA Edge Deployment", tier: "Supporting story", tierCls: "purple",
      use: "Deployment, computer-vision and edge discussion.",
      proves: "Production deployment discipline and model serving on constrained edge hardware.",
      story: "Built Flask apps containerized with Docker to serve models and monitor NVIDIA edge devices, using transfer learning for the vision models. The work covered packaging, deploying to edge hardware, and debugging serving in a constrained environment.",
      bridge: "Deployment discipline, model serving and production debugging — directly transferable to deploying and operating GenAI services.",
      redflag: "Treating it as a notebook demo instead of a deployed, monitored serving setup." },
    { title: "7 · ATS Resume Screening Assistant", tier: "GenAI HR Project", tierCls: "purple",
      use: "Show practical GenAI application building, RAG thinking, structured extraction, evaluation, responsible AI guardrails, and FastAPI backend design.",
      proves: "Building a real GenAI business app end to end — RAG retrieval, structured extraction, explainable scoring, responsible-AI guardrails, and human-in-the-loop review.",
      story: "RAG-based HR candidate shortlisting assistant for resume parsing, job-description matching, candidate ranking, explainable scorecards, and human-in-the-loop recruiter review. A GenAI ATS assistant designed for HR department resume screening workflows — decision-support, not a deployed HR system.",
      bridge: "This IS a GenAI project — RAG, embeddings, structured output, evaluation, guardrails and FastAPI in one practical app.",
      redflag: "Overclaiming it's a deployed/official HR tool, or that it auto-rejects candidates.",
      cta: "ats-resume-screening-assistant.html", ctaLabel: "Open ATS Resume Screening Assistant →" },
    { title: "8 · Document QnA RAG App", tier: "Scalable RAG Project", tierCls: "purple",
      use: "Show RAG architecture, vector database design, chunking strategy, latency optimization, citation handling, evaluation, and production-scale GenAI thinking.",
      proves: "Designing a scalable RAG system end to end — async ingestion, vector search, hybrid retrieval, reranking, citations, and latency optimization.",
      story: "Document question-answering system over large PDF collections with async ingestion, vector search, citations, latency optimization, and grounded answer generation. Designed with an architecture suitable for thousands of documents (quote tested scale only if benchmarked).",
      bridge: "This IS a GenAI project — the canonical production RAG pipeline applied to document Q&A.",
      redflag: "Claiming benchmarked thousands-of-PDFs scale with no numbers, or processing documents at query time.",
      cta: "document-qna-rag-app.html", ctaLabel: "Open Document QnA RAG App →" },
  ];
  const body = `<div class="eyebrow"><span class="dot"></span> ${p.eyebrow}</div>
<h1>${p.title}</h1>
<p class="lead">${p.lead}</p>
${callout("note", "What this page is", "<p>These are <strong>not</strong> generic GenAI lessons. They're personal project stories to prepare <strong>project deep-dive</strong>, <strong>senior behavioral</strong>, and <strong>resume-screening</strong> answers — and to bridge real ML/backend/analytics experience into GenAI positioning. Be honest: most predate GenAI; present them as production AI/ML experience that supports the transition.")}

<h2 id="use">How to use this page</h2>
<ul>
<li><strong>Indorama</strong> — your strongest production-AI story (lead with it). Full Q&amp;A on its <a href="indorama-interview-questions.html">interview page</a>.</li>
<li><strong>Yield Optimizer</strong> — ML + optimization and decision-support discussion.</li>
<li><strong>Real-Time Optimization</strong> — performance/scaling discussion.</li>
<li><strong>Oil &amp; Gas Digital Twin</strong> — system/domain-modeling discussion.</li>
<li><strong>PayPal Marketing Analytics</strong> — analytics/stakeholder-communication discussion.</li>
<li><strong>NVIDIA Edge</strong> — deployment / computer-vision / edge discussion.</li>
</ul>
${callout("tip", "Pick by the question, not the project", "<p>When asked “most complex project” → Indorama. “Performance problem you solved” → Real-Time Optimization. “Worked with stakeholders” → PayPal. “Deployment experience” → NVIDIA Edge. Match the story to what the interviewer is probing.</p>")}

<h2 id="stories">Project stories</h2>
${stories.map(storyCard).join("")}`;
  return { body, toc, prevNext: p.prevNext };
}

function indoramaQBody(p) {
  const toc = [];
  const sec = (id, t) => toc.push({ id, title: t });
  const A = (x) => (Array.isArray(x) ? x : x == null ? [] : [x]);
  // custom question card with the two extra Indorama-specific fields
  const card = (q, i) => {
    const id = "q" + (i + 1);
    const tag = (cls, txt) => `<span class="qtag ${cls}">${txt}</span>`;
    const tags = [q.difficulty && tag(q.difficulty.toLowerCase(), q.difficulty), q.round && tag("", q.round), q.seniority && tag("", q.seniority)].filter(Boolean).join("");
    const b = [];
    if (q.why) b.push(`<h5>Why the interviewer asks this</h5><p>${q.why}</p>`);
    if (q.model) b.push(`<h5>Model answer</h5>${A(q.model).map((x) => (x.startsWith("<") ? x : `<p>${x}</p>`)).join("")}`);
    if (q.senior) b.push(`<h5>Strong senior-level answer</h5><div class="senioranswer">${A(q.senior).map((x) => (x.startsWith("<") ? x : `<p>${x}</p>`)).join("")}</div>`);
    if (q.followups) b.push(`<h5>Likely follow-ups</h5><ul>${A(q.followups).map((f) => `<li>${f}</li>`).join("")}</ul>`);
    if (q.redflag) b.push(`<h5>Red-flag answer pattern</h5><div class="redflag">${q.redflag}</div>`);
    if (q.mention) b.push(`<h5>What to mention from the project</h5><ul>${A(q.mention).map((m) => `<li>${m}</li>`).join("")}</ul>`);
    if (q.genai) b.push(`<h5>How to connect this to GenAI roles</h5><div class="callout note" style="margin:6px 0"><div class="c-ico">🔗</div><div class="c-body"><p style="margin:0">${q.genai}</p></div></div>`);
    return `<details class="qcard" id="${id}"><summary><span class="q-text"><span class="qx">Q${i + 1}</span><span>${q.q}</span></span><span class="q-tags">${tags}</span></summary><div class="q-body">${b.join("")}</div></details>`;
  };
  sec("story", "90-Second Project Story");
  sec("architecture", "Architecture");
  sec("questions", "10 Project Interview Questions");
  sec("genai", "How this project supports GenAI interviews");
  sec("revise", "Before the interview, revise this");

  const archMermaid = `flowchart TD
    A[Plant Historian / Elasticsearch / DB] --> B[Python Data Fetch Layer]
    B --> C[Cleaning, Pivoting, Validation]
    C --> D[Feature Engineering / KPI Calculation]
    D --> E[ML Inference / Anomaly Logic]
    E --> F[Health Score / Trip Score / Instrumentation Score]
    F --> G[FastAPI REST APIs]
    G --> H[TCG Mcube Dashboard]
    H --> I[Plant User Monitoring]`;
  const archFlow = flow([
    { t: "Plant historian / Elasticsearch / DB" }, { t: "Python data fetch layer" },
    { t: "Cleaning, pivoting, validation" }, { t: "Feature engineering / KPI calc", accent: true },
    { t: "ML inference / anomaly logic" }, { t: "Health / trip / instrumentation scores" },
    { t: "FastAPI REST APIs" }, { t: "TCG Mcube dashboard → plant users" },
  ], "lr");

  const body = `<div class="eyebrow"><span class="dot"></span> ${p.eyebrow}</div>
<h1>${p.title}</h1>
<p class="lead">${p.lead}</p>
<div class="meta-row"><span class="pill purple">Project deep-dive</span><span class="pill">10 questions</span><span class="pill blue">Python · FastAPI</span><span class="pill green">Docker · Kubernetes</span></div>
${callout("tip", "Use the project page alongside this", "<p>This page is for <strong>practice</strong>. The <a href='indorama-digitization.html'>Indorama project page</a> has the summary, resume bullets and full architecture. Honesty rule: present this as production <strong>AI/ML</strong> engineering — never claim it used GenAI.</p>")}

<h2 id="story">90-Second Project Story</h2>
${callout("note", "Say this, out loud, until it's natural", "<p>“In the Indorama Digitization project, I worked on backend machine learning and API development for industrial equipment and loop monitoring. The goal was to digitize plant operations by exposing model predictions, anomaly scores, health scores, trip scores, instrumentation scores, and calculated KPIs through backend APIs, which were then integrated with TCG Mcube dashboards.</p><p>I worked mainly in Python and FastAPI, where I created APIs for different loops and equipment. The backend pipeline fetched plant time-series data from Elasticsearch or databases, transformed it into model-ready format, calculated KPIs or predictions, generated equipment-level health outputs, and returned structured JSON for dashboard consumption.</p><p>The project also involved deployment using Docker and Kubernetes, including API packaging, environment configuration, service deployment, health checks, and integration testing. This project helped me understand end-to-end production ML: data ingestion, feature engineering, model inference, API design, dashboard integration, monitoring, debugging, and deployment.”</p>")}

<h2 id="architecture">Architecture</h2>
${archFlow}
${diagram(archMermaid, "", "Plant data → Python backend → ML/KPI → FastAPI → Mcube dashboard → plant users.")}

<h2 id="questions">10 Project Interview Questions</h2>
<p>Click any question for a model answer, a stronger senior-level answer, follow-ups, the red-flag pattern, what to mention from the project, and how to connect it to GenAI roles.</p>
${p.questions.map((q, i) => card(q, i)).join("")}

<h2 id="genai">How this project supports GenAI interviews</h2>
${table(["Indorama experience", "GenAI equivalent"], [
  ["ML model APIs", "LLM / RAG / Agent APIs"],
  ["Equipment health dashboard", "GenAI observability dashboard"],
  ["Elasticsearch / DB data fetch", "Document retrieval / vector retrieval"],
  ["Feature engineering", "Chunking, metadata enrichment, retrieval preparation"],
  ["Health score / anomaly score", "Evaluation score, hallucination score, quality score"],
  ["API integration with Mcube", "Enterprise GenAI frontend integration"],
  ["Kubernetes deployment", "Production GenAI app deployment"],
  ["API debugging", "RAG / agent debugging"],
  ["Time-series validation", "Document quality and retrieval validation"],
])}
${callout("key", "Positioning statement", "<p>“This project is relevant to GenAI interviews because production GenAI systems are not only about prompts. They require backend APIs, data pipelines, model serving, monitoring, observability, deployment, debugging, and enterprise integration. The same engineering foundation can be applied to RAG systems, agentic workflows, LLM evaluation services, and GenAI monitoring dashboards.”</p>")}

<h2 id="revise">Before the interview, revise this</h2>
<ul class="checklist">
<li>Can I explain the business problem in 60 seconds?</li>
<li>Can I draw the architecture without looking?</li>
<li>Can I explain the API flow end to end?</li>
<li>Can I explain how time-series data was cleaned and transformed?</li>
<li>Can I explain what health score, anomaly score, trip score, and instrumentation score mean?</li>
<li>Can I explain one production debugging issue?</li>
<li>Can I explain Kubernetes deployment basics?</li>
<li>Can I connect this project to RAG, agents, LLMOps, and GenAI monitoring?</li>
<li>Can I clearly say what I personally worked on?</li>
<li>Can I avoid overclaiming GenAI usage?</li>
</ul>`;
  return { body, toc, prevNext: p.prevNext };
}

function resumeGuideBody(p) {
  const toc = [];
  const sec = (id, t) => toc.push({ id, title: t });
  ["reposition", "flagship", "bullets", "summary", "github", "explain", "linkedin", "mistakes", "checklist"].forEach((id, i) =>
    sec(id, ["Reposition, don't rebuild", "Your strongest non-GenAI project", "Resume bullets that land", "The 3-line summary", "GitHub & README", "Explaining a project (the template)", "LinkedIn & recruiter screens", "Common mistakes", "Pre-send checklist"][i]));
  const body = `<div class="eyebrow"><span class="dot"></span> ${p.eyebrow}</div>
<h1>${p.title}</h1>
<p class="lead">${p.lead}</p>
${callout("key", "The one principle", "<p>Hiring engineers skim for <strong>production thinking</strong> and <strong>impact</strong>, not tool lists. Every bullet should answer 'what did you build, what did it move, what was the hard call' — not 'I used LangChain'.</p>")}

<h2 id="reposition">Reposition, don't rebuild</h2>
<p>You already have strong material — reframe it for GenAI:</p>
${table(["You have", "Reframe as"], [
  ["Built FastAPI / backend services", "Production LLM service experience: latency, cost, reliability"],
  ["Data pipelines / ETL", "Document ingestion & RAG indexing pipelines"],
  ["ML model evaluation", "LLM evaluation: golden sets, faithfulness, LLM-as-judge"],
  ["Monitoring / observability", "LLMOps: tracing, drift, cost/latency dashboards"],
  ["ElasticSearch / search", "Hybrid retrieval (dense + BM25), reranking"],
])}

<h2 id="flagship">Your strongest non-GenAI project — lead with it</h2>
${callout("key", "Indorama Digitization Project", "<p>If your background includes production AI/ML work like the <a href='../projects/indorama-digitization.html'>Indorama Digitization Project</a>, that is your <strong>strongest</strong> credential — put it first, before any academic or demo GenAI project.</p>")}
<ul>
<li><strong>It proves production AI engineering</strong> — you can build and deploy real AI systems, not just notebooks.</li>
<li><strong>Connect it to GenAI</strong> explicitly: backend ML APIs → LLM/RAG/agent APIs; equipment dashboard → GenAI observability; Elasticsearch data fetch → retrieval; Kubernetes → production GenAI deployment.</li>
<li><strong>Position it before smaller GenAI demos</strong> — it shows enterprise-scale engineering maturity that demos can't.</li>
<li><strong>Stay honest</strong> — present it as production AI/ML backend experience that supports a GenAI transition, not as a GenAI project.</li>
</ul>
<p style="margin:8px 0"><a href="../projects/my-real-project-stories.html">Practice real project stories → My Real Project Stories</a> — compact 90-second stories and GenAI bridges for Indorama, Yield Optimizer, Real-Time Optimization, Digital Twin, PayPal Analytics, and NVIDIA Edge.</p>
<p>Resume bullet to anchor it (full bullets + 90-second pitch + architecture on the <a href='../projects/indorama-digitization.html'>project page</a>):</p>
${callout("tip", "Anchor bullet", "<p>'Built Python/FastAPI backend ML &amp; analytics APIs (hundreds of loop/equipment endpoints) generating anomaly, health, trip and KPI scores from Elasticsearch time-series data, integrated with the TCG Mcube monitoring dashboard and deployed on Kubernetes.'</p>")}

<h2 id="bullets">Resume bullets that land</h2>
<p>Formula: <strong>Built/Led [what] → [how, briefly] → moved [metric]</strong>. Lead with the number.</p>
${callout("tip", "Weak → strong", "<p><strong>Weak:</strong> 'Worked on a chatbot using LangChain and OpenAI.'</p><p><strong>Strong:</strong> 'Built a production RAG assistant over 50k internal docs (hybrid retrieval + reranking, citations, abstain path); raised answer faithfulness from 0.72→0.91 on a 120-case golden set and cut p95 latency 40% via caching + model routing.'</p>")}
<ul>
<li>Quantify: faithfulness, recall@k, latency, cost/request, deflection rate, adoption.</li>
<li>Name the hard call: 'chose RAG over fine-tuning because…', 'hybrid over semantic-only because…'.</li>
<li>Show production discipline: evaluation, guardrails, monitoring — not just 'it works'.</li>
<li>One line per project; link the GitHub repo.</li>
</ul>

<h2 id="summary">The 3-line summary</h2>
${callout("note", "Template", "<p>'Senior engineer (X yrs) specializing in production GenAI — RAG, agents, and LLM evaluation on top of Python/FastAPI services. Shipped [flagship project] that [metric]. Strong on retrieval quality, evaluation, and cost/latency optimization.'</p>")}

<h2 id="github">GitHub &amp; README</h2>
<p>Your repo is read more carefully than your resume. Each portfolio project's README should have:</p>
<ul>
<li><strong>Problem &amp; who it's for</strong> — one paragraph.</li>
<li><strong>Architecture diagram</strong> — the pipeline at a glance.</li>
<li><strong>Quickstart</strong> — one command (<code>docker compose up</code>).</li>
<li><strong>Design decisions</strong> — chunking, hybrid, rerank, with <em>rationale</em> (this is what engineers read).</li>
<li><strong>Evaluation</strong> — your golden-set numbers (the standout signal).</li>
<li><strong>Limitations &amp; next steps</strong> — shows judgment.</li>
</ul>
${callout("warn", "Pin 2–3 deep repos, not 10 shallow ones", "<p>Two polished projects with eval numbers beat ten half-finished demos. Pin <a href='../projects/build-first-rag.html'>the RAG app</a>, <a href='../projects/build-first-agent.html'>an agent</a>, and <a href='../projects/monitoring-dashboard.html'>the monitoring dashboard</a>.</p>")}

<h2 id="explain">Explaining a project (the 2-minute template)</h2>
<ol>
<li><strong>Problem &amp; users</strong> (15s) — what and for whom.</li>
<li><strong>Architecture</strong> (30s) — the pipeline in one breath.</li>
<li><strong>Hardest decision</strong> (30s) — the tradeoff you made and why.</li>
<li><strong>How you knew it worked</strong> (30s) — the metric.</li>
<li><strong>What you'd do next</strong> (15s) — shows you see its limits.</li>
</ol>
<p>Then stop and let the interviewer pull threads. Every project page has a "Questions the interviewer may ask" section — rehearse those.</p>
${callout("tip", "Turn this project into interview answers →", "<p>After writing the Indorama Digitization Project on your resume or portfolio, practice explaining it using the dedicated project interview page. It covers production ML APIs, time-series data handling, health scoring, Kubernetes deployment, Mcube integration, and how to connect the project to GenAI roles.</p><p style='margin:8px 0 0'><a class='btn sm' href='../projects/indorama-interview-questions.html'>Practice Indorama Project Interview Questions →</a></p><p style='margin:10px 0 0;font-size:13px;color:var(--text-muted)'>Use this before project deep-dive, senior behavioral, and resume-screening rounds where the interviewer asks you to explain your strongest real-world AI/ML project.</p>")}

<h2 id="linkedin">LinkedIn &amp; recruiter screens</h2>
<ul>
<li>Headline: target role + specialty ('GenAI / Applied AI Engineer — RAG, Agents, LLMOps').</li>
<li>For <strong>India</strong> roles, list concrete stack (Python, FastAPI, vector DBs, LangGraph) — keyword-matched to JDs/ATS.</li>
<li>For <strong>global remote</strong>, emphasize async communication, ownership, and a public portfolio.</li>
<li>Recruiter screen: have a 60-second pitch (see <a href='start-here.html'>Start Here</a>) and one metric-backed project story ready.</li>
</ul>

<h2 id="mistakes">Common mistakes</h2>
<ul>
<li>Listing tools instead of impact and tradeoffs.</li>
<li>No metrics anywhere.</li>
<li>A README that's just install steps — no design rationale or evaluation.</li>
<li>Ten shallow repos; none deployed or evaluated.</li>
<li>Claiming 'fine-tuned LLMs' when you did prompting + RAG (interviewers will probe).</li>
</ul>

<h2 id="checklist">Pre-send checklist</h2>
<ul class="checklist">
<li>Every project bullet has a metric</li>
<li>3-line summary targets one role</li>
<li>2–3 pinned repos with eval numbers in the README</li>
<li>Each repo runs with one command</li>
<li>I can explain each project in 2 minutes using the template</li>
<li>No tool-listing without impact</li>
</ul>`;
  return { body, toc, prevNext: p.prevNext };
}

function qbankIndexBody(p) {
  const cats = QBANK.filter((x) => x.group === "qbank" && x.kind === "learn");
  const toc = [{ id: "use", title: "How to use it" }, { id: "cats", title: "Categories" }, { id: "meta", title: "Metadata legend" }];
  const cards = cats.map((c) => `<a class="card hover" href="${c.path.split("/").pop()}"><span class="ico">📂</span><h4>${c.data.pills ? "" : ""}${c.title}</h4><p>${c.data.questions.length} questions · model + senior answers, follow-ups, red flags.</p></a>`).join("");
  const body = `<div class="eyebrow"><span class="dot"></span> ${p.eyebrow}</div>
<h1>${p.title}</h1>
<p class="lead">${p.lead}</p>
<h2 id="use">How to use it</h2>
<p>Don't just read. Read the question, answer out loud, then open the card and compare against the model and senior answers. Aim to match the senior answer's structure: definition → example → tradeoff → production/safety concern. Topic pages also embed their own questions; this is the consolidated bank.</p>
<h2 id="cats">Categories</h2>
<div class="grid grid-2">${cards}</div>
<h2 id="meta">Metadata legend</h2>
${table(["Field", "Values"], [
  ["Difficulty", "Beginner · Intermediate · Advanced · Senior"],
  ["Round type", "screening · technical deep-dive · coding · system design · behavioral"],
  ["Seniority", "Mid · Senior · Staff"],
  ["Frequency", "high · medium · emerging (how often it's asked now)"],
  ["Region", "India · Global Remote · Both"],
])}`;
  return { body, toc, prevNext: p.prevNext };
}

// ----- assign prevNext across the full ordered sequence -----
const ordered = [];
GROUP_META.forEach((g) => ALL.filter((p) => p.group === g.id).forEach((p) => ordered.push(p)));
ordered.forEach((p, i) => {
  const prev = ordered[i - 1], next = ordered[i + 1];
  p.data.prevNext = {
    prev: prev ? { href: prev.path, title: prev.title } : null,
    next: next ? { href: next.path, title: next.title } : null,
  };
});

// ----- render each page -----
function renderOne(p) {
  const d = p.data;
  if (p.kind === "learn") return renderLearningPage(d);
  if (p.kind === "project") return renderProjectPage(d);
  if (p.kind === "sysdesign") return renderSystemDesignPage(d);
  if (p.kind === "mock") return renderMockPage(d);
  if (p.kind === "custom") {
    if (d.bodyBuilder) return startHereBody(d);
    if (d.finalRevision) return finalRevisionBody(d);
    if (d.resumeGuide) return resumeGuideBody(d);
    if (d.indorama) return indoramaBody(d);
    if (d.indoramaQ) return indoramaQBody(d);
    if (d.realStories) return realStoriesBody(d);
    if (d.ats) return atsBody(d);
    if (d.docqna) return docqnaBody(d);
    if (d.qbankIndex) return qbankIndexBody(d);
  }
  throw new Error("unknown kind " + p.kind + " for " + p.path);
}

let count = 0;
const dirs = new Set();
ALL.forEach((p) => {
  const groupLabel = GROUP_META.find((g) => g.id === p.group).label;
  const { body, toc, prevNext } = renderOne(p);
  const depth = p.path.includes("/") ? 1 : 0;
  const html = page({
    title: p.data.title || p.title,
    description: p.data.lead ? p.data.lead.replace(/<[^>]+>/g, "").slice(0, 155) : TAGLINE,
    depth, crumbs: `${groupLabel} / <b>${p.num} · ${p.title}</b>`,
    body, toc, prevNext,
  });
  const full = join(ROOT, p.path);
  const dir = dirname(full); dirs.add(dir); mkdirSync(dir, { recursive: true });
  writeFileSync(full, html, "utf8");
  count++;
});

// ----- client nav registry -> portal.js -----
const registry = GROUP_META.map((g) => ({
  id: g.id, label: g.label, mark: g.mark,
  pages: ALL.filter((p) => p.group === g.id).map((p) => ({ title: p.title, num: p.num, path: p.path, kw: p.kw || "" })),
}));
// add the landing page into the Get Started group at the top for nav
registry[0].pages.unshift({ title: "Home", num: "✦", path: "index.html", kw: "home landing overview interview hub" });

const tmpl = readFileSync(join(__dirname, "portal.template.js"), "utf8");
writeFileSync(join(ROOT, "assets", "portal.js"), tmpl.replace("__REGISTRY_JSON__", JSON.stringify(registry)), "utf8");

// ----- landing page -----
const landing = `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${SITE} — ${TAGLINE}</title>
<meta name="description" content="Interview-first GenAI preparation for experienced Python/backend/ML engineers (5–10 yrs) targeting GenAI roles in India and global remote companies. RAG, agents, evaluation, LLMOps, guardrails, system design, projects and mock interviews — with model answers.">
<script>(function(){try{var t=localStorage.getItem("gp.theme")||((window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)?"dark":"light");document.documentElement.setAttribute("data-theme",t);}catch(e){}})();</script>
<link rel="stylesheet" href="assets/portal.css">
</head>
<body data-hub-depth="0">
<div class="app">
  <aside class="sidebar">
    <div class="brand"><a href="index.html" style="display:flex;align-items:center;gap:12px;text-decoration:none;color:inherit"><div class="brand-mark">IV</div><div class="brand-text"><strong>${SITE}</strong><span>${TAGLINE}</span></div></a></div>
    <div class="search-wrap"><div class="search-box"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg><input type="text" data-search placeholder="Search the hub…  ( / )"></div><div class="search-results"></div></div>
    <nav class="nav"></nav>
  </aside>
  <div class="backdrop"></div>
  <div class="main">
    <header class="topbar"><button class="icon-btn menu-btn" aria-label="Menu"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg></button><div class="crumbs"><b>Home — ${SITE}</b></div><button class="icon-btn" data-theme-toggle aria-label="Toggle theme"></button></header>
    <div class="content-wrap">
      <main class="content">
        <div class="hero">
          <div class="eyebrow"><span class="dot"></span> Interview-first · not a textbook course</div>
          <h1>Become <span class="grad">interview-ready</span> for GenAI roles</h1>
          <p class="lead">A practical GenAI interview-preparation hub for experienced <strong>Python / backend / ML engineers (5–10 yrs)</strong> targeting GenAI, Applied AI, ML(LLMs), Platform and Architect roles — in India and at global remote companies. Every page gives you 60-second and 3-minute interview answers, real questions with model + senior answers, and a project to prove it.</p>
          <div class="meta-row" style="justify-content:flex-start">
            <a class="btn" href="pages/start-here.html">Start here →</a>
            <a class="btn ghost" href="pages/30-60-90-plan.html">See the 30/60/90 plan</a>
          </div>
          <div class="meta-row" style="justify-content:flex-start;margin-top:14px">
            <span class="pill red">RAG · Agents · Eval</span><span class="pill amber">LLMOps · Guardrails</span><span class="pill blue">System Design</span><span class="pill purple">${ALL.filter(p=>p.kind!=='custom').reduce((n,p)=>n+((p.data.questions&&p.data.questions.length)||0),0)}+ Q&amp;A</span>
          </div>
        </div>

        ${callout("key", "What makes this different", "<p><strong>Not</strong> a generic GenAI course. No long theory, no tool tours, no question lists without answers. Every topic is framed around what interviewers actually ask now — and backed by a project you build and can defend.</p>")}

        <h2 id="who">Who it's for &amp; what it prepares you for</h2>
        <div class="grid grid-2">
          <div class="card"><span class="ico">👤</span><h4>Experienced engineers</h4><p>5–10 yrs in Python / backend / ML who need to convert that into a GenAI offer — fast, with proof.</p></div>
          <div class="card"><span class="ico">🎯</span><h4>Every interview round</h4><p>Screening, technical deep-dive, coding, system design and behavioral — each with dedicated prep and mocks.</p></div>
        </div>

        <h2 id="topics">What matters most in GenAI interviews now</h2>
        <div class="grid grid-3">
          <a class="card hover" href="pages/rag-mastery.html"><span class="ico">📚</span><h4>RAG Mastery</h4><p>Chunking, hybrid search, reranking, citations, hallucination reduction, evaluation.</p></a>
          <a class="card hover" href="pages/agentic-ai.html"><span class="ico">🤖</span><h4>Agentic AI</h4><p>Tool/function calling, ReAct, planner-executor, LangGraph state, memory, guardrails.</p></a>
          <a class="card hover" href="pages/embeddings-vector-search.html"><span class="ico">🧭</span><h4>Embeddings &amp; Vector Search</h4><p>ANN/HNSW, hybrid dense+sparse, reranking, vector DB choice.</p></a>
          <a class="card hover" href="pages/llm-evaluation.html"><span class="ico">📊</span><h4>LLM Evaluation</h4><p>Golden sets, LLM-as-judge, faithfulness, eval as CI.</p></a>
          <a class="card hover" href="pages/llmops-observability.html"><span class="ico">📡</span><h4>LLMOps &amp; Observability</h4><p>Tracing, latency &amp; cost optimization, caching, fallbacks, monitoring.</p></a>
          <a class="card hover" href="pages/guardrails-security.html"><span class="ico">🛡️</span><h4>Guardrails &amp; Security</h4><p>Prompt-injection defense, PII, access control, agent safety.</p></a>
        </div>

        <h2 id="path">The learning path</h2>
        <p>Follow it top to bottom, building as you go. Use the grouped sidebar to jump anywhere.</p>
        <div class="grid grid-2">
          <a class="card hover" href="pages/start-here.html"><span class="ico">🚀</span><h4>1 · Get Started</h4><p>Positioning, <a href="pages/role-roadmap.html">role roadmap</a>, and the <a href="pages/30-60-90-plan.html">30/60/90 plan</a>.</p></a>
          <a class="card hover" href="pages/core-foundations.html"><span class="ico">🎓</span><h4>2 · Core Track</h4><p>Foundations → Prompting → Embeddings → RAG → Agents → Eval → LLMOps → Guardrails → System Design.</p></a>
          <a class="card hover" href="projects/build-first-rag.html"><span class="ico">🛠️</span><h4>3 · Hands-on Projects</h4><p>8 projects from First RAG App to a production monitoring dashboard — each with an interview explanation.</p></a>
          <a class="card hover" href="systemdesign/enterprise-knowledge-assistant.html"><span class="ico">🏗️</span><h4>4 · System Design</h4><p>7 worked enterprise GenAI designs with clarifying questions, layers and failure modes.</p></a>
          <a class="card hover" href="mocks/weekly-plan.html"><span class="ico">🎤</span><h4>5 · Mocks &amp; Revision</h4><p>RAG, agent, system-design, coding and behavioral mocks + final revision sheets.</p></a>
          <a class="card hover" href="qbank/index.html"><span class="ico">🗂️</span><h4>Q · Question Bank</h4><p>12 categories of metadata-tagged questions with model + senior answers.</p></a>
        </div>

        <h2 id="realproject">Featured real-world project</h2>
        <p>Production AI engineering experience is your strongest interview asset — lead with it.</p>
        <div class="grid grid-2">
          <a class="card hover" href="projects/indorama-digitization.html">
            <span class="ico">🏭</span>
            <h4>Indorama Digitization Project</h4>
            <p>Production ML APIs for industrial equipment monitoring. Built backend ML &amp; analytics APIs for plant loops/equipment, generated health/anomaly/KPI outputs, and integrated them with TCG Mcube dashboards.</p>
            <div class="meta-row" style="margin:10px 0 0">
              <span class="pill blue">Python</span><span class="pill blue">FastAPI</span><span class="pill">ML APIs</span><span class="pill amber">Time-series</span><span class="pill amber">Elasticsearch</span><span class="pill green">Kubernetes</span><span class="pill">Mcube</span>
            </div>
            <p style="margin-top:10px;font-size:13px;color:var(--text-muted)"><strong>Interview value:</strong> production AI engineering, backend API design, dashboard integration, Kubernetes deployment, and debugging — maps directly to RAG/agents/LLMOps.</p>
          </a>
        </div>

        <div class="page-nav"><span></span><a class="next" href="pages/start-here.html"><div class="dir">Begin →</div><div class="ttl">Start Here</div></a></div>
      </main>
      <div class="toc-rail"><nav class="toc"><div class="toc-title">On this page</div><a href="#who">Who it's for</a><a href="#topics">What matters most</a><a href="#path">The learning path</a><a href="#realproject">Featured project</a></nav></div>
    </div>
  </div>
</div>
<script src="assets/portal.js"></script>
</body>
</html>`;
writeFileSync(join(ROOT, "index.html"), landing, "utf8");

console.log(`Built ${count} content pages + landing + portal.js across ${dirs.size} dirs.`);
