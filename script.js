document.addEventListener("DOMContentLoaded", () => {
  const LOADER_DURATION = 2600;

  setTimeout(() => {
    document.body.classList.add("loaded");
    setupHorizontalScroll();
  }, LOADER_DURATION);

  if (typeof setupBinaryHover === "function") {
    setupBinaryHover();
  }

  if (typeof setupMissionReveal === "function") {
    setupMissionReveal();
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
