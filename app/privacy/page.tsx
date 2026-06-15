export const metadata = {
  title: 'Privacy Policy — AI Social Content',
  description: 'How AI Social Content handles your data.',
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e11d48', marginBottom: 12 }}>{title}</h2>
    <div style={{ color: '#374151', lineHeight: 1.7, fontSize: 15 }}>{children}</div>
  </section>
)

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px 80px' }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: '#64748b', marginBottom: 48, fontSize: 14 }}>Last updated: June 2025</p>
      <Section title="Data We Collect">
        <p>We collect topic prompts, brand descriptions, and tone preferences you enter for content generation. We do not store generated content after your session.</p>
      </Section>
      <Section title="How We Use Data">
        <p>Prompts are sent to AI providers to generate social media content. We never use your prompts for advertising or training.</p>
      </Section>
      <Section title="Cookies">
        <p>We use minimal session cookies for functionality. No advertising or tracking cookies are used.</p>
      </Section>
      <Section title="Third-Party Services">
        <p>Content generation uses Groq and/or OpenAI APIs. Prompts are subject to their privacy policies during processing.</p>
      </Section>
      <Section title="Data Retention">
        <p>Topic prompts and generated content are not retained after your session ends.</p>
      </Section>
      <Section title="Your Rights">
        <p>Email privacy@ai-social-content.app to request deletion of any data we hold about you.</p>
      </Section>
      <Section title="Children&apos;s Privacy">
        <p>This service is not directed at children under 13. We do not knowingly collect data from minors.</p>
      </Section>
      <Section title="Contact">
        <p>Questions? Email <a href="mailto:privacy@ai-social-content.app" style={{ color: '#e11d48' }}>privacy@ai-social-content.app</a></p>
      </Section>
    </main>
  )
}
