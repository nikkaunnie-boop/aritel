// Product page: options (color / size / quantity), gallery, and "Order Now" email.
// Which product is shown comes from <body data-product="product1">.
(function () {
  "use strict";

  var ORDER_EMAIL = "orders@examplewebsite142.com";
  var MAX_QTY = 10;

  var productId = document.body.getAttribute("data-product");
  var product = typeof products !== "undefined" ? products[productId] : null;
  if (!product) return;

  var selectedColor = "";
  var selectedSize = "";
  var quantity = 1;

  var nameEl = document.getElementById("product-name");
  var priceEl = document.getElementById("product-price");
  var imageEl = document.getElementById("product-image");
  var qtyEl = document.getElementById("quantity");
  var messageEl = document.getElementById("order-message");

  // Fill from the data object so the page and the email always agree.
  if (nameEl) nameEl.textContent = product.name;
  if (priceEl) priceEl.textContent = "₱ " + product.price;
  if (imageEl) { imageEl.src = product.image; imageEl.alt = product.alt; }

  function showMessage(text, isError) {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.classList.toggle("error", !!isError);
  }

  // Single-choice button groups (color, size).
  function setupGroup(selector, onPick) {
    var buttons = document.querySelectorAll(selector);
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.classList.remove("selected");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("selected");
        btn.setAttribute("aria-pressed", "true");
        onPick(btn);
        showMessage("", false);
      });
    });
  }

  setupGroup(".color-circle", function (btn) { selectedColor = btn.dataset.color; });
  setupGroup(".size-btn", function (btn) { selectedSize = btn.dataset.size; });

  // Quantity
  function renderQty() { if (qtyEl) qtyEl.textContent = String(quantity); }
  var dec = document.getElementById("decrease");
  var inc = document.getElementById("increase");
  if (dec) dec.addEventListener("click", function () { if (quantity > 1) { quantity--; renderQty(); } });
  if (inc) inc.addEventListener("click", function () { if (quantity < MAX_QTY) { quantity++; renderQty(); } });

  // Gallery thumbnails swap the main image.
  var thumbs = document.querySelectorAll(".gallery-image");
  thumbs.forEach(function (thumb) {
    thumb.addEventListener("click", function () {
      thumbs.forEach(function (t) {
        t.classList.remove("active");
        t.setAttribute("aria-pressed", "false");
      });
      thumb.classList.add("active");
      thumb.setAttribute("aria-pressed", "true");
      if (imageEl) {
        imageEl.src = thumb.dataset.image;
        imageEl.alt = thumb.dataset.alt || product.alt;
      }
    });
  });

  // Order Now -> opens the visitor's email app with the order filled in.
  function orderProduct() {
    if (!selectedColor || !selectedSize) {
      var missing = [];
      if (!selectedColor) missing.push("a color");
      if (!selectedSize) missing.push("a size");
      showMessage("Please choose " + missing.join(" and ") + " before ordering.", true);
      return;
    }
    var total = product.price * quantity;
    var subject = "T-Shirt Order: " + product.name;
    var body =
      "Hello Aritel,\n\nI would like to order:\n\n" +
      "Product: " + product.name + "\n" +
      "Price: PHP " + product.price + "\n" +
      "Color: " + selectedColor + "\n" +
      "Size: " + selectedSize + "\n" +
      "Quantity: " + quantity + "\n" +
      "Total: PHP " + total + "\n\n" +
      "Name:\nShipping address:\nContact number:\n\nThank you!";
    showMessage("Opening your email app… if nothing happens, email us at " + ORDER_EMAIL + ".", false);
    window.location.href = "mailto:" + ORDER_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  }

  // Add to Cart -> the cart number in the navigation goes up by the quantity chosen.
  function addToCart() {
    if (!selectedColor || !selectedSize) {
      var missing = [];
      if (!selectedColor) missing.push("a color");
      if (!selectedSize) missing.push("a size");
      showMessage("Please choose " + missing.join(" and ") + " before adding to cart.", true);
      return;
    }
    if (!window.AritelCart) return;
    var total = window.AritelCart.add({
      id: productId, name: product.name, price: product.price,
      color: selectedColor, size: selectedSize, qty: quantity
    });
    showMessage("Added to cart: " + product.name + " (" + selectedColor + ", " + selectedSize + ") \u00D7 " + quantity +
      ". Your cart now has " + total + (total === 1 ? " item." : " items."), false);
  }

  var cartBtn = document.getElementById("addToCart");
  if (cartBtn) cartBtn.addEventListener("click", addToCart);

  var orderBtn = document.getElementById("orderNow");
  if (orderBtn) orderBtn.addEventListener("click", orderProduct);
})();
