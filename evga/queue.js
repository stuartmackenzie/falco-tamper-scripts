// ==UserScript==
// @name         EVGA Queue Entry
// @namespace    stuymack
// @version      1.0.0
// @description  Signs up for product notifications (queue entry)
// @author       stuymack / Stuart MacKenzie
// @match        https://www.evga.com/products/autoNotify*
// @match        https://www.evga.com/products/feature.aspx
// @run-at       document-start
// @grant        none
// ==/UserScript==

// Version Changelog
// 1.0.0 - Initial release
"use strict";

// 08G-P4-2289-KR - EVGA GeForce RTX 2080 FTW3 ULTRA HYDRO COPPER GAMING (This IS available for notify .. script should work)
// 12G-P5-3955-KR - EVGA RTX 3080 Ti 12GB XC3 ULTRA (If this not available for notify.. the script will keep reloading until it is)

// Config (REQUIRED)
const PRODUCT_NUMBER = "08G-P4-2289-KR";
const FIRST_NAME = "Enter your first name in this string";
const LAST_NAME = "Enter your last name in this string";
const EMAIL = "youremail@gmail.com";

// Config (OPTIONAL) (reload will randomly reload between MIN and MAX time interval -> makes it somewhat random)
const RELOAD_MIN = 5; // Minimum time in SECONDS to reload if the PRODUCT_NUMBER is not available yet for notify
const RELOAD_MAX = 8; // Maximum time in SECONDS to reload if the PRODUCT_NUMBER is not available yet for notify

// ***** LOAD THIS URL IN URL BROWSER --- MAKE SURE TO MODIFY THE PN VALUE to the same PRODUCT_NUMBER VALUE *****
// https://www.evga.com/products/autoNotify.aspx?pn=12G-P5-3955-KR&CsrfToken=596a90d0-bcdd-4361-abaf-a14ebf27bf41

// LEAVE ALONE!!
const __CSRF__ = "b3a3ace0-fbce-4eb0-ad55-3326e6a9f10d";
const __URL__ = `https://www.evga.com/products/autoNotify.aspx?pn=${PRODUCT_NUMBER}&CsrfToken=${__CSRF__}`;
let __RECAPTCHA_SET__ = false;

(async function () {
  document.addEventListener("DOMContentLoaded", async function () {
    const $headTitle = document.querySelector("head title");
    if (!$headTitle) return console.log("WEIRDNESS");

    const headTitle = $headTitle.innerText.trim();
    if (headTitle.indexOf(PRODUCT_NUMBER) < 0) {
      return retry();
    }

    grecaptcha.ready(function () {
      grecaptcha
        .execute("6LdRnsYaAAAAAMnJUhAVLCAAzZvc54L5DO_5354X", {
          action: "www_products_autoNotify_aspx"
        })
        .then(function (token) {
          $("#RecaptchaV3_recaptcha").val(token);
          console.log(token);
          __RECAPTCHA_SET__ = true;
        });
    });

    const $badge = createBadge();
    document.body.appendChild($badge);
    setTimeout(() => {
      $badge.style.transform = "translate(0, 0)";
    }, 300);

    // Warning Message
    const $font = document.querySelector("font");
    if ($font) {
      console.log("WARNING");
      return;
    }

    const $form = document.querySelector("body > form");
    if (!$form) {
      return reload();
    }

    const $fnInput = $form.querySelector("input[name=tbFirstName]");
    const $lnInput = $form.querySelector("input[name=tbLastName]");
    const $emailInput = $form.querySelector("input[name=tbEmail]");
    const $button = $form.querySelector("input[value=Submit]");
    if (!$fnInput || !$lnInput || !$emailInput) {
      return reload();
    }
    $fnInput.value = FIRST_NAME;
    $lnInput.value = LAST_NAME;
    $emailInput.value = EMAIL;

    if ($button) {
      // Avoid recaptcha error
      while (!__RECAPTCHA_SET__) {
        await sleep(1000);
      }
      $button.click();
    }
  });
})();

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function reload() {
  setTimeout(() => {
    location.reload();
  }, randomIntFromInterval(RELOAD_MIN, RELOAD_MAX) * 1000);
}

function retry() {
  setTimeout(() => {
    window.location.href = __URL__;
  }, randomIntFromInterval(RELOAD_MIN, RELOAD_MAX) * 1000);
}

function sleep(duration = 3000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

function createBadge() {
  const iconUrl =
    "https://raw.githubusercontent.com/stuartmackenzie/falco-tamper-scripts/main/assets/falco_icon.png";
  const $container = document.createElement("div");
  const $bg = document.createElement("div");
  const $link = document.createElement("a");
  const $img = document.createElement("img");

  $link.setAttribute("href", "https://discord.gg/falcodrin");
  $link.setAttribute("target", "_blank");
  $link.setAttribute("title", "Falcodrin Community Discord");
  $img.setAttribute("src", iconUrl);

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
