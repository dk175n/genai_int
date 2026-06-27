// Real, stable reference URLs reused across question `source` fields.
const link = (url, label) => `<a href="${url}" target="_blank" rel="noopener">${label}</a>`;

export const SRC = {
  ragPaper: link("https://arxiv.org/abs/2005.11401", "Lewis et al., 2020 — RAG (arXiv)"),
  react: link("https://arxiv.org/abs/2210.03629", "Yao et al., 2022 — ReAct (arXiv)"),
  lostMiddle: link("https://arxiv.org/abs/2307.03172", "Liu et al., 2023 — Lost in the Middle (arXiv)"),
  hnsw: link("https://arxiv.org/abs/1603.09320", "Malkov & Yashunin — HNSW (arXiv)"),
  contextualRetrieval: link("https://www.anthropic.com/news/contextual-retrieval", "Anthropic — Contextual Retrieval"),
  anthropicTools: link("https://docs.anthropic.com/en/docs/build-with-claude/tool-use", "Anthropic — Tool use docs"),
  anthropicAgents: link("https://www.anthropic.com/engineering/building-effective-agents", "Anthropic — Building effective agents"),
  openaiEmbeddings: link("https://platform.openai.com/docs/guides/embeddings", "OpenAI — Embeddings guide"),
  ragas: link("https://docs.ragas.io/", "RAGAS — RAG evaluation metrics"),
  langfuse: link("https://langfuse.com/docs", "Langfuse docs"),
  langsmith: link("https://docs.smith.langchain.com/", "LangSmith docs"),
  langgraph: link("https://langchain-ai.github.io/langgraph/", "LangGraph docs"),
  llamaindex: link("https://docs.llamaindex.ai/", "LlamaIndex docs"),
  langchain: link("https://python.langchain.com/docs/introduction/", "LangChain docs"),
  pgvector: link("https://github.com/pgvector/pgvector", "pgvector (GitHub)"),
  qdrant: link("https://qdrant.tech/documentation/", "Qdrant docs"),
  faiss: link("https://github.com/facebookresearch/faiss/wiki", "FAISS wiki"),
  owaspLLM: link("https://owasp.org/www-project-top-10-for-large-language-model-applications/", "OWASP Top 10 for LLM Apps"),
  promptInjection: link("https://simonwillison.net/series/prompt-injection/", "Simon Willison — Prompt injection series"),
  rrf: link("https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html", "Elastic — Reciprocal Rank Fusion"),
  bm25: link("https://en.wikipedia.org/wiki/Okapi_BM25", "Okapi BM25"),
  nist: link("https://www.nist.gov/itl/ai-risk-management-framework", "NIST AI Risk Management Framework"),
};

export default SRC;
