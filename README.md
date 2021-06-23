# falco-tamper-scripts

Tamper scripts to help with retailer checkout

[Falcodrin Discord](https://discord.gg/falcodrin)

[Falcodrin Twitter](https://twitter.com/falcodrin)

[Falcodrin Twitch](https://www.twitch.tv/falcodrin)

## Canada

[Kings Discord](https://discord.gg/z2kdWWtwMv)

[Kings Twitch](https://www.twitch.tv/kingstwitch_)

## AMD Script

- Displays add to cart buttons on AMD product list page or product detail page.

[Youtube Walkthrough](https://www.youtube.com/watch?v=C-Cv_41h0Ho)

## EVGA Queue Script

\*\* You first need to login to EVGA with your account!!!

You need to edit the script and set your first name, last name, and email:

```js
const PRODUCT_NUMBER = "08G-P4-2289-KR"; // <-- Enter the product number you want to enter into queue
const FIRST_NAME = "Falco";
const LAST_NAME = "McGinity";
const EMAIL = "falco.mcginty@gmail.com";
```

1. Load the script into tamper monkey (and make sure it is enabled)

2. Go to the below url (you need to put same PRODUCT_NUMBER in url below)

- https://www.evga.com/products/autoNotify.aspx?pn=08G-P4-2289-KR&CsrfToken=596a90d0-bcdd-4361-abaf-a14ebf27bf41

3. If you use a product number that the queue is NOT OPEN for, the script will continue to reload the above url (ie. should work when the queue opens)

4. You may see Access Denied -> clear your evga cookies, login, and try again.

3080ti FTW3 Hydro Copper - https://www.evga.com/products/autonotify.aspx?pn=12G-P5-3969-KR
3080ti XC3 Hydro Copper - https://www.evga.com/products/autonotify.aspx?pn=12G-P5-3958-KR
3080ti FTW3 ULTRA - https://www.evga.com/products/autonotify.aspx?pn=12G-P5-3967-KR
3080ti Hybrid FTW3 Ultra - https://www.evga.com/products/autonotify.aspx?pn=12G-P5-3968-KR
3080ti XC3 ULTRA - https://www.evga.com/products/autonotify.aspx?pn=12G-P5-3955-KR
3080ti Hybrid XC3 - https://www.evga.com/products/autonotify.aspx?pn=12G-P5-3958-KR
