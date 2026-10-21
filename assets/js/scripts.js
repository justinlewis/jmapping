/*
* Current year in the footer
* ========================================================================== */

(function() {
  var currentYear = document.querySelector('.full-year');
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
})();
