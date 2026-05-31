import { useState } from "react";
import { HelpCircle, ChevronRight } from "lucide-react";

const faqItems = [
  {
    question: "When is the next seasonal capsule drop?",
    answer: "Our seasonal drops launch on a bi-monthly basis. Subscribers receive 24-hour early access keys to shop drops before public release. Check the countdown timer on this page for the exact time of Drop 02."
  },
  {
    question: "How do I choose the correct fit?",
    answer: "Every Sirat garment features a detailed sizing spec. Most streetwear items are cut in a premium relaxed drape. Refer to the size charts on product pages or select your usual size for standard fit."
  },
  {
    question: "What is your return and exchange policy?",
    answer: "We offer complimentary returns and exchanges within 14 days of delivery. The item must be in its original unworn condition with security tags intact."
  }
];

export default function FaqSection() {
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <section className="faq-section">
      <div className="faq-layout">
        <div className="faq-intro">
          <div className="storefront__badge">
            <HelpCircle size={14} /> FAQ
          </div>
          <h2 className="page-section__title" style={{ marginTop: "0.5rem" }}>Drop Support Specs</h2>
          <p className="page-section__text">
            Garment sizing guides, exchange pipelines, and shipping schedules detailed here.
          </p>
        </div>
        <div className="faq-accordion">
          {faqItems.map((faq, idx) => (
            <div key={idx} className={["faq-item", activeFaq === idx ? "open" : ""].filter(Boolean).join(" ")}>
              <button
                type="button"
                className="faq-question"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <span>{faq.question}</span>
                <ChevronRight className="faq-arrow" size={16} />
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
