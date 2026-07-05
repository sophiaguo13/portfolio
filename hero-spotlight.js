/* Rainbow spotlight: cursor over a heading reveals its letters in a shifting
   rainbow under a soft circular light, and turns the cursor into the spotlight.
   Works on any element tagged .spotlight-target. */
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cursorEl = document.getElementById("cursor");
  const targets = document.querySelectorAll(".spotlight-target");

  targets.forEach((el) => {
    const overlay = document.createElement("div");
    overlay.className = "spot-overlay";
    overlay.setAttribute("aria-hidden", "true");
    el.appendChild(overlay);
    let built = false;

    el.addEventListener("mousemove", (e) => {
      if (!built) {
        // clone every child node (text + elements) except the overlay itself
        el.childNodes.forEach((n) => {
          if (n !== overlay) overlay.appendChild(n.cloneNode(true));
        });
        built = true;
      }
      const r = el.getBoundingClientRect();
      overlay.style.setProperty("--sx", (e.clientX - r.left) + "px");
      overlay.style.setProperty("--sy", (e.clientY - r.top) + "px");
      if (cursorEl) cursorEl.classList.add("spot");
    });

    el.addEventListener("mouseleave", () => {
      overlay.style.setProperty("--sx", "-9999px");
      overlay.style.setProperty("--sy", "-9999px");
      if (cursorEl) cursorEl.classList.remove("spot");
    });
  });
})();
