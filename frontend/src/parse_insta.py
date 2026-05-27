import re
import html

file_path = r"C:\Users\Lenovo\.gemini\antigravity-ide\brain\2cfaa5df-8779-4caa-af4b-3c73f09998a0\.system_generated\steps\81\content.md"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's search for keywords and extract their surrounding context (e.g. 100 characters before and after)
keywords = ["project", "completed", "ongoing", "villa", "interior", "house", "construction", "design", "office", "site", "architect"]

print("Searching content for project keywords:")
found_any = False
for kw in keywords:
    matches = list(re.finditer(re.escape(kw), content, re.IGNORECASE))
    if matches:
        print(f"\nKeyword '{kw}' matches: {len(matches)}")
        found_any = True
        # Print context of first 5 matches
        for m in matches[:5]:
            start = max(0, m.start() - 100)
            end = min(len(content), m.end() + 100)
            snippet = content[start:end].replace("\n", " ")
            # Clean up HTML tags inside snippet for readability
            snippet_clean = re.sub(r'<[^>]*>', ' ', snippet)
            snippet_clean = ' '.join(snippet_clean.split())
            print("  - Context:", html.unescape(snippet_clean))

if not found_any:
    print("No matches found for any keywords in the raw file.")
