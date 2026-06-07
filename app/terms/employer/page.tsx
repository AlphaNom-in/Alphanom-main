import Link from 'next/link'

export const metadata = { title: 'Employer Terms & Conditions – AlphaNom' }

const SECTIONS = [
  {
    title: '1. Platform Use',
    body: `AlphaNom provides a recruitment marketplace that connects employers with verified specialist recruiters. By creating an account, you are granted a non-exclusive, non-transferable right to access the platform for the sole purpose of sourcing candidates for genuine open roles within your organisation.`,
  },
  {
    title: '2. Job Postings',
    body: `You agree to post only accurate, legitimate job openings. Fabricated, test, or misleading postings are strictly prohibited. AlphaNom reserves the right to remove any posting that violates these guidelines without prior notice. You must not use candidate information received through AlphaNom for any purpose other than evaluating that candidate for the specific role posted.`,
  },
  {
    title: '3. Placement Fee',
    body: `AlphaNom operates on a success-fee model — no upfront charges apply. Upon hiring a candidate submitted through the platform, a placement fee as agreed in your service arrangement becomes payable within 30 days of the candidate's start date. If a placed candidate exits within 90 days, AlphaNom will provide a free replacement or a partial fee credit at its reasonable discretion.`,
  },
  {
    title: '4. Candidate Data & Confidentiality',
    body: `All candidate information shared by recruiters is provided for the exclusive purpose of evaluating that individual for the posted role. You must not share candidate profiles with third parties, use them for other roles without fresh consent, or retain data beyond the period necessary for the hiring decision. All data handling must comply with applicable Indian privacy and data-protection laws.`,
  },
  {
    title: '5. Prohibited Conduct',
    body: `The following are expressly prohibited:\n• Hiring a candidate submitted through AlphaNom while circumventing the platform to avoid the placement fee.\n• Discriminatory, illegal, or harassing conduct toward candidates or recruiters.\n• Misrepresentation of the company's identity, the role's responsibilities, location, or compensation.\n• Engaging directly with a submitted candidate to bypass the recruiter relationship established through AlphaNom.`,
  },
  {
    title: '6. Account Suspension & Termination',
    body: `AlphaNom may suspend or permanently terminate your account for material breach of these terms, fraudulent activity, non-payment of agreed fees, or conduct that harms the reputation of the platform or its participants. You will be notified where reasonably practicable.`,
  },
  {
    title: '7. Limitation of Liability',
    body: `AlphaNom acts solely as an intermediary marketplace. We do not guarantee the suitability, qualifications, or conduct of any candidate, and we are not liable for any hiring decisions you make. Our aggregate liability to you for any claim shall not exceed the fees you paid to AlphaNom in the three months preceding the claim.`,
  },
  {
    title: '8. Amendments',
    body: `AlphaNom may update these terms from time to time. Continued use of the platform after notice of changes constitutes acceptance of the revised terms. Material changes will be communicated via email to your registered address.`,
  },
  {
    title: '9. Governing Law',
    body: `These terms are governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra.`,
  },
]

export default function EmployerTermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F5F8FC' }}>
      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #E2EAF3', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ height: '2.5px', background: 'linear-gradient(90deg,#032655 0%,#0FB9B1 40%,#15C7C0 60%,#032655 100%)' }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0FB9B1', display: 'inline-block', marginRight: '7px' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: '1.55rem', color: '#032655', letterSpacing: '-0.02em', lineHeight: 1 }}>Alpha</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '0.95rem', color: '#032655', letterSpacing: '0.05em', textTransform: 'uppercase', alignSelf: 'flex-end', paddingBottom: '2px', marginLeft: '1px' }}>Nom</span>
          </Link>
          <Link href="/employer/signup" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#032655', textDecoration: 'none', border: '1.5px solid #D0DBE8', borderRadius: '8px', padding: '6px 14px' }}>
            ← Back to Signup
          </Link>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem 4rem' }}>
        {/* Title block */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#0FB9B1' }}>Legal</span>
          <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '2rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.03em', margin: '8px 0 12px' }}>
            Employer Terms & Conditions
          </h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: '#96AFCA', margin: 0 }}>
            Last updated: June 2026 &nbsp;·&nbsp; Please read these terms carefully before creating your employer account.
          </p>
          <div style={{ height: '3px', width: '48px', background: 'linear-gradient(90deg, #032655, #0FB9B1)', borderRadius: '2px', marginTop: '20px' }} />
        </div>

        {/* Introduction */}
        <div style={{ background: '#fff', border: '1px solid #E2EAF3', borderLeft: '4px solid #032655', borderRadius: '12px', padding: '20px 24px', marginBottom: '2rem' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', color: '#3D5A7A', margin: 0, lineHeight: 1.7 }}>
            This Employer Agreement ("Agreement") is entered into between you ("Employer") and AlphaNom ("Platform").
            By clicking "I Agree" and creating an account, you confirm that you have read, understood, and agree to be bound by these terms.
            If you are acting on behalf of a company, you represent that you have the authority to bind that organisation.
          </p>
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {SECTIONS.map((s) => (
            <div key={s.title} style={{ background: '#fff', border: '1px solid #E2EAF3', borderRadius: '12px', padding: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 800, color: '#032655', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
                {s.title}
              </h2>
              {s.body.split('\n').map((line, i) => (
                <p key={i} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.87rem', color: '#3D5A7A', margin: i > 0 ? '6px 0 0' : 0, lineHeight: 1.7, paddingLeft: line.startsWith('•') ? '8px' : 0 }}>
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div style={{ marginTop: '2.5rem', background: 'linear-gradient(135deg, #032655, #0A4A8A)', borderRadius: '16px', padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '1rem', color: '#fff', margin: '0 0 4px' }}>Ready to get started?</p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', margin: 0 }}>Return to the signup page and create your employer account.</p>
          </div>
          <Link href="/employer/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '11px 22px', borderRadius: '10px', background: '#0FB9B1', color: '#fff', textDecoration: 'none', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            Back to Signup →
          </Link>
        </div>
      </main>
    </div>
  )
}
