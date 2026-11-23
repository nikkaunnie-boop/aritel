// Contact page: accessible form validation -> email app, and the FAQ accordion.
(function () {
  "use strict";

  var CONTACT_EMAIL = "hello@examplewebsite142.com";

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("form-status");

  function isValid(field) {
    var value = field.type === "checkbox" ? field.checked : field.value.trim();
    if (!value) return false;
    if (field.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (field.type === "tel") return /^[0-9+\-\s()]{7,20}$/.test(value);
    return true;
  }

  function mark(field) {
    var ok = isValid(field);
    field.classList.toggle("is-invalid", !ok);
    field.classList.toggle("is-valid", ok && field.type !== "checkbox");
    field.setAttribute("aria-invalid", ok ? "false" : "true");
    return ok;
  }

  if (form) {
    var fields = Array.prototype.slice.call(form.querySelectorAll("input, textarea"));

    // Re-check a field after the visitor has left it once.
    fields.forEach(function (f) {
      f.addEventListener("blur", function () { if (f.dataset.touched) mark(f); else if (f.value || f.checked) { f.dataset.touched = "1"; mark(f); } });
      f.addEventListener("input", function () { if (f.classList.contains("is-invalid")) mark(f); });
      f.addEventListener("change", function () { if (f.classList.contains("is-invalid")) mark(f); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      fields.forEach(function (f) { if (!mark(f) && !firstBad) firstBad = f; });

      if (firstBad) {
        status.textContent = "Please fix the highlighted fields and try again.";
        status.className = "form-status error";
        firstBad.focus();
        return;
      }

      var first = document.getElementById("firstName").value.trim();
      var last = document.getElementById("lastName").value.trim();
      var email = document.getElementById("email").value.trim();
      var phone = document.getElementById("contactNumber").value.trim();
      var message = document.getElementById("message").value.trim();

      var subject = "Contact Us Inquiry - " + first + " " + last;
      var body =
        "First Name: " + first + "\n" +
        "Last Name: " + last + "\n" +
        "Email: " + email + "\n" +
        "Contact Number: " + phone + "\n\n" +
        "Message:\n" + message;

      status.textContent = "Opening your email app… if nothing happens, email us at " + CONTACT_EMAIL + ".";
      status.className = "form-status success";
      window.location.href = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-question").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      item.classList.toggle("active", !open);
      var icon = btn.querySelector(".faq-icon");
      if (icon) icon.textContent = open ? "+" : "−";
    });
  });
})();
