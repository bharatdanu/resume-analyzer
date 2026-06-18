from pypdf import PdfReader


MAX_FILE_SIZE = 2 * 1024 * 1024  # 2MB
MAX_TEXT_LENGTH = 12000


def extract_resume_text(uploaded_file):
    if uploaded_file.size > MAX_FILE_SIZE:
        raise ValueError("File too large. Maximum size is 2MB.")

    filename = uploaded_file.name.lower()

    if filename.endswith(".txt"):
        text = uploaded_file.read().decode("utf-8", errors="ignore")

    elif filename.endswith(".pdf"):
        reader = PdfReader(uploaded_file)
        pages = []

        for page in reader.pages:
            page_text = page.extract_text() or ""
            pages.append(page_text)

        text = "\n".join(pages)

    else:
        raise ValueError("Only PDF and TXT files are allowed.")

    text = text.strip()

    if not text:
        raise ValueError("Could not extract text from the resume.")

    return text[:MAX_TEXT_LENGTH]
