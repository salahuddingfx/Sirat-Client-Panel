import { useState } from "react";
import { m } from "framer-motion";
import { Mail, Phone, BadgePercent, Send, Plus, MessageSquare, MapPin, Clock, Compass } from "lucide-react";
import PageFrame from "../../components/layout/PageFrame";
import { Panel } from "../../components/ui";
import { contactFormSchema } from "@sirat/api";
import SEO from "../../components/layout/SEO";
import { submitContact } from "@api/queries";
import track from "@lib/tracker";
import { useCart } from "../../app/providers/CartContext";

const FAQ_ITEMS = [
  {
    question: "Do you offer custom prints or bulk orders?",
    answer: "Absolutely. We specialize in high-quality bulk custom prints and wholesale apparel runs for brands, corporates, and events. Drop us your requirements via this form or email us at sales@salahuddin.codes and our design department will get in touch."
  },
  {
    question: "What is your standard shipping & delivery timeline?",
    answer: "Inside Dhaka: 2 to 3 business days (80 BDT). Nationwide across Bangladesh: 3 to 5 business days (150 BDT). All packages are dispatched via reliable, fully-tracked courier partners."
  },
  {
    question: "What is your exchange and return policy?",
    answer: "We offer a flexible 7-day exchange window for unworn items in their original packaging with tags intact. If you have any sizing issues, simply reach out to us and we'll arrange the courier swap."
  },
  {
    question: "Where is the showroom located? Can I buy in-store?",
    answer: "Our flagship concept store and design lab is based in Banani, Dhaka. You can view all our premium combed cotton designs and try them on. Visit us Saturday through Thursday, 10:00 AM to 8:00 PM."
  }
];

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className={`faq-item ${isOpen ? "faq-item--active" : ""}`}>
      <button className="faq-trigger" onClick={onToggle} type="button">
        <span className="faq-question">{item.question}</span>
        <span className="faq-icon-wrap">
          <Plus size={18} style={{ transform: isOpen ? "rotate(45deg)" : "none", transition: "transform 0.2s ease" }} />
        </span>
      </button>
      <m.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{ overflow: "hidden" }}
      >
        <div className="faq-answer">
          {item.answer}
        </div>
      </m.div>
    </div>
  );
}

export default function ContactPage() {
  const { triggerToast } = useCart();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("Drop us a line about custom designs, sizing queries, or shipping details.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = contactFormSchema.safeParse(form);

    if (result.success) {
      setIsSubmitting(true);
      try {
        await submitContact(result.data);
        track.event("contact_submit", { label: result.data.email });
        setStatus(`Thank you, ${result.data.name}. We will get back to you at ${result.data.email} within 24 hours.`);
        setForm({ name: "", email: "", message: "" });
        triggerToast("Message sent successfully!", "success");
      } catch (err) {
        console.error("Contact submission error:", err);
        setStatus("Failed to send message. Please try again later.");
        triggerToast("Failed to send message.", "error");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const errorMsg = result.error.issues[0]?.message ?? "Please fill out the contact form correctly.";
      setStatus(errorMsg);
      triggerToast(errorMsg, "warning");
    }
  };

  return (
    <PageFrame
      eyebrow="Contact Us"
      title="Let's Start a Conversation."
      description="Have questions about our premium combed cotton, custom print options, or sizing details? Send us a message and our team will assist you."
    >
      <SEO title="Contact Support - Sirat" description="Get in touch with Sirat support. Ask questions about custom prints, sizing, shipping, or volume bulk drops." />

      <div className="contact-container">
        <div className="contact-layout-grid">
          {/* Contact Form Column */}
          <Panel className="glass-card">
            <h3 style={{ fontSize: "1.45rem", marginBottom: "0.5rem" }}>Send us a Message</h3>
            <p style={{ color: "var(--sirat-muted)", fontSize: "0.92rem", marginBottom: "2rem" }}>
              Fill in your details below and we will get back to you shortly.
            </p>

            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="floating-field-group full">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
                  placeholder=" "
                  required
                />
                <label>Your Name</label>
              </div>

              <div className="floating-field-group full">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))}
                  placeholder=" "
                  required
                />
                <label>Email Address</label>
              </div>

              <div className="floating-field-group textarea-group full">
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((c) => ({ ...c, message: e.target.value }))}
                  placeholder=" "
                  required
                />
                <label>Your Message</label>
              </div>

              <div className="full" style={{ marginTop: "0.5rem" }}>
                <button type="submit" disabled={isSubmitting} className="sirat-btn-premium">
                  <Send size={16} /> {isSubmitting ? "Sending message..." : "Send Message"}
                </button>
              </div>
            </form>

            <div className="alert" style={{ marginTop: "2rem", borderLeft: "4px solid var(--sirat-gold)" }}>
              <span style={{ fontSize: "0.88rem", fontWeight: 500 }}>{status}</span>
            </div>
          </Panel>

          {/* Contact Details and Showroom Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Quick Connect Cards */}
            <Panel className="glass-card" style={{ padding: "2rem" }}>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Connect Instantly</h3>
              <p style={{ color: "var(--sirat-muted)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
                Select a channel below to get direct support from our sales or help desk.
              </p>

              <div className="connect-channels-grid">
                <a href="https://wa.me/8801700000000" target="_blank" rel="noopener noreferrer" className="connect-channel-card">
                  <div className="icon-wrap">
                    <MessageSquare size={16} />
                  </div>
                  <span className="label">WhatsApp</span>
                  <span className="value">Chat Live</span>
                </a>

                <a href="https://m.me/siratclothing" target="_blank" rel="noopener noreferrer" className="connect-channel-card">
                  <div className="icon-wrap">
                    <Send size={16} />
                  </div>
                  <span className="label">Messenger</span>
                  <span className="value">Facebook</span>
                </a>

                <a href="tel:+8801700000000" className="connect-channel-card">
                  <div className="icon-wrap">
                    <Phone size={16} />
                  </div>
                  <span className="label">Call Support</span>
                  <span className="value">+880 1700-000000</span>
                </a>

                <a href="mailto:hello@salahuddin.codes" className="connect-channel-card">
                  <div className="icon-wrap">
                    <Mail size={16} />
                  </div>
                  <span className="label">Email Inbox</span>
                  <span className="value">hello@salahuddin.codes</span>
                </a>
              </div>
            </Panel>

            {/* Showroom & HQ Details */}
            <Panel className="glass-card hq-card">
              <span className="hq-card__eyebrow">Flagship Store</span>
              <h3 className="hq-card__title">Sirat Showroom</h3>
              
              <div className="hq-card__details">
                <div className="hq-card__detail-item">
                  <MapPin size={18} />
                  <span>House 12, Road 5, Banani, Dhaka, Bangladesh</span>
                </div>
                <div className="hq-card__detail-item">
                  <Compass size={18} />
                  <span>Opposite Banani Park, Level 2 Showroom Lab</span>
                </div>
                <div className="hq-card__detail-item">
                  <Clock size={18} />
                  <span>Saturday – Thursday: 10:00 AM – 8:00 PM</span>
                </div>
              </div>

              <div className="hq-card__hours">
                <div className="hq-card__hours-title">Support Hours</div>
                <div style={{ color: "#D5D1CA", fontSize: "0.85rem" }}>
                  Digital ticketing & chat is open 24/7. Phone queries answered during standard business hours.
                </div>
              </div>
            </Panel>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="faq-container">
          <div className="faq-header">
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common queries about custom prints, fabric composition, and delivery schedules.</p>
          </div>

          <div className="faq-accordion">
            {FAQ_ITEMS.map((item, idx) => (
              <AccordionItem
                key={idx}
                item={item}
                isOpen={openFaqIndex === idx}
                onToggle={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </PageFrame>
  );
}
