// Site-wide behaviour (loaded on every page): cart counter, mobile menu, and the home page product slider.

/* ---------- Cart (shared by every page; remembered in the browser) ---------- */
window.AritelCart = (function () {
  var KEY = "aritelCart";
  var memory = [];            // used if the browser blocks localStorage

  function read() {
    try {
      var raw = window.localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return memory; }
  }
  function write(items) {
    memory = items;
    try { window.localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* ignore */ }
  }
  function count() {
    return read().reduce(function (sum, item) { return sum + (item.qty || 0); }, 0);
  }
  function add(item) {
    var items = read();
    var same = items.filter(function (i) {
      return i.id === item.id && i.color === item.color && i.size === item.size;
    })[0];
    if (same) { same.qty += item.qty; } else { items.push(item); }
    write(items);
    render();
    return count();
  }
  function render() {
    var n = count();
    var badge = document.getElementById("cart-count");
    var link = document.getElementById("cart-link");
    if (badge) {
      badge.textContent = n > 99 ? "99+" : String(n);
      badge.hidden = n === 0;
    }
    if (link) {
      link.setAttribute("aria-label", (n === 0 ? "Cart, empty" : "Cart, " + n + (n === 1 ? " item" : " items")) + ". Shop our t-shirts");
    }
  }
  return { add: add, count: count, render: render };
})();

document.addEventListener("DOMContentLoaded", function () {
  window.AritelCart.render();
  // keep the number right if the cart changes in another tab
  window.addEventListener("storage", window.AritelCart.render);

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (!toggle || !menu) return;

  function setOpen(open) {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  toggle.addEventListener("click", function () {
    setOpen(!menu.classList.contains("open"));
  });

  // Escape closes the menu and returns focus to the button.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Close after choosing a link (useful for in-page anchors on mobile).
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });
});

/* ---------- Home page product slider (does nothing on other pages) ---------- */
// Desktop: the big middle card moves right and shrinks, the left card grows into the middle.
// Phone: the cards are a swipe strip and the arrows scroll one card at a time.
(function () {
  "use strict";
  var track = document.getElementById("product-track");
  if (!track) return;

  var cards = Array.prototype.slice.call(track.querySelectorAll(".product-card"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".dots span"));
  var status = document.getElementById("carousel-status");
  var prev = document.querySelector(".arrow-prev");
  var next = document.querySelector(".arrow-next");
  var SLOTS = ["left", "center", "right"];
  var slot = cards.map(function (_, i) { return i; });   // card i is in slot slot[i] (0 left, 1 middle, 2 right)
  var phone = window.matchMedia("(max-width: 800px)");

  function render(announce) {
    cards.forEach(function (card, i) {
      card.setAttribute("data-pos", SLOTS[slot[i]]);
      card.setAttribute("aria-hidden", "false");
    });
    var centre = slot.indexOf(1);
    dots.forEach(function (d, i) { d.classList.toggle("active", i === centre); });
    if (announce && status) {
      status.textContent = "Featured: " + cards[centre].querySelector("h3").textContent;
    }
  }

  function rotate(step) {
    slot = slot.map(function (s) { return (s + step + 3) % 3; });
    render(true);
  }

  function scrollPhone(dir) {
    var card = cards[0];
    var step = card.getBoundingClientRect().width + 16;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  function go(dir) {
    if (phone.matches) { scrollPhone(dir); } else { rotate(dir); }
  }

  if (next) next.addEventListener("click", function () { go(1); });   // middle card -> right, left card -> middle
  if (prev) prev.addEventListener("click", function () { go(-1); });

  // keyboard: left / right arrows while focus is inside the carousel
  track.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { go(1); } else if (e.key === "ArrowLeft") { go(-1); }
  });

  // phone: keep the dots in step with the card being swiped to
  track.addEventListener("scroll", function () {
    if (!phone.matches) return;
    var w = cards[0].getBoundingClientRect().width + 16;
    var i = Math.max(0, Math.min(cards.length - 1, Math.round(track.scrollLeft / w)));
    dots.forEach(function (d, k) { d.classList.toggle("active", k === i); });
  }, { passive: true });

  phone.addEventListener && phone.addEventListener("change", function () { render(false); });
  render(false);
})();
