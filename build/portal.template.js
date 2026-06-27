/* =========================================================================
   GenAI Interview Hub — client controller (self-contained, offline)
   Builds the grouped sidebar + cross-hub search from a single injected
   registry, handles theme, right-rail TOC scroll-spy, code copy buttons,
   the mobile drawer and the desktop sidebar collapse. No dependencies.
   ========================================================================= */
(function () {
  "use strict";
  var GROUPS = __REGISTRY_JSON__;

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
