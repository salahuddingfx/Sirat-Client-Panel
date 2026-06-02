import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { Compass, Target, ShieldCheck, Calendar, Sparkles } from "lucide-react";
import PageFrame from "@components/layout/PageFrame";
import { Panel } from "@components/ui";
import SEO from "@components/layout/SEO";

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 75%"]
  });
  const scaleY = useTransform(scrollYProgress, [0, 0.95], [0, 1]);

  const team = [
    {
      name: "Tanvir Rahman",
      role: "Founder & Creative Director",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250",
      desc: "Streetwear designer focused on minimal graphics, custom oversized silhouettes, and brand transparency."
    },
    {
      name: "Sarah Ahmed",
      role: "Lead Fabric Specialist",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250",
      desc: "Supervises our mill sourcing contracts in Cox's Bazar, ensuring 100% heavy combed cotton fabrics."
    },
    {
      name: "Imran Chowdhury",
      role: "Head of Workshop Production",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250",
      desc: "Supervises our screen printing workshops, puff-print quality, and detailed custom garment checks."
    }
  ];

  const timelineItems = [
    {
      year: "2026 Q1",
      title: "Brand Foundation",
      copy: "Sirat was established in Cox's Bazar with a micro team of fabric designers, set on bringing premium, high-density drop capsule garments to life."
    },
    {
      year: "2026 Q2",
      title: "Combed Cotton Sourcing",
      copy: "Partnered directly with premier domestic spinning mills to secure exclusive heavy 100% combed cotton, focusing on soft feel and solid drape."
    },
    {
      year: "2026 Q3",
      title: "Puff Print Breakthrough",
      copy: "Integrated high-density puff printing hardware into our workshop, allowing raised textured graphics that survive years of machine washing."
    },
    {
      year: "2026 Q4",
      title: "Storefront Launch",
      copy: "Went live with our online drops model, offering real-time SMS order tracking, next-day courier delivery, and secure digital checkout."
    }
  ];

  return (
    <div>
      <PageFrame
        eyebrow="About Sirat"
        title="A streetwear drop label built on quality & honesty."
        description="Sirat is designed around dramatic presentation, premium materials sourcing, and a streamlined online storefront that brings luxury garments directly to your wardrobe."
      >
        <SEO title="About Us" description="Discover Sirat's custom screen printing, premium combed cotton sourcing, team profiles, and animated journey timeline." />

        {/* 1. Brand Pillars (Mission, Vision, Priorities) */}
        <section className="about-pillars" style={{ marginTop: "1rem" }}>
          <div className="quote-grid">
            <Panel className="page-card text-center" transition={{ duration: 0.6, delay: 0.1 }}>
              <div className="storefront__badge" style={{ margin: "0 auto 1rem" }}>
                <Target size={14} /> Our Mission
              </div>
              <h3 className="page-section__title" style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}>Purity of Craft</h3>
              <p className="page-section__text" style={{ fontSize: "0.95rem" }}>
                To engineer street garments of absolute fabric quality. We reject cheap fast-fashion shortcuts, offering heavily weighted, long-lasting custom items instead.
              </p>
            </Panel>

            <Panel className="page-card text-center" transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="storefront__badge" style={{ margin: "0 auto 1rem" }}>
                <Sparkles size={14} /> Our Vision
              </div>
              <h3 className="page-section__title" style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}>Authentic Standard</h3>
              <p className="page-section__text" style={{ fontSize: "0.95rem" }}>
                To set the benchmark for luxury custom streetwear in Bangladesh, demonstrating that fabric weight transparency and custom graphics are key.
              </p>
            </Panel>

            <Panel className="page-card text-center" transition={{ duration: 0.6, delay: 0.3 }}>
              <div className="storefront__badge" style={{ margin: "0 auto 1rem" }}>
                <ShieldCheck size={14} /> Our Priorities
              </div>
              <h3 className="page-section__title" style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}>Committed to Honesty</h3>
              <p className="page-section__text" style={{ fontSize: "0.95rem" }}>
                100% combed cotton, durable puff inks, and next-day shipping. We focus entirely on delivery speed and product feel before checkout.
              </p>
            </Panel>
          </div>
        </section>

        {/* 2. Journey Timeline */}
        <section className="about-timeline-section" style={{ marginTop: "4rem" }}>
          <div className="section-header" style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p className="section-header__eyebrow">Our Path</p>
            <h2>Journey Timeline</h2>
            <p style={{ margin: "0.5rem auto 0" }}>How we scaled from a small printing table in Cox's Bazar to an active custom streetwear label.</p>
          </div>

          <div className="timeline-container" ref={containerRef}>
            <div className="timeline-line">
              <m.div
                style={{ scaleY, originY: 0, width: "100%", height: "100%", background: "var(--sirat-border-strong)" }}
              />
            </div>

            <div className="timeline-items">
              {timelineItems.map((item, idx) => (
                <div key={item.year} className="timeline-item">
                  <div className="timeline-node">
                    <m.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + idx * 0.15, ease: "easeOut" }}
                      style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Calendar size={14} />
                    </m.div>
                  </div>
                  <div className="timeline-content-wrapper">
                    <Panel
                      className="timeline-content page-card"
                      initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.8, delay: 0.3 + idx * 0.15 }}
                    >
                      <span className="timeline-date">{item.year}</span>
                      <h4 className="timeline-title">{item.title}</h4>
                      <p className="timeline-desc">{item.copy}</p>
                    </Panel>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Team Profiles */}
        <section className="about-team-section" style={{ marginTop: "4rem" }}>
          <div className="section-header" style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p className="section-header__eyebrow">The Collective</p>
            <h2>Meet the Team</h2>
            <p style={{ margin: "0.5rem auto 0" }}>The creators, textile engineers, and print specialists behind Sirat's custom drops.</p>
          </div>

          <div className="team-grid">
            {team.map((member, idx) => (
              <Panel
                key={member.name}
                className="team-card page-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15 }}
              >
                <div className="team-avatar-container">
                  <img src={member.avatar} alt={member.name} className="team-avatar" />
                </div>
                <div className="team-meta">
                  <h4 className="team-name">{member.name}</h4>
                  <span className="team-role">{member.role}</span>
                  <p className="team-desc">{member.desc}</p>
                </div>
              </Panel>
            ))}
          </div>
        </section>
      </PageFrame>
    </div>
  );
}
