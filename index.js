// Built by Aaryan Mahipal
// This script scrapes the latest 100 Hacker News articles using Playwright
// and verifies they are sorted from newest to oldest using article IDs and timestamps.

const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  let browser;
  try {
    browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://news.ycombinator.com/newest');

    const targetCount = 100;
    let allArticles = [];

    // Collect articles across multiple pages
    for (let pageNum = 1; allArticles.length < targetCount && pageNum <= 4; pageNum++) {
      await page.waitForSelector('tr.athing');

      const pageArticles = await page.$$eval('tr.athing', (rows, currentPage) => {
        return rows.map(row => {
          const titleElement = row.querySelector('.titleline a');
          const title = titleElement?.innerText.trim() || 'No title';
          const id = row.getAttribute('id');

          const nextRow = row.nextElementSibling;
          let timestamp = null;
          if (nextRow?.querySelector) {
            const ageElement = nextRow.querySelector('td.subtext span.age');
            if (ageElement) {
              timestamp = ageElement.getAttribute('title') || ageElement.textContent.trim();
            }
          }

          return {
            title,
            id: id ? Number(id) : null,
            page: currentPage,
            timestamp
          };
        });
      }, pageNum);

      allArticles = allArticles.concat(pageArticles);

      // Navigate to the next page if needed
      if (allArticles.length < targetCount && pageNum < 4) {
        try {
          await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle' }),
            page.click('a.morelink')
          ]);
        } catch (err) {
          console.warn(`⚠️  Could not load page ${pageNum + 1}:`, err.message);
          break;
        }
      }
    }

    const finalArticles = allArticles.slice(0, targetCount);

    console.log('\n=== RUNNING TESTS ===');

    // Test 1: Collected article count
    try {
      assert.strictEqual(finalArticles.length, targetCount);
      console.log('✅ Test 1 PASSED: Collected 100 articles');
    } catch (err) {
      console.error('❌ Test 1 FAILED:', err.message);
    }

    // Test 2: Valid IDs
    try {
      const validIds = finalArticles.filter(a => a.id);
      assert.strictEqual(validIds.length, targetCount);
      console.log('✅ Test 2 PASSED: All articles have valid IDs');
    } catch (err) {
      console.error('❌ Test 2 FAILED:', err.message);
    }

    // Test 3: Sorted by ID
    try {
      const ids = finalArticles.map(a => a.id);
      const sorted = ids.every((id, i, arr) => i === 0 || id <= arr[i - 1]);
      assert.ok(sorted);
      console.log('✅ Test 3 PASSED: Articles sorted by descending ID');
    } catch (err) {
      console.error('❌ Test 3 FAILED:', err.message);
    }

    // Test 4: Timestamp presence
    try {
      const withTimestamps = finalArticles.filter(a => a.timestamp);
      assert.ok(withTimestamps.length > 0);
      console.log(`✅ Test 4 PASSED: ${withTimestamps.length} articles have timestamps`);
    } catch (err) {
      console.error('❌ Test 4 FAILED:', err.message);
    }

    // Test 5: Timestamp order (optional)
    try {
      const timestamped = finalArticles.filter(a => a.timestamp);
      if (timestamped.length > 0) {
        const dates = timestamped.map(a => {
          const iso = a.timestamp.includes(' ') ? a.timestamp.split(' ')[0] : a.timestamp;
          return new Date(iso);
        });
        const sorted = dates.every((d, i, arr) => i === 0 || d <= arr[i - 1]);
        assert.ok(sorted);
        console.log('✅ Test 5 PASSED: Timestamps sorted newest to oldest');
      } else {
        console.log('⚠️  Test 5 SKIPPED: No timestamps to test');
      }
    } catch (err) {
      console.error('❌ Test 5 FAILED:', err.message);
    }

    // Test 6: Structure check
    try {
      const fields = ['title', 'id', 'page', 'timestamp'];
      const consistent = finalArticles.every(a => fields.every(f => f in a));
      assert.ok(consistent);
      console.log('✅ Test 6 PASSED: All articles have expected fields');
    } catch (err) {
      console.error('❌ Test 6 FAILED:', err.message);
    }

  } catch (err) {
    console.error('❌ CRITICAL ERROR:', err);
  } finally {
    if (browser) await browser.close();
  }
})();
