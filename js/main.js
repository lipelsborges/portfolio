(function () {
  "use strict";

  var cfg = window.PORTFOLIO || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


  document.documentElement.classList.add("js");



  function lookup(key) {
    if (key === "email") return cfg.email ? "mailto:" + cfg.email : "";
    if (key === "linkedin" || key === "github") return cfg[key] || "";
    var parts = key.split(".");
    var project = cfg.projects && cfg.projects[parts[0]];
    return (project && project[parts[1]]) || "";
  }

  document.querySelectorAll("[data-link]").forEach(function (a) {
    var href = lookup(a.getAttribute("data-link"));
    if (href) {
      a.setAttribute("href", href);
      a.hidden = false;
    } else {
      a.hidden = true;
    }
  });

  document.querySelectorAll("[data-needs]").forEach(function (el) {
    var key = el.getAttribute("data-needs");
    el.hidden = !cfg[key];
  });

  document.querySelectorAll("[data-text='email']").forEach(function (el) {
    el.textContent = cfg.email || "";
  });

  document.querySelectorAll("[data-shot]").forEach(function (fig) {
    var project = cfg.projects && cfg.projects[fig.getAttribute("data-shot")];
    if (!project || !project.image) return;
    var placeholder = fig.querySelector(".shot-placeholder");
    var img = new Image();
    img.alt = project.alt || "";
    img.decoding = "async";
    img.onload = function () {
      if (placeholder) placeholder.remove();
    };
    img.onerror = function () {
      if (placeholder) fig.appendChild(placeholder);
      img.remove();
    };
    fig.appendChild(img);
    img.src = project.image;

  });


  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });


  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("menu-principal");
  var header = document.querySelector(".site-header");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 720px)").addEventListener("change", function () {
      setMenu(false);
    });
  }


  var toTop = document.querySelector(".to-top");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
    if (toTop) toTop.classList.toggle("is-visible", window.scrollY > 600);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });


  var links = Array.prototype.slice.call(document.querySelectorAll(".nav a[href^='#']"));
  var map = {};
  links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute("aria-current"); });
        var active = map[entry.target.id];
        if (active) active.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }


  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var ro = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        obs.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }


  var typed = document.querySelector("[data-typed]");
  if (typed && !reduceMotion) {
    var words;
    try { words = JSON.parse(typed.getAttribute("data-typed")); } catch (err) { words = []; }
    var target = typed.querySelector(".typed-text");

    if (words.length > 1 && target) {
      var w = 0, c = words[0].length, deleting = false;

      (function tick() {
        var word = words[w];
        var delay;

        if (!deleting) {
          c++;
          if (c >= word.length) { c = word.length; deleting = true; delay = 1600; }
          else delay = 85;
        } else {
          c--;
          if (c <= 0) { c = 0; deleting = false; w = (w + 1) % words.length; delay = 350; }
          else delay = 45;
        }

        target.textContent = word.slice(0, c);
        setTimeout(tick, delay);
      })();
    }
  }
})();
