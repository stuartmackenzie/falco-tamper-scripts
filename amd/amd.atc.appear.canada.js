// ==UserScript==
// @name         AMD ATC Button Appear Canada
// @namespace    stuymack
// @version      1.0.3
// @description  Makes ATC Button Appear on Product Page
// @author       stuymack / Stuart MacKenzie
// @match        https://www.amd.com/*/direct-buy/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

// Version Changelog
// 1.0.0 - Initial release
// 1.0.1 - Added a delay so AMD pages have time to load Drupal script and wait for dynamic products to load
// 1.0.2 - I was clobbering Out of stock notifier on product list page, that is now fixed
// 1.0.3 - Added await for dynamic product detail info to load
"use strict";

// https://www.amd.com/en/direct-buy/us
// https://www.amd.com/en/direct-buy/5450881700/us

// Auto click on product detail page
const AUTO_CLICK = true;

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

    const sku = urlMatch && urlMatch.length > 1 ? urlMatch[1] : "";

    if (sku) {
      await handleProductDetailPage(sku);
    } else {
      await handleProductListPage();
    }

    await waitForDrupal();
    Drupal.ajax.bindAjaxLinks(document);

    if (sku && AUTO_CLICK) {
      const $detailButton = document.querySelector(
        "#product-details-info .product-page-description button"
      );
      if ($detailButton) $detailButton.click();
    }

    const $badge = createBadge();
    document.body.appendChild($badge);

    await sleep(300);

    $badge.style.transform = "translate(0, 0)";
  });
})();

// Add buttons to products on product list page
const handleProductListPage = async () => {
  const $products = await waitForProducts();

  for (const $product of $products) {
    const $existingButton = $product.querySelector(".shop-links button");
    if ($existingButton) continue;

    const skuMatch = $product
      .querySelector(".shop-full-specs-link a")
      .getAttribute("href")
      .match(/\d{10}/);
    const sku = skuMatch && skuMatch.length > 0 ? skuMatch[0] : "";
    if (!sku) continue;

    const $links = $product.querySelector(".shop-links");
    if (!$links) continue;

    // $links.innerText = "";
    const $button = createButton(sku);
    $links.append($button);
  }
};

// Add button to product on product detail page
const handleProductDetailPage = async (sku) => {
  if (!sku) return;
  const $details = await waitForDetails();
  const $existingButton = $details ? $details.querySelector("button") : null;
  if ($details && !$existingButton) {
    const $button = createButton(sku);
    $details.append($button);
  }
};

// Generic sleep timeout function
const sleep = (duration = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
};

// Waits for products to load
const waitForProducts = async () => {
  const sel = ".container .views-row";
  let $products = document.querySelectorAll(sel);
  while ($products.length === 0) {
    await sleep(300);
    $products = document.querySelectorAll(sel);
  }
  return $products;
};

// Waits for product details to load
const waitForDetails = async () => {
  const sel = "#product-details-info .product-page-description";
  let $details = document.querySelector(sel);
  while (!$details) {
    await sleep(300);
    $details = document.querySelector(sel);
  }
  return $details;
};

// Waits for Drupal to load in the page
const waitForDrupal = async () => {
  while (typeof window["Drupal"] !== "object") {
    await sleep(300);
  }
};

// Creates Cart Button
// `<button class="btn-shopping-cart btn-shopping-neutral use-ajax" data-progress-type="fullscreen" href="/en/direct-buy/add-to-cart/${idMatch[0]}">Add To Cart</button>`
const createButton = (sku) => {
  const $button = document.createElement("button");
  $button.setAttribute(
    "class",
    "btn-shopping-cart btn-shopping-neutral use-ajax"
  );
  $button.setAttribute("data-progress-type", "fullscreen");
  $button.setAttribute("href", `/en/direct-buy/add-to-cart/${sku}`);
  $button.innerText = "Add To Cart";
  return $button;
};

// Creates Kings badge in bottom left corner
const createBadge = () => {
  const $container = document.createElement("div");
  const $bg = document.createElement("div");
  const $link = document.createElement("a");
  const $img = document.createElement("img");

  $link.setAttribute("href", "https://discord.gg/z2kdWWtwMv");
  $link.setAttribute("target", "_blank");
  $link.setAttribute("title", "Kings Lounge");
  $img.setAttribute(
    "src",
    "https://raw.githubusercontent.com/stuartmackenzie/falco-tamper-scripts/main/assets/kings_icon.jpg"
  );

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
};
