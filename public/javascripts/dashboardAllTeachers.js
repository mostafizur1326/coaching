function allTeachers() {
  const teachersDropdownButton = document.getElementById('teachersDropdownButton');
  const teachersDropdownMenu = document.getElementById('teachersDropdownMenu');
  const teacherTabButtons = document.querySelectorAll('.teacher-tab-button');
  const teacherTabContents = document.querySelectorAll('.teacher-tab-content');

  teachersDropdownButton.addEventListener('click', () => {
    teachersDropdownMenu.classList.toggle('hidden');
  });

  teacherTabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-target');

      teacherTabContents.forEach(content => content.classList.remove('active'));
      teacherTabButtons.forEach(btn => btn.classList.remove('bg-blue-500', 'text-white'));

      document.getElementById(target).classList.add('active');
      button.classList.add('bg-blue-500', 'text-white');
    });
  });

  teacherTabButtons[0].classList.add('bg-blue-500', 'text-white');
  teacherTabContents[0].classList.add('active');
}

allTeachers();