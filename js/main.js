/* =========================================================
   Portfolio interactions — vanilla JS, no build step required
   ========================================================= */
(function(){
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Loader ---------- */
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => loader && loader.classList.add("done"), 500);
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle (dark/light), persisted for the session ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const THEME_KEY = "portfolio-theme";
  let savedTheme = null;
  try { savedTheme = sessionStorage.getItem(THEME_KEY); } catch(e) { /* storage unavailable */ }
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  function applyThemeIcon(){
    const isLight = root.getAttribute("data-theme") === "light";
    if (themeToggle) themeToggle.innerHTML = isLight
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  }
  applyThemeIcon();

  if (themeToggle){
    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      applyThemeIcon();
      try { sessionStorage.setItem(THEME_KEY, next); } catch(e) { /* ignore */ }
    });
  }

  /* ---------- Mobile nav ---------- */
  const navBurger = document.getElementById("navBurger");
  const navLinks = document.getElementById("navLinks");
  if (navBurger && navLinks){
    navBurger.addEventListener("click", () => navLinks.classList.toggle("open"));
    navLinks.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => navLinks.classList.remove("open"))
    );
  }

  /* ---------- Scroll progress bar ---------- */
  const scrollProgress = document.getElementById("scrollProgress");
  function updateScrollProgress(){
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    if (scrollProgress) scrollProgress.style.width = (scrolled || 0) + "%";
  }
  document.addEventListener("scroll", updateScrollProgress, { passive: true });

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById("backToTop");
  function updateBackToTop(){
    if (!backToTop) return;
    backToTop.classList.toggle("visible", window.scrollY > 500);
  }
  document.addEventListener("scroll", updateBackToTop, { passive: true });
  backToTop && backToTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
  );

  /* ---------- Mouse glow ---------- */
  const glow = document.getElementById("mouseGlow");
  if (glow && !reduceMotion && window.matchMedia("(pointer:fine)").matches){
    document.addEventListener("mousemove", (e) => {
      glow.style.opacity = "1";
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    });
    document.addEventListener("mouseleave", () => (glow.style.opacity = "0"));
  }

  /* ---------- Fluid Elastic Jelly Cursor ---------- */
  const cursorBlob = document.getElementById("cursorBlob");
  const cursorDot = document.getElementById("cursorDot");

  if (cursorBlob && cursorDot && !reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    document.body.classList.add("has-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let blobX = mouseX;
    let blobY = mouseY;
    let currentScaleX = 1;
    let currentScaleY = 1;
    let currentAngle = 0;
    let isVisible = false;

    // Fast mousemove tracking for pixel-perfect dot
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.left = mouseX + "px";
      cursorDot.style.top = mouseY + "px";

      if (!isVisible) {
        isVisible = true;
        cursorBlob.style.opacity = "1";
        cursorDot.style.opacity = "1";
        blobX = mouseX;
        blobY = mouseY;
      }
    });

    document.addEventListener("mouseleave", () => {
      isVisible = false;
      cursorBlob.style.opacity = "0";
      cursorDot.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
      isVisible = true;
      cursorBlob.style.opacity = "1";
      cursorDot.style.opacity = "1";
    });

    window.addEventListener("mousedown", () => {
      cursorBlob.classList.add("is-down");
      cursorDot.classList.add("is-down");
    });

    window.addEventListener("mouseup", () => {
      cursorBlob.classList.remove("is-down");
      cursorDot.classList.remove("is-down");
    });

    // Detect clickable and interactive elements for magnetic/aura expansion
    const interactiveSelector = `
      a, button, input, textarea, select, label,
      .project-card, .filter-chip, .skill-card,
      .cert-card, .profile-card, .stat-card,
      .theme-toggle, .cv-btn, [role="button"]
    `;

    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(interactiveSelector)) {
        cursorBlob.classList.add("is-hovering");
        cursorDot.classList.add("is-hovering");
      }
    });

    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(interactiveSelector)) {
        if (!e.relatedTarget || !e.relatedTarget.closest(interactiveSelector)) {
          cursorBlob.classList.remove("is-hovering");
          cursorDot.classList.remove("is-hovering");
        }
      }
    });

    // Jelly physics render loop using linear interpolation (lerp)
    function renderJelly() {
      if (isVisible) {
        const ease = 0.18;
        const dx = mouseX - blobX;
        const dy = mouseY - blobY;

        blobX += dx * ease;
        blobY += dy * ease;

        const dist = Math.hypot(dx, dy);

        if (dist > 0.4) {
          const targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

          // Shortest angle interpolation to avoid 360-degree flips
          let angleDiff = targetAngle - currentAngle;
          while (angleDiff < -180) angleDiff += 360;
          while (angleDiff > 180) angleDiff -= 360;
          currentAngle += angleDiff * 0.22;

          // Velocity-based stretching and squishing
          const speed = Math.min(dist * 0.032, 0.65);
          const targetScaleX = 1 + speed;
          const targetScaleY = Math.max(0.4, 1 - speed * 0.42);

          currentScaleX += (targetScaleX - currentScaleX) * 0.2;
          currentScaleY += (targetScaleY - currentScaleY) * 0.2;
        } else {
          // Organically bounce/relax back to a circle
          currentScaleX += (1 - currentScaleX) * 0.14;
          currentScaleY += (1 - currentScaleY) * 0.14;
        }

        cursorBlob.style.transform = `translate3d(${blobX}px, ${blobY}px, 0) translate(-50%, -50%) rotate(${currentAngle}deg) scale(${currentScaleX}, ${currentScaleY})`;
      }

      requestAnimationFrame(renderJelly);
    }

    requestAnimationFrame(renderJelly);
  }

  /* ---------- Typing animation for role titles ---------- */
  const roles = [
    "Final Year CSE Student",
    "AI & Machine Learning Enthusiast",
    "Python Developer"
  ];
  const typedEl = document.getElementById("typedRole");
  if (typedEl){
    if (reduceMotion){
      typedEl.textContent = roles[0];
    } else {
      let roleIndex = 0, charIndex = 0, deleting = false;
      function tick(){
        const current = roles[roleIndex];
        if (!deleting){
          charIndex++;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length){
            deleting = true;
            setTimeout(tick, 1600);
            return;
          }
        } else {
          charIndex--;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0){
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
          }
        }
        setTimeout(tick, deleting ? 35 : 65);
      }
      tick();
    }
  }

  /* ---------- Signature signal strip: live "win probability" ticker ---------- */
  const teams = [
    { name: "CSK", value: 63 }, { name: "MI", value: 71 },
    { name: "RCB", value: 48 }, { name: "GT", value: 82 },
    { name: "KKR", value: 55 }
  ];
  const signalValue = document.getElementById("signalValue");
  const signalFill = document.getElementById("signalFill");
  let signalIdx = 0;
  function updateSignal(){
    const t = teams[signalIdx % teams.length];
    if (signalValue) signalValue.textContent = `${t.name} ${t.value.toFixed(1)}%`;
    if (signalFill) signalFill.style.width = t.value + "%";
    signalIdx++;
  }
  updateSignal();
  if (!reduceMotion) setInterval(updateSignal, 3200);

  /* ---------- Lightweight particle background (hero only) ---------- */
  const particlesEl = document.getElementById("particles");
  if (particlesEl && !reduceMotion){
    const count = window.innerWidth < 640 ? 18 : 34;
    for (let i = 0; i < count; i++){
      const p = document.createElement("span");
      p.className = "particle";
      const size = Math.random() * 3 + 1.5;
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.left = Math.random() * 100 + "%";
      p.style.top = Math.random() * 100 + "%";
      p.style.animationDuration = (Math.random() * 6 + 6) + "s";
      p.style.animationDelay = (Math.random() * 5) + "s";
      particlesEl.appendChild(p);
    }
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("in-view"));
  }

  /* ---------- Section title underline sweep ---------- */
  const sectionTitles = document.querySelectorAll(".section-title");
  if ("IntersectionObserver" in window && !reduceMotion){
    const titleIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add("in-view");
          titleIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    sectionTitles.forEach(el => titleIO.observe(el));
  } else {
    sectionTitles.forEach(el => el.classList.add("in-view"));
  }

  /* ---------- 3D card tilt on hover (CSS variable driven) ---------- */
  if (!reduceMotion && window.matchMedia("(pointer:fine)").matches){
    const tiltTargets = document.querySelectorAll(
      ".project-card, .skill-card, .cert-card, .exp-card, .profile-card, .stat-card"
    );
    tiltTargets.forEach(card => {
      card.classList.add("tilt-card");
      const MAX_TILT = 8; // degrees
      card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width  / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        card.style.setProperty("--tilt-x", `${(-dy * MAX_TILT).toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${ (dx * MAX_TILT).toFixed(2)}deg`);
      });
      card.addEventListener("mouseleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  /* ---------- Count-up statistics ---------- */
  const countEls = document.querySelectorAll(".stat-number[data-count]");
  function animateCount(el){
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduceMotion){ el.textContent = target; return; }
    const duration = 1200;
    const start = performance.now();
    function step(now){
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  if (countEls.length){
    if ("IntersectionObserver" in window){
      const countIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting){
            animateCount(entry.target);
            countIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      countEls.forEach(el => countIO.observe(el));
    } else {
      countEls.forEach(animateCount);
    }
  }

  /* ---------- Animated skill bars ---------- */
  const fillEls = document.querySelectorAll(".fill[data-level]");
  if (fillEls.length){
    if ("IntersectionObserver" in window){
      const fillIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting){
            entry.target.style.width = entry.target.getAttribute("data-level") + "%";
            fillIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      fillEls.forEach(el => fillIO.observe(el));
    } else {
      fillEls.forEach(el => (el.style.width = el.getAttribute("data-level") + "%"));
    }
  }

  /* ---------- Project filtering ---------- */
  const filterBar = document.getElementById("filterBar");
  const projectCards = document.querySelectorAll(".project-card");
  if (filterBar){
    filterBar.addEventListener("click", (e) => {
      const chip = e.target.closest(".filter-chip");
      if (!chip) return;
      filterBar.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const filter = chip.getAttribute("data-filter");
      projectCards.forEach(card => {
        const tags = card.getAttribute("data-tags") || "";
        const show = filter === "all" || tags.split(" ").includes(filter);
        card.classList.toggle("hidden", !show);
      });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");
  if (sections.length && navAnchors.length && "IntersectionObserver" in window){
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          const id = entry.target.getAttribute("id");
          navAnchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(s => navIO.observe(s));
  }



})();
