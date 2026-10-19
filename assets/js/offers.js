/*
  Worthback — offer list
  ----------------------
  This is the ONLY file you need to edit to add, change or remove offers.
  Every offer you add appears automatically on the Explore Offers page,
  and the first three active offers also appear on the Home page.

  Add only offers you have confirmed with the retailer or affiliate network.

  Fields for each offer:
    id          short unique text, lowercase, no spaces      e.g. "store-name-fashion"
    store       retailer name exactly as it should appear     e.g. "Store Name"
    category    one word or short phrase for the filter chips e.g. "Fashion"
    rate        the cashback headline                         e.g. "Up to 6%" or "Flat ₹75"
    summary     one sentence describing the offer
    link        your tracked affiliate link (must start with https://)
    validTill   last day of the offer as "YYYY-MM-DD", or null if it has no end date.
                Offers are hidden automatically after this date.
    conditions  list of short, clear conditions shown under "Conditions"

  Copy this block (remove the leading // from each line) inside the [ ] below,
  and separate offers with a comma:

  // {
  //   id: "store-name-fashion",
  //   store: "Store Name",
  //   category: "Fashion",
  //   rate: "Up to 6%",
  //   summary: "Cashback on full-price fashion orders placed through Worthback.",
  //   link: "https://your-affiliate-network.example/track?id=...",
  //   validTill: "2026-12-31",
  //   conditions: [
  //     "New and existing customers",
  //     "Not valid on gift cards",
  //     "Cashback confirmed after the return window closes"
  //   ]
  // }
*/

window.WORTHBACK_OFFERS = [

];
