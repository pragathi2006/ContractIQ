import pdfplumber

def extract_text(pdf_path):
    text = ""

    try:
        with pdfplumber.open(pdf_path) as pdf:
            total_pages = len(pdf.pages)

            for page in pdf.pages:
                page_text = page.extract_text()

                if page_text:
                    text += page_text + "\n"

        return text, total_pages

    except Exception as e:
        print("Error:", e)
        return None, 0


if __name__ == "__main__":
    pdf_path = "data/Extracted_Questions.pdf"

    extracted_text, pages = extract_text(pdf_path)

    if extracted_text:
        print(extracted_text)