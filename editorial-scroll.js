/* Editorial cinematic scroll:
   - top progress bar fills with page scroll
   - hero masthead drifts up and fades as you scroll into the work section */
(function () {
  "use strict";
  const bar = document.querySelector(".ed-progress-bar");
  const inner = document.querySelector(".ed-hero-inner");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!bar && !inner) return;

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
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();

  /* F — subtle cursor parallax tilt on the headline */
  const title = document.querySelector(".ed-title");
  if (title && !reduce) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", function (e) {
      tx = e.clientX / window.innerWidth - 0.5;    // -0.5 .. 0.5
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
