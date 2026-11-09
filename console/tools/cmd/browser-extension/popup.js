document.addEventListener('DOMContentLoaded', async () => {
  const titleInput = document.getElementById('title');
  const urlInput = document.getElementById('url');
  const summaryInput = document.getElementById('summary');
  const tagsInput = document.getElementById('tags');
  const saveBtn = document.getElementById('save-btn');
  const statusEl = document.getElementById('status');
  const settingsLink = document.getElementById('settings-link');

  // Load settings
  const settings = await chrome.storage.local.get(['n4cApiUrl', 'n4cApiKey']);
  const apiUrl = settings.n4cApiUrl || 'http://localhost:8081';

  settingsLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage?.() || chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
  });

  // Get current tab info
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    urlInput.value = tab.url || '';
    titleInput.value = tab.title || '';
  }

  function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
    statusEl.classList.remove('hidden');
    setTimeout(() => {
      statusEl.classList.add('hidden');
    }, 3000);
  }

  saveBtn.addEventListener('click', async () => {
    const payload = {
      title: titleInput.value.trim(),
      url: urlInput.value.trim(),
      summary: summaryInput.value.trim(),
      tags: tagsInput.value.trim(),
      source: 'browser-extension',
      source_alias: 'clipper'
    };

    if (!payload.title || !payload.url) {
      showStatus('标题和链接不能为空', 'error');
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = '保存中...';

    try {
      const res = await fetch(`${apiUrl}/api/v1/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(settings.n4cApiKey ? { 'X-API-Key': settings.n4cApiKey } : {})
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      showStatus('✓ 已保存到 AI News Database 本地库', 'success');
      setTimeout(() => window.close(), 800);
    } catch (err) {
      showStatus(`保存失败: ${err.message}`, 'error');
      saveBtn.disabled = false;
      saveBtn.textContent = '保存到本地库';
    }
  });
});
