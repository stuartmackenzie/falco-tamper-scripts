// ==UserScript==
// @name         Bestbuy.ca Pre-Carting
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds "Add to Cart" button to a Out-of-stock item page.
// @author       d0nb1t#2670 (discord)
// @match        https://www.bestbuy.ca/*
// @grant        none
//
// Instructions:
//
// 1. Install Tampermonkey or Greasemonkey extension in Chrome or Firefox.
// 2. Open the extension, click the + sign and paste the script, including this header.
// 3. Save and ensure the script is enabled.
// 4. Go to product page and refresh.
//
// Notes: - The script uses by default postal and province codes from cookies written by Bestbuy.ca.
//        If these cannot be found it uses values from postalcode and province vars below.
//        You may replace these to match your location if desired.
//
//        - The SKU field can be used to override the SKU to be added to cart.
//        This can be useful for products that are not exposed in a product page.
//
// ==/UserScript==

var postalcode = "K1A";
var province = "ON";

///////////////////////

var cartId = getCookieValue("cartId");

(function () {
  "use strict";
  userData();
  const product_page = document.URL.indexOf("/en-ca/product/");
  const sku = truncate(
    location.href.substring(location.href.lastIndexOf("/") + 1),
    8
  );
  if (product_page > -1) addFakeButtons(sku);
})();

function price_tag() {
  return document.querySelector('div[class~="price_FHDfG"]');
}
function getCookieValue(name) {
  return (
    document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || ""
  );
}
function addFakeButtons(id) {
  var div = document.createElement("div");
  var btn_addtocart = document.createElement("input");
  var input_sku = document.createElement("input");
  var btn_gotocart = document.createElement("input");
  setAttributes(input_sku, {
    type: "text",
    value: id,
    id: "skufield",
    size: "8",
    maxlength: "8"
  });
  setAttributes(btn_gotocart, {
    type: "button",
    value: "Go to Cart",
    id: "gotocart",
    onclick:
      'javascript:window.location.href = "https://www.bestbuy.ca/en-ca/basket"'
  });
  setAttributes(btn_addtocart, {
    type: "button",
    value: "Add to Cart",
    id: "fakeaddtocart",
    onclick:
      'javascript:(function() { var cartId = "' +
      cartId +
      '"; if(!cartId) { alert("Log in first!\\nIf you have just logged in, please reload this page."); throw new Error(); } var id = document.getElementById("skufield").value; fetch("https://www.bestbuy.ca/api/basket/v2/baskets", { "headers": { "accept-language": "en-CA", "content-type": "application/json", "postal-code": "' +
      postalcode +
      '", "region-code": "' +
      province +
      '" }, "body": "' +
      JSON.stringify(
        { id: cartId, lineItems: [{ sku: id, quantity: 1 }] },
        null
      ).replace(/\"/g, '\\"') +
      '", "method": "POST", "credentials": "include" }).then(function(response) { console.log(response.status); if(response.ok) { alert("Item added to cart!"); } else if(response.status == "422") { alert("Added the maximum allowed quantity for this item!"); } else if(response.status == "400") { alert("Could not add Item to cart.\\nPlease log off, log in again and retry!"); } else { alert("HTTP status " + response.status); throw new Error("HTTP status " + response.status); } }) })();'
  });
  div.appendChild(btn_addtocart);
  div.appendChild(input_sku);
  div.appendChild(btn_gotocart);
  try {
    price_tag().before(div);
  } catch (e) {
    console.error(e.message);
  }
}
function setAttributes(element, attrs) {
  for (var key in attrs) {
    element.setAttribute(key, attrs[key]);
  }
}

function userData() {
  try {
    var decodeLocation = JSON.parse(
      decodeURIComponent(getCookieValue("lastUsedLocations"))
    );
    if (decodeLocation.shippingLocation.postalCode)
      postalcode = decodeLocation.shippingLocation.postalCode;
    if (decodeLocation.shippingLocation.region)
      province = decodeLocation.shippingLocation.region;
  } catch (e) {
    console.error(e.message);
  }
  console.log("Cart ID: " + cartId);
  console.log("Postal Code: " + postalcode);
  console.log("Province: " + province);
}

function truncate(str, n) {
  return str.length > n ? str.substr(0, n) : str;
}
