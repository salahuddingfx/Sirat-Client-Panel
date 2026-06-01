import PageFrame from "@components/layout/PageFrame";
import { Panel } from "@components/ui";
import { ShieldCheck, Ruler } from "lucide-react";
import SEO from "@components/layout/SEO";

export default function SizingPage() {
  return (
    <PageFrame
      eyebrow="Fitting Specifications"
      title="Garment Sizing Guide"
      description="Our drops feature a premium, relaxed streetwear drape. Review our detailed size parameters to secure your perfect silhouette."
    >
      <SEO title="Sizing Guide" description="Find exact sizing measurements in inches for our combed cotton oversized t-shirts, hoodies, and streetwear essentials." />
      
      <div className="policy-layout">
        <Panel className="page-card policy-card">
          <div className="policy-section">
            <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Ruler size={18} /> Oversized Streetwear T-Shirt Spec (Inches)
            </h3>
            <p>
              Sirat oversized t-shirts feature a dropshoulder, loose body fit. We recommend choosing your normal size for the intended streetwear drape.
            </p>
            
            <div style={{ overflowX: "auto", marginTop: "1rem" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.9rem",
                textAlign: "left",
                minWidth: "400px"
              }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--sirat-border-strong)", color: "var(--sirat-gold)", fontWeight: "800" }}>
                    <th style={{ padding: "0.75rem" }}>Size</th>
                    <th style={{ padding: "0.75rem" }}>Chest (in)</th>
                    <th style={{ padding: "0.75rem" }}>Length (in)</th>
                    <th style={{ padding: "0.75rem" }}>Sleeve (in)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid var(--sirat-border)" }}>
                    <td style={{ padding: "0.75rem", fontWeight: "700" }}>S</td>
                    <td style={{ padding: "0.75rem" }}>40"</td>
                    <td style={{ padding: "0.75rem" }}>27"</td>
                    <td style={{ padding: "0.75rem" }}>8.5"</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--sirat-border)" }}>
                    <td style={{ padding: "0.75rem", fontWeight: "700" }}>M</td>
                    <td style={{ padding: "0.75rem" }}>42"</td>
                    <td style={{ padding: "0.75rem" }}>28"</td>
                    <td style={{ padding: "0.75rem" }}>9.0"</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--sirat-border)" }}>
                    <td style={{ padding: "0.75rem", fontWeight: "700" }}>L</td>
                    <td style={{ padding: "0.75rem" }}>44"</td>
                    <td style={{ padding: "0.75rem" }}>29"</td>
                    <td style={{ padding: "0.75rem" }}>9.5"</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--sirat-border)" }}>
                    <td style={{ padding: "0.75rem", fontWeight: "700" }}>XL</td>
                    <td style={{ padding: "0.75rem" }}>46"</td>
                    <td style={{ padding: "0.75rem" }}>30"</td>
                    <td style={{ padding: "0.75rem" }}>10.0"</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--sirat-border)" }}>
                    <td style={{ padding: "0.75rem", fontWeight: "700" }}>XXL</td>
                    <td style={{ padding: "0.75rem" }}>48"</td>
                    <td style={{ padding: "0.75rem" }}>31"</td>
                    <td style={{ padding: "0.75rem" }}>10.5"</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <hr className="product-card-modern__divider" style={{ margin: "1.5rem 0" }} />

          <div className="policy-section">
            <h3>How to Measure</h3>
            <ul style={{ paddingLeft: "1.25rem", color: "var(--sirat-muted)", display: "grid", gap: "0.5rem" }}>
              <li><strong>Chest</strong>: Measure the circumference around the fullest part of your chest, keeping the tape horizontal.</li>
              <li><strong>Length</strong>: Measure from the highest point of the shoulder down to the bottom hem.</li>
              <li><strong>Sleeve</strong>: Measure from the center back of your neck, down the shoulder, and down to the sleeve hem.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ShieldCheck size={18} style={{ color: "#10B981" }} /> Wash & Care Instructions
            </h3>
            <p>
              Our premium 100% combed cotton fabric has been pre-shrunk, but proper care will extend the life of high-density custom screen prints:
            </p>
            <ul style={{ paddingLeft: "1.25rem", color: "var(--sirat-muted)", display: "grid", gap: "0.5rem" }}>
              <li>Machine wash inside out in cold water with similar colors.</li>
              <li>Use mild laundry detergent. Do not bleach or use fabric softeners.</li>
              <li>Hang dry to preserve print textures. If using a dryer, tumble dry on a low heat setting.</li>
              <li>Never iron directly over the printed graphic; iron the garment inside out on low heat.</li>
            </ul>
          </div>
        </Panel>
      </div>
    </PageFrame>
  );
}
