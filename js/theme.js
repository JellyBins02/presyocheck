// theme.js - the floating buttons (light/dark, palette picker) and their behaviour.
// Adds its own HTML to the page, so no page needs to include these buttons itself.

(function() {
  document.body.insertAdjacentHTML("beforeend", '<button class="tg" id="tg" type="button"></button>\n<button class="back-to-top" id="backToTop" type="button">' +
      '<span class="circle-icon">↑</span><span>Back to Top</span></button>\n<button class="palette-toggle" id="paletteToggle" type="button" aria-expanded="false">🎨 Theme</button>\n<section class="palette-panel" id="palettePanel" aria-label="Color palette chooser">\n  <h3>Choose your palette</h3>' +
      '<p>Preview the same app in different visual styles.</p>\n  <button class="palette-choice" data-palette-choice="smart" aria-pressed="true">' +
      '<span class="palette-dots"><i style="background:#2563EB"></i>' +
      '<i style="background:#059669"></i><i style="background:#0F172A">' +
      '</i></span><span><strong>Modern Fintech</strong><small>Clean, trustworthy, balanced</small>' +
      '</span></button>\n  <button class="palette-choice" data-palette-choice="premium" aria-pressed="false">' +
      '<span class="palette-dots"><i style="background:#7C3AED"></i>' +
      '<i style="background:#F59E0B"></i><i style="background:#1E1B4B">' +
      '</i></span><span><strong>Premium Shopping</strong><small>Elegant, premium, refined</small>' +
      '</span></button>\n  <button class="palette-choice" data-palette-choice="deal" aria-pressed="false">' +
      '<span class="palette-dots"><i style="background:#EA580C"></i>' +
      '<i style="background:#84CC16"></i><i style="background:#292524">' +
      '</i></span><span><strong>Deal Hunter</strong><small>Bold, energetic, deal-focused</small>' +
      '</span></button>\n  <div class="palette-mode"><button type="button" id="modeLight">☀ Light</button>' +
      '<button type="button" id="modeDark">☾ Dark</button></div>\n</section>');
})();
// Mobile Back to Top visibility and scroll logic
var backToTopBtn = document.getElementById("backToTop");
window.addEventListener("scroll", function() {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add("visible");
  } else {
    backToTopBtn.classList.remove("visible");
  }
});
backToTopBtn.addEventListener("click", function() {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
var th = null, mq = window.matchMedia("(prefers-color-scheme: dark)"), tg = document.getElementById("tg");
try {
  th = localStorage.getItem("pc_theme");
} catch (e) {
}
// True when dark mode is showing.
function isDark() {
  var a = document.documentElement.getAttribute("data-theme");
  return a ? a === "dark" : mq.matches;
}
// Updates the sun/moon button.
function paint() {
  var d = isDark();
  tg.textContent = d ? "☀" : "☾";
  tg.setAttribute("aria-label", d ? "Switch to light mode" : "Switch to dark mode");
}
if (th === "light" || th === "dark") document.documentElement.setAttribute("data-theme", th);
paint();
tg.addEventListener("click", function() {
  var n = isDark() ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", n);
  try {
    localStorage.setItem("pc_theme", n);
  } catch (e) {
  }
  paint();
});
if (mq.addEventListener) mq.addEventListener("change", paint);
(function() {
  const palettes = {
    smart: {
      light: { bg: "#FFFFFF", surf: "#FFFFFF", ink: "#0F172A", mute: "#64748B", line: "#E2E8F0", green: "#2563EB", deep: "#1D4ED8", hd: "#0F172A", link: "#2563EB", focus: "#2563EB", ongreen: "#FFFFFF", star: "#D97706", tag: "#D1FAE5", tagink: "#065F46" },
      dark: { bg: "#0B1120", surf: "#1E293B", ink: "#F1F5F9", mute: "#94A3B8", line: "#334155", green: "#3B82F6", deep: "#2563EB", hd: "#F1F5F9", link: "#60A5FA", focus: "#60A5FA", ongreen: "#FFFFFF", star: "#FBBF24", tag: "#064E3B", tagink: "#D1FAE5" }
    },
    premium: {
      light: { bg: "#FAF9FF", surf: "#FFFFFF", ink: "#1E1B4B", mute: "#6B6687", line: "#E7E2F2", green: "#7C3AED", deep: "#6D28D9", hd: "#1E1B4B", link: "#7C3AED", focus: "#8B5CF6", ongreen: "#FFFFFF", star: "#D97706", tag: "#FEF3C7", tagink: "#92400E" },
      dark: { bg: "#100D1F", surf: "#211B36", ink: "#F5F3FF", mute: "#B7AECF", line: "#403653", green: "#A78BFA", deep: "#8B5CF6", hd: "#F5F3FF", link: "#C4B5FD", focus: "#C4B5FD", ongreen: "#1E1B4B", star: "#FBBF24", tag: "#594018", tagink: "#FDE68A" }
    },
    deal: {
      light: { bg: "#FAFAF9", surf: "#FFFFFF", ink: "#292524", mute: "#78716C", line: "#E7E5E4", green: "#EA580C", deep: "#C2410C", hd: "#292524", link: "#C2410C", focus: "#F97316", ongreen: "#FFFFFF", star: "#D97706", tag: "#ECFCCB", tagink: "#3F6212" },
      dark: { bg: "#171412", surf: "#292524", ink: "#FAFAF9", mute: "#A8A29E", line: "#57534E", green: "#F97316", deep: "#EA580C", hd: "#FAFAF9", link: "#FDBA74", focus: "#FB923C", ongreen: "#FFFFFF", star: "#FBBF24", tag: "#365314", tagink: "#ECFCCB" }
    }
  };
  const root = document.documentElement, panel = document.getElementById("palettePanel"), toggle = document.getElementById("paletteToggle");
  let palette = "smart";
  try {
    palette = localStorage.getItem("pc_palette") || "smart";
  } catch (e) {
  }
  function mode() {
    return isDark() ? "dark" : "light";
  }
  function apply() {
    const m = mode(), colors = palettes[palette][m];
    Object.keys(colors).forEach((k) => root.style.setProperty("--" + k, colors[k]));
    document.querySelectorAll("[data-palette-choice]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.paletteChoice === palette)));
    document.getElementById("modeLight").classList.toggle("active", m === "light");
    document.getElementById("modeDark").classList.toggle("active", m === "dark");
    try {
      localStorage.setItem("pc_palette", palette);
    } catch (e) {
    }
    if (typeof paint === "function") paint();
  }
  document.querySelectorAll("[data-palette-choice]").forEach((b) => b.addEventListener("click", () => {
    palette = b.dataset.paletteChoice;
    apply();
  }));
  document.getElementById("modeLight").addEventListener("click", () => {
    root.setAttribute("data-theme", "light");
    try {
      localStorage.setItem("pc_theme", "light");
    } catch (e) {
    }
    ;
    apply();
  });
  document.getElementById("modeDark").addEventListener("click", () => {
    root.setAttribute("data-theme", "dark");
    try {
      localStorage.setItem("pc_theme", "dark");
    } catch (e) {
    }
    ;
    apply();
  });
  toggle.addEventListener("click", () => {
    const open = panel.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && !toggle.contains(e.target)) {
      panel.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
  const oldToggle = document.getElementById("tg");
  oldToggle.addEventListener("click", () => setTimeout(apply, 0));
  if (window.matchMedia) {
    const mq2 = window.matchMedia("(prefers-color-scheme: dark)");
    if (mq2.addEventListener) mq2.addEventListener("change", () => setTimeout(apply, 0));
  }
  apply();
})();
