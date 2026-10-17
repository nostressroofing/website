/* No Stress Roofing — vanilla JS. No dependencies. */
(function () {
  "use strict";

  /* ============ Mobile nav ============ */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ============ Quote forms ============ */
  // ------------------------------------------------------------------
  // FORM SUBMISSION ENDPOINT — goes here before the site goes live.
  // Set FORM_ENDPOINT to the URL that should receive quote requests,
  // e.g. a FormSubmit.co address or a small backend route.
  // When empty, the form validates and shows the success message
  // without sending (preview mode).
  // ------------------------------------------------------------------
  var FORM_ENDPOINT = "";

  function setInvalid(field, bad) {
    field.classList.toggle("invalid", bad);
    return !bad;
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  document.querySelectorAll(".quote-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      var name = form.querySelector('[name="name"]');
      var phone = form.querySelector('[name="phone"]');
      var email = form.querySelector('[name="email"]');
      var address = form.querySelector('[name="address"]');
      var message = form.querySelector('[name="message"]');

      ok = setInvalid(name.closest(".field"), name.value.trim().length < 2) && ok;
      ok = setInvalid(phone.closest(".field"), phone.value.trim().length < 7) && ok;
      ok = setInvalid(email.closest(".field"), !validEmail(email.value.trim())) && ok;
      ok = setInvalid(address.closest(".field"), address.value.trim().length < 3) && ok;
      ok = setInvalid(message.closest(".field"), message.value.trim().length < 5) && ok;

      if (!ok) {
        var firstBad = form.querySelector(".field.invalid input, .field.invalid textarea");
        if (firstBad) firstBad.focus();
        return;
      }

      var done = function () {
        form.reset();
        var s = form.querySelector(".form-success");
        if (s) {
          s.classList.add("show");
          s.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      };

      if (FORM_ENDPOINT) {
        var data = new FormData(form);
        fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then(function () { done(); })
          .catch(function () { done(); });
      } else {
        done(); // preview mode: no backend wired yet
      }
    });

    // Clear the error state as the user types
    form.querySelectorAll("input, textarea").forEach(function (el) {
      el.addEventListener("input", function () {
        el.closest(".field").classList.remove("invalid");
      });
    });
  });

  /* ============ Footer year ============ */
  document.querySelectorAll(".js-year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
