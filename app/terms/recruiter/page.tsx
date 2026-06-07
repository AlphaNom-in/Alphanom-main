import Link from 'next/link'

export const metadata = { title: 'Recruiter Terms & Conditions – AlphaNom' }

const SECTIONS = [
  {
    title: '1. Platform Use',
    body: `AlphaNom provides a marketplace where verified independent recruiters submit pre-qualified candidates to employer mandates. Access is granted exclusively to approved recruiters. You agree to use the platform in good faith and in compliance with these terms.`,
  },
  {
    title: '2. Candidate Submissions',
    body: `You may only submit candidates you have directly spoken with and who have explicitly consented to be represented for the specific role. Each submission must reflect the candidate's genuine interest and current availability.\n\nDirect outreach to the employer outside of the AlphaNom platform, or sharing of mandate details with external parties, is strictly prohibited during and after the active mandate period.`,
  },
  {
    title: '3. Earning Potential & Fee Structure',
    body: `Your earning for a successful placement is calculated as 4% of the candidate's agreed annual CTC. This fee is payable to you within 30 days of AlphaNom receiving the employer's payment.\n\nNo fee is payable for candidates not placed, candidates who decline the offer, or placements that occur outside the platform. AlphaNom reserves the right to withhold payment if there is evidence of misrepresentation or terms violation.`,
  },
  {
    title: '4. Confidentiality',
    body: `All job mandates, salary bands, employer identity, and platform data are strictly confidential. You must not disclose mandate details to third parties, post them publicly, or use them for competitive intelligence. This obligation survives the termination of your account.`,
  },
  {
    title: '5. Prohibited Conduct',
    body: `The following are expressly prohibited:\n• Submitting a candidate without their explicit consent.\n• Fabricating, exaggerating, or misrepresenting a candidate's qualifications, experience, or salary history.\n• Bypassing AlphaNom to collect a direct placement fee from the employer.\n• Submitting the same candidate to the same employer through multiple channels simultaneously.\n• Sharing access to your account with third parties.`,
  },
  {
    title: '6. Candidate Data Responsibilities',
    body: `You are responsible for obtaining valid consent from each candidate before submitting their personal data through the platform. Candidate data must be used solely for the relevant job submission and must be handled in compliance with applicable Indian data-protection laws. You must not retain candidate data after the submission cycle has concluded.`,
  },
  {
    title: '7. Quality & Accuracy Standards',
    body: `AlphaNom reserves the right to review submission quality. Repeated low-quality or irrelevant submissions, or submissions with inaccurate data, may result in account suspension. Maintaining a strong placement track record improves your visibility on the platform.`,
  },
  {
    title: '8. Account Suspension & Termination',
    body: `AlphaNom may suspend or permanently terminate your account for material breach of these terms, submitting fraudulent or non-consenting candidates, attempting to circumvent the platform, or conduct detrimental to employers or other platform participants.`,
  },
  {
    title: '9. Amendments',
    body: `AlphaNom may update these terms periodically. Continued use of the platform after notice of changes constitutes acceptance of the revised terms. Material changes will be communicated via email.`,
  },
  {
    title: '10. Governing Law',
    body: `These terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra.`,
  },
]

export default function RecruiterTermsPage() {
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
          <Link href="/recruiter/signup" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#0FB9B1', textDecoration: 'none', border: '1.5px solid #0FB9B1', borderRadius: '8px', padding: '6px 14px' }}>
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
            Recruiter Terms & Conditions
          </h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: '#96AFCA', margin: 0 }}>
            Last updated: June 2026 &nbsp;·&nbsp; Please read these terms carefully before creating your recruiter account.
          </p>
          <div style={{ height: '3px', width: '48px', background: 'linear-gradient(90deg, #032655, #0FB9B1)', borderRadius: '2px', marginTop: '20px' }} />
        </div>

        {/* Introduction */}
        <div style={{ background: '#fff', border: '1px solid #E2EAF3', borderLeft: '4px solid #0FB9B1', borderRadius: '12px', padding: '20px 24px', marginBottom: '2rem' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', color: '#3D5A7A', margin: 0, lineHeight: 1.7 }}>
            This Recruiter Agreement ("Agreement") is entered into between you ("Recruiter") and AlphaNom ("Platform").
            By clicking "I Agree" and creating an account, you confirm that you have read, understood, and agree to be bound by these terms.
            Breaching these terms may result in immediate account termination and forfeiture of pending fees.
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
        <div style={{ marginTop: '2.5rem', background: 'linear-gradient(135deg, #0A9E97, #0FB9B1)', borderRadius: '16px', padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '1rem', color: '#fff', margin: '0 0 4px' }}>Ready to join?</p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', margin: 0 }}>Return to the signup page and create your recruiter account.</p>
          </div>
          <Link href="/recruiter/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '11px 22px', borderRadius: '10px', background: '#032655', color: '#fff', textDecoration: 'none', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            Back to Signup →
          </Link>
        </div>
      </main>
    </div>
  )
}
