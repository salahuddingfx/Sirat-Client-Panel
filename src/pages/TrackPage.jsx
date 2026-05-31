import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, PackageSearch } from "lucide-react";
import PageFrame from "../components/PageFrame";
import { Button, Panel } from "../lib/ui";
import SEO from "../components/SEO";

export default function TrackPage() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get("id") || "";
  const [query, setQuery] = useState(initialId);
  const [message, setMessage] = useState(
    initialId
      ? `Looking up shipment progress for Order #${initialId}...`
      : "Enter an order ID, a customer name, or an email and name."
  );

  function parseQuery(q) {
    const cleaned = q.trim();
    if (!cleaned) return null;
    // Order ID like SRT-1234
    if (/^SRT-?\d+/i.test(cleaned)) return { orderId: cleaned };
    const parts = cleaned.split(/\s+/);
    // email + name (email first)
    if (cleaned.includes("@")) {
      const email = parts[0];
      const name = parts.slice(1).join(" ") || undefined;
      return { email, name };
    }
    // treat as full name
    if (parts.length >= 1) return { name: cleaned };
    return null;
  }

  return (
    <PageFrame
      eyebrow="Order Tracking"
      title="Track your shipment in real-time."
      description="Enter your order credentials below to check the production or shipping status of your custom printed garments."
    >
      <SEO title="Track Order" description="Track your premium custom printed clothing drop. Enter your Order ID or registered email address." />
      <div className="support-grid">
        <Panel className="page-card">
          <form
            className="form-grid"
            onSubmit={(event) => {
              event.preventDefault();
              const parsed = parseQuery(query);

              if (!parsed) {
                setMessage("Please enter a valid Order ID (e.g. SRT-2026-880) or your registered Email.");
                return;
              }

              if (parsed.orderId) {
                setMessage(`Looking up shipment progress for Order #${parsed.orderId}...`);
                return;
              }

              if (parsed.email) {
                setMessage(`Searching for orders associated with ${parsed.email}...`);
                return;
              }

              if (parsed.name) {
                setMessage(`Searching orders for customer ${parsed.name}...`);
                return;
              }
            }}
          >
            <label className="field full">
              <span>Order ID, Email, or Full Name</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. SRT-2026-880 or yourname@email.com" />
            </label>
            <div className="full">
              <Button type="submit">
                <Search size={16} /> Track Shipment
              </Button>
            </div>
          </form>
        </Panel>
        <Panel className="page-card">
          <div className="alert">
            <PackageSearch size={16} /> {message}
          </div>
          <p className="page-section__text" style={{ marginTop: "1rem" }}>
            We update tracking information the moment your premium combed cotton t-shirt leaves our printing workshop in Cox's Bazar. You will receive an SMS and email notification with direct courier contact details.
          </p>
        </Panel>
      </div>
    </PageFrame>
  );
}
