function validateForm() {
  let isValid = true;
  const fields = document.querySelectorAll('.input-field');
  const checkBox = document.querySelector('#condition');
  const errorMessages = document.querySelectorAll('.error-message');

  errorMessages.forEach(error => error.classList.add('hidden'));

  fields.forEach(field => {
    if (!field.value.trim()) {
      const errorMessage = field.nextElementSibling.nextElementSibling;
      errorMessage.classList.remove('hidden');
      isValid = false;
    }
  });

  if (!checkBox.checked) {
    checkBox.nextElementSibling.nextElementSibling.classList.remove('hidden');
    isValid = false;
  }

  return isValid;
}