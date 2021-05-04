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
  });
})();
