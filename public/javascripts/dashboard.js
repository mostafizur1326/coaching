function allStudents() {
  const dropdownButton = document.getElementById('dropdownButton');
  const studentsDropdownMenu = document.getElementById('studentsDropdownMenu');
  const dropdownIcon = document.getElementById('dropdownIcon');

  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  dropdownButton.addEventListener('click', () => {
    if (studentsDropdownMenu.classList.contains('hidden')) {
      studentsDropdownMenu.classList.remove('hidden');
      studentsDropdownMenu.style.maxHeight = studentsDropdownMenu.scrollHeight + 'px';
    } else {
      studentsDropdownMenu.style.maxHeight = '0px';
      setTimeout(() => studentsDropdownMenu.classList.add('hidden'), 300);
    }
    dropdownIcon.classList.toggle('bx-chevron-up');
  });

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active-tab'));
      tabContents.forEach(content => content.classList.add('hidden'));
      button.classList.add('active-tab');
      const target = button.getAttribute('data-target');
      document.getElementById(target).classList.remove('hidden');
    });
  });
}

function previewImage(event) {
  const imagePreview = document.getElementById('imagePreview');
  const imagePreviewContainer = document.getElementById('imagePreviewContainer');

  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imagePreview.src = e.target.result;
      imagePreview.classList.remove('hidden');
      imagePreviewContainer.classList.remove('mb-4');
    }
    reader.readAsDataURL(file);
  } else {
    imagePreview.classList.add('hidden');
    imagePreviewContainer.classList.add('mb-4');
  }
}


allStudents();
