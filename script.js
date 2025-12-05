document.addEventListener("DOMContentLoaded", () => {
  const LOADER_DURATION = 2600;

  setTimeout(() => {
    document.body.classList.add("loaded");
    setupHorizontalScroll(); // your horizontal scroll function
    setupSkillsReveal(); // <- make sure this is here
    setupMissionTitleReveal(); // if you have it
    setupMissionParagraphReveal(); // if you have it
    setupMissionStatsReveal(); // if you have it
  }, LOADER_DURATION);

  if (typeof setupBinaryHover === "function") {
    setupBinaryHover();
  }
});

function setupBinaryHover() {
  const links = document.querySelectorAll(".nav-link");

  links.forEach((link) => {
    const originalText = link.textContent;
    link.dataset.original = originalText;

    let intervalId = null;

    link.addEventListener("mouseenter", () => {
      const length = originalText.length;

      if (intervalId) clearInterval(intervalId);

      intervalId = setInterval(() => {
        let binary = "";
        for (let i = 0; i < length; i++) {
          binary += Math.random() > 0.5 ? "0" : "1";
        }
        link.textContent = binary;
      }, 60);

      // auto stop after a short time
      setTimeout(() => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
          link.textContent = link.dataset.original;
        }
      }, 700);
    });

    link.addEventListener("mouseleave", () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      link.textContent = link.dataset.original;
    });
  });
}

//missionhorizontal

function setupHorizontalScroll() {
  const track = document.querySelector(".scroll-track");
  if (!track) return;

  const panels = document.querySelectorAll(".panel");
  const totalPanels = panels.length;
  const viewportW = window.innerWidth;

  // total horizontal distance we can move
  const maxTranslate = viewportW * (totalPanels - 1);

  // set body height so we have enough vertical scroll space
  const maxScrollY = maxTranslate;
  document.body.style.height = window.innerHeight + maxScrollY + "px";

  function update() {
    const scrollY = window.scrollY;
    const clamped = Math.max(0, Math.min(scrollY, maxScrollY));
    const translateX = -clamped;

    track.style.transform = `translateX(${translateX}px)`;
  }

  window.addEventListener("scroll", update);
  window.addEventListener("resize", () => {});
  update();
}

function setupMissionReveal() {
  const section = document.querySelector(".mission-section");
  if (!section) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          section.classList.add("in-view");
        } else {
          section.classList.remove("in-view");
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  observer.observe(section);
}

function setupMissionTitleReveal() {
  const title = document.querySelector(".mission-title");
  const missionPanel = document.getElementById("mission");
  if (!title || !missionPanel) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          title.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.5, // triggers when half the panel is visible
    }
  );

  observer.observe(missionPanel);
}

function setupMissionParagraphReveal() {
  const paragraph = document.querySelector(".mission-paragraph");
  const missionPanel = document.getElementById("mission");

  if (!paragraph || !missionPanel) return;

  // STEP 1: get each line based on layout
  const words = paragraph.innerText.split(" ");
  paragraph.innerHTML = ""; // reset

  const tempSpan = document.createElement("span");
  paragraph.appendChild(tempSpan);

  let line = [];

  words.forEach((word) => {
    const testLine = [...line, word].join(" ");
    tempSpan.innerText = testLine;

    // if the test line exceeds width, finalize previous line
    if (tempSpan.offsetWidth > paragraph.offsetWidth) {
      const lineSpan = document.createElement("span");
      lineSpan.className = "mission-line";
      lineSpan.innerText = line.join(" ");
      paragraph.appendChild(lineSpan);
      line = [word];
      tempSpan.innerText = word;
    } else {
      line.push(word);
    }
  });

  // add the last line
  if (line.length > 0) {
    const lineSpan = document.createElement("span");
    lineSpan.className = "mission-line";
    lineSpan.innerText = line.join(" ");
    paragraph.appendChild(lineSpan);
  }

  // remove temp
  tempSpan.remove();

  const lines = paragraph.querySelectorAll(".mission-line");

  // STEP 2: observe mission section
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          lines.forEach((line, i) => {
            setTimeout(() => {
              line.classList.add("visible");
            }, i * 150); // stagger
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(missionPanel);
}

function setupMissionStatsReveal() {
  const missionPanel = document.getElementById("mission");
  const stats = document.querySelectorAll(".ani-stat");

  if (!missionPanel || !stats.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;

          stats.forEach((stat, i) => {
            setTimeout(() => {
              stat.classList.add("visible");

              const numEl = stat.querySelector(".stat-number");
              if (numEl) {
                animateCountNumber(numEl, 500);
              }
            }, i * 180); // stagger each stat
          });
        }
      });
    },
    {
      threshold: 0.4,
    }
  );

  observer.observe(missionPanel);
}

// animate number counting from 0 to target

function animateCountNumber(element, duration) {
  const fullText = element.textContent.trim();
  const match = fullText.match(/^(\d+)(.*)$/);

  if (!match) return;

  const target = parseInt(match[1], 10);
  const suffix = match[2] || "";
  const start = 0;
  const startTime = performance.now();

  function frame(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // ease-out with a simple ease function
    const eased = 1 - Math.pow(1 - progress, 2);

    const current = Math.floor(start + (target - start) * eased);
    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

function setupSkillsReveal() {
  const panel = document.getElementById("skills");
  if (!panel) return;

  const title = panel.querySelector(".skills-title");
  const description = panel.querySelector(".skills-description");
  const cards = panel.querySelectorAll(".ani-skill");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // heading
          if (title) {
            title.classList.add("visible");
          }

          // description
          if (description) {
            setTimeout(() => {
              description.classList.add("visible");
            }, 150);
          }

          // cards stagger
          cards.forEach((card, i) => {
            setTimeout(() => {
              card.classList.add("visible");
            }, 200 + i * 150);
          });
        }
      });
    },
    {
      threshold: 0.3, // a bit lower so it definitely triggers
    }
  );

  observer.observe(panel);
}

function revealCategories() {
  const cols = document.querySelectorAll(".category-col");
  cols.forEach((col) => {
    const rect = col.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      col.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealCategories);
window.addEventListener("load", revealCategories);

function revealVerticalPanels() {
  const panels = document.querySelectorAll(".vertical-panel");

  panels.forEach((panel) => {
    const rect = panel.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      panel.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealVerticalPanels);
window.addEventListener("load", revealVerticalPanels);
