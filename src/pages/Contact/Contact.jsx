import { useState } from "react";
import { Mail, Phone, BadgePercent } from "lucide-react";
import PageFrame from "../../components/layout/PageFrame";
import { Button, Panel } from "../../components/ui";
import { contactFormSchema } from "@sirat/api";
import SEO from "../../components/layout/SEO";
import { submitContact } from "@api/queries";
import { useCart } from "../../app/providers/CartContext";

export default function ContactPage() {
  const { triggerToast } = useCart();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("Drop us a line about custom designs, sizing queries, or shipping details.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <PageFrame
      eyebrow="Contact Us"
      title="We'd love to hear from you."
      description="Have questions about our premium combed cotton, custom print options, or sizing details? Send us a message and we'll get back to you."
    >
      <SEO title="Contact Support" description="Get in touch with Sirat support. Ask questions about custom prints, sizing, shipping, or volume bulk drops." />
      <div className="support-grid">
        <Panel className="page-card">
          <form
            className="form-grid"
            onSubmit={async (event) => {
              event.preventDefault();
              const result = contactFormSchema.safeParse(form);

              if (result.success) {
                setIsSubmitting(true);
                try {
                    await submitContact(result.data);
                    setStatus(`Thanks ${result.data.name}. Our support team will reply to ${result.data.email} within 24 hours.`);
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
            }}
          >
            <label className="field">
              <span>Your Name</span>
              <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="e.g. John Doe" />
            </label>
            <label className="field">
              <span>Email Address</span>
              <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="e.g. johndoe@email.com" />
            </label>
            <label className="field full">
              <span>Your Message</span>
              <textarea value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} placeholder="Ask us anything about print textures, combed cotton options, or order bulk drops..." />
            </label>
            <div className="full">
              <Button type="submit">
                <Mail size={16} /> Send Message
              </Button>
            </div>
          </form>
        </Panel>
        <Panel className="page-card">
          <div className="list-stack">
            <div className="list-item">
              <span>
                <Phone size={16} /> Support
              </span>
              <strong>+880 1700 000000</strong>
            </div>
            <div className="list-item">
              <span>
                <Mail size={16} /> Email
              </span>
              <strong>hello@siratclothing.com</strong>
            </div>
            <div className="list-item">
              <span>
                <BadgePercent size={16} /> Custom Orders
              </span>
              <strong>Bulk printed drops</strong>
            </div>
          </div>
          <div className="alert" style={{ marginTop: "1rem" }}>
            {status}
          </div>
        </Panel>
      </div>
    </PageFrame>
  );
}
