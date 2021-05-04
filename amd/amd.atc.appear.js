// ==UserScript==
// @name         AMD ATC Button Appear
// @namespace    stuymack
// @version      1.0.0
// @description  Makes ATC Button Appear on Product Page
// @author       stuymack / Stuart MacKenzie
// @match        https://www.amd.com/*/direct-buy/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

// Version Changelog
// 1.0.0 - Initial release
"use strict";

const ICON_URL =
  "https://raw.githubusercontent.com/stuartmackenzie/falco-tamper-scripts/main/assets/falco_icon.png";

function createBadge() {
  const $container = document.createElement("div");
  const $bg = document.createElement("div");
  const $link = document.createElement("a");
  const $img = document.createElement("img");

  $link.setAttribute("href", "https://discord.gg/falcodrin");
  $link.setAttribute("target", "_blank");
  $link.setAttribute("title", "Falcodrin Community Discord");
  $img.setAttribute("src", ICON_URL);

  $container.style.cssText =
    "position:fixed;left:0;bottom:0;width:80px;height:80px;background: transparent;z-index: 1000;transition: all 500ms ease; transform: translate(-80px, 80px);";
  $bg.style.cssText =
    "position:absolute;left:-100%;top:0;width:160px;height:160px;transform:rotate(45deg);background:#000;box-shadow: 0px 0 10px #060303; border: 1px solid #FFF;";
  $link.style.cssText =
    "position:absolute;display:block;top:30px;left: 12px; z-index:10;width: 40px;height:40px;border-radius: 10px;overflow:hidden;";
  $img.style.cssText = "display:block;width:100%";
  $link.appendChild($img);
  $container.appendChild($bg);
  $container.appendChild($link);
  return $container;
}

(async function () {
  document.addEventListener("DOMContentLoaded", async function () {
    const urlMatch = location.href.match(
      /^https:\/\/www.amd.com\/.{2}\/direct-buy\/(\d{10})?/
    );
    if (urlMatch == null) {
      const err =
        "You must run this script from www.AMD.com.\nThe script will make the add to cart button appear.";
      alert(err);
      throw new Error(err);
    }

    const pid = urlMatch[1];

    const products = document.querySelectorAll(
      ".view-shop-product-search .views-row"
    );

    products.forEach((p) => {
      const idMatch = p
        .querySelector(".shop-full-specs-link a")
        .getAttribute("href")
        .match(/\d{10}/);
      if (idMatch == null) return;
      if (p.querySelector(".shop-links button") != null) return;

      p.querySelector(".shop-links").insertAdjacentHTML(
        "beforeend",
        `<button class="btn-shopping-cart btn-shopping-neutral use-ajax" data-progress-type="fullscreen" href="/en/direct-buy/add-to-cart/${idMatch[0]}">Add To Cart</button>`
      );
    });

    const details = document.querySelector(
      "#product-details-info .product-page-description"
    );
    if (details && pid && !details.querySelector("button")) {
      details.insertAdjacentHTML(
        "beforeend",
        `<button class="btn-shopping-cart btn-shopping-neutral use-ajax" data-progress-type="fullscreen" href="/en/direct-buy/add-to-cart/${pid}">Add to Cart</button>`
      );
    }

    Drupal.ajax.bindAjaxLinks(document);

    if (details && details.querySelector("button")) {
      details.querySelector("button").click();
    }

    const $badge = createBadge();
    document.body.appendChild($badge);
    setTimeout(() => {
      $badge.style.transform = "translate(0, 0)";
    }, 300);
  });
})();
