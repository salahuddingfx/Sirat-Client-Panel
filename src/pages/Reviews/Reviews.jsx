import { Star } from "lucide-react";
import PageFrame from "../../components/layout/PageFrame";
import { Panel } from "../../components/ui";
import SEO from "../../components/layout/SEO";

export default function ReviewsPage() {
  const reviews = [
    { name: "Amina Al-Sabah", text: "The premium combed cotton feels incredibly soft. The print details are sharp and don't wash off. Highly recommended!", stars: 5 },
    { name: "Daniel Tremblay", text: "Fast delivery to Chittagong! The custom puff print looks amazing and the fabric weight is perfect for streetwear.", stars: 5 },
    { name: "Mia Takahashi", text: "The burgundy and cream theme on the website matched the luxury vibes of the actual tees. Love the oversized fit!", stars: 4.8 }
  ];

  return (
    <PageFrame
      eyebrow="Customer Reviews"
      title="What our community says about Sirat."
      description="Read verified feedback from our customers about imported fabric quality, print durability, and our commitment to honesty."
    >
      <SEO title="Customer Feedback" description="See what other clothing drops verified buyers say about Sirat's stitch design, premium custom puff prints, and delivery." />
      <div className="quote-grid">
        {reviews.map((review) => (
          <Panel key={review.name} className="page-card">
            <div className="storefront__badge" style={{ color: "var(--sirat-star)", borderColor: "var(--sirat-star)", background: "rgba(245, 158, 11, 0.05)" }}>
              <Star size={14} fill="currentColor" /> {review.stars.toFixed(1)} / 5
            </div>
            <p className="page-section__text" style={{ marginTop: "0.85rem" }}>
              "{review.text}"
            </p>
            <strong style={{ display: "block", marginTop: "1rem" }}>{review.name}</strong>
          </Panel>
        ))}
      </div>
    </PageFrame>
  );
}
