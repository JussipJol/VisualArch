import { Config, Data, DropZone } from "@measured/puck";

export type PuckConfig = {
  Heading: { title: string; level: 'h1' | 'h2' | 'h3' };
  Text: { text: string };
  Hero: { title: string; description: string; cta: string };
  Button: { label: string; variant: 'primary' | 'secondary' };
  Card: { title: string; content: string };
  FeatureGrid: { features: { title: string; description: string }[] };
  Pricing: { tiers: { plan: string; price: string; features: string[] }[] };
  Navbar: { logo: string; links: { label: string; href: string }[] };
  Contact: { title: string; emailPlaceholder: string };
  Container: { children: any };
};

export const config: Config<PuckConfig> = {
  components: {
    Heading: {
      fields: {
        title: { type: "text" },
        level: {
          type: "select",
          options: [
            { label: "Level 1", value: "h1" },
            { label: "Level 2", value: "h2" },
            { label: "Level 3", value: "h3" },
          ],
        },
      },
      render: ({ title, level }) => {
        const Tag = level || "h1";
        const sizes = { h1: "text-4xl", h2: "text-2xl", h3: "text-xl" };
        return <Tag className={`${sizes[Tag as keyof typeof sizes]} font-bold mb-4 text-text-primary`}>{title}</Tag>;
      },
    },
    Text: {
      fields: { text: { type: "textarea" } },
      render: ({ text }) => <p className="text-text-secondary leading-relaxed mb-4">{text}</p>,
    },
    Hero: {
      fields: {
        title: { type: "text" },
        description: { type: "textarea" },
        cta: { type: "text" },
      },
      render: ({ title, description, cta }) => (
        <div className="py-16 px-8 rounded-3xl bg-surface border border-white/5 text-center space-y-4">
          <h1 className="text-5xl font-extrabold text-text-primary">{title}</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">{description}</p>
          <button className="px-6 py-3 bg-accent text-white rounded-xl font-bold shadow-glow-accent">
            {cta}
          </button>
        </div>
      ),
    },
    Button: {
      fields: {
        label: { type: "text" },
        variant: {
          type: "radio",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
          ],
        },
      },
      render: ({ label, variant }) => (
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            variant === "primary" ? "bg-accent text-white" : "bg-white/5 text-text-primary hover:bg-white/10"
          }`}
        >
          {label}
        </button>
      ),
    },
    Card: {
      fields: {
        title: { type: "text" },
        content: { type: "textarea" },
      },
      render: ({ title, content }) => (
        <div className="p-6 rounded-2xl bg-surface border border-white/5 space-y-2">
          <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          <p className="text-sm text-text-secondary">{content}</p>
        </div>
      ),
    },
    FeatureGrid: {
      fields: {
        features: {
          type: "array",
          getItemSummary: (idx) => `Feature ${idx + 1}`,
          arrayFields: {
            title: { type: "text" },
            description: { type: "textarea" },
          },
        },
      },
      render: ({ features }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-surface border border-white/5 space-y-2">
              <h3 className="text-lg font-bold text-text-primary">{f.title}</h3>
              <p className="text-sm text-text-secondary">{f.description}</p>
            </div>
          ))}
        </div>
      ),
    },
    Pricing: {
      fields: {
        tiers: {
          type: "array",
          getItemSummary: (idx) => `Tier ${idx + 1}`,
          arrayFields: {
            plan: { type: "text" },
            price: { type: "text" },
            features: { type: "array", arrayFields: { item: { type: "text" } } },
          },
        },
      },
      render: ({ tiers }) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          {tiers.map((t, i) => (
            <div key={i} className="p-8 rounded-3xl bg-surface border border-white/5 space-y-6 relative overflow-hidden group">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-text-primary">{t.plan}</h3>
                <div className="text-3xl font-black text-accent">{t.price}</div>
              </div>
              <ul className="space-y-3">
                {t.features.map((f: any, fi: number) => (
                  <li key={fi} className="text-sm text-text-secondary flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" /> {f.item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 bg-white/5 hover:bg-accent text-white rounded-xl font-bold transition-all">
                Get Started
              </button>
            </div>
          ))}
        </div>
      ),
    },
    Navbar: {
      fields: {
        logo: { type: "text" },
        links: {
          type: "array",
          arrayFields: {
            label: { type: "text" },
            href: { type: "text" },
          },
        },
      },
      render: ({ logo, links }) => (
        <nav className="flex items-center justify-between py-6 px-4 border-b border-white/5 mb-8">
          <div className="text-lg font-black text-accent tracking-tighter">{logo}</div>
          <div className="flex items-center gap-6">
            {links.map((l, i) => (
              <a key={i} href={l.href} className="text-sm font-medium text-text-secondary hover:text-accent transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </nav>
      ),
    },
    Contact: {
      fields: {
        title: { type: "text" },
        emailPlaceholder: { type: "text" },
      },
      render: ({ title, emailPlaceholder }) => (
        <div className="py-12 px-8 bg-surface border border-white/5 rounded-3xl space-y-6">
          <h2 className="text-3xl font-bold text-text-primary text-center">{title}</h2>
          <div className="flex gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder={emailPlaceholder} 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
              disabled
            />
            <button className="px-6 py-3 bg-accent text-white rounded-xl font-bold cursor-not-allowed">
              Send
            </button>
          </div>
        </div>
      ),
    },
    Container: {
      render: () => (
        <div className="py-10 px-6 border border-dashed border-white/10 rounded-3xl min-h-[100px] bg-white/[0.02]">
          <DropZone zone="container-content" />
        </div>
      ),
    },
  },
};

export const initialPuckData: Data = {
  content: [],
  root: {},
};
