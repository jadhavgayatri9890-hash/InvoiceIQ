
const fileNameElement = document.getElementById("result-file-name");
const fileMetaElement = document.getElementById("result-file-meta");
const overallStatus = document.getElementById("overall-status");
const progressDescription = document.getElementById("progress-description");
const progressPercent = document.getElementById("progress-percent");
const progressFill = document.getElementById("progress-fill");
const demoWarning = document.getElementById("demo-warning");

const stepIds = [
  "step-upload",
  "step-extract",
  "step-check",
  "step-complete"
];

const checkIds = [
  "check-extraction",
  "check-duplicate",
  "check-validation",
  "check-anomaly"
];

function getSelectedInvoice() {
  try {
    const data = sessionStorage.getItem("invoiceIQSelectedInvoice");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
}

function setCheckStatus(index, text) {
  const element = document.getElementById(checkIds[index]);

  if (element) {
    element.textContent = text;
    element.style.background = "#fff3d6";
    element.style.color = "#8a6414";
  }
}

function setProgress(percent, description, activeStep) {
  progressPercent.textContent = percent + "%";
  progressFill.style.width = percent + "%";
  progressDescription.textContent = description;

  stepIds.forEach(function (id, index) {
    const step = document.getElementById(id);

    if (step) {
      step.classList.toggle("active", index <= activeStep);
    }
  });
}

function showEmptyState() {
  fileNameElement.textContent = "No invoice selected";
  fileMetaElement.textContent = "Return to the dashboard and select an invoice.";
  overallStatus.textContent = "Not started";

  setProgress(0, "Waiting for an invoice.", -1);

  demoWarning.textContent =
    "Demo interface only. Select an invoice from the dashboard to continue.";

  checkIds.forEach(function (id) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = "Not run";
      element.style.background = "#f0f3f8";
      element.style.color = "#75869b";
    }
  });
}

function startDemoProgress(invoice) {
  fileNameElement.textContent = invoice.name || "Selected invoice";

  const size = Number(invoice.size || 0);

  fileMetaElement.textContent =
    "File size: " + (size / (1024 * 1024)).toFixed(2) + " MB";

  overallStatus.textContent = "Demo in progress";

  demoWarning.textContent =
    "This is a simulated demonstration. No actual AI analysis or invoice " +
    "validation has been performed.";

  checkIds.forEach(function (id) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = "Waiting";
      element.style.background = "#f0f3f8";
      element.style.color = "#75869b";
    }
  });

  setProgress(25, "Demo: invoice received.", 0);

  setTimeout(function () {
    setProgress(50, "Demo: data extraction stage.", 1);
    setCheckStatus(0, "Demo preview");
  }, 900);

  setTimeout(function () {
    setProgress(75, "Demo: verification checks stage.", 2);
    setCheckStatus(1, "Demo preview");
    setCheckStatus(2, "Demo preview");
    setCheckStatus(3, "Demo preview");
  }, 1800);

  setTimeout(function () {
    setProgress(100, "Demo flow completed.", 3);
    overallStatus.textContent = "Demo complete";
  }, 2700);
}

const invoice = getSelectedInvoice();

if (invoice) {
  startDemoProgress(invoice);
} else {
  showEmptyState();
}
