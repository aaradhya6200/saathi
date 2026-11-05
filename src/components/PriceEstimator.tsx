"use client";

import { useState } from "react";
import { inr, PLANS } from "@/lib/pricing";

export function PriceEstimator() {
  const [hours, setHours] = useState(2.5);
  const [buy, setBuy] = useState(1500);
  const time = hours * PLANS.PAYG.rate;
  const sum = time + buy || 1;

  return (
    <div className="calc" aria-label="Price estimator">
      <div>
        <div className="field">
          <label htmlFor="calcHours">
            Hours <output className="num">{hours} hrs</output>
          </label>
          <input id="calcHours" type="range" min={2} max={8} step={0.25} value={hours} onChange={(e) => setHours(+e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="calcBuy">
            Purchases <output className="num">{inr(buy)}</output>
          </label>
          <input id="calcBuy" type="range" min={0} max={10000} step={100} value={buy} onChange={(e) => setBuy(+e.target.value)} />
        </div>
      </div>
      <div className="total">
        <span className="eyebrow">Estimated total</span>
        <span className="big">{inr(time + buy)}</span>
        <div className="split" aria-hidden="true">
          <i className="a" style={{ width: `${(time / sum) * 100}%` }} />
          <i className="b" style={{ width: `${(buy / sum) * 100}%` }} />
        </div>
        <span className="muted">
          {inr(time)} for time + {inr(buy)} purchases at cost
        </span>
      </div>
    </div>
  );
}
