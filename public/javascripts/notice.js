function openTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));

  document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('border-teal-500', 'text-teal-500'));

  document.getElementById(tabId).classList.remove('hidden');
  document.querySelector(`[onclick="openTab('${tabId}')"]`).classList.add('border-teal-500', 'text-teal-500');
}

document.getElementById('defaultTab').click();
