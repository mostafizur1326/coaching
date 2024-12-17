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

  const dropzones = document.querySelectorAll('.dropzone');
  let uploadedFile = null;

  dropzones.forEach(dropzone => {
    const fileInput = dropzone.querySelector('.fileInput');
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('bg-gray-100');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('bg-gray-100');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('bg-gray-100');
      const file = e.dataTransfer.files[0];
      handleFile(file, dropzone);
    });

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      handleFile(file, dropzone);
    });
  });

  function handleFile(file, dropzone) {
    if (file) {
      uploadedFile = file;
      if (file.name.endsWith('.xlsx')) {
        dropzone.textContent = `Selected File: ${file.name}`;
        dropzone.classList.remove('border-red-500');
        dropzone.classList.add('border-green-500');
      } else {
        dropzone.textContent = 'Invalid file! Please select a .xlsx file.';
        dropzone.classList.remove('border-green-500');
        dropzone.classList.add('border-red-500');
      }
    } else {
      dropzone.textContent = 'No file uploaded! Please upload a file.';
      dropzone.classList.remove('border-green-500', 'border-red-500');
    }
  }

  const uploadButton = document.querySelectorAll('.uploadBTN');

  uploadButton.forEach((button) => {
    button.addEventListener('click', () => {
      if (!uploadedFile) {
        alert('No file uploaded! Please upload a file first.');
        return;
      }

      if (uploadedFile.name.endsWith('.xlsx')) {
        if (navigator.onLine) {
          alert('Result Upload successful.');
        } else {
          alert('No internet connection! Please check your internet.');
        }
      } else {
        alert('Invalid file type! Only .xlsx files are allowed.');
      }
    });
  });
}

resultManagment();
