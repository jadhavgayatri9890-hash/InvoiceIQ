
const invoiceFile = document.getElementById("invoice-file");
const fileLabel = document.getElementById("file-label");
const fileMessage = document.getElementById("file-message");
const verifyButton = document.getElementById("verify-button");

const totalCount = document.getElementById("total-count");
const pendingCount = document.getElementById("pending-count");
const invoiceList = document.getElementById("invoice-list");
const invoiceCount = document.getElementById("invoice-count");
const emptyRow = document.getElementById("invoice-empty-row");

const STORAGE_KEY = "invoiceIQHistory";

let selectedInvoice = null;
let invoices = [];

try {
  const savedInvoices = localStorage.getItem(STORAGE_KEY);
  invoices = savedInvoices ? JSON.parse(savedInvoices) : [];

  if (!Array.isArray(invoices)) {
    invoices = [];
  }
} catch (error) {
  invoices = [];
}

const allowedTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg"
];

function saveHistory() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    return true;
  } catch (error) {
    fileMessage.style.color = "#d94848";
    fileMessage.textContent =
      "History save झाली नाही. Browser storage check कर.";
    return false;
  }
}

function updateDashboard() {
  if (totalCount) totalCount.textContent = invoices.length;
  if (pendingCount) pendingCount.textContent = invoices.length;
  if (invoiceCount) invoiceCount.textContent = invoices.length;

  if (!invoiceList) return;

  invoiceList.querySelectorAll(".generated-invoice-row")
    .forEach(function (row) {
      row.remove();
    });

  if (emptyRow) {
    emptyRow.style.display = invoices.length ? "none" : "";
  }

  invoices.slice().reverse().forEach(function (invoice) {
    const row = document.createElement("tr");
    row.className = "generated-invoice-row";

    const nameCell = document.createElement("td");
    nameCell.textContent = invoice.name;

    const dateCell = document.createElement("td");
    dateCell.textContent = new Date(invoice.date).toLocaleDateString();

    const sizeCell = document.createElement("td");
    sizeCell.textContent =
      (Number(invoice.size || 0) / (1024 * 1024)).toFixed(2) + " MB";

    const statusCell = document.createElement("td");
    statusCell.textContent = "Pending";
    statusCell.className = "pending-status";

    row.append(nameCell, dateCell, sizeCell, statusCell);
    invoiceList.appendChild(row);
  });
}

invoiceFile.addEventListener("change", function () {
  const file = this.files[0];
  selectedInvoice = null;

  if (!file) {
    fileLabel.textContent = "Choose a file to upload";
    fileMessage.textContent = "";
    return;
  }

  if (!allowedTypes.includes(file.type)) {
    this.value = "";
    fileLabel.textContent = "Choose a file to upload";
    fileMessage.style.color = "#d94848";
    fileMessage.textContent = "Please select a PDF, PNG or JPG file.";
    return;
  }

  selectedInvoice = file;
  fileLabel.textContent = file.name;
  fileMessage.style.color = "#17886c";
  fileMessage.textContent =
    "File selected successfully (" +
    (file.size / (1024 * 1024)).toFixed(2) +
    " MB).";
});

verifyButton.addEventListener("click", function () {
  if (!selectedInvoice) {
    fileMessage.style.color = "#d94848";
    fileMessage.textContent = "Please select an invoice file first.";
    return;
  }

  const invoiceDetails = {
    id: Date.now() + "-" + Math.random().toString(36).slice(2, 8),
    name: selectedInvoice.name,
    size: selectedInvoice.size,
    lastModified: selectedInvoice.lastModified,
    date: new Date().toISOString(),
    status: "Pending"
  };

  invoices.push(invoiceDetails);

  if (!saveHistory()) {
    invoices.pop();
    return;
  }

  try {
    sessionStorage.setItem(
      "invoiceIQSelectedInvoice",
      JSON.stringify(invoiceDetails)
    );
  } catch (error) {
    fileMessage.style.color = "#d94848";
    fileMessage.textContent =
      "Invoice details save झाले नाहीत. पुन्हा try कर.";
    return;
  }

  updateDashboard();
  window.location.href = "results.html";
});

updateDashboard();
