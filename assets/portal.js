/* =========================================================================
   GenAI Interview Hub — client controller (self-contained, offline)
   Builds the grouped sidebar + cross-hub search from a single injected
   registry, handles theme, right-rail TOC scroll-spy, code copy buttons,
   the mobile drawer and the desktop sidebar collapse. No dependencies.
   ========================================================================= */
(function () {
  "use strict";
  var GROUPS = [{"id":"start","label":"Get Started","mark":"1","pages":[{"title":"Home","num":"✦","path":"index.html","kw":"home landing overview interview hub"},{"title":"Start Here","num":"01","path":"pages/start-here.html","kw":"start here positioning who is this for interview readiness genai roles india remote"},{"title":"Role Roadmap","num":"02","path":"pages/role-roadmap.html","kw":"role roadmap genai engineer applied ai ml engineer llm platform titles skills jd hiring signals"},{"title":"30 / 60 / 90 Day Plan","num":"03","path":"pages/30-60-90-plan.html","kw":"30 60 90 day plan study schedule preparation timeline roadmap weekly"}]},{"id":"core","label":"Core Track","mark":"2","pages":[{"title":"Core GenAI Foundations","num":"04","path":"pages/core-foundations.html","kw":"llm tokens context window temperature decoding sampling next token prediction hallucination foundations transformer attention"},{"title":"Prompting & LLM APIs","num":"05","path":"pages/prompting-llm-apis.html","kw":"prompt engineering system prompt few shot chain of thought structured output json function calling streaming llm api fastapi"},{"title":"Embeddings & Vector Search","num":"06","path":"pages/embeddings-vector-search.html","kw":"embeddings vector database cosine similarity hnsw ann faiss qdrant pgvector hybrid search bm25 reranking semantic search recall"},{"title":"RAG Mastery","num":"07","path":"pages/rag-mastery.html","kw":"rag retrieval augmented generation chunking strategies grounded generation citations hallucination reduction rag evaluation hybrid search reranking context"},{"title":"Agentic AI","num":"08","path":"pages/agentic-ai.html","kw":"agents tool calling function calling react planner executor langgraph stateful agent memory guardrails multi-agent loop autonomy"},{"title":"LLM Evaluation","num":"09","path":"pages/llm-evaluation.html","kw":"llm evaluation golden dataset llm as judge faithfulness groundedness answer relevance ragas offline online eval metrics regression ci"},{"title":"LLMOps & Observability","num":"10","path":"pages/llmops-observability.html","kw":"llmops observability tracing langfuse langsmith latency cost optimization caching streaming fallback models deployment monitoring rate limiting"},{"title":"Guardrails & Security","num":"11","path":"pages/guardrails-security.html","kw":"guardrails security prompt injection defense pii safety input validation output validation jailbreak tool security least privilege content moderation"},{"title":"GenAI System Design","num":"12","path":"pages/genai-system-design.html","kw":"genai system design interview framework architecture clarifying requirements retrieval orchestration safety evaluation observability cost latency tradeoffs enterprise"}]},{"id":"projects","label":"Hands-on Projects","mark":"3","pages":[{"title":"Build First RAG App","num":"01","path":"projects/build-first-rag.html","kw":"first rag app project build retrieval augmented generation fastapi pgvector citations eval portfolio"},{"title":"Build First Agent App","num":"02","path":"projects/build-first-agent.html","kw":"first agent app tool calling react bounded loop guardrails fastapi project portfolio"},{"title":"PDF Q&A App","num":"03","path":"projects/pdf-qna.html","kw":"pdf qna question answering rag chunking citations upload"},{"title":"SQL Agent","num":"04","path":"projects/sql-agent.html","kw":"sql agent text to sql database tool calling read only guardrails"},{"title":"Email Triage Agent","num":"05","path":"projects/email-triage.html","kw":"email triage agent classification structured output routing automation"},{"title":"Research Assistant Agent","num":"06","path":"projects/research-assistant.html","kw":"research assistant agent multi step web search planner executor synthesis citations"},{"title":"Customer Support RAG Bot","num":"07","path":"projects/customer-support-rag.html","kw":"customer support rag bot knowledge base escalation guardrails citations deflection"},{"title":"Resume Screening RAG App","num":"08","path":"projects/resume-screening-rag.html","kw":"resume screening rag app candidate matching jd structured extraction fairness bias"},{"title":"Production GenAI Monitoring Dashboard","num":"09","path":"projects/monitoring-dashboard.html","kw":"monitoring dashboard observability tracing langfuse cost latency quality drift alerts llmops project"}]},{"id":"sysdesign","label":"System Design","mark":"4","pages":[{"title":"Enterprise Knowledge Assistant","num":"01","path":"systemdesign/enterprise-knowledge-assistant.html","kw":"enterprise knowledge assistant rag internal docs access control system design confluence sharepoint"},{"title":"Customer Support Bot","num":"02","path":"systemdesign/customer-support-bot.html","kw":"customer support bot rag escalation deflection multichannel system design"},{"title":"Document Q&A for Legal / Finance / HR","num":"03","path":"systemdesign/document-qa-regulated.html","kw":"legal finance hr document qa regulated compliance audit citations high stakes system design"},{"title":"Code Assistant Agent","num":"04","path":"systemdesign/code-assistant-agent.html","kw":"code assistant agent repo rag tools tests sandbox system design copilot"},{"title":"SQL Data Agent","num":"05","path":"systemdesign/sql-data-agent.html","kw":"sql data agent analytics text to sql semantic layer governance read only system design"},{"title":"Multi-Agent Business Workflow","num":"06","path":"systemdesign/multi-agent-workflow.html","kw":"multi agent business workflow orchestration supervisor handoff state human in the loop system design"},{"title":"Production RAG Platform","num":"07","path":"systemdesign/production-rag-platform.html","kw":"production rag platform multi tenant shared infrastructure gateway eval harness observability system design"}]},{"id":"mocks","label":"Mocks & Revision","mark":"5","pages":[{"title":"Weekly Mock Interview Plan","num":"01","path":"mocks/weekly-plan.html","kw":"weekly mock interview plan schedule practice rounds debrief"},{"title":"RAG Mock Interview","num":"02","path":"mocks/rag-mock.html","kw":"rag mock interview chunking retrieval evaluation hallucination questions rubric"},{"title":"Agent Mock Interview","num":"03","path":"mocks/agent-mock.html","kw":"agent mock interview tool calling react reliability guardrails questions rubric"},{"title":"System Design Mock Interview","num":"04","path":"mocks/system-design-mock.html","kw":"system design mock interview genai architecture framework rubric clarifying tradeoffs"},{"title":"Python Coding Mock Round","num":"05","path":"mocks/python-coding-mock.html","kw":"python coding mock round llm api structured output retry async pytest rubric"},{"title":"Senior Behavioral Mock Round","num":"06","path":"mocks/behavioral-mock.html","kw":"senior behavioral mock round leadership ownership impact conflict star rubric"},{"title":"Resume, GitHub & Portfolio Guide","num":"07","path":"mocks/resume-portfolio.html","kw":"resume github portfolio guide cv bullet points metrics readme project explanation linkedin recruiter ats senior genai engineer"},{"title":"Final Revision Sheets","num":"08","path":"mocks/final-revision.html","kw":"final revision sheets cheat sheet flashcards last minute summary one pager"}]},{"id":"qbank","label":"Question Bank","mark":"Q","pages":[{"title":"Question Bank — Overview","num":"00","path":"qbank/index.html","kw":"question bank overview categories metadata difficulty frequency region how to use"},{"title":"LLM Basics","num":"01","path":"qbank/llm-basics.html","kw":"llm basics tokens context window temperature hallucination decoding sampling"},{"title":"Prompt Engineering","num":"02","path":"qbank/prompt-engineering.html","kw":"prompt engineering few shot structured output chain of thought system prompt json"},{"title":"Embeddings & Vector DB","num":"03","path":"qbank/embeddings-vector-db.html","kw":"embeddings vector database hnsw ann hybrid search bm25 reranking cosine recall"},{"title":"RAG","num":"04","path":"qbank/rag.html","kw":"rag retrieval augmented chunking citations evaluation faithfulness fine tuning hallucination"},{"title":"Agentic AI","num":"05","path":"qbank/agentic-ai.html","kw":"agents tool calling react planner executor reliability injection workflow memory"},{"title":"LangChain / LangGraph / LlamaIndex","num":"06","path":"qbank/frameworks.html","kw":"langchain langgraph llamaindex frameworks orchestration abstraction state"},{"title":"LLM Evaluation","num":"07","path":"qbank/llm-evaluation.html","kw":"evaluation golden dataset llm as judge faithfulness offline online ci regression"},{"title":"LLMOps & Observability","num":"08","path":"qbank/llmops.html","kw":"llmops observability tracing cost latency caching streaming fallback monitoring drift"},{"title":"Security / Guardrails","num":"09","path":"qbank/security-guardrails.html","kw":"prompt injection guardrails pii access control tool security jailbreak data leak"},{"title":"GenAI System Design","num":"10","path":"qbank/system-design.html","kw":"system design architecture framework tradeoffs enterprise rag platform multi tenant"},{"title":"Python Coding","num":"11","path":"qbank/python-coding.html","kw":"python coding structured output retry async rate limit recall pytest typing pydantic"},{"title":"Senior Engineer / Behavioral","num":"12","path":"qbank/behavioral.html","kw":"behavioral senior leadership ownership impact conflict ambiguity influence star metrics"}]},{"id":"myprojects","label":"My Projects & Experience","mark":"★","pages":[{"title":"Indorama Digitization Project","num":"★","path":"projects/indorama-digitization.html","kw":"indorama digitization project industrial ai oil gas fertilizer plant equipment monitoring backend ml apis fastapi elasticsearch time-series kubernetes docker mcube anomaly health score trip score instrumentation kpi production ml engineer real world experience portfolio"},{"title":"Indorama Interview Questions","num":"★Q","path":"projects/indorama-interview-questions.html","kw":"indorama project interview questions backend ml api time-series elasticsearch anomaly health score trip instrumentation kpi fastapi kubernetes docker mcube dashboard deployment debugging genai transition rag agents llmops production ml"},{"title":"My Real Project Stories","num":"★S","path":"projects/my-real-project-stories.html","kw":"my real project stories indorama yield optimizer real-time optimization differential evolution multiprocessing oil gas digital twin paypal marketing analytics clustering segmentation nvidia edge deployment flask docker transfer learning project deep dive behavioral resume screening genai bridge positioning"},{"title":"ATS Resume Screening Assistant","num":"★A","path":"projects/ats-resume-screening-assistant.html","kw":"ats resume screening assistant rag hr candidate shortlisting job description matching skill extraction embeddings semantic match explainable score fastapi vector db pdf parsing structured extraction responsible ai guardrails human in the loop genai hr project recruiter shortlisting"},{"title":"Document QnA RAG App","num":"★D","path":"projects/document-qna-rag-app.html","kw":"document qna rag app scalable question answering thousands pdfs async ingestion batch embedding vector db qdrant faiss pgvector reranking hybrid search citations latency optimization caching streaming celery redis langfuse fastapi enterprise knowledge search document intelligence genai portfolio project"}]}];

  var depth = parseInt(document.body.getAttribute("data-hub-depth") || "0", 10);
  var UP = depth > 0 ? new Array(depth + 1).join("../") : "";
  function href(p) { return UP + p; }

  // Current page, expressed as a hub-root-relative path (e.g. "index.html",
  // "pages/start-here.html", "qbank/index.html"). We reconstruct it from the
  // last (depth+1) path segments, so index.html in different folders never
  // collide. depth comes from <body data-hub-depth>.
  var loc = location.pathname.replace(/\\/g, "/");
  var parts = loc.split("/").filter(Boolean);
  if (!parts.length || !/\.[a-z0-9]+$/i.test(parts[parts.length - 1])) parts.push("index.html"); // directory URL → index.html
  var rel = parts.slice(Math.max(0, parts.length - (depth + 1))).join("/");
  function isCurrent(path) { return path === rel; }

  var currentGroup = null;
  GROUPS.forEach(function (g) { g.pages.forEach(function (p) { if (isCurrent(p.path)) currentGroup = g; }); });

  function buildSidebar() {
    var nav = document.querySelector(".nav"); if (!nav) return;
    var html = "";
    GROUPS.forEach(function (g) {
      var open = (g === currentGroup);
      html += '<div class="navgroup' + (open ? " open" : "") + '" data-group="' + g.id + '">';
      html += '<button class="navgroup-head" aria-expanded="' + (open ? "true" : "false") + '"><span class="ng-mk">' + g.mark + '</span><span class="ng-label">' + g.label + '</span><svg class="ng-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></button>';
      html += '<div class="navgroup-body">';
      g.pages.forEach(function (p) {
        var active = isCurrent(p.path) ? " active" : "";
        html += '<a class="nav-item' + active + '" href="' + href(p.path) + '"><span class="num">' + p.num + '</span><span class="nt">' + p.title + '</span></a>';
      });
      html += '</div></div>';
    });
    nav.innerHTML = html; nav.classList.add("sitenav");
    nav.querySelectorAll(".navgroup-head").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var grp = btn.closest(".navgroup"); var o = grp.classList.toggle("open");
        btn.setAttribute("aria-expanded", o ? "true" : "false");
      });
    });
    var app = document.querySelector(".app");
    if (app) nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { app.classList.remove("nav-open"); }); });
  }

  function setupSearch() {
    var input = document.querySelector("[data-search]"); var out = document.querySelector(".search-results");
    if (!input || !out) return;
    var index = []; GROUPS.forEach(function (g) { g.pages.forEach(function (p) { index.push({ p: p, group: g.label }); }); });
    function escp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
    function render(q) {
      q = q.trim().toLowerCase(); if (!q) { out.innerHTML = ""; return; }
      var hits = index.map(function (r) {
        var hay = (r.p.title + " " + r.group + " " + (r.p.kw || "")).toLowerCase(); var s = 0;
        if (r.p.title.toLowerCase().indexOf(q) > -1) s += 10;
        q.split(/\s+/).forEach(function (w) { if (w && hay.indexOf(w) > -1) s += 1; });
        return { r: r, s: s };
      }).filter(function (x) { return x.s > 0; }).sort(function (a, b) { return b.s - a.s; }).slice(0, 10);
      if (!hits.length) { out.innerHTML = '<div class="search-empty">No results for "' + q + '"</div>'; return; }
      out.innerHTML = hits.map(function (h) {
        var p = h.r.p; var t = p.title.replace(new RegExp("(" + escp(q) + ")", "i"), "<b>$1</b>");
        return '<a class="search-result" href="' + href(p.path) + '"><span class="sr-group">' + h.r.group + '</span>' + t + '</a>';
      }).join("");
    }
    input.addEventListener("input", function (e) { render(e.target.value); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement !== input && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
      if (e.key === "Escape") { input.blur(); out.innerHTML = ""; }
    });
  }

  function setupTheme() {
    var btn = document.querySelector("[data-theme-toggle]"); if (!btn) return;
    function icon() {
      var dark = document.documentElement.getAttribute("data-theme") === "dark";
      btn.innerHTML = dark
        ? '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></svg>'
        : '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z"/></svg>';
    }
    icon();
    btn.addEventListener("click", function () {
      var dark = document.documentElement.getAttribute("data-theme") === "dark";
      var t = dark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", t);
      try { localStorage.setItem("gp.theme", t); } catch (e) {}
      icon();
    });
  }

  function setupCopy() {
    document.querySelectorAll(".copy-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var pre = b.closest(".code-block").querySelector("pre code");
        var txt = pre ? pre.innerText : "";
        var done = function () { b.textContent = "Copied"; b.classList.add("copied"); setTimeout(function () { b.textContent = "Copy"; b.classList.remove("copied"); }, 1500); };
        if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, done); else done();
      });
    });
  }

  function setupTocSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".toc a"));
    if (!links.length) return;
    var targets = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); }).filter(Boolean);
    function onScroll() {
      var top = window.scrollY + 90, cur = null;
      targets.forEach(function (t) { if (t.offsetTop <= top) cur = t.id; });
      links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + cur); });
    }
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }

  function setupSidebarToggle() {
    var app = document.querySelector(".app"); var menu = document.querySelector(".menu-btn"); if (!app) return;
    try { if (localStorage.getItem("gp.sidebar") === "collapsed") app.classList.add("sidebar-collapsed"); } catch (e) {}
    function isMobile() { return window.matchMedia("(max-width: 860px)").matches; }
    if (menu) menu.addEventListener("click", function () {
      if (isMobile()) app.classList.toggle("nav-open");
      else { var c = app.classList.toggle("sidebar-collapsed"); try { localStorage.setItem("gp.sidebar", c ? "collapsed" : "open"); } catch (e) {} }
    });
    var bd = document.querySelector(".backdrop"); if (bd) bd.addEventListener("click", function () { app.classList.remove("nav-open"); });
    window.addEventListener("resize", function () { if (!isMobile()) app.classList.remove("nav-open"); });
  }

  function injectFooter() {
    var content = document.querySelector(".content"); if (!content || content.querySelector(".site-footer")) return;
    var f = document.createElement("footer"); f.className = "site-footer";
    f.innerHTML = '<span>GenAI Interview Hub</span><span class="sep">·</span><span>Interview-first prep for senior GenAI engineers</span><span class="sep">·</span><a href="' + href("index.html") + '">Home</a>';
    content.appendChild(f);
  }

  function init() { buildSidebar(); setupSearch(); setupTheme(); setupCopy(); setupTocSpy(); setupSidebarToggle(); injectFooter(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
