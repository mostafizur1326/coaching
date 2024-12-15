function navigation() {
  const elements = {
    menu_list: document.querySelector(".menu_list"),
    menu_icon: document.querySelector(".menu_icon"),
    cross_icon: document.querySelector(".cross_icon"),
    home: document.querySelector(".home"),
    about: document.querySelector(".about"),
    exams: document.querySelector(".exams"),
    payment: document.querySelector(".payment"),
    notice: document.querySelector(".notice"),
    contact: document.querySelector(".contact"),
    profileButton: document.getElementById("profileButton"),
    dropdownMenu: document.getElementById("dropdownMenu")
  };

  const links = [elements.home, elements.about, elements.exams, elements.notice, elements.payment, elements.contact];

  const timeline = gsap.timeline();
  timeline.from(".sm_logo a img", { y:200, duration: 0.5, stagger: 0.1 })
    .from(".menu", { y: 80, duration: 0.5 })
    .from(".user_i", { y: 80, duration: 0.5 });

  const tl = gsap.timeline();
  tl.to(".menu_list", {
      x: -425,
      duration: 0.5
    })
    .from(".menu_list ul li, .profileBtn_sm", {
      x: 425,
      duration: 0.5,
      opacity: 0,
      stagger: 0.2
    })
    .to(".menu_icon", {
      x: 425,
      duration: 0.1
    })
    .to(".cross_icon", {
      y: 425,
      duration: 0.1
    })
    .pause();

  elements.menu_icon.addEventListener("click", () => tl.play());
  elements.cross_icon.addEventListener("click", () => tl.reverse());

  // Adding mouseover and mouseleave animations to links
  links.forEach(link => {
    link.addEventListener("mouseover", () => {
      gsap.from(link.querySelectorAll('span'), {
        rotateY: 720,
        duration: 0.2,
        opacity: 0,
        stagger: 0.1
      });
    });
    link.addEventListener("mouseleave", () => {
      gsap.from(link.querySelectorAll('span'), {
        rotateY: -720,
        duration: 0.2,
        opacity: 0,
        stagger: -0.1
      });
    });
  });

  // Toggle dropdown menu for profile button
  elements.profileButton.addEventListener("click", () => {
    elements.dropdownMenu.classList.toggle("hidden");
  });

  // Close the dropdown if clicked outside
  window.addEventListener("click", (e) => {
    if (!elements.profileButton.contains(e.target) && !elements.dropdownMenu.contains(e.target)) {
      elements.dropdownMenu.classList.add("hidden");
    }
  });
}

function toggleMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const menuDropdown = document.getElementById("menuDropdown");

  menuToggle.addEventListener("click", () => {
    menuDropdown.classList.toggle("hidden");
  });

  window.addEventListener("click", (e) => {
    if (!menuToggle.contains(e.target) && !menuDropdown.contains(e.target)) {
      menuDropdown.classList.add("hidden");
    }
  });
}

function carousel() {
  const carousel = document.querySelector(".carousel");
  const items = document.querySelectorAll(".carousel-item");
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");
  const totalItems = items.length;

  let currentIndex = 0;

  const updateCarousel = () => {
    const offset = -currentIndex * 100;
    carousel.style.transform = `translateX(${offset}%)`;
  };

  prev.addEventListener("click", () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalItems - 1;
    updateCarousel();
  });

  next.addEventListener("click", () => {
    currentIndex = (currentIndex < totalItems - 1) ? currentIndex + 1 : 0;
    updateCarousel();
  });
}


window.addEventListener("DOMContentLoaded", navigation);
window.addEventListener("DOMContentLoaded", toggleMenu);
window.addEventListener("DOMContentLoaded", carousel);
