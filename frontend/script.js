
const slides = [
  {
    label: "VERIFICATION OVERVIEW",
    title: "Invoice Analysis",
    counter: "01 / 04",
    icon: "PDF",
    file: "Sample_Invoice.pdf",
    description: "Illustrative invoice preview",
    rows: [
      ["✓", "Required fields", "Example", "success"],
      ["✓", "Amount consistency", "Example", "success"],
      ["!", "Duplicate review", "Review", "warning"]
    ],
    insightTitle: "✦ Verification insight",
    insightDescription:
      "Findings can be reviewed by a person before a decision."
  },
  {
    label: "SMART FEATURES",
    title: "Powerful Features",
    counter: "02 / 04",
    icon: "AI",
    file: "Intelligent Invoice Tools",
    description: "Tools designed to simplify invoice review",
    rows: [
      ["✓", "Invoice data extraction", "Available", "success"],
      ["✓", "Amount verification", "Available", "success"],
      ["✓", "Duplicate identification", "Smart check", "warning"]
    ],
    insightTitle: "✦ Feature highlight",
    insightDescription:
      "Bring important invoice details and potential issues together in one place."
  },
  {
    label: "HOW IT WORKS",
    title: "Simple Workflow",
    counter: "03 / 04",
    icon: "PDF",
    file: "Your Invoice",
    description: "A simple process for reviewing invoices",
    rows: [
      ["1", "Upload invoice", "Step 1", "success"],
      ["2", "Review extracted details", "Step 2", "success"],
      ["3", "Check findings", "Step 3", "warning"]
    ],
    insightTitle: "✦ Easy process",
    insightDescription:
      "Review invoice information step by step before making a decision."
  },
  {
    label: "INSIGHTS & INNOVATION",
    title: "Explainable AI",
    counter: "04 / 04",
    icon: "AI",
    file: "Invoice Insights",
    description: "Understand the results of invoice checks",
    rows: [
      ["✓", "Clear verification results", "Insights", "success"],
      ["✓", "Potential inconsistencies", "Review", "warning"],
      ["✓", "Human review support", "Included", "success"]
    ],
    insightTitle: "✦ Our innovation",
    insightDescription:
      "Understand why an item needs attention while keeping people involved in final decisions."
  }
];

const panelContent = document.getElementById("panel-content");
const slideLabel = document.getElementById("slide-label");
const slideTitle = document.getElementById("slide-title");
const slideCounter = document.getElementById("slide-counter");
const visualIcon = document.getElementById("visual-icon");
const visualTitle = document.getElementById("visual-title");
const visualDescription = document.getElementById("visual-description");
const slidePoints = document.getElementById("slide-points");
const insightTitle = document.getElementById("insight-title");
const insightDescription = document.getElementById("insight-description");
const progressFill = document.getElementById("progress-fill");
const dots = document.querySelectorAll(".slide-dot");
const navLinks = document.querySelectorAll(".nav-links a[data-slide]");

let currentSlide = 0;
let autoPlay;
let progressTimer;

const ROTATION_TIME = 3000;

function renderSlide(index) {
  currentSlide = (index + slides.length) % slides.length;

  const slide = slides[currentSlide];

  panelContent.classList.add("changing");

  window.setTimeout(() => {
    slideLabel.textContent = slide.label;
    slideTitle.textContent = slide.title;
    slideCounter.textContent = slide.counter;
    visualIcon.textContent = slide.icon;
    visualTitle.textContent = slide.file;
    visualDescription.textContent = slide.description;
    insightTitle.textContent = slide.insightTitle;
    insightDescription.textContent = slide.insightDescription;

    slidePoints.replaceChildren();

    slide.rows.forEach(([symbol, label, status, type]) => {
      const row = document.createElement("div");
      row.className = "info-row";

      const left = document.createElement("span");
      left.className = "row-left";

      const icon = document.createElement("span");
      icon.className = `row-icon ${type}`;
      icon.textContent = symbol;

      const labelText = document.createElement("span");
      labelText.textContent = label;

      left.append(icon, labelText);

      const statusText = document.createElement("span");
      statusText.className = `row-status ${type}-text`;
      statusText.textContent = status;

      row.append(left, statusText);
      slidePoints.appendChild(row);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === currentSlide);
      dot.setAttribute(
        "aria-current",
        dotIndex === currentSlide ? "true" : "false"
      );
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        Number(link.dataset.slide) === currentSlide
      );
    });

    panelContent.classList.remove("changing");
    startProgress();
  }, 180);
}

function startProgress() {
  window.clearInterval(progressTimer);

  progressFill.style.transition = "none";
  progressFill.style.width = "0%";

  // Restart the progress animation.
  void progressFill.offsetWidth;

  progressFill.style.transition = `width ${ROTATION_TIME}ms linear`;
  progressFill.style.width = "100%";
}

function nextSlide() {
  renderSlide(currentSlide + 1);
}

function previousSlide() {
  renderSlide(currentSlide - 1);
}

function startSlider() {
  window.clearInterval(autoPlay);
  autoPlay = window.setInterval(nextSlide, ROTATION_TIME);
}

function restartSlider() {
  startSlider();
  startProgress();
}

document.getElementById("next-slide").addEventListener("click", () => {
  nextSlide();
  restartSlider();
});

document.getElementById("previous-slide").addEventListener("click", () => {
  previousSlide();
  restartSlider();
});

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    renderSlide(Number(dot.dataset.go));
    restartSlider();
  });
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    renderSlide(Number(link.dataset.slide));
    restartSlider();
  });
});

document.getElementById("start-button").addEventListener("click", () => {
  renderSlide(0);
  restartSlider();
});

const showcase = document.getElementById("showcase");

showcase.addEventListener("mouseenter", () => {
  window.clearInterval(autoPlay);
});

showcase.addEventListener("mouseleave", startSlider);

showcase.addEventListener("focusin", () => {
  window.clearInterval(autoPlay);
});

showcase.addEventListener("focusout", (event) => {
  if (!showcase.contains(event.relatedTarget)) {
    startSlider();
  }
});

renderSlide(0);
startSlider();
