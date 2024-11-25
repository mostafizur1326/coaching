function submitForm() {
  var submitBtn = document.getElementById('submitBtn');
  submitBtn.onclick(() => {
    submitBtn.disabled = true;
  })
  
  setTimeout(() => {
    submitBtn.disabled = false;
  }, 10000);
}
