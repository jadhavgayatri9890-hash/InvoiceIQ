
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from io import BytesIO
import re

app = FastAPI(title="InvoiceIQ")

# Allow the frontend to connect to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Welcome to InvoiceIQ!",
        "project": "AI-Powered Invoice Verification Assistant",
        "status": "Backend is running successfully"
    }


@app.post("/api/invoices/extract")
async def extract_invoice(file: UploadFile = File(...)):
    # Accept PDF files only
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF invoice."
        )

    # Read uploaded file
    pdf_bytes = await file.read()

    if not pdf_bytes:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty."
        )

    if len(pdf_bytes) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail="PDF size must be 10 MB or less."
        )

    try:
        reader = PdfReader(BytesIO(pdf_bytes))

        if reader.is_encrypted:
            raise HTTPException(
                status_code=400,
                detail="Password-protected PDFs are not supported."
            )

        text = "\n".join(
            page.extract_text() or "" for page in reader.pages
        )

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Could not read this PDF. Please check the file."
        )

    if not text.strip():
        raise HTTPException(
            status_code=422,
            detail=(
                "No selectable text found. "
                "This PDF may be scanned and require OCR."
            )
        )

    # Try to identify common invoice fields
    def find_field(patterns):
        for pattern in patterns:
            match = re.search(
                pattern, text, re.IGNORECASE | re.MULTILINE
            )
            if match:
                return match.group(1).strip()
        return None

    invoice_number = find_field([
        r"(?:invoice\s*(?:number|no\.?|#|id))\s*[:#\-]?\s*([A-Z0-9][A-Z0-9\-\/]+)",
        r"(?:bill\s*(?:number|no\.?))\s*[:#\-]?\s*([A-Z0-9][A-Z0-9\-\/]+)"
    ])

    invoice_date = find_field([
        r"(?:invoice\s*date|bill\s*date|date\s*of\s*issue|date)\s*[:\-]?\s*(\d{1,4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,4})"
    ])

    total_amount = find_field([
        r"(?:grand\s*total|total\s*amount|invoice\s*total|amount\s*due|total)\s*[:\-]?\s*(?:INR|Rs\.?|₹|\$)?\s*([0-9,]+(?:\.\d{1,2})?)"
    ])

    vendor_name = None
    for line in text.splitlines():
        line = line.strip()
        if line and len(line) >= 2:
            if not re.search(
                r"invoice|tax invoice|bill to|ship to|date|gstin",
                line,
                re.IGNORECASE
            ):
                vendor_name = line[:120]
                break

    return {
        "filename": file.filename,
        "message": "PDF text extracted successfully.",
        "extraction_method": "PDF text extraction",
        "invoice_number": invoice_number,
        "vendor_name": vendor_name,
        "invoice_date": invoice_date,
        "total_amount": total_amount,
        "text_preview": text[:1500],
        "note": (
            "Fields are best-effort matches. "
            "Please verify the extracted values manually."
        )
    }
