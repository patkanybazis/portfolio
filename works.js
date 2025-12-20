function setupWorksShowcase() {
  const categories = document.querySelectorAll(
    "#works-showcase .work-category"
  );

  if (!categories.length) return;

  const NAV_OFFSET = 110; // match CSS top

  function setupCategory(category) {
    const titleEl = category.querySelector(".category-title");
    const slides = Array.from(category.querySelectorAll(".slide"));
    const sticky = category.querySelector(".category-sticky");

    if (!slides.length || !titleEl || !sticky) return;

    // Set category title once (doesn't change per slide)
    titleEl.textContent = category.dataset.category || "";

    // Give the category enough scroll space: 1 viewport per slide
    const slidesCount = slides.length;
    const slideScroll = window.innerHeight; // 1 screen per slide
    const totalScroll = slideScroll * slidesCount;

    category.style.height = totalScroll + "px";

    let current = 0;

    function setActive(next) {
      if (next === current) return;

      const oldSlide = slides[current];
      const newSlide = slides[next];

      // start exit animation on old
      oldSlide.classList.remove("is-active");
      oldSlide.classList.add("is-exiting");

      // prepare new at bottom (already default), then activate
      newSlide.classList.remove("is-exiting");
      newSlide.classList.add("is-active");

      // clean up exiting class after transition
      window.setTimeout(() => {
        oldSlide.classList.remove("is-exiting");
      }, 500);

      current = next;
    }
    function update() {
      const rect = category.getBoundingClientRect();

      // Active for the whole time this category is the sticky one
      const inView =
        rect.top <= NAV_OFFSET && rect.bottom >= window.innerHeight;
      category.classList.toggle("is-active-category", inView);

      if (!inView) return;

      const progress = Math.min(
        Math.max(-rect.top + NAV_OFFSET, 0),
        totalScroll - 1
      );

      const idx = Math.min(slidesCount - 1, Math.floor(progress / slideScroll));
      setActive(idx);
    }

    // init

    slides.forEach((s, i) => {
      s.classList.toggle("is-active", i === 0);
      s.classList.remove("is-exiting");
    });
    current = 0;
    update();

    window.addEventListener("scroll", update);
    window.addEventListener("resize", () => {
      // recompute on resize
      const slideScrollNew = window.innerHeight;
      const totalScrollNew = slideScrollNew * slidesCount;
      category.style.height = totalScrollNew + "px";
      update();
    });
  }

  categories.forEach(setupCategory);
}

window.addEventListener("load", () => {
  setupHorizontalScroll();
  setupWorksShowcase();
});
