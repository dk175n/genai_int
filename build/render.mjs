// =========================================================================
// GenAI Interview Hub — render engine
// Turns structured page-data objects into full, offline static HTML pages
// that reuse the shared design system (assets/portal.css) and the client
// sidebar/search/toc controller (assets/portal.js).
// =========================================================================

export const SITE = "GenAI Interview Hub";
export const TAGLINE = "Interview-first GenAI prep for senior engineers";

// ---- small helpers ----
const A = (x) => (Array.isArray(x) ? x : x == null ? [] : [x]);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// "../" prefix to reach the hub root from a page that sits `depth` folders deep.
function up(depth) { return depth > 0 ? "../".repeat(depth) : ""; }

// ---- block-level content renderers (authored content is trusted HTML) ----
export function callout(kind, title, body) {
  const ico = { tip: "✅", note: "📝", warn: "⚠️", danger: "⛔", key: "🎯" }[kind] || "💡";
  return `<div class="callout ${kind}"><div class="c-ico">${ico}</div><div class="c-body">${title ? `<div class="c-title">${title}</div>` : ""}${body}</div></div>`;
}

export function table(headers, rows) {
  const th = headers.map((h) => `<th>${h}</th>`).join("");
  const tb = rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("");
  return `<div class="table-wrap"><table><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table></div>`;
}

export function code(lang, body, opts = {}) {
  const cls = opts.mermaid ? "code-block mermaid-src" : "code-block";
  return `<div class="${cls}"><div class="code-head"><span class="lang"><span class="dots"><i></i><i></i><i></i></span>${lang}</span><button class="copy-btn" type="button">Copy</button></div><pre><code>${esc(body)}</code></pre></div>`;
}

// A CSS architecture rail (offline, on-brand). nodes: [{t, s, accent}]
export function flow(nodes, dir = "tb") {
  const lr = dir === "lr" ? " lr" : "";
  const parts = nodes.map((n, i) => {
    const node = `<div class="rf${n.accent ? " accent" : ""}"><div>${n.t}${n.s ? `<small>${n.s}</small>` : ""}</div></div>`;
    return i < nodes.length - 1 ? node + `<div class="arr"></div>` : node;
  });
  return `<div class="ragflow${lr}">${parts.join("")}</div>`;
}

// Mermaid + a rendered CSS-flow fallback side by side.
export function diagram(mermaidSrc, fallbackFlow, caption) {
  return `${fallbackFlow || ""}${mermaidSrc ? code("mermaid", mermaidSrc, { mermaid: true }) : ""}${caption ? `<div class="diagram-caption">${caption}</div>` : ""}`;
}

// ---- interview question card ----
// q: {q, difficulty, round, seniority, frequency, region, model, senior, followups:[], redflag, task, why, source}
export function questionCard(q, idx) {
  const id = q.id || slugify(q.q).slice(0, 60) + "-" + idx;
  const tag = (cls, txt) => `<span class="qtag ${cls}">${txt}</span>`;
  const tags = [
    q.difficulty ? tag(q.difficulty.toLowerCase(), q.difficulty) : "",
    q.round ? tag("", q.round) : "",
    q.seniority ? tag("", q.seniority) : "",
    q.frequency ? tag("freq-" + q.frequency.toLowerCase(), "freq: " + q.frequency) : "",
    q.region ? tag("", q.region) : "",
  ].filter(Boolean).join("");
  const blocks = [];
  if (q.why) blocks.push(`<h5>Why this is asked now</h5><p>${q.why}</p>`);
  if (q.model) blocks.push(`<h5>Model answer</h5>${A(q.model).map((p) => (p.startsWith("<") ? p : `<p>${p}</p>`)).join("")}`);
  if (q.senior) blocks.push(`<h5>Strong senior-level answer</h5><div class="senioranswer">${A(q.senior).map((p) => (p.startsWith("<") ? p : `<p>${p}</p>`)).join("")}</div>`);
  if (q.followups && q.followups.length) blocks.push(`<h5>Likely follow-ups</h5><ul>${A(q.followups).map((f) => `<li>${f}</li>`).join("")}</ul>`);
  if (q.redflag) blocks.push(`<h5>Red-flag answer pattern</h5><div class="redflag">${q.redflag}</div>`);
  if (q.task) blocks.push(`<h5>Related hands-on task / project</h5><p>${q.task}</p>`);
  if (q.source) blocks.push(`<h5>Source / evidence</h5><p>${q.source}</p>`);
  return `<details class="qcard" id="${id}"><summary><span class="q-text"><span class="qx">Q</span><span>${q.q}</span></span><span class="q-tags">${tags}</span></summary><div class="q-body">${blocks.join("")}</div></details>`;
}

// ---- standard learning-page assembly ----
// Renders the required template sections in the prescribed order. Every section
// is optional; only present sections are emitted (with a matching TOC anchor).
export function renderLearningPage(p) {
  const toc = [];
  const out = [];
  const sec = (id, title, html) => { if (!html) return; toc.push({ id, title }); out.push(`<h2 id="${id}">${title}</h2>${html}`); };

  // meta strip (audience / goal / what you'll learn)
  const metaRows = [];
  if (p.audience) metaRows.push(`<div class="row"><span class="k">Audience</span><span class="v">${p.audience}</span></div>`);
  if (p.goal) metaRows.push(`<div class="row"><span class="k">Goal</span><span class="v">${p.goal}</span></div>`);
  if (p.learn) metaRows.push(`<div class="row"><span class="k">You'll learn</span><span class="v"><ul style="margin:0;padding-left:18px">${A(p.learn).map((l) => `<li>${l}</li>`).join("")}</ul></span></div>`);
  const metaBlock = metaRows.length ? `<div class="ix-meta">${metaRows.join("")}</div>` : "";

  if (p.whyInterviews) sec("why", "Why this topic shows up in interviews", A(p.whyInterviews).map((x) => (x.startsWith("<") ? x : `<p>${x}</p>`)).join(""));

  // 60s / 3min answers
  let answers = "";
  if (p.answer60) answers += `<div class="ans s60"><div class="ans-head"><span class="clock">60 sec</span> The crisp interview answer</div><div class="ans-body">${A(p.answer60).map((x) => (x.startsWith("<") ? x : `<p>${x}</p>`)).join("")}</div></div>`;
  if (p.answer3) answers += `<div class="ans"><div class="ans-head"><span class="clock">3 min</span> The deeper answer that signals seniority</div><div class="ans-body">${A(p.answer3).map((x) => (x.startsWith("<") ? x : `<p>${x}</p>`)).join("")}</div></div>`;
  if (answers) sec("answers", "Interview answers — 60-second & 3-minute", answers);

  if (p.concept) sec("concept", "Core concept", A(p.concept).join(""));
  if (p.diagram) sec("architecture", "Architecture / decision flow", p.diagram);
  if (p.tradeoffs) sec("tradeoffs", "Tradeoffs", table(p.tradeoffs.headers, p.tradeoffs.rows));

  if (p.questions && p.questions.length) {
    const qhtml = p.questions.map((q, i) => questionCard(q, i)).join("");
    sec("questions", `Interview questions on this topic (${p.questions.length})`, `<p>Click any question to reveal a model answer, a stronger senior-level answer, likely follow-ups and the red-flag pattern interviewers listen for.</p>${qhtml}`);
  }

  if (p.followups) sec("followups", "Likely follow-up directions", `<ul>${A(p.followups).map((f) => `<li>${f}</li>`).join("")}</ul>`);
  if (p.hands) sec("hands-on", "Hands-on task", A(p.hands).map((x) => (x.startsWith("<") ? x : `<p>${x}</p>`)).join(""));
  if (p.portfolio) sec("portfolio", "Portfolio connection", A(p.portfolio).map((x) => (x.startsWith("<") ? x : `<p>${x}</p>`)).join(""));
  if (p.mistakes) sec("mistakes", "Common mistakes", `<ul>${A(p.mistakes).map((m) => `<li>${m}</li>`).join("")}</ul>`);
  if (p.checklist) sec("revision", "Revision checklist", `<ul class="checklist">${A(p.checklist).map((c) => `<li>${c}</li>`).join("")}</ul>`);
  if (p.sources) sec("sources", "Sources", `<ul>${A(p.sources).map((s) => `<li>${s}</li>`).join("")}</ul>`);

  const body = `<div class="eyebrow"><span class="dot"></span> ${p.eyebrow || "Interview Prep"}</div>
<h1>${p.title}</h1>
${p.lead ? `<p class="lead">${p.lead}</p>` : ""}
${p.pills ? `<div class="meta-row">${A(p.pills).map((x) => `<span class="pill ${x.cls || ""}">${x.t}</span>`).join("")}</div>` : ""}
${metaBlock}
${out.join("\n")}`;

  return { body, toc, prevNext: p.prevNext };
}

// ---- full HTML document shell ----
export function page({ title, description, depth, crumbs, body, toc, prevNext, bodyClass = "" }) {
  const U = up(depth);
  const tocHtml = (toc && toc.length)
    ? `<div class="toc-title">On this page</div>` + toc.map((t) => `<a href="#${t.id}">${t.title}</a>`).join("")
    : "";
  const pn = prevNext
    ? `<div class="page-nav">${prevNext.prev ? `<a href="${U}${prevNext.prev.href}"><div class="dir">← Previous</div><div class="ttl">${prevNext.prev.title}</div></a>` : "<span></span>"}${prevNext.next ? `<a class="next" href="${U}${prevNext.next.href}"><div class="dir">Next →</div><div class="ttl">${prevNext.next.title}</div></a>` : "<span></span>"}</div>`
    : "";
  return `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} — ${SITE}</title>
<meta name="description" content="${esc(description || TAGLINE)}">
<script>(function(){try{var t=localStorage.getItem("gp.theme")||((window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)?"dark":"light");document.documentElement.setAttribute("data-theme",t);}catch(e){}})();</script>
<link rel="stylesheet" href="${U}assets/portal.css">
</head>
<body data-hub-depth="${depth}" class="${bodyClass}">
<div class="app">
  <aside class="sidebar">
    <div class="brand">
      <a href="${U}index.html" style="display:flex;align-items:center;gap:12px;text-decoration:none;color:inherit">
        <div class="brand-mark">IV</div>
        <div class="brand-text"><strong>${SITE}</strong><span>${TAGLINE}</span></div>
      </a>
    </div>
    <div class="search-wrap">
      <div class="search-box">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <input type="text" data-search placeholder="Search the hub…  ( / )">
      </div>
      <div class="search-results"></div>
    </div>
    <nav class="nav"></nav>
  </aside>
  <div class="backdrop"></div>
  <div class="main">
    <header class="topbar">
      <button class="icon-btn menu-btn" aria-label="Menu"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg></button>
      <div class="crumbs">${crumbs || `<b>${esc(title)}</b>`}</div>
      <button class="icon-btn" data-theme-toggle aria-label="Toggle theme"></button>
    </header>
    <div class="content-wrap">
      <main class="content">
${body}
${pn}
      </main>
      <div class="toc-rail"><nav class="toc">${tocHtml}</nav></div>
    </div>
  </div>
</div>
<script src="${U}assets/portal.js"></script>
</body>
</html>`;
}

// ---- generic section list renderer (for spec-style pages) ----
// sections: [{id,title,html}] -> {body, toc}
export function renderSectionsPage(p, sections) {
  const toc = [];
  const out = [];
  sections.forEach((s) => {
    if (!s || !s.html) return;
    toc.push({ id: s.id, title: s.title });
    out.push(`<h2 id="${s.id}">${s.title}</h2>${s.html}`);
  });
  const body = `<div class="eyebrow"><span class="dot"></span> ${p.eyebrow || "Interview Prep"}</div>
<h1>${p.title}</h1>
${p.lead ? `<p class="lead">${p.lead}</p>` : ""}
${p.pills ? `<div class="meta-row">${A(p.pills).map((x) => `<span class="pill ${x.cls || ""}">${x.t}</span>`).join("")}</div>` : ""}
${out.join("\n")}`;
  return { body, toc, prevNext: p.prevNext };
}

// Project page: required spec structure + interview questions about the project.
export function renderProjectPage(p) {
  const S = (id, title, html) => ({ id, title, html });
  const list = (arr) => `<ul>${A(arr).map((x) => `<li>${x}</li>`).join("")}</ul>`;
  const block = (x) => A(x).map((y) => (y.startsWith("<") ? y : `<p>${y}</p>`)).join("");
  const sections = [
    p.proves && S("proves", "What this project proves in an interview", block(p.proves)),
    p.architecture && S("architecture", "Architecture", p.architecture),
    p.stack && S("stack", "Tech stack options", p.stack.headers ? table(p.stack.headers, p.stack.rows) : list(p.stack)),
    p.api && S("api", "API design", block(p.api)),
    p.dataflow && S("dataflow", "Data flow", block(p.dataflow)),
    p.evalplan && S("eval", "Evaluation plan", block(p.evalplan)),
    p.failures && S("failures", "Failure modes", list(p.failures)),
    p.demo && S("demo", "Demo script", block(p.demo)),
    p.readme && S("readme", "GitHub README structure", block(p.readme)),
    p.explain && S("explain", "Interview explanation template", block(p.explain)),
    p.questions && p.questions.length && S("questions", `Questions the interviewer may ask about this project (${p.questions.length})`, p.questions.map((q, i) => questionCard(q, i)).join("")),
    p.checklist && S("checklist", "Build & ship checklist", `<ul class="checklist">${A(p.checklist).map((c) => `<li>${c}</li>`).join("")}</ul>`),
  ].filter(Boolean);
  return renderSectionsPage(p, sections);
}

// System design page: required spec structure.
export function renderSystemDesignPage(p) {
  const S = (id, title, html) => ({ id, title, html });
  const list = (arr) => `<ul>${A(arr).map((x) => `<li>${x}</li>`).join("")}</ul>`;
  const block = (x) => A(x).map((y) => (y.startsWith("<") ? y : `<p>${y}</p>`)).join("");
  const sections = [
    p.intro && S("intro", "The brief", block(p.intro)),
    p.clarify && S("clarify", "Clarifying questions to ask first", list(p.clarify)),
    p.functional && S("functional", "Functional requirements", list(p.functional)),
    p.nonfunctional && S("nonfunctional", "Non-functional requirements", list(p.nonfunctional)),
    p.architecture && S("architecture", "Architecture", p.architecture),
    p.ingestion && S("ingestion", "Data ingestion layer", block(p.ingestion)),
    p.retrieval && S("retrieval", "Retrieval layer", block(p.retrieval)),
    p.orchestration && S("orchestration", "Model / orchestration layer", block(p.orchestration)),
    p.safety && S("safety", "Safety layer", block(p.safety)),
    p.evaluation && S("evaluation", "Evaluation layer", block(p.evaluation)),
    p.observability && S("observability", "Observability layer", block(p.observability)),
    p.costlatency && S("costlatency", "Cost & latency tradeoffs", p.costlatency.headers ? table(p.costlatency.headers, p.costlatency.rows) : block(p.costlatency)),
    p.failures && S("failures", "Failure modes", list(p.failures)),
    p.tenmin && S("tenmin", "How to explain this design in 10 minutes", block(p.tenmin)),
    p.interruptions && S("interruptions", "Common interviewer interruptions & how to answer", p.interruptions.headers ? table(p.interruptions.headers, p.interruptions.rows) : block(p.interruptions)),
    p.questions && p.questions.length && S("questions", `Interview questions on this design (${p.questions.length})`, p.questions.map((q, i) => questionCard(q, i)).join("")),
  ].filter(Boolean);
  return renderSectionsPage(p, sections);
}

// Mock interview page.
export function renderMockPage(p) {
  const S = (id, title, html) => ({ id, title, html });
  const list = (arr) => `<ul>${A(arr).map((x) => `<li>${x}</li>`).join("")}</ul>`;
  const block = (x) => A(x).map((y) => (y.startsWith("<") ? y : `<p>${y}</p>`)).join("");
  const sections = [
    p.intro && S("intro", "Overview", block(p.intro)),
    p.script && S("script", "Interviewer script", block(p.script)),
    p.timing && S("timing", "Timing plan", p.timing.headers ? table(p.timing.headers, p.timing.rows) : block(p.timing)),
    p.questions && p.questions.length && S("questions", "Questions", p.questions.map((q, i) => questionCard(q, i)).join("")),
    p.strong && S("strong", "Expected answer signals (strong)", list(p.strong)),
    p.weak && S("weak", "Weak answer signals", list(p.weak)),
    p.rubric && S("rubric", "Scoring rubric", p.rubric.headers ? table(p.rubric.headers, p.rubric.rows) : block(p.rubric)),
    p.debrief && S("debrief", "Debrief checklist", `<ul class="checklist">${A(p.debrief).map((c) => `<li>${c}</li>`).join("")}</ul>`),
  ].filter(Boolean);
  return renderSectionsPage(p, sections);
}
