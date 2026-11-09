// AI News Database Content Script
// Runs in the context of web pages to extract article metadata

(function () {
  function extractMeta(selector) {
    const el = document.querySelector(selector);
    return el ? el.getAttribute('content') || el.textContent : '';
  }

  function getArticleData() {
    const title = document.title || extractMeta('meta[property="og:title"]');
    const description = extractMeta('meta[property="og:description"]') ||
                        extractMeta('meta[name="description"]');
    const url = window.location.href;

    // Try to extract main content (very naive)
    const articleBody = document.querySelector('article');
    let content = '';
    if (articleBody) {
      content = articleBody.innerText.substring(0, 500);
    }

    return {
      title: title.trim(),
      url,
      description: description.trim(),
      content: content.trim()
    };
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getArticleData') {
      sendResponse(getArticleData());
    }
    return true;
  });
})();
