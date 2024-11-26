function submitForm() {
  var submitBtn = document.getElementById('submitBtn');
  submitBtn.onsubmit(() => {
    submitBtn.disabled = true;
  })
  
  setTimeout(() => {
    submitBtn.disabled = false;
  }, 10000);
}