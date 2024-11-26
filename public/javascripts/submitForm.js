/*function submitForm() {
  var submitBtn = document.getElementById('submitBtn');
  submitBtn.onsubmit(() => {
    submitBtn.disabled = true;
  })
  
  setTimeout(() => {
    submitBtn.disabled = false;
  }, 10000);
}*/
/*const form = document.querySelector("form");
const submitButton = form.querySelector("#submitBtn");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (submitButton.disabled) {
    return
  } else {
    submitButton.disabled = true;
    submitButton.innerText = "Submitting...";
    setTimeout(() => {
      console.log("Form submitted!");
      alert("Form submitted successfully!");

      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.innerText = "Submit";
      }, 30000);
    }, 1000);
  }
});*/