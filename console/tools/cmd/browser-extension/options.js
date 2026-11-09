document.addEventListener('DOMContentLoaded', async () => {
  const apiUrlInput = document.getElementById('api-url');
  const apiKeyInput = document.getElementById('api-key');
  const saveBtn = document.getElementById('save-btn');
  const statusEl = document.getElementById('status');

  const settings = await chrome.storage.local.get(['n4cApiUrl', 'n4cApiKey']);
  apiUrlInput.value = settings.n4cApiUrl || 'http://localhost:8081';
  apiKeyInput.value = settings.n4cApiKey || '';

  function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
    statusEl.classList.remove('hidden');
    setTimeout(() => statusEl.classList.add('hidden'), 3000);
  }

  saveBtn.addEventListener('click', async () => {
    await chrome.storage.local.set({
      n4cApiUrl: apiUrlInput.value.trim(),
      n4cApiKey: apiKeyInput.value.trim()
    });
    showStatus('✓ 设置已保存', 'success');
  });
});
