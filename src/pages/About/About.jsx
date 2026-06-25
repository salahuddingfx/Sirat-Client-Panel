import { useEffect, useRef, useState } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { Compass, Target, ShieldCheck, Calendar, Sparkles, Github, Linkedin, Twitter, Instagram, Facebook, Globe, Users } from "lucide-react";
import PageFrame from "@components/layout/PageFrame";
import { Panel } from "@components/ui";
import SEO from "@components/layout/SEO";
import { fetchTeamMembers } from "@api/queries";

const SOCIAL_ICONS = {
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
  facebook: Facebook,
  website: Globe,
};

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 75%"]
  });
  const scaleY = useTransform(scrollYProgress, [0, 0.95], [0, 1]);

  const [team, setTeam] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchTeamMembers();
        if (cancelled) return;
        if (res?.success && Array.isArray(res.data)) {
          setTeam(res.data);
        }
      } catch (err) {
        console.error("Failed to load team members:", err);
      } finally {
        if (!cancelled) setTeamLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

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
                Build garments worth keeping. Heavyweight combed cotton, durable puff inks, and zero fast-fashion shortcuts.
              </p>
            </Panel>

            <Panel className="page-card text-center" transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="storefront__badge" style={{ margin: "0 auto 1rem" }}>
                <Sparkles size={14} /> Our Vision
              </div>
              <h3 className="page-section__title" style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}>Authentic Standard</h3>
              <p className="page-section__text" style={{ fontSize: "0.95rem" }}>
                Prove that transparency — fabric weight, print method, sourcing — is what separates real quality from marketing.
              </p>
            </Panel>

            <Panel className="page-card text-center" transition={{ duration: 0.6, delay: 0.3 }}>
              <div className="storefront__badge" style={{ margin: "0 auto 1rem" }}>
                <ShieldCheck size={14} /> Our Priorities
              </div>
              <h3 className="page-section__title" style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}>Committed to Honesty</h3>
              <p className="page-section__text" style={{ fontSize: "0.95rem" }}>
                What you see is what you get. Real fabric specs, real print quality, next-day delivery across Bangladesh.
              </p>
            </Panel>
          </div>
        </section>

        {/* 2. Journey Timeline */}
        <section className="about-timeline-section" style={{ marginTop: "4rem" }}>
          <div className="section-header" style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p className="section-header__eyebrow">Our Path</p>
            <h2>Journey Timeline</h2>
            <p style={{ margin: "0.5rem auto 0", maxWidth: "480px" }}>
              From a single printing table in Cox's Bazar to a fully operational custom streetwear label.
            </p>
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
            <p className="section-header__eyebrow">The People</p>
            <h2>Behind Sirat</h2>
            <p style={{ margin: "0.5rem auto 0", maxWidth: "480px" }}>
              A small, intentional team obsessed with fabric, print, and the details most brands skip.
            </p>
          </div>

          <div className="team-grid">
            {teamLoading ? (
              <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--sirat-muted)" }}>
                Loading team…
              </p>
            ) : team.length === 0 ? (
              <Panel
                className="page-card"
                style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2.5rem 1.5rem" }}
              >
                <Users size={36} className="muted" style={{ margin: "0 auto 0.75rem", color: "var(--sirat-gold)" }} />
                <h4 style={{ margin: "0 0 0.4rem" }}>Team dropping soon</h4>
                <p className="page-section__text" style={{ margin: 0 }}>
                  Profiles will appear here once the full crew is locked in.
                </p>
              </Panel>
            ) : (
              team.map((member, idx) => {
                const socials = Object.entries(SOCIAL_ICONS)
                  .filter(([key]) => member[key])
                  .map(([key, Icon]) => ({ key, href: member[key], Icon, label: key }));
                return (
                  <Panel
                    key={member._id || member.id || member.name}
                    className="team-card page-card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: idx * 0.15 }}
                  >
                    <div className="team-avatar-container">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="team-avatar" />
                      ) : (
                        <Users size={36} className="muted" style={{ color: "var(--sirat-gold)" }} />
                      )}
                    </div>
                    <div className="team-meta">
                      <h4 className="team-name">{member.name}</h4>
                      <span className="team-role">{member.role}</span>
                      {member.bio && <p className="team-desc">{member.bio}</p>}
                      {socials.length > 0 && (
                        <div className="team-socials">
                          {socials.map(({ key, href, Icon, label }) => (
                            <a
                              key={key}
                              href={href}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="team-social"
                              aria-label={`${member.name} on ${label}`}
                              title={label.charAt(0).toUpperCase() + label.slice(1)}
                            >
                              <Icon size={15} />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </Panel>
                );
              })
            )}
          </div>
        </section>
      </PageFrame>
    </div>
  );
}
