from pdf_parser import extract_text
from ocr import extract_text_from_scanned_pdf


def process_document(pdf_path):

    # First try normal PDF text extraction
    extracted_text = extract_text(pdf_path)

    # If text exists, return it
    if extracted_text and extracted_text.strip():
        print("Text-based PDF detected")
        return extracted_text

    # Otherwise use OCR
    else:
        print("Scanned PDF detected. Running OCR...")
        extracted_text = extract_text_from_scanned_pdf(pdf_path)
        return extracted_text


if __name__ == "__main__":

    pdf_path = "data/sample.pdf"

    final_text = process_document(pdf_path)

    print("\nFinal Extracted Text:\n")
    print(final_text)