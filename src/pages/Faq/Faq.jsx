import { useState } from "react";
import PageFrame from "@components/layout/PageFrame";
import { Panel } from "@components/ui";
import { HelpCircle, ChevronRight, Info, Truck } from "lucide-react";
import SEO from "@components/layout/SEO";

const faqCategories = [
  {
    title: "Ordering & Drops",
    icon: HelpCircle,
    items: [
      {
        question: "When is the next seasonal capsule drop?",
        answer: "Our seasonal drops launch on a bi-monthly basis. Subscribers receive 24-hour early access keys to shop drops before public release. Check our newsletter drop queue on the homepage to register."
      },
      {
        question: "Can I cancel or modify my order after placing it?",
        answer: "Since we begin preparing your custom printed garments almost immediately, orders can only be cancelled or modified within 1 hour of placement. Please email support or call us immediately."
      }
    ]
  },
  {
    title: "Sizing & Garments",
    icon: Info,
    items: [
      {
        question: "How do I choose the correct fit?",
        answer: "Every Sirat garment features a relaxed, premium drape. Most streetwear items run slightly oversized for comfort. You can check our dedicated Sizing Guide page for absolute measurements in inches."
      },
      {
        question: "How do I care for my printed tees?",
        answer: "To preserve high-density custom prints and premium combed cotton texture, wash inside out in cold water on a gentle cycle. Hang dry or tumble dry low. Do not iron directly over printed patterns."
      }
    ]
  },
  {
    title: "Shipping & Support",
    icon: Truck,
    items: [
      {
        question: "What are the shipping charges and timelines?",
        answer: "We offer free shipping on orders over \u09F31500! Standard shipping inside Cox's Bazar takes 2-3 business days. Delivery to Dhaka and other divisions takes 3-5 business days."
      },
      {
        question: "What is your return and exchange policy?",
        answer: "We offer complimentary returns and exchanges within 14 days of delivery. The item must be in its original unworn condition with tags intact. Customized products are non-exchangeable unless defective."
      }
    ]
  }
];

export default function FaqPage() {
  const [activeFaq, setActiveFaq] = useState({});

  const toggleFaq = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setActiveFaq((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <PageFrame
      eyebrow="Drop Support"
      title="Frequently Asked Questions"
      description="Need specifications on custom drops, payment protocols, shipping channels, or garments? We have them detailed below."
    >
      <SEO title="FAQ & Support" description="Frequently Asked Questions about custom drops, ordering, combed cotton care, sizing, and shipping specs." />
      
      <div className="policy-layout" style={{ display: "grid", gap: "2.5rem" }}>
        {faqCategories.map((cat, catIdx) => {
          const Icon = cat.icon;
          return (
            <div key={catIdx} className="faq-category-block">
              <h3 style={{ display: "flex", alignItems: "center", gap: "0.6rem", margin: "0 0 1.25rem", color: "var(--sirat-gold)", textTransform: "uppercase", fontSize: "1.1rem", letterSpacing: "0.05em" }}>
                <Icon size={18} /> {cat.title}
              </h3>
              
              <div style={{ display: "grid", gap: "1rem" }}>
                {cat.items.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`;
                  const isOpen = !!activeFaq[key];
                  
                  return (
                    <Panel key={itemIdx} className="page-card" style={{ padding: "0", overflow: "hidden" }}>
                      <button
                        type="button"
                        className="faq-question"
                        style={{
                          width: "100%",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "1.25rem 1.5rem",
                          textAlign: "left",
                          color: "var(--sirat-text)",
                          fontWeight: "700",
                          fontSize: "0.95rem"
                        }}
                        onClick={() => toggleFaq(catIdx, itemIdx)}
                      >
                        <span>{item.question}</span>
                        <ChevronRight style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.25s ease", color: "var(--sirat-gold)" }} size={16} />
                      </button>
                      
                      <div style={{
                        maxHeight: isOpen ? "200px" : "0",
                        overflow: "hidden",
                        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                        padding: isOpen ? "0 1.5rem 1.25rem" : "0 1.5rem"
                      }}>
                        <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--sirat-muted)", lineHeight: "1.6" }}>
                          {item.answer}
                        </p>
                      </div>
                    </Panel>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </PageFrame>
  );
}
