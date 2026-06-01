const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const year = document.querySelector("#year");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const revealItems = document.querySelectorAll(".reveal");
const statNumbers = document.querySelectorAll("[data-count]");
const navAnchors = document.querySelectorAll(".nav-links a");
const magneticItems = document.querySelectorAll(".magnetic");
const marqueeTrack = document.querySelector(".marquee-track");
const backToTop = document.querySelector('.site-footer a[href="#top"]');
const contactForm = document.querySelector("#contactForm");
const formNote = document.querySelector("#formNote");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const themeText = document.querySelector(".theme-text");

const setTheme = (theme) => {
  const isLight = theme === "light";

  body.classList.toggle("light-theme", isLight);

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark theme" : "Switch to light theme",
    );
  }

  if (themeIcon) {
    themeIcon.textContent = isLight ? "L" : "D";
  }

  if (themeText) {
    themeText.textContent = isLight ? "Light" : "Dark";
  }
};

const savedTheme = localStorage.getItem("portfolio-theme");
setTheme(savedTheme === "light" ? "light" : "dark");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = body.classList.contains("light-theme") ? "dark" : "light";
    localStorage.setItem("portfolio-theme", nextTheme);
    setTheme(nextTheme);
  });
}

if (year) {
  year.textContent = new Date().getFullYear();
}

if (backToTop) {
  backToTop.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const message = formData.get("message").trim();
    const subject = encodeURIComponent(`${name} - Put a subject here`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=bhushanpawse100@gmail.com&su=${subject}&body=${body}`;

    window.open(gmailUrl, "_blank", "noopener,noreferrer");

    if (formNote) {
      formNote.textContent = "Opening Gmail with your message ready to send.";
    }
  });
}

if (marqueeTrack) {
  marqueeTrack.innerHTML += marqueeTrack.innerHTML;
}

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("menu-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (navLinks) {
  navLinks.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      body.classList.remove("menu-open");

      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
      }
    }
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 },
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 5, 4) * 90}ms`;
  revealObserver.observe(item);
});

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const target = Number(element.dataset.count);
      const isDecimal = !Number.isInteger(target);
      const duration = 1300;
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        element.textContent = isDecimal ? value.toFixed(1) : Math.round(value);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          element.textContent = isDecimal ? target.toFixed(1) : String(target);
        }
      };

      requestAnimationFrame(tick);
      countObserver.unobserve(element);
    });
  },
  { threshold: 0.6 },
);

statNumbers.forEach((number) => countObserver.observe(number));

const sectionMap = [...navAnchors]
  .map((anchor) => document.querySelector(anchor.getAttribute("href")))
  .filter(Boolean);

const setActiveLink = () => {
  const scrollPosition = window.scrollY + 160;
  let currentId = "";

  sectionMap.forEach((section) => {
    if (section.offsetTop <= scrollPosition) {
      currentId = section.id;
    }
  });

  navAnchors.forEach((anchor) => {
    anchor.classList.toggle(
      "active",
      anchor.getAttribute("href") === `#${currentId}`,
    );
  });
};

window.addEventListener("scroll", setActiveLink, { passive: true });
setActiveLink();

if (window.matchMedia("(pointer: fine)").matches) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener(
    "mousemove",
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    },
    { passive: true },
  );

  const renderCursor = () => {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  };

  renderCursor();

  document.querySelectorAll("a, button, input, textarea").forEach((item) => {
    item.addEventListener("mouseenter", () =>
      cursorRing.classList.add("hovering"),
    );
    item.addEventListener("mouseleave", () =>
      cursorRing.classList.remove("hovering"),
    );
  });

  magneticItems.forEach((item) => {
    item.addEventListener("mousemove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
    });

    item.addEventListener("mouseleave", () => {
      item.style.transform = "translate(0, 0)";
    });
  });
}

document
  .querySelectorAll(".project-card, .skill-card, .edu-card")
  .forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.background = `
      radial-gradient(circle at ${x}% ${y}%, rgba(62, 231, 198, 0.16), transparent 34%),
      linear-gradient(145deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.055))
    `;
    });

    card.addEventListener("pointerleave", () => {
      card.style.background = "";
    });
  });
