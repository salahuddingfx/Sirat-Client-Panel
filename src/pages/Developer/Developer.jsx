import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code2, Cpu, Layers, GitBranch, Github, Linkedin, Twitter, Instagram, Globe, Mail, Sparkles, Server, Database, Smartphone, Zap } from "lucide-react";
import PageFrame from "@components/layout/PageFrame";
import { Panel } from "@components/ui";
import SEO from "@components/layout/SEO";
import { fetchTeamMembers } from "@api/queries";
import "./Developer.css";

const STACK = [
  { name: "React 19", category: "Frontend", icon: Code2 },
  { name: "Vite 6", category: "Build Tool", icon: Zap },
  { name: "Framer Motion", category: "Animation", icon: Sparkles },
  { name: "Drizzle ORM", category: "Database", icon: Database },
  { name: "MySQL", category: "Storage", icon: Server },
  { name: "Express.js", category: "Backend", icon: Cpu },
  { name: "Multer + S3", category: "Uploads", icon: Layers },
  { name: "Capacitor", category: "Mobile", icon: Smartphone },
];

const HIGHLIGHTS = [
  { value: "20+", label: "Reusable Components" },
  { value: "ETag", label: "Bandwidth-aware" },
  { value: "LRU", label: "In-memory cache" },
  { value: "A+", label: "Performance budget" },
];

export default function DeveloperPage() {
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchTeamMembers();
        if (cancelled) return;
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          const match = res.data.find(
            (m) => /developer|founder|engineer|full[-\s]?stack|lead/i.test(m.role || "")
          ) || res.data[0];
          setDeveloper(match);
        }
      } catch (err) {
        console.error("Failed to fetch developer info:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const socials = developer
    ? [
        { href: developer.twitter, Icon: Twitter, label: "Twitter" },
        { href: developer.linkedin, Icon: Linkedin, label: "LinkedIn" },
        { href: developer.github, Icon: Github, label: "GitHub" },
        { href: developer.instagram, Icon: Instagram, label: "Instagram" },
        { href: developer.website, Icon: Globe, label: "Website" },
      ].filter((s) => s.href)
    : [];

  return (
    <div>
      <PageFrame
        eyebrow="The Developer"
        title={developer?.name || "Salah Uddin Kader"}
        description={developer?.bio || "Solo full-stack developer behind the Sirat storefront, admin panel, and API — engineered with care from Cox's Bazar, Bangladesh."}
      >
        <SEO title="Developer" description="Meet the developer behind Sirat — a solo full-stack engineer building premium streetwear e-commerce experiences." />

        <section className="developer-hero">
          <div className="developer-hero__grid">
            <motion.div
              className="developer-hero__avatar-wrap"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="developer-hero__avatar-ring" />
              <div className="developer-hero__avatar">
                {developer?.avatar ? (
                  <img src={developer.avatar} alt={developer.name || "Developer"} />
                ) : (
                  <Code2 size={56} strokeWidth={1.4} />
                )}
              </div>
            </motion.div>

            <motion.div
              className="developer-hero__content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <span className="developer-hero__eyebrow">
                <Sparkles size={14} /> {developer?.role || "Solo Full-Stack Developer"}
              </span>
              <h2 className="developer-hero__title">
                Building Sirat with intention, line by line.
              </h2>
              <p className="developer-hero__text">
                I designed and built the entire Sirat platform — the storefront you are
                browsing, the admin command center, and the REST API underneath it — as
                a single, opinionated system. Premium feel, lean payload, transparent
                markup, zero template shortcuts.
              </p>

              <div className="developer-hero__socials">
                {socials.length > 0 ? (
                  socials.map(({ href, Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="developer-social"
                      aria-label={label}
                      title={label}
                    >
                      <Icon size={18} />
                    </a>
                  ))
                ) : (
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="developer-social"
                    aria-label="GitHub"
                    title="GitHub"
                  >
                    <Github size={18} />
                  </a>
                )}
                <a
                  href="mailto:hello@siratclothing.com"
                  className="developer-social"
                  aria-label="Email"
                  title="Email"
                >
                  <Mail size={18} />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="developer-highlights">
          {HIGHLIGHTS.map((h, idx) => (
            <motion.div
              key={h.label}
              className="developer-highlight"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <strong>{h.value}</strong>
              <span>{h.label}</span>
            </motion.div>
          ))}
        </section>

        <section className="developer-stack-section">
          <div className="section-header" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p className="section-header__eyebrow">The Stack</p>
            <h2>Under the hood</h2>
            <p style={{ margin: "0.5rem auto 0", maxWidth: "560px" }}>
              A pragmatic, modern toolchain focused on speed, transparency, and a premium feel.
            </p>
          </div>

          <div className="developer-stack-grid">
            {STACK.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <Panel className="page-card developer-stack-card">
                    <div className="developer-stack-icon">
                      <Icon size={22} strokeWidth={1.6} />
                    </div>
                    <div>
                      <strong className="developer-stack-name">{tech.name}</strong>
                      <span className="developer-stack-cat">{tech.category}</span>
                    </div>
                  </Panel>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="developer-cta">
          <Panel className="page-card developer-cta-card">
            <GitBranch size={28} className="developer-cta-icon" />
            <h3>Open to collaboration</h3>
            <p>
              Got a project that needs the same attention to detail? I take on a small
              number of contract engagements each quarter. Reach out and let's build
              something that lasts.
            </p>
            <a
              href="mailto:hello@siratclothing.com?subject=Project%20inquiry"
              className="developer-cta-btn"
            >
              <Mail size={16} /> Start a conversation
            </a>
          </Panel>
        </section>

        {loading && (
          <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--sirat-muted)" }}>
            Loading developer info…
          </p>
        )}
      </PageFrame>
    </div>
  );
}
