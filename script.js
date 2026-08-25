document.addEventListener("DOMContentLoaded", () => {
  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const el = document.querySelector(a.getAttribute("href"));
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Reveal sections as they enter the viewport.
  const revealItems = document.querySelectorAll(".reveal-section, .reveal-group");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -50px 0px" });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Subtle mouse parallax for the hero visual on desktop.
  const visual = document.querySelector(".hero-visual");
  const radar = document.querySelector(".radar");
  if (visual && radar && window.matchMedia("(pointer:fine)").matches) {
    visual.addEventListener("mousemove", (e) => {
      const rect = visual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      radar.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
    });
    visual.addEventListener("mouseleave", () => {
      radar.style.transform = "";
    });
  }

  // Count-up effect for the hero metrics.
  const metrics = document.querySelectorAll(".hero-metrics b");
  const values = [
    { end: 15, prefix: "₹", suffix: "K" },
    { end: 13, prefix: "₹", suffix: "K" },
    { end: 50, prefix: "", suffix: "+" },
    { end: 200, prefix: "", suffix: "+" }
  ];
  let counted = false;

  const runCounters = () => {
    if (counted) return;
    counted = true;
    metrics.forEach((el, i) => {
      const target = values[i];
      if (!target) return;
      const start = performance.now();
      const duration = 900;
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target.end * eased);
        el.textContent = `${target.prefix}${value}${target.suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };

  const metricsBlock = document.querySelector(".hero-metrics");
  if (metricsBlock && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting) {
        runCounters();
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    counterObserver.observe(metricsBlock);
  } else {
    runCounters();
  }

  // Keep the current navigation item visually connected to the section.
  const navLinks = [...document.querySelectorAll(".topbar nav a")];
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.remove("active-nav"));
        const active = navLinks.find(link => link.getAttribute("href") === `#${entry.target.id}`);
        if (active) active.classList.add("active-nav");
      });
    }, { threshold: 0.35 });

    sections.forEach(section => navObserver.observe(section));
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const progress = document.querySelector(".scroll-progress span");
  const glow = document.querySelector(".cursor-glow");

  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, {passive:true});

  if (glow && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("mousemove", (e) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
      glow.style.opacity = "1";
    }, {passive:true});
    window.addEventListener("mouseleave", () => glow.style.opacity = "0");
  }

  // 3D tilt on cards, subtle enough to stay professional.
  document.querySelectorAll(".tilt-card").forEach((card) => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width-.5;
      const y = (e.clientY-r.top)/r.height-.5;
      card.style.transform = `perspective(900px) rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*5).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // Add a gentle magnetic effect to the primary CTA.
  document.querySelectorAll(".hero-buttons .neon").forEach((button) => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    button.addEventListener("mousemove", (e) => {
      const r=button.getBoundingClientRect();
      const x=(e.clientX-r.left-r.width/2)/8;
      const y=(e.clientY-r.top-r.height/2)/8;
      button.style.transform=`translate(${x}px,${y}px)`;
    });
    button.addEventListener("mouseleave",()=>button.style.transform="");
  });
});
