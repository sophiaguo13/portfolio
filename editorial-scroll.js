/* Editorial cinematic scroll:
   - top progress bar fills with page scroll
   - hero masthead drifts up + fades as you scroll into the work section
   - case-study images parallax; case spreads reveal as they enter view
   - subtle cursor parallax tilt on the hero headline */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bar = document.querySelector(".ed-progress-bar");
  const inner = document.querySelector(".ed-hero-inner");
  const parallax = [...document.querySelectorAll(".ed-case-media")]
    .map((m) => ({ m, img: m.querySelector("img") }))
    .filter((o) => o.img);

  let ticking = false;
  function update() {
    const y = window.scrollY || window.pageYOffset;
    const docH = document.documentElement.scrollHeight - window.innerHeight;

    if (bar) bar.style.transform = "scaleX(" + Math.min(1, Math.max(0, y / Math.max(1, docH))) + ")";

    if (inner && !reduce) {
      const p = Math.min(1, y / window.innerHeight);
      inner.style.transform = "translateY(" + (p * -64) + "px)";
      inner.style.opacity = String(1 - p * 0.85);
    }

    if (!reduce && parallax.length) {
      const vh = window.innerHeight;
      for (const o of parallax) {
        const r = o.m.getBoundingClientRect();
        if (r.bottom < -120 || r.top > vh + 120) continue;
        const delta = ((r.top + r.height / 2) - vh / 2) / vh; // -1 .. 1
        o.img.style.transform = "translateY(" + (delta * 8).toFixed(1) + "px) scale(1.05)";
      }
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();

  // reveal case-study spreads as they enter the viewport
  const cases = document.querySelectorAll(".ed-case");
  if (cases.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      cases.forEach((c) => c.classList.add("in"));
    } else {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      cases.forEach((c) => obs.observe(c));
    }
  }

  // subtle cursor parallax tilt on the hero headline
  const title = document.querySelector(".ed-title");
  if (title && !reduce) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", function (e) {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });
    (function tiltLoop() {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      title.style.transform = "rotateY(" + (cx * 7).toFixed(2) + "deg) rotateX(" + (-cy * 5).toFixed(2) + "deg)";
      requestAnimationFrame(tiltLoop);
    })();
  }
})();
