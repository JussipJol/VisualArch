import React from 'react';
import { useNode, Element } from '@craftjs/core';
import { LucideIcon, Wand2 } from 'lucide-react';

// --- Types ---

export interface CommonProps {
  padding?: string;
  margin?: string;
  background?: string;
  color?: string;
  borderRadius?: string;
  textAlign?: 'left' | 'center' | 'right';
}

const CommonSettings = () => {
  return null;
};

// --- Container ---

export const Container = ({ children, padding, margin, background, borderRadius }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div 
      ref={(ref) => connect(drag(ref as any))}
      style={{ 
        padding: padding || '20px', 
        margin: margin || '0', 
        background: background || 'transparent',
        borderRadius: borderRadius || '0px',
        minHeight: '50px'
      }}
      className="relative border border-dashed border-transparent hover:border-accent/30 transition-colors"
    >
      {children}
    </div>
  );
};
Container.displayName = 'Container';
(Container as any).craft = {
  displayName: 'Container',
  props: { padding: '20px', background: 'transparent' },
  related: { settings: CommonSettings }
};

// --- Text ---

export const Text = ({ text, fontSize, color, textAlign, fontWeight }: any) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();
  const [editable, setEditable] = React.useState(false);

  return (
    <div ref={(ref) => connect(drag(ref as any))} className="group relative">
      <p
        contentEditable={editable}
        onBlur={(e) => {
          setProp((props: any) => (props.text = e.target.innerText));
          setEditable(false);
        }}
        onClick={() => setEditable(true)}
        style={{ 
          fontSize: `${fontSize}px`, 
          color: color || 'inherit', 
          textAlign: textAlign || 'left',
          fontWeight: fontWeight || 'normal'
        }}
        className="outline-none"
      >
        {text}
      </p>
    </div>
  );
};
Text.displayName = 'Text';
(Text as any).craft = {
  displayName: 'Text',
  props: { text: 'Type something...', fontSize: 16, color: '#ffffff', textAlign: 'left' },
  related: { settings: CommonSettings }
};

// --- Hero ---

export const Hero = ({ title, subtitle, ctaText, background, height }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <section 
      ref={(ref) => connect(drag(ref as any))}
      style={{ background: background || 'linear-gradient(to right, #6d28d9, #4f46e5)', minHeight: height || '400px' }}
      className="flex flex-col items-center justify-center p-12 rounded-3xl text-white text-center"
    >
      <h1 className="text-5xl font-black mb-4 tracking-tighter">{title || 'Your Story Starts Here'}</h1>
      <p className="text-xl opacity-90 mb-8 max-w-2xl">{subtitle || 'Describe the value proposition of your application.'}</p>
      <button className="px-8 py-4 bg-white text-accent rounded-2xl font-bold shadow-lg transition-transform hover:scale-105">
        {ctaText || 'Get Started'}
      </button>
    </section>
  );
};
Hero.displayName = 'Hero';
(Hero as any).craft = {
  displayName: 'Hero',
  props: { title: 'Hero Title', subtitle: 'Hero Subtitle', ctaText: 'Action', background: '', height: '400px' },
  related: { settings: CommonSettings }
};

// --- Section ---

export const Section = ({ title, children, background }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <section 
      ref={(ref) => connect(drag(ref as any))}
      style={{ background: background || 'transparent' }}
      className="py-16 px-8 flex flex-col gap-8"
    >
      <h2 className="text-3xl font-bold text-text-primary">{title || 'Section Title'}</h2>
      <div className="w-full h-px bg-white/5" />
      <Element id="section-body" is={Container} canvas>
        {children}
      </Element>
    </section>
  );
};
Section.displayName = 'Section';
(Section as any).craft = {
  displayName: 'Section',
  props: { title: 'Section Title' },
  related: { settings: CommonSettings }
};

// --- Button ---

export const Button = ({ text, variant, padding, margin }: any) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <button
      ref={(ref) => connect(drag(ref as any))}
      style={{ padding: padding || '12px 24px', margin: margin || '0' }}
      className={`rounded-xl font-bold transition-all ${
        variant === 'primary' ? 'bg-accent text-white shadow-glow-accent' : 'bg-white/5 text-text-primary'
      }`}
    >
      {text || 'Click me'}
    </button>
  );
};
Button.displayName = 'Button';
(Button as any).craft = {
  displayName: 'Button',
  props: { text: 'Button', variant: 'primary' },
  related: { settings: CommonSettings }
};

// Settings are now defined alongside components above.
