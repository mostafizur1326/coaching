function guideTapber() {
  document.getElementById("tab1").classList.add("text-blue-900", "border-b-2", "border-blue-500");
  document.getElementById("content1").classList.add("active");

  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", function() {
      tabs.forEach(t => t.classList.remove("text-blue-900", "border-b-2", "border-blue-500"));
      document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));

      tab.classList.add("text-blue-900", "border-b-2", "border-blue-500");

      const target = tab.id.replace('tab', 'content');
      document.getElementById(target).classList.add("active");
    });
  });
}

function classInfoHigth() {
  const buttons = document.querySelectorAll('.toggle-btn');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);

      // Check if the content is already visible
      if (targetContent.style.maxHeight && targetContent.style.maxHeight !== '0px') {
        targetContent.style.maxHeight = '0'; // Collapse content
      } else {
        // Close any open content
        document.querySelectorAll('.hidden-content').forEach(content => {
          content.style.maxHeight = '0';
        });

        // Open the clicked content
        targetContent.style.maxHeight = targetContent.scrollHeight + 'px';
      }
    });
  });
}

guideTapber();
classInfoHigth();
