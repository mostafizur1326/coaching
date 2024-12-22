function resultManagment() {
  const resultDropdownButton = document.getElementById('resultDropdownButton');
  const resultDropdownMenu = document.getElementById('resultDropdownMenu');
  const dropdownIcon = document.getElementById('dropdownIcon');

  resultDropdownButton.addEventListener('click', () => {
    if (resultDropdownMenu.classList.contains('hidden')) {
      resultDropdownMenu.classList.remove('hidden');
      resultDropdownMenu.style.maxHeight = resultDropdownMenu.scrollHeight + 'px';
    } else {
      resultDropdownMenu.style.maxHeight = '0px';
      setTimeout(() => resultDropdownMenu.classList.add('hidden'), 300);
    }
    dropdownIcon.classList.toggle('bx-chevron-up');
  });

  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabContents.forEach(content => content.classList.add('hidden'));
      tabButtons.forEach(btn => btn.classList.remove('bg-blue-50'));
      const target = document.getElementById(button.getAttribute('data-target'));
      target.classList.remove('hidden');
      button.classList.add('bg-blue-50');
    });
  });
}

resultManagment();