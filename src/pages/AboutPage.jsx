import { useEffect, useRef } from "react";
import { Compass, Target, ShieldCheck, Calendar, Sparkles } from "lucide-react";
import gsap from "gsap";
import PageFrame from "../components/PageFrame";
import { Panel } from "../lib/ui";
import SEO from "../components/SEO";

export default function AboutPage() {
  const pageRef = useRef(null);

  // GSAP animation on component mount
  useEffect(() => {
    const context = gsap.context(() => {
      // Animate timeline line scale
      gsap.from(".timeline-line", {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 1.2,
        ease: "power2.inOut"
      });

      // Animate timeline nodes
      gsap.from(".timeline-node", {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        delay: 0.4,
        ease: "back.out(1.7)"
      });

      // Animate timeline content items (sliding in from alternating sides)
      gsap.from(".timeline-item:nth-child(odd) .timeline-content", {
        opacity: 0,
        x: -40,
        duration: 0.8,
        stagger: 0.25,
        delay: 0.5,
        ease: "power2.out"
      });

      gsap.from(".timeline-item:nth-child(even) .timeline-content", {
        opacity: 0,
        x: 40,
        duration: 0.8,
        stagger: 0.25,
        delay: 0.5,
        ease: "power2.out"
      });

      // Animate team cards on load
      gsap.from(".team-card", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.2,
        ease: "power2.out"
      });
    }, pageRef);

    return () => context.revert();
  }, []);

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
    <div ref={pageRef}>
      <PageFrame
        eyebrow="About Sirat"
        title="A streetwear drop label built on quality & honesty."
        description="Sirat is designed around dramatic presentation, premium materials sourcing, and a streamlined online storefront that brings luxury garments directly to your wardrobe."
      >
        <SEO title="About Us" description="Discover Sirat's custom screen printing, premium combed cotton sourcing, team profiles, and animated journey timeline." />

        {/* 1. Brand Pillars (Mission, Vision, Priorities) */}
        <section className="about-pillars" style={{ marginTop: "1rem" }}>
          <div className="quote-grid">
            <Panel className="page-card text-center">
              <div className="storefront__badge" style={{ margin: "0 auto 1rem" }}>
                <Target size={14} /> Our Mission
              </div>
              <h3 className="page-section__title" style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}>Purity of Craft</h3>
              <p className="page-section__text" style={{ fontSize: "0.95rem" }}>
                To engineer street garments of absolute fabric quality. We reject cheap fast-fashion shortcuts, offering heavily weighted, long-lasting custom items instead.
              </p>
            </Panel>

            <Panel className="page-card text-center">
              <div className="storefront__badge" style={{ margin: "0 auto 1rem" }}>
                <Sparkles size={14} /> Our Vision
              </div>
              <h3 className="page-section__title" style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}>Authentic Standard</h3>
              <p className="page-section__text" style={{ fontSize: "0.95rem" }}>
                To set the benchmark for luxury custom streetwear in Bangladesh, demonstrating that fabric weight transparency and custom graphics are key.
              </p>
            </Panel>

            <Panel className="page-card text-center">
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

        {/* 2. GSAP Animated Journey Timeline */}
        <section className="about-timeline-section" style={{ marginTop: "4rem" }}>
          <div className="section-header" style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p className="section-header__eyebrow">Our Path</p>
            <h2>Journey Timeline</h2>
            <p style={{ margin: "0.5rem auto 0" }}>How we scaled from a small printing table in Cox's Bazar to an active custom streetwear label.</p>
          </div>

          <div className="timeline-container">
            <div className="timeline-line" />

            <div className="timeline-items">
              {timelineItems.map((item, idx) => (
                <div key={item.year} className="timeline-item">
                  <div className="timeline-node">
                    <Calendar size={14} />
                  </div>
                  <div className="timeline-content-wrapper">
                    <Panel className="timeline-content page-card">
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
            {team.map((member) => (
              <Panel key={member.name} className="team-card page-card">
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
