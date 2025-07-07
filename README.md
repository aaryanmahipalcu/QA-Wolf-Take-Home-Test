# 🕵️‍♂️ Hacker News Sort Order Validator

A QA automation script that uses [Playwright](https://playwright.dev) and Node.js to validate the sort order of the latest articles on [Hacker News](https://news.ycombinator.com/newest). The script checks that the 100 most recent articles are displayed in descending chronological order using both article IDs and timestamps.

---

## ✅ Features

- ✅ End-to-end browser automation with Playwright
- ✅ Multi-page navigation (up to 4 pages)
- ✅ Structured metadata extraction (title, ID, timestamp, page)
- ✅ Timestamp-aware validation
- ✅ Fully automated test suite using `assert`

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/hacker-news-validator.git
cd hacker-news-validator
npm install
```

---

## 🚀 Usage

```bash
node index.js
```

- The script launches Chromium and begins collecting articles.
- You’ll see live output for test results.
- The browser remains visible for debugging (`headless: false`).

To run headless:

```js
// in index.js
await chromium.launch({ headless: true });
```

---

## 🧪 Test Coverage

The script runs six validation checks:

| Test # | Description |
|--------|-------------|
| 1️⃣ | Validates that exactly 100 articles were collected |
| 2️⃣ | Ensures all articles have valid numeric IDs |
| 3️⃣ | Confirms IDs are sorted in descending order |
| 4️⃣ | Verifies timestamp data exists for at least some articles |
| 5️⃣ | Checks that timestamps (if present) are sorted correctly |
| 6️⃣ | Ensures all article objects contain required fields: `title`, `id`, `timestamp`, `page` |

Each test uses `assert` to fail loudly with descriptive error messages.

---

## 📊 Sample Output

```bash
=== RUNNING TESTS ===
✅ Test 1 PASSED: Collected 100 articles
✅ Test 2 PASSED: All articles have valid IDs
✅ Test 3 PASSED: Articles sorted by descending ID
✅ Test 4 PASSED: 100/100 articles have timestamps
✅ Test 5 PASSED: Timestamps sorted newest to oldest
✅ Test 6 PASSED: All articles have expected fields
```

---

## ⚠️ Assumptions & Known Constraints

- Hacker News IDs increment over time (i.e., higher ID = newer post)
- Page layout remains consistent (`tr.athing`, `.titleline`, etc.)
- Timestamps use `title` attribute when available (fallback to text content)
- Only the `/newest` section is validated — not front page or filters
- Script is capped at 4 pages max (~120 articles scraped to ensure coverage)

---

## 🛠 Customization

| Want to... | Change |
|------------|--------|
| Change article count | `const targetCount = 100;` |
| Navigate more pages | Update `pageNum <= 4` in the loop |
| Run silently | Set `headless: true` in `chromium.launch()` |
| Export data | Add JSON/CSV output logic in the final section |

---

## 📁 Project Structure

```text
├── index.js        # Main scraping and test logic
├── package.json    # Dependencies (Playwright only)
└── README.md       # Project documentation
```


