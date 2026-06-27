import { callout } from "../render.mjs";
import { SRC } from "./sources.mjs";

export const QBANK = [];
// category pages use kind 'learn' with only lead/pills/questions (renders question cards).
const cat = (num, title, path, kw, lead, questions) =>
  QBANK.push({ kind: "learn", group: "qbank", num, title, path, kw,
    data: { eyebrow: "Question Bank", title: "Question Bank · " + title, lead, pills: [{ t: title, cls: "purple" }, { t: questions.length + " questions" }], questions } });

const q = (o) => ({ region: "Both", ...o });
const ul = (items) => "<ul>" + items.map((i) => `<li>${i}</li>`).join("") + "</ul>";

// Overview (custom)
QBANK.push({ kind: "custom", group: "qbank", num: "00", title: "Question Bank — Overview", path: "qbank/index.html",
  kw: "question bank overview categories metadata difficulty frequency region how to use",
  data: { eyebrow: "Question Bank", title: "Interview Question Bank", qbankIndex: true,
    lead: "Every question carries metadata — category, difficulty, round type, seniority, a frequency signal (how often it shows up now), and a region signal (India / Global Remote / Both) — plus a model answer, a stronger senior answer, likely follow-ups, the red-flag pattern, and a linked hands-on task. Topic-specific questions also live on each topic page; this is the consolidated, browsable bank." } });

// ── 1. LLM Basics ──
cat("01", "LLM Basics", "qbank/llm-basics.html", "llm basics tokens context window temperature hallucination decoding sampling",
  "Fundamentals that open most screening rounds.",
  [
    q({ q: "What is an LLM and how does it generate text?", difficulty: "Beginner", round: "screening", seniority: "Mid", frequency: "high",
      model: ["An LLM is a model that predicts the next word (token) in a sequence. It generates text by doing this repeatedly:", ul(["You give it some text (the prompt).", "It outputs a probability for every possible next token.", "It picks one, adds it to the text, and repeats until done.", "It keeps no memory between calls — each request only knows what you send it."])],
      senior: "A senior adds why this matters: because it's stateless, you must re-send chat history and any retrieved context every call; and because it predicts plausibility (not truth), quality is statistical — which is why we add retrieval, evaluation and guardrails.",
      followups: ["Why is it stateless?", "Where does the 'knowledge' come from?"], redflag: "Describing it as a database or search engine that 'looks up' answers.",
      why: "It's the foundation every other answer builds on; interviewers check you actually understand the mechanism.", task: "<a href='../pages/core-foundations.html'>Core Foundations</a>." }),
    q({ q: "Why do LLMs hallucinate?", difficulty: "Intermediate", round: "screening", seniority: "Senior", frequency: "high",
      model: ["Because the model generates the most <em>plausible-sounding</em> continuation, not necessarily the <em>true</em> one. When the likely text isn't the correct text, it still says it confidently.", "You reduce it (you can't fully remove it) by:", ul(["Grounding answers in retrieved sources (RAG).", "Telling it to cite sources and say 'I don't know' when unsure.", "Lowering temperature for factual tasks.", "Validating the answer against the source before showing it."])],
      senior: "A senior treats hallucination as a measurable number (a 'faithfulness' or 'groundedness' score), monitors it in production, and fixes it with architecture and evaluation — not by adding 'please don't hallucinate' to the prompt.",
      followups: ["How would you measure hallucination?", "What if retrieval finds nothing relevant?"], redflag: "'You just tell it not to hallucinate in the prompt.'",
      why: "It connects directly to RAG, evaluation and guardrails — the topics interviewers care most about.", task: "<a href='../pages/core-foundations.html#questions'>Foundations questions</a>." }),
    q({ q: "Explain temperature and top-p.", difficulty: "Beginner", round: "screening", seniority: "Mid", frequency: "medium",
      model: ["Both control how random the model's output is.", ul(["<strong>Temperature</strong> — higher = more random/creative, lower = more focused/repeatable.", "<strong>top-p</strong> — only sample from the most likely tokens that together cover p% of the probability.", "Use <strong>low</strong> (0–0.3) for extraction, classification or JSON; <strong>higher</strong> (0.7–1.0) for brainstorming or creative writing."])],
      senior: "A senior defaults to low temperature in production because it makes output reproducible and easy to evaluate, and only raises it where variety is genuinely the goal.",
      followups: ["Which would you use for JSON extraction and why?"], redflag: "Using high temperature for structured/extraction tasks.",
      why: "A quick check that you've actually worked with the API knobs." }),
    q({ q: "What is the context window and why does it constrain design?", difficulty: "Intermediate", round: "technical deep-dive", seniority: "Senior", frequency: "high",
      model: ["The context window is the maximum amount of text (tokens) the model can take in plus produce in a single call. It matters because:", ul(["Everything competes for that space — system prompt, chat history, and any retrieved documents.", "You pay per token and latency grows as it fills up.", "Very long contexts can lose accuracy in the middle ('lost in the middle')."])],
      senior: "A senior budgets the window deliberately — caps history, reranks retrieved context down to the few most relevant chunks — and knows that a bigger window isn't automatically better quality; relevance and placement matter more than raw size.",
      followups: ["What is 'lost in the middle'?", "How do you decide how many chunks to include?"], redflag: "Thinking the model remembers previous calls without you re-sending context.",
      why: "It directly shapes how you design RAG and chat memory." }),
  ]);

// ── 2. Prompt Engineering ──
cat("02", "Prompt Engineering", "qbank/prompt-engineering.html", "prompt engineering few shot structured output chain of thought system prompt json",
  "Practical prompting and reliable API integration.",
  [
    q({ q: "How do you get reliable structured (JSON) output from an LLM?", difficulty: "Intermediate", round: "coding", seniority: "Senior", frequency: "high",
      model: ["Don't try to extract JSON from free text with string parsing — it breaks. Instead:", ul(["Define a schema (e.g. a Pydantic model).", "Use the provider's structured-output / tool-calling feature and force it to use that schema.", "Validate the result against the schema.", "If validation fails, retry once or twice, feeding the error back to the model."])],
      senior: "A senior treats the schema as the single source of truth, bounds the retries, keeps temperature low, and logs the schema-failure rate as a quality signal (a rising rate usually means a prompt or schema drift).",
      followups: ["What do you do if it never produces valid output?", "How does this interact with streaming?"], redflag: "Parsing JSON out of prose with regex/string operations and no validation.",
      task: "<a href='../pages/prompting-llm-apis.html#hands-on'>Prompting hands-on</a>." }),
    q({ q: "When do you add few-shot examples?", difficulty: "Beginner", round: "screening", seniority: "Mid", frequency: "medium",
      model: ["Start with no examples (zero-shot). Add a few examples when:", ul(["You need a consistent output format or style.", "The task is ambiguous and examples clarify it.", "Use a small number (1–3) of high-quality, varied examples — not a pile of mediocre ones."])],
      senior: "A senior adds examples to fix a specific failure they've actually observed, and measures the trade-off (more examples = more tokens = more cost/latency). Often a clearer instruction or a schema beats adding examples.",
      followups: ["What's the downside of too many examples?"], redflag: "Stuffing 20 examples 'to be safe' without measuring whether they help." }),
    q({ q: "What is chain-of-thought and when is it worth it?", difficulty: "Intermediate", round: "technical deep-dive", seniority: "Senior", frequency: "medium",
      model: ["Chain-of-thought = letting the model 'think step by step' before giving the final answer. It helps on multi-step reasoning (math, logic, planning).", ul(["Use it for genuinely reasoning-heavy tasks.", "Don't use it for simple lookups — it just adds cost and latency.", "Hide the reasoning from end users; keep it internal."])],
      senior: "A senior notes the cost/latency trade-off and that modern reasoning models often handle this internally, so explicit CoT is needed less than it used to be.",
      followups: ["Do you show users the reasoning?"], redflag: "Adding 'think step by step' to every prompt, including trivial ones." }),
    q({ q: "How do you manage prompts in production?", difficulty: "Advanced", round: "system design", seniority: "Senior", frequency: "medium",
      model: ["Treat prompts as configuration, not code comments:", ul(["Store them outside the code and version them.", "A/B test changes instead of editing blindly.", "Run them through your evaluation set before shipping — a prompt edit is a production change.", "Be able to roll back to a previous prompt."])],
      senior: "A senior keeps a prompt registry tied into the evaluation CI, so no prompt change ships without passing the golden set, and every version is traceable.",
      followups: ["How would you A/B test a prompt?"], redflag: "Prompts buried as string literals in code with no versioning or testing.",
      task: "<a href='../pages/llmops-observability.html'>LLMOps</a>." }),
  ]);

// ── 3. Embeddings & Vector DB ──
cat("03", "Embeddings & Vector DB", "qbank/embeddings-vector-db.html", "embeddings vector database hnsw ann hybrid search bm25 reranking cosine recall",
  "Retrieval substrate questions — high frequency in applied loops.",
  [
    q({ q: "What is an embedding and why does cosine similarity work?", difficulty: "Beginner", round: "screening", seniority: "Mid", frequency: "high",
      model: ["An embedding turns a piece of text into a vector (a list of numbers) so that texts with similar meaning end up close together in that space.", "Cosine similarity measures the angle between two vectors — a small angle means similar meaning. So to find relevant text, you find the vectors closest to the query's vector."],
      senior: "A senior notes you normally normalize the vectors, that the embedding model must fit your domain, and that embeddings capture meaning but miss exact tokens (IDs, names) — which is why keyword search is still needed alongside them.",
      followups: ["When do embeddings fail to find the right text?"], redflag: "Can't explain what 'similar' means or how search uses it.",
      task: "<a href='../pages/embeddings-vector-search.html'>Embeddings & Vector Search</a>." }),
    q({ q: "Dense vs sparse vs hybrid retrieval — what's the difference?", difficulty: "Intermediate", round: "technical deep-dive", seniority: "Senior", frequency: "high",
      model: [ul(["<strong>Dense</strong> (embeddings) — great at meaning and paraphrase ('reset password' ≈ 'change my login').", "<strong>Sparse</strong> (BM25 / keyword) — great at exact terms: IDs, names, codes, rare words.", "<strong>Hybrid</strong> — run both, combine the results, then rerank. This is the production default because real questions need both."])],
      senior: "A senior weights the two by domain (more keyword weight for legal/finance/part-numbers, more semantic for conversational FAQ) and validates the choice on a labeled set rather than guessing.",
      followups: ["How do you combine the two result lists?"], redflag: "Insisting embeddings alone are always enough." }),
    q({ q: "What is an ANN index (HNSW) and what do you trade for speed?", difficulty: "Intermediate", round: "technical deep-dive", seniority: "Senior", frequency: "high",
      model: ["Searching millions of vectors exactly is too slow. An Approximate Nearest Neighbor (ANN) index like HNSW finds 'close enough' matches fast.", "The trade-off: you give up a little accuracy (recall) for a big speed gain. A setting like <code>ef_search</code> lets you tune that balance — higher = more accurate but slower."],
      senior: "A senior picks the setting from a latency budget: raise accuracy until it stops improving within the latency you can afford, and also accounts for memory and re-index cost as the data grows.",
      followups: ["How does HNSW differ from IVF?"], redflag: "Believing ANN search is exact/lossless.", source: SRC.hnsw }),
    q({ q: "How do you choose a vector database?", difficulty: "Intermediate", round: "system design", seniority: "Senior", frequency: "medium",
      model: ["Pick based on scale, filtering needs, and how much infra you want to run:", ul(["<strong>pgvector</strong> — you already run Postgres and scale is moderate.", "<strong>Qdrant / Weaviate / Milvus</strong> — large scale, heavy metadata filtering.", "<strong>FAISS</strong> — in-process, offline, or research.", "<strong>Managed (Pinecone etc.)</strong> — you don't want to operate infra."])],
      senior: "A senior starts from constraints (data residency, multi-tenancy, can the team run another stateful service?) and avoids adopting a heavy vector DB before the scale actually requires it — pgvector covers a lot.",
      followups: ["Why not always use a managed service?"], redflag: "Picking the trendiest DB with no reference to scale or operations." }),
    q({ q: "What does reranking add, and why a cross-encoder?", difficulty: "Advanced", round: "technical deep-dive", seniority: "Senior", frequency: "medium",
      model: ["First-pass search returns many roughly-relevant chunks. A reranker reorders the top candidates by true relevance and keeps only the best few.", "A cross-encoder reads the query and a chunk <em>together</em> (not separately), so it judges relevance much more precisely — at the cost of speed, which is why you only run it on the top ~50, not the whole corpus."],
      senior: "A senior uses reranking to keep the context small and precise (cheaper, less 'lost in the middle') and measures the recall@k improvement to justify it.",
      followups: ["Why not use a cross-encoder for the whole search?"], redflag: "Stuffing many un-reranked chunks straight into the prompt." }),
  ]);

// ── 4. RAG ──
cat("04", "RAG", "qbank/rag.html", "rag retrieval augmented chunking citations evaluation faithfulness fine tuning hallucination",
  "The most-tested category. See also the <a href='../pages/rag-mastery.html#questions'>RAG Mastery</a> questions.",
  [
    q({ q: "Walk me through a production RAG pipeline.", difficulty: "Intermediate", round: "technical deep-dive", seniority: "Senior", frequency: "high",
      model: ["RAG (Retrieval-Augmented Generation) grounds an LLM in your own data. It has two halves:", "<strong>Offline (done ahead of time):</strong>", ul(["<strong>Load</strong> the documents and extract text.", "<strong>Chunk</strong> them into smaller passages.", "<strong>Embed</strong> each chunk into a vector.", "<strong>Index</strong> the vectors in a vector database."]), "<strong>Online (each user question):</strong>", ul(["<strong>Retrieve</strong> the most relevant chunks (hybrid: semantic + keyword).", "<strong>Rerank</strong> them and keep the best few.", "<strong>Ground</strong> — put those chunks in the prompt with 'answer only from this context'.", "<strong>Generate + cite</strong> — the model answers and cites which chunk each claim came from.", "<strong>Validate</strong> the answer is supported before showing it."]), "Then evaluate both halves separately — retrieval quality and answer quality."],
      senior: "A senior adds the production concerns: access control so users only see permitted docs, caching for cost/latency, observability (logging the retrieved chunks per query), an 'I don't know' path, and running evaluation automatically on every change.",
      followups: ["Where does it most commonly fail?", "How do you handle permissions / multi-tenant data?", "How do you keep the index fresh?"], redflag: "Describing only 'embed → cosine search → stuff into the prompt' with no reranking, citations or evaluation.",
      task: "<a href='../projects/build-first-rag.html'>Build First RAG App</a>.", source: SRC.ragPaper }),
    q({ q: "RAG vs fine-tuning — when do you pick which?", difficulty: "Intermediate", round: "technical deep-dive", seniority: "Senior", frequency: "high",
      model: [ul(["<strong>RAG</strong> — for knowledge that changes often, is large, or must be sourced/audited. Updating means re-indexing, not retraining.", "<strong>Fine-tuning</strong> — for changing the model's behavior, format, tone or domain style.", "They combine: fine-tune the <em>how it talks</em>, use RAG for the <em>facts</em>."])],
      senior: "A senior defaults to RAG because updates are cheap and answers are auditable, and only fine-tunes when prompting + RAG can't hit a behavioral or format target — and even then prefers lightweight (LoRA) fine-tuning.",
      followups: ["Can you do both at once?"], redflag: "'Just fine-tune the model on our documents' as the default for a knowledge problem." }),
    q({ q: "How do you choose a chunking strategy?", difficulty: "Advanced", round: "technical deep-dive", seniority: "Senior", frequency: "high",
      model: ["Chunking = how you split documents. It's the highest-leverage RAG decision:", ul(["Too big → embeddings get diluted and you waste context space.", "Too small → the answer gets split across chunks.", "Start with fixed-size + ~10–20% overlap; move to splitting on document structure (headings/sections) for structured docs.", "A common best option: 'parent-document' — match on small precise chunks but return the larger surrounding passage for context."])],
      senior: "A senior treats chunking as an experiment driven by a labeled query set, checking whether answers span chunk boundaries, rather than picking a fixed number by habit.",
      followups: ["What overlap do you use and why?"], redflag: "'Always 512 tokens' with no reference to the documents or any measurement." }),
    q({ q: "How do you evaluate a RAG system?", difficulty: "Advanced", round: "technical deep-dive", seniority: "Senior", frequency: "high",
      model: ["Evaluate the two halves separately so you know which one failed:", ul(["<strong>Retrieval</strong> — did it find the right documents? Metrics: recall@k, MRR, on a labeled set of question→relevant-doc.", "<strong>Generation</strong> — is the answer supported by the retrieved context (faithfulness), relevant, and correct vs a known answer?"]), "Use a small 'golden' set of test cases, and an LLM-as-judge to score at scale."],
      senior: "A senior runs evaluation like CI (every change must not regress), grows the test set from real production failures, and calibrates the LLM judge against some human labels so they trust it.",
      followups: ["How big should the golden set be?", "How do you trust an LLM judge?"], redflag: "'We eyeballed a few answers and they looked good.'",
      task: "<a href='../pages/llm-evaluation.html'>LLM Evaluation</a>.", source: SRC.ragas }),
    q({ q: "How do you reduce hallucination in a RAG system?", difficulty: "Advanced", round: "technical deep-dive", seniority: "Senior", frequency: "high",
      model: [ul(["<strong>Ground + cite or abstain</strong> — instruct the model to answer only from the provided context, cite sources, and say 'I don't have enough information' otherwise.", "<strong>Better retrieval</strong> — hybrid search + reranking so the right context is actually present.", "<strong>Coverage gate</strong> — if the best retrieved chunk scores too low, abstain or escalate instead of guessing.", "<strong>Faithfulness check</strong> — verify the answer's claims are supported before showing it."])],
      senior: "A senior makes hallucination a tracked metric with a deploy gate, rather than a vague hope, and samples production traffic to keep measuring it.",
      followups: ["What if retrieval returns nothing relevant?"], redflag: "Trying to fix it purely with prompt wording like 'be accurate'." }),
  ]);

// ── 5. Agentic AI ──
cat("05", "Agentic AI", "qbank/agentic-ai.html", "agents tool calling react planner executor reliability injection workflow memory",
  "Fast-rising category. See also <a href='../pages/agentic-ai.html#questions'>Agentic AI</a>.",
  [
    q({ q: "How does an agent / tool calling actually work?", difficulty: "Intermediate", round: "technical deep-dive", seniority: "Senior", frequency: "high",
      model: ["An agent is an LLM in a loop with tools. The cycle:", ul(["You give the model a set of tools (functions) with their input schemas.", "It outputs a structured request to call one tool with some arguments.", "<strong>Your code</strong> runs the real function and returns the result.", "The result goes back into the conversation; the model decides the next step or gives a final answer.", "Repeat until done — with a maximum step limit."]), "Key point: the model only <em>proposes</em> a call; your runtime actually executes it."],
      senior: "A senior frames it as 'model proposes, runtime disposes': the runtime is the trust boundary, so it validates the arguments, keeps tools least-privilege, and bounds the loop. That framing is what makes agents safe.",
      followups: ["What stops it from looping forever?", "What if a tool fails?"], redflag: "Thinking the LLM itself runs the code/tool.",
      task: "<a href='../projects/build-first-agent.html'>Build First Agent App</a>.", source: SRC.anthropicTools }),
    q({ q: "ReAct vs planner-executor vs stateful graph?", difficulty: "Advanced", round: "technical deep-dive", seniority: "Senior", frequency: "medium",
      model: [ul(["<strong>ReAct</strong> — reason and act one step at a time, adapting as it goes. Flexible but can wander and is hard to predict.", "<strong>Planner-executor</strong> — make a full plan first, then execute the steps. Predictable and easier to debug.", "<strong>Stateful graph (LangGraph)</strong> — model the agent as nodes/edges with explicit state, checkpoints and human-in-the-loop. The production-grade option."])],
      senior: "A senior leans toward planner-executor or an explicit graph in production because predictability, cost control and observability matter more than raw flexibility.",
      followups: ["How do you bound cost in ReAct?"], redflag: "Treating ReAct as always the best choice." }),
    q({ q: "Why do agents fail in production, and how do you make them reliable?", difficulty: "Advanced", round: "technical deep-dive", seniority: "Senior", frequency: "high",
      model: ["Common failures:", ul(["Looping forever, or calling the wrong tool / wrong arguments.", "One bad early step cascading into a wrong result.", "Cost blowups from too many calls.", "Prompt injection hidden in tool outputs."]), "Fixes:", ul(["Bound the loop (max steps) and set a token/cost budget.", "Validate every tool call against its schema.", "Make tools least-privilege and idempotent; add timeouts/retries.", "Guard inputs and outputs; treat tool results as untrusted."])],
      senior: "A senior adds explicit state with checkpointing (retry a step, not the whole run), human-in-the-loop on risky actions, and full tracing so the decision path is debuggable.",
      followups: ["Where do you put human-in-the-loop?"], redflag: "No mention of bounding the loop or budgets." }),
    q({ q: "When would you NOT build an agent?", difficulty: "Intermediate", round: "system design", seniority: "Senior", frequency: "medium",
      model: ["When the steps are known in advance. Then a plain deterministic workflow (with maybe one LLM call per step) is cheaper, faster, more testable, and more reliable than a free-running agent loop."],
      senior: "A senior defaults to the least-agentic solution that works and only escalates to a full agent when the path is genuinely dynamic at runtime. That restraint signals maturity.",
      followups: ["Give an example you'd build as a workflow, not an agent."], redflag: "Reaching for an agent for everything because it's impressive." }),
  ]);

// ── 6. Frameworks ──
cat("06", "LangChain / LangGraph / LlamaIndex", "qbank/frameworks.html", "langchain langgraph llamaindex frameworks orchestration abstraction state",
  "Framework questions — answer them as 'tools with tradeoffs', never as fandom.",
  [
    q({ q: "When would you use LangGraph over plain orchestration?", difficulty: "Advanced", round: "technical deep-dive", seniority: "Senior", frequency: "emerging",
      model: ["LangGraph models an agent as a graph of nodes and edges with explicit shared state. Reach for it when you need:", ul(["Explicit state passed between steps.", "Conditional routing (different next step based on results).", "Checkpointing — retry/resume a single step, not the whole run.", "Human-in-the-loop approval at certain points."])],
      senior: "A senior uses it for control and observability but notes you can achieve the same with disciplined plain Python — the framework is a convenience, not the architecture.",
      followups: ["What does the checkpointer give you?"], redflag: "Using it just because it's popular, with no reason.",
      task: "<a href='../pages/agentic-ai.html'>Agentic AI</a>.", source: SRC.langgraph }),
    q({ q: "LangChain vs LlamaIndex — how do you frame the difference?", difficulty: "Intermediate", round: "technical deep-dive", seniority: "Senior", frequency: "medium",
      model: [ul(["<strong>LangChain</strong> — broad orchestration toolkit (chains, agents, integrations).", "<strong>LlamaIndex</strong> — centered on data indexing and retrieval for RAG.", "Both are conveniences layered over the same underlying primitives (LLM calls, embeddings, vector search)."])],
      senior: "A senior picks by fit, keeps the abstraction thin, and is willing to drop to the raw API when the framework hides too much.",
      followups: ["When do frameworks hurt you?"], redflag: "Treating a framework as the system instead of a tool." }),
    q({ q: "What's the risk of heavy framework abstraction in production?", difficulty: "Advanced", round: "system design", seniority: "Senior", frequency: "emerging",
      model: ["Heavy abstractions can:", ul(["Hide the actual prompts and control flow, making debugging hard.", "Make cost and latency harder to see and control.", "Break on version upgrades."])],
      senior: "A senior keeps a clean seam so the framework is replaceable, and traces exactly what gets sent to the model regardless of the framework.",
      followups: ["How do you see what the framework actually sends the model?"], redflag: "Having no idea what prompt the framework is actually sending." }),
  ]);

// ── 7. LLM Evaluation ──
cat("07", "LLM Evaluation", "qbank/llm-evaluation.html", "evaluation golden dataset llm as judge faithfulness offline online ci regression",
  "Strong seniority signal. See also <a href='../pages/llm-evaluation.html#questions'>LLM Evaluation</a>.",
  [
    q({ q: "How do you evaluate a GenAI feature, before and after shipping?", difficulty: "Advanced", round: "technical deep-dive", seniority: "Senior", frequency: "high",
      model: [ul(["<strong>Offline</strong> — run a curated 'golden' set of test cases before deploy, like a test suite, and block the release if quality drops.", "<strong>Online</strong> — sample real production traffic and score it with the same checks, plus capture user feedback (thumbs up/down).", "For RAG, split the metrics into retrieval quality and answer quality."])],
      senior: "A senior runs evaluation as CI (no change ships without passing the golden set) and closes the loop — every production failure becomes a new test case.",
      followups: ["How big should the golden set be?"], redflag: "'We manually check a few outputs.'",
      task: "<a href='../pages/llm-evaluation.html#hands-on'>Eval hands-on</a>." }),
    q({ q: "How do you trust an LLM-as-judge?", difficulty: "Advanced", round: "technical deep-dive", seniority: "Senior", frequency: "medium",
      model: ["LLM-as-judge means using an LLM to score outputs. To trust it:", ul(["Give it a clear scoring rubric and low temperature.", "Prefer comparing against a reference answer or pairwise comparisons.", "Check its scores against a sample of human labels (calibration).", "Watch for biases — it may favor longer answers or the first option."])],
      senior: "A senior measures the judge's agreement with humans on a labeled sample, uses a different/stronger model as judge than the one being judged, and versions the judge prompt.",
      followups: ["What if the same model is judge and generator?"], redflag: "Treating judge scores as ground truth with no calibration.", source: SRC.ragas }),
    q({ q: "What is a golden dataset, and how big should it be?", difficulty: "Intermediate", round: "technical deep-dive", seniority: "Mid–Senior", frequency: "high",
      model: ["A golden dataset is a curated set of test inputs with expected answers or pass/fail criteria, used to measure quality and catch regressions.", ul(["Coverage matters more than size — 30–200 well-chosen cases beat thousands of near-duplicates.", "Include happy paths, edge cases, adversarial inputs, and 'should say I don't know' cases.", "Grow it from real production failures."])],
      senior: "A senior tags cases by category (so they can see which type regressed) and keeps a permanent adversarial slice as a gate.",
      followups: ["How do you keep it from going stale?"], redflag: "Thinking you need thousands of cases before you can start." }),
    q({ q: "Offline eval passes but users complain — what do you do?", difficulty: "Advanced", round: "technical deep-dive", seniority: "Senior", frequency: "medium",
      model: ["It means your golden set doesn't reflect real usage. So:", ul(["Sample the failing production traffic and look at what actually went wrong.", "Add those cases to the golden set.", "Check whether the input distribution has drifted (users asking new kinds of questions)."])],
      senior: "A senior closes the loop online → golden set continuously, and monitors input drift so they catch the shift before users do.",
      followups: ["How do you detect drift without labels?"], redflag: "Insisting it must be fine because offline passed." }),
  ]);

// ── 8. LLMOps & Observability ──
cat("08", "LLMOps & Observability", "qbank/llmops.html", "llmops observability tracing cost latency caching streaming fallback monitoring drift",
  "Backend engineers' edge. See also <a href='../pages/llmops-observability.html#questions'>LLMOps</a>.",
  [
    q({ q: "How do you reduce the cost of an LLM feature without hurting quality?", difficulty: "Advanced", round: "system design", seniority: "Senior", frequency: "high",
      model: [ul(["<strong>Cache</strong> repeated queries (exact matches and semantically similar ones).", "<strong>Route</strong> easy requests to a cheaper/smaller model, reserve the big model for hard ones.", "<strong>Trim</strong> the prompt/context to what's needed.", "<strong>Batch</strong> offline work.", "Always re-run your evaluation after a change so quality doesn't silently drop."])],
      senior: "A senior measures cost-per-request first to optimize where the money actually is, and runs every cost change through the eval gate — never trading quality blindly.",
      followups: ["How does semantic caching work and when is it risky?"], redflag: "Downgrading the model with no eval to confirm quality held.",
      task: "<a href='../projects/monitoring-dashboard.html'>Monitoring Dashboard</a>." }),
    q({ q: "What do you trace in an LLM app, and why?", difficulty: "Intermediate", round: "technical deep-dive", seniority: "Senior", frequency: "high",
      model: ["Trace the whole request as a tree of steps:", ul(["Which chunks were retrieved.", "The prompts and model calls.", "Any tool calls.", "Token counts, cost and latency per step.", "Quality scores."]), "This lets you debug why an answer was bad, slow, or expensive. Tools like Langfuse/LangSmith do this."],
      senior: "A senior attaches one trace id end-to-end and logs the retrieved context with every answer — that single habit makes most RAG debugging a quick lookup (was it retrieval or generation that failed?).",
      followups: ["How do you handle PII in traces?"], redflag: "Logging only the final answer with no intermediate steps.", source: SRC.langfuse }),
    q({ q: "How do you keep the feature reliable when the model provider is slow or down?", difficulty: "Advanced", round: "system design", seniority: "Senior", frequency: "medium",
      model: [ul(["Set timeouts and retries with backoff.", "Have a fallback model or a second provider.", "Handle rate limits gracefully.", "Degrade gracefully — serve a cached or smaller-model answer, or an honest 'try again', instead of failing hard.", "Use circuit breakers so you stop hammering a failing provider."])],
      senior: "A senior designs provider failure as a normal event, with a fallback whose quality they've already validated on the eval set, and tiers of degradation under load.",
      followups: ["How do you ensure the fallback model's quality is acceptable?"], redflag: "Assuming one provider with no fallback or timeout." }),
    q({ q: "How do you cut latency for a RAG or agent app?", difficulty: "Intermediate", round: "technical deep-dive", seniority: "Senior", frequency: "medium",
      model: [ul(["<strong>Stream</strong> the answer so the user sees text immediately.", "Run retrieval and independent tool calls <strong>in parallel</strong>.", "Use a <strong>smaller/faster model</strong> where quality allows (check on eval).", "Tighten retrieval so you process fewer chunks.", "<strong>Cache</strong> frequent results."])],
      senior: "A senior optimizes p95 latency against a target SLO and measures per-step latency from traces first, so they fix the actual bottleneck.",
      followups: ["What does streaming make harder?"], redflag: "Guessing at fixes without measuring where the time goes." }),
  ]);

// ── 9. Security / Guardrails ──
cat("09", "Security / Guardrails", "qbank/security-guardrails.html", "prompt injection guardrails pii access control tool security jailbreak data leak",
  "Increasingly a dedicated round. See also <a href='../pages/guardrails-security.html#questions'>Guardrails & Security</a>.",
  [
    q({ q: "What is prompt injection and how do you defend against it?", difficulty: "Advanced", round: "technical deep-dive", seniority: "Senior", frequency: "high",
      model: ["Prompt injection is when malicious instructions trick the model into ignoring its real instructions. Two forms:", ul(["<strong>Direct</strong> — the user types 'ignore previous instructions and…'.", "<strong>Indirect</strong> — hidden instructions inside a retrieved document or tool output that the model then follows. This is the dangerous one for RAG/agents."]), "Defenses (layered, no single fix):", ul(["Treat all retrieved/tool content as untrusted data, never as instructions.", "Validate outputs before using them.", "Keep tool permissions least-privilege so a hijacked model can't do damage."])],
      senior: "A senior emphasizes indirect injection, assumes some attempts will succeed, and limits the blast radius — plus adds injection cases to the eval set as a permanent gate.",
      followups: ["How would you exfiltrate data from a naive RAG agent?"], redflag: "'Just tell the model in the system prompt to ignore injection attempts.'", source: SRC.promptInjection }),
    q({ q: "How do you stop a RAG system from leaking data a user shouldn't see?", difficulty: "Advanced", round: "system design", seniority: "Senior", frequency: "high",
      model: ["Enforce access control at the retrieval step, not in the prompt:", ul(["Tag each chunk with permission metadata (which group/role can see it).", "Filter the search by the requesting user's permissions, so restricted documents are never even candidates.", "For hard boundaries, use separate indexes per tenant.", "Add an output PII/secret check as a backstop."])],
      senior: "A senior carries the source system's permissions into the chunk metadata at ingestion and tests 'restricted query returns nothing' as a hard invariant. The model is the last thing they'd trust to enforce permissions.",
      followups: ["Per-document permissions vs separate indexes — when each?"], redflag: "Relying on a prompt instruction to keep restricted data hidden." }),
    q({ q: "How do you secure an agent that can take actions (send email, run SQL)?", difficulty: "Advanced", round: "system design", seniority: "Senior", frequency: "medium",
      model: [ul(["Give each tool the minimum capability it needs (e.g. read-only SQL with row limits).", "Validate every tool argument.", "Require confirmation or human approval for destructive/irreversible actions.", "Control what the agent can reach (egress) and log every action for audit.", "Treat tool outputs as untrusted (injection risk)."])],
      senior: "A senior makes safety come from what the tools <em>can't</em> do, not from the model behaving — because the model can be manipulated.",
      followups: ["How do you make a SQL tool safe?"], redflag: "Giving the agent broad write/delete access and trusting it to behave." }),
    q({ q: "Direct vs indirect injection — which is worse for agents?", difficulty: "Advanced", round: "technical deep-dive", seniority: "Senior", frequency: "emerging",
      model: ["Indirect is worse. A poisoned document or web page can contain hidden instructions that the agent reads and then acts on — sending data or taking actions — without the user being malicious at all."],
      senior: "A senior designs so that even if the model is hijacked, the tools and permissions prevent real damage, and tests for it explicitly.",
      followups: ["How would you test for indirect injection?"], redflag: "Only knowing about 'ignore previous instructions'." }),
  ]);

// ── 10. GenAI System Design ──
cat("10", "GenAI System Design", "qbank/system-design.html", "system design architecture framework tradeoffs enterprise rag platform multi tenant",
  "Level-deciding for senior roles. See the seven worked <a href='../systemdesign/enterprise-knowledge-assistant.html'>designs</a>.",
  [
    q({ q: "Design an enterprise knowledge assistant over our internal docs.", difficulty: "Senior", round: "system design", seniority: "Senior/Staff", frequency: "high",
      model: ["Drive it with a framework:", ul(["<strong>Clarify</strong> — which sources, permissions, freshness, scale, quality bar.", "<strong>Requirements</strong> — functional (cited answers, follow-ups) and non-functional (latency, cost, no data leaks).", "<strong>Architecture (layers)</strong> — ingestion → retrieval (with access control) → orchestration → safety → evaluation → observability.", "<strong>Close with tradeoffs and failure modes.</strong>"])],
      senior: "A senior front-loads the non-functional bar (it drives every choice), enforces access control at retrieval, and treats evaluation and observability as design components — not afterthoughts.",
      followups: ["How do you keep the index fresh?", "How do permissions work?"], redflag: "'The user asks the LLM and it answers' — no retrieval quality, safety or evaluation.",
      task: "<a href='../systemdesign/enterprise-knowledge-assistant.html'>Worked design</a>." }),
    q({ q: "How is GenAI system design different from classic system design?", difficulty: "Intermediate", round: "system design", seniority: "Senior", frequency: "medium",
      model: ["It includes all the usual concerns (APIs, storage, caching, scaling) plus extra ones:", ul(["The model is probabilistic — correctness is statistical, not exact.", "Retrieval quality and hallucination risk.", "Prompt/version management.", "Token cost and model latency dominate.", "Safety, prompt injection, and evaluation/feedback loops."])],
      senior: "A senior makes evaluation and observability first-class parts of the architecture and designs the feedback loop (production failures → eval set → improvement) in from the start.",
      followups: ["Where does evaluation live in the architecture?"], redflag: "Treating it like a normal CRUD service design." }),
    q({ q: "Design a multi-tenant production RAG platform (used by many teams).", difficulty: "Senior", round: "system design", seniority: "Staff", frequency: "emerging",
      model: ["It's a shared platform, not one app:", ul(["Shared ingestion, retrieval, and a model gateway (routing, caching, fallback, rate limits).", "A shared evaluation harness and guardrail layer every app inherits.", "Per-tenant isolation (separate namespaces) and cost attribution.", "Central observability."])],
      senior: "A senior makes standards executable — an app can't onboard without passing baseline eval and inheriting guardrails — and keeps the gateway highly available since it's the critical path.",
      followups: ["How do you attribute cost per tenant?", "How do you stop a shared cache leaking across tenants?"], redflag: "One shared index for all tenants with no isolation story.",
      task: "<a href='../systemdesign/production-rag-platform.html'>RAG Platform</a>." }),
  ]);

// ── 11. Python Coding ──
cat("11", "Python Coding", "qbank/python-coding.html", "python coding structured output retry async rate limit recall pytest typing pydantic",
  "Applied GenAI engineering, not LeetCode. See the <a href='../mocks/python-coding-mock.html'>coding mock</a>.",
  [
    q({ q: "Write a function that returns validated JSON from an LLM, retrying on failure.", difficulty: "Intermediate", round: "coding", seniority: "Senior", frequency: "high",
      model: ["Approach:", ul(["Define the output shape as a Pydantic model.", "Call the LLM forcing structured-output / tool-calling against that schema.", "Validate the response; if it fails, retry a bounded number of times, passing the validation error back to the model.", "Keep temperature low and log how often validation fails."])],
      senior: "A senior makes the schema the source of truth, bounds the retries, and tracks the failure rate as a quality metric.",
      followups: ["What if it never produces valid output?", "How do you test this?"], redflag: "Using regex/string parsing on prose with no validation." }),
    q({ q: "Make 100 LLM calls concurrently without exceeding a rate limit.", difficulty: "Advanced", round: "coding", seniority: "Senior", frequency: "medium",
      model: ["Use asyncio with a concurrency cap:", ul(["Wrap calls in <code>asyncio.gather</code>.", "Use a <code>Semaphore</code> (or a token bucket) to limit how many run at once.", "Catch errors so one failure doesn't sink the batch.", "Retry on rate-limit (429) errors with exponential backoff."])],
      senior: "A senior bounds concurrency, uses jittered backoff, and surfaces partial failures rather than silently dropping them.",
      followups: ["How do you handle 429 errors specifically?"], redflag: "Firing all 100 requests at once with no limit." }),
    q({ q: "Implement recall@k for a retriever.", difficulty: "Intermediate", round: "coding", seniority: "Mid–Senior", frequency: "medium",
      model: ["recall@k = of the documents that should have been found, what fraction appear in the top k results.", ul(["For each query: count how many of its relevant docs are in the top k, divide by total relevant.", "Average across all queries.", "Handle edge cases: ties, fewer than k results, queries with no relevant docs."])],
      senior: "A senior writes a quick test and handles the edge cases cleanly.",
      followups: ["How would you add MRR?"], redflag: "Off-by-one errors or ignoring edge cases." }),
    q({ q: "Stream an LLM response and parse it safely.", difficulty: "Advanced", round: "coding", seniority: "Senior", frequency: "emerging",
      model: [ul(["Stream tokens to the UI so the user sees progress.", "But buffer the full response before acting on it for anything a program consumes.", "Only validate/parse and take action on the completed message, not partial fragments."])],
      senior: "A senior separates 'display to the human' from 'trust for the program' — guarding and validating the final, complete message.",
      followups: ["How do you apply a guardrail to a streamed answer?"], redflag: "Acting on partial, unvalidated streamed output." }),
  ]);

// ── 12. Senior / Behavioral ──
cat("12", "Senior Engineer / Behavioral", "qbank/behavioral.html", "behavioral senior leadership ownership impact conflict ambiguity influence star metrics",
  "Where strong engineers lose offers by under-selling. See the <a href='../mocks/behavioral-mock.html'>behavioral mock</a>.",
  [
    q({ q: "Tell me about a GenAI project you owned and its impact.", difficulty: "Senior", round: "behavioral", seniority: "Senior", frequency: "high",
      model: ["Use the STAR structure and lead with impact:", ul(["<strong>Situation</strong> — the problem and who it was for.", "<strong>Task</strong> — your specific responsibility.", "<strong>Action</strong> — the decisions <em>you</em> made and the architecture.", "<strong>Result</strong> — the metric you moved (latency, cost, quality, adoption)."])],
      senior: "A senior leads with the business impact and a number, owns the tradeoffs they made, and credits the team without hiding their own role.",
      followups: ["What was the hardest tradeoff?", "What would you change?"], redflag: "Saying 'we' for everything with no clear personal contribution and no metric." }),
    q({ q: "Tell me about a time you were wrong, or a project failed.", difficulty: "Senior", round: "behavioral", seniority: "Senior", frequency: "high",
      model: ["Pick a real failure and structure it:", ul(["What happened and what you got wrong.", "What you learned.", "What you changed afterward so it wouldn't happen again."])],
      senior: "A senior shows reflection plus a systemic fix — e.g. 'so I added an evaluation gate that would have caught it' — not just 'I worked harder'.",
      followups: ["What did you change systemically?"], redflag: "A fake weakness or humblebrag ('I just care too much')." }),
    q({ q: "How do you handle ambiguous or under-specified requirements?", difficulty: "Senior", round: "behavioral", seniority: "Senior/Staff", frequency: "medium",
      model: [ul(["Ask clarifying questions to narrow the goal.", "State your assumptions explicitly so others can correct them.", "Ship a thin slice quickly, then iterate with feedback.", "Communicate tradeoffs as you go."])],
      senior: "A senior drives alignment among stakeholders, de-risks the unknowns early, and keeps people informed of the tradeoffs.",
      followups: ["Give a concrete example."], redflag: "Waiting to be told exactly what to do before starting." }),
    q({ q: "How did you influence a technical decision without authority?", difficulty: "Senior", round: "behavioral", seniority: "Senior/Staff", frequency: "medium",
      model: [ul(["Make the case with data or a quick prototype rather than opinion.", "Listen to and address the other side's concerns.", "Build consensus instead of overruling."])],
      senior: "A senior frames the argument in business terms and brings a measured prototype or eval result to make it concrete.",
      followups: ["What if you lost the argument?"], redflag: "'I just told them I was right.'" }),
  ]);

export default QBANK;
