// Privacy page: change "View more.." / "View less.." as each card expands (Bootstrap collapse).
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('.policy-card [data-bs-toggle="collapse"]').forEach(function (link) {
    var target = document.querySelector(link.getAttribute("href"));
    var card = link.closest(".policy-card");
    if (!target) return;
    var hidden = link.querySelector(".visually-hidden");
    var extra = hidden ? hidden.outerHTML : "";
    function label(more) { link.innerHTML = (more ? "View more" : "View less") + extra + ".."; }
    target.addEventListener("show.bs.collapse", function () { card.classList.add("expanded"); label(false); });
    target.addEventListener("hidden.bs.collapse", function () { card.classList.remove("expanded"); label(true); });
  });
});
