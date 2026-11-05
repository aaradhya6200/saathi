import Link from "next/link";
import { HeroMap } from "@/components/HeroMap";
import { PriceEstimator } from "@/components/PriceEstimator";
import { HELPER_RATE, PLANS, inr } from "@/lib/pricing";

const SERVICES = [
  { title: "Health", icon: <><path d="M12 5v14M5 12h14" /><rect x="3" y="3" width="18" height="18" rx="4" /></>, items: ["Go along to doctor visits", "Collect test reports", "Buy medicines and wait at the counter"] },
  { title: "Shopping", icon: <><path d="M4 7h16l-1.5 11a2 2 0 0 1-2 1.7h-9a2 2 0 0 1-2-1.7z" /><path d="M9 7a3 3 0 0 1 6 0" /></>, items: ["Vegetables from the local market", "That one item only a specific shop has", "Compare options with you on a video call"] },
  { title: "Paperwork", icon: <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M10 13h6M10 17h6" /></>, items: ["Bill payments and bank visits", "Wait in RTO, passport or society-office queues", "Drop off and collect documents"] },
  { title: "Home", icon: <><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>, items: ["Bring things from a relative’s house", "Receive deliveries", "Be present for a repair visit"] },
  { title: "Company", icon: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 14.5c3 0 6 1.8 6 5" /></>, items: ["A short walk together", "Help with a phone or an app", "A check-in visit when family can’t come"] },
  { title: "For shops and clinics", icon: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>, items: ["A part-time runner on fixed weekly hours", "Supplier pickups and local drops", "No full-time hire needed"] },
];

const TRUST = [
  { title: "Police verification", text: "ID and address checks plus an in-person interview for every helper.", icon: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></> },
  { title: "Trained to care", text: "Basics of helping elderly people, handling cash, and respectful behaviour.", icon: <><path d="M4 19V6a2 2 0 0 1 2-2h12v15H6a2 2 0 0 0-2 2" /><path d="M8 8h6" /></> },
  { title: "Live tracking", text: "Location and photo updates for the whole booking, shared with family.", icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></> },
  { title: "SOS and fast support", text: "An SOS button for the customer and a support line that answers in minutes.", icon: <><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.9L2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></> },
  { title: "Insured", text: "Items handled during a booking and the helper on the job are covered.", icon: <><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18M7 15h3" /></> },
  { title: "Rated every time", text: "Ratings after each booking. Helpers with low ratings are retrained or removed.", icon: <path d="M12 3l2.6 5.5 6 .8-4.4 4.2 1.1 6L12 16.6 6.7 19.5l1.1-6L3.4 9.3l6-.8z" /> },
];

const FAQ = [
  ["Where is Saathi available?", "We’re starting in Hyderabad, one neighbourhood at a time. If you’re in another city, send a request anyway and we’ll tell you when we reach you."],
  ["Who pays for the things my Saathi buys?", "You do, at the exact bill amount. You can pay the helper upfront by UPI, or give cash at home. Every purchase comes with a photo of the bill."],
  ["Can my parent book without a smartphone?", "Yes. Parents can book and get updates by WhatsApp or a phone call. Children can also book on their behalf from another city or country."],
  ["What if the booking runs longer than planned?", "After the 2-hour minimum, time is billed in 15-minute steps. Your Saathi checks with you before going more than 30 minutes over."],
  ["Can I get the same helper every time?", "Yes. On the Parent Care plan the same helper is assigned to your family. On pay as you go you can request a helper you’ve booked before."],
  ["How do I check on a booking?", "Every booking gets a code like SA-7K3P9. Enter it with your phone number on the Track page to see the status, your helper and every update."],
];

export default function Home() {
  return (
    <>
      <header className="hero">
        <div className="wrap">
          <div>
            <h1>A trusted helper for the errands that need <em>a real person</em>.</h1>
            <p className="lead">
              Book a verified Saathi by the hour. They pick up the prescription, wait in the hospital queue, buy the
              vegetables and send every bill to the family on WhatsApp.
            </p>
            <div className="cta-row">
              <Link className="btn primary" href="/book">Book from {inr(PLANS.PAYG.rate)} an hour</Link>
              <Link className="btn ghost" href="/#how">See how it works</Link>
            </div>
            <div className="pilot">
              <span>Launching first in Hyderabad</span>
              <span>Police-verified helpers</span>
              <span>Live updates for the whole family</span>
            </div>
          </div>
          <HeroMap />
        </div>
      </header>

      <main>
        <section className="band" id="how">
          <div className="wrap">
            <div className="head">
              <span className="eyebrow">How it works</span>
              <h2>Book hours, not a delivery</h2>
              <p className="lead">One booking can cover many stops, in any order. You pay for the time your Saathi spends, plus the exact cost of anything they buy.</p>
            </div>
            <ol className="steps">
              <li><h3>Choose your hours</h3><p>Pick a day and start time. The minimum booking is 2 hours. List the stops now or decide as you go.</p></li>
              <li><h3>Meet your Saathi</h3><p>See their photo, ID check and ratings before they arrive. Families can ask for the same helper every time.</p></li>
              <li><h3>Follow along live</h3><p>Track the booking with its code, and get bill photos and updates on WhatsApp, shared with family in other cities too.</p></li>
              <li><h3>Pay for time used</h3><p>Pay by UPI at the end. Hourly charge plus purchases, with every receipt attached.</p></li>
            </ol>
          </div>
        </section>

        <section className="band" id="services">
          <div className="wrap">
            <div className="head">
              <span className="eyebrow">What a Saathi can do</span>
              <h2>Errands that need someone to go, wait and decide</h2>
            </div>
            <div className="services">
              {SERVICES.map((s) => (
                <div className="svc" key={s.title}>
                  <div className="ic"><svg viewBox="0 0 24 24">{s.icon}</svg></div>
                  <h3>{s.title}</h3>
                  <ul>{s.items.map((i) => <li key={i}>{i}</li>)}</ul>
                </div>
              ))}
            </div>
            <p className="limits"><b>Not included:</b> medical or nursing care, driving your car, or carrying large amounts of cash.</p>
          </div>
        </section>

        <section className="band family">
          <div className="wrap">
            <div>
              <span className="eyebrow">For children living away</span>
              <h2>You’re in Bengaluru. Amma is in Hyderabad. Saathi is there.</h2>
              <p className="lead">Book from anywhere, including abroad. Your parent can also book on WhatsApp or by phone, with no app to install.</p>
              <ul>
                <li><svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg><div><b>Updates at every stop</b><span>Know what’s done and what’s next, as it happens.</span></div></li>
                <li><svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></svg><div><b>A photo of every bill</b><span>Purchases are paid at cost, with receipts in the chat.</span></div></li>
                <li><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M16 11l2 2 4-4" /></svg><div><b>The same helper every week</b><span>On the Parent Care plan, your parent sees a familiar face.</span></div></li>
              </ul>
            </div>
            <div className="chat" aria-label="Example WhatsApp update thread">
              <div className="who">Saathi · Amma’s errands (example)</div>
              <div className="bubble">Ravi has reached Amma’s home and collected the prescription.<small>10:02</small></div>
              <div className="bubble">
                Medicines bought at the pharmacy.
                <div className="bill"><span>Medicines</span><span>₹1,240</span><span>Strips counted</span><span>14 of 14</span><span className="t">Paid at cost</span><span className="t">₹1,240</span></div>
                <small>10:41</small>
              </div>
              <div className="bubble me">Thank you. Please also collect her blood test report.<small>10:43</small></div>
              <div className="bubble">Report collected. Photo attached. Heading to the market now.<small>11:20</small></div>
              <div className="bubble">Back home. 2 h 40 m used. Total: ₹800 time + ₹1,515 purchases.<small>12:42</small></div>
            </div>
          </div>
        </section>

        <section className="band" id="pricing">
          <div className="wrap">
            <div className="head">
              <span className="eyebrow">Pricing</span>
              <h2>Simple hourly pricing</h2>
              <p className="lead">No delivery fees, no surge. Purchases are charged at the exact bill amount.</p>
            </div>
            <div className="plans">
              <div className="plan">
                <span className="eyebrow">{PLANS.PAYG.label}</span>
                <div className="price">{inr(PLANS.PAYG.rate)}<small> / hour</small></div>
                <ul><li>2-hour minimum</li><li>Any number of stops</li><li>Billed in 15-minute steps after 2 hours</li></ul>
                <Link className="btn ghost" href="/book?plan=PAYG">Book hours</Link>
              </div>
              <div className="plan pick">
                <span className="eyebrow">{PLANS.CARE.label} plan</span>
                <div className="price">{inr(PLANS.CARE.rate)}<small> / month</small></div>
                <ul><li>{PLANS.CARE.hoursIncluded} hours each month</li><li>The same helper every visit</li><li>Priority booking</li><li>Updates for the whole family</li></ul>
                <Link className="btn primary" href="/book?plan=CARE">Start Parent Care</Link>
              </div>
              <div className="plan">
                <span className="eyebrow">{PLANS.BIZ.label}</span>
                <div className="price">{inr(PLANS.BIZ.rate)}<small> / hour</small></div>
                <ul><li>For shops and clinics</li><li>Fixed weekly hours</li><li>Monthly invoice</li></ul>
                <Link className="btn ghost" href="/book?plan=BIZ">Ask about it</Link>
              </div>
            </div>
            <PriceEstimator />
          </div>
        </section>

        <section className="band" id="safety">
          <div className="wrap">
            <div className="head">
              <span className="eyebrow">Trust and safety</span>
              <h2>For families, trust is the whole product</h2>
              <p className="lead">Every Saathi goes through the same checks before their first booking.</p>
            </div>
            <div className="trust">
              {TRUST.map((t) => (
                <div key={t.title}>
                  <svg viewBox="0 0 24 24">{t.icon}</svg>
                  <div><h3>{t.title}</h3><p>{t.text}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="band">
          <div className="wrap">
            <div className="head">
              <span className="eyebrow">Why Saathi</span>
              <h2>More than a delivery app</h2>
            </div>
            <div className="tbl compare">
              <table>
                <thead><tr><th scope="col"></th><th scope="col">Delivery apps</th><th scope="col">Saathi</th></tr></thead>
                <tbody>
                  <tr><td>You pay for</td><td>Each delivery</td><td>The helper’s time</td></tr>
                  <tr><td>Stops</td><td>One pickup, one drop</td><td>Many, in any order</td></tr>
                  <tr><td>Helper</td><td>A different rider each time</td><td>The same trusted person</td></tr>
                  <tr><td>Who gets updates</td><td>The person who booked</td><td>The whole family</td></tr>
                  <tr><td>Goes with a person</td><td>No</td><td>Yes, to clinics and offices</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="band" id="join">
          <div className="wrap join">
            <div className="head" style={{ margin: 0 }}>
              <span className="eyebrow">Become a helper</span>
              <h2>Earn more per hour, on a schedule you can plan</h2>
              <p className="lead">We’re looking for patient, reliable people in Hyderabad who know their neighbourhood. A two-wheeler helps but isn’t required for every booking.</p>
              <div className="cta-row" style={{ marginTop: ".6rem" }}><Link className="btn primary" href="/join">Apply to be a Saathi</Link></div>
            </div>
            <div className="perks">
              <div className="perk"><b>{inr(HELPER_RATE)}</b><span>an hour, paid for all booked time</span></div>
              <div className="perk"><b>Weekly</b><span>payouts by UPI, with a clear earnings log</span></div>
              <div className="perk"><b>Fixed</b><span>slots from regular families, not only random orders</span></div>
              <div className="perk"><b>Free</b><span>training, insurance on the job and a support line</span></div>
            </div>
          </div>
        </section>

        <section className="band" id="faq">
          <div className="wrap">
            <div className="head"><span className="eyebrow">Questions</span><h2>Common questions</h2></div>
            <div className="faq">
              {FAQ.map(([q, a]) => (
                <details key={q}><summary>{q}</summary><p>{a}</p></details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
