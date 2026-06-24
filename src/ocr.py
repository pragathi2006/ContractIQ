from pdf2image import convert_from_path
import pytesseract

# Path to Tesseract executable
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Path to Poppler bin folder
POPPLER_PATH = r"C:\Users\pprag\Downloads\Release-26.02.0-0\poppler-26.02.0\Library\bin"


def extract_text_from_scanned_pdf(pdf_path):
    text = ""

    # Convert PDF pages into images
    images = convert_from_path(
        pdf_path,
        poppler_path=POPPLER_PATH
    )

    # OCR each page
    for image in images:
        page_text = pytesseract.image_to_string(image)
        text += page_text + "\n"

    return text


if __name__ == "__main__":
    pdf_path = "data/Extracted_Questions.pdf"

    extracted_text = extract_text_from_scanned_pdf(pdf_path)

    print(extracted_text)