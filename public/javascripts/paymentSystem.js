document.addEventListener("DOMContentLoaded", () => {
  const dropdownButton = document.querySelector(".tab-bar-dropdown-button");
  const dropdownMenu = document.querySelector(".tab-bar-dropdown-menu");
  const tabButtons = document.querySelectorAll(".tab-bar-dropdown-tab-button");
  const tabContents = document.querySelectorAll(".tab-bar-tab-content");

  dropdownButton.addEventListener("click", () => {
    dropdownMenu.classList.toggle("max-h-96");
  });

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-target");
      tabContents.forEach(content => content.classList.add("hidden"));
      document.querySelector(`.tab-bar-tab-content[data-content="${target}"]`).classList.remove("hidden");
    });
  });

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("tab-bar-sub-tab-button")) {
      const parent = e.target.parentNode;
      const subContents = parent.parentNode.querySelectorAll(".tab-bar-sub-tab-content");
      parent.querySelectorAll(".tab-bar-sub-tab-button").forEach(button => button.classList.remove("border-blue-600", "text-blue-600"));
      e.target.classList.add("border-blue-600", "text-blue-600");
      subContents.forEach(content => content.classList.add("hidden"));
      subContents[Array.from(parent.children).indexOf(e.target)].classList.remove("hidden");
    }
  });
});
