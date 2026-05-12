document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {

  const revealElements = document.querySelectorAll('[data-bynox-reveal]');

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }

    });

  }, {
    threshold: 0.15
  });

  revealElements.forEach(element => {
    observer.observe(element);
  });

});