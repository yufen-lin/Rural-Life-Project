// navbar background
const navbar = document.querySelector(".navbar");
const banner = document.querySelector(".banner");
const navbarToggler = document.querySelector(".navbar-toggler");

window.addEventListener("scroll", showNavbarBackground);
navbarToggler.addEventListener("click", (event) => {
  navbar.classList.add("bg-brown");
});

function showNavbarBackground() {
  const distanceScrolled = document.documentElement.scrollTop;
  const bannerHeight = banner.clientHeight;

  if (distanceScrolled > bannerHeight) {
    navbar.classList.add("bg-brown");
  } else {
    navbar.classList.remove("bg-brown");
  }
}

// subscribe form validation
let forms = document.querySelectorAll(".needs-validation");
Array.prototype.slice.call(forms).forEach(function (form) {
  form.addEventListener(
    "submit",
    function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add("was-validated");
    },
    false
  );
});
