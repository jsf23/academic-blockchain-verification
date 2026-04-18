from pypdf import PdfReader

reader = PdfReader('doc.pdf')
text = ''
for page in reader.pages:
    text += page.extract_text()

with open('pdf_text.txt', 'w', encoding='utf-8') as f:
    f.write(text)

print("Text extracted to pdf_text.txt")
