import type { Data } from '@measured/puck';
import type { ArchitectureData } from '@/lib/store/workspace';

/**
 * Converts architecture graph data into an initial Puck page layout.
 * This is called after AI generation so the Design Mode shows something meaningful
 * instead of a blank canvas.
 */
export function architectureToDesign(
  architectureData: ArchitectureData,
  workspaceName: string
): Data {
  const { nodes, techStack } = architectureData;

  if (!nodes || nodes.length === 0) {
    return { content: [], root: {} };
  }

  // Build feature items from architecture nodes
  const features = nodes.map(n => ({
    title: n.label,
    description: n.description || `${n.layer} layer component`,
  }));

  // Detect app type from tech stack / node labels
  const allText = [
    ...nodes.map(n => n.label.toLowerCase()),
    ...techStack.map(t => t.toLowerCase()),
  ].join(' ');

  const isEcommerce = /shop|store|ecommerce|order|product|payment/.test(allText);
  const isSaaS      = /dashboard|subscription|plan|billing|saas/.test(allText);

  // Pick hero copy based on detected app type
  let heroTitle = workspaceName || 'Your Application';
  let heroDesc  = `Full-stack system with ${nodes.length} components, built with ${techStack.slice(0, 3).join(', ')}`;
  let heroCTA   = 'Get Started';

  if (isEcommerce) {
    heroTitle = workspaceName || 'Your Store';
    heroDesc  = `Modern e-commerce platform powered by ${techStack.slice(0, 2).join(' & ')}`;
    heroCTA   = 'Shop Now';
  } else if (isSaaS) {
    heroTitle = workspaceName || 'Your SaaS';
    heroDesc  = `Scalable SaaS platform with ${nodes.length} services and enterprise-grade reliability`;
    heroCTA   = 'Start Free Trial';
  }

  // Nav links derived from frontend / service nodes
  const navLinks = nodes
    .filter(n => ['Frontend', 'Gateway', 'Services'].includes(n.layer))
    .slice(0, 4)
    .map(n => ({ label: n.label, href: `#${n.id}` }));

  if (navLinks.length === 0) {
    navLinks.push(
      { label: 'Features', href: '#features' },
      { label: 'Docs', href: '#docs' },
    );
  }

  const content: Data['content'] = [];

  // 1. Navbar
  content.push({
    type: 'Navbar',
    props: {
      logo: workspaceName || 'VisualArch',
      links: navLinks,
    },
  } as any);

  // 2. Hero
  content.push({
    type: 'Hero',
    props: {
      title: heroTitle,
      description: heroDesc,
      cta: heroCTA,
    },
  } as any);

  // 3. Feature grid from architecture nodes
  content.push({
    type: 'FeatureGrid',
    props: { features },
  } as any);

  // 4. Architecture heading
  content.push({
    type: 'Heading',
    props: { title: 'Technology Stack', level: 'h2' },
  } as any);

  // 5. Tech stack as text
  if (techStack.length > 0) {
    content.push({
      type: 'Text',
      props: { text: techStack.join(' · ') },
    } as any);
  }

  // 6. Pricing section for SaaS/ecommerce apps
  if (isSaaS || isEcommerce) {
    content.push({
      type: 'Pricing',
      props: {
        tiers: [
          { plan: 'Starter', price: '$0/mo',  features: [{ item: '1 project' }, { item: 'Basic analytics' }, { item: 'Community support' }] },
          { plan: 'Pro',     price: '$29/mo', features: [{ item: '10 projects' }, { item: 'Advanced analytics' }, { item: 'Priority support' }] },
          { plan: 'Team',    price: '$99/mo', features: [{ item: 'Unlimited projects' }, { item: 'Custom integrations' }, { item: 'Dedicated support' }] },
        ],
      },
    } as any);
  }

  // 7. Contact section
  content.push({
    type: 'Contact',
    props: {
      title: 'Stay in the loop',
      emailPlaceholder: 'you@example.com',
    },
  } as any);

  return { content, root: {} };
}
