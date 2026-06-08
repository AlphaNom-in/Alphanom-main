import { createClient } from '@/lib/supabase/server'
import { redirect }      from 'next/navigation'
import PayoutForm        from './PayoutForm'
import SecurityForm      from './SecurityForm'

function SettingCard({ icon, title, description, children }: {
  icon: React.ReactNode; title: string; description: string; children: React.ReactNode
}) {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', overflow: 'hidden', boxShadow: '0 2px 12px rgba(3,38,85,0.05)' }}>
      <div style={{ padding: '16px 22px', borderBottom: '1px solid #EEF3F8', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EEF3F8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {icon}
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 700, color: '#032655', margin: 0 }}>{title}</p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#96AFCA', margin: '2px 0 0' }}>{description}</p>
        </div>
      </div>
      <div style={{ padding: '22px' }}>{children}</div>
    </div>
  )
}

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/recruiter/login')

  const { data: recruiter } = await supabase
    .from('recruiters')
    .select('bank_account_name, bank_account_number, bank_ifsc, upi_id, pan_number, gst_number')
    .eq('user_id', user.id)
    .single()

  return (
    <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Payout & Banking */}
      <SettingCard
        icon={
          <svg fill="none" stroke="#5A7A9F" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
        }
        title="Payout & Banking"
        description="Bank account, UPI, and invoicing details for commission payouts"
      >
        <PayoutForm
          bankAccountName={recruiter?.bank_account_name}
          bankAccountNumber={recruiter?.bank_account_number}
          bankIfsc={recruiter?.bank_ifsc}
          upiId={recruiter?.upi_id}
          panNumber={recruiter?.pan_number}
          gstNumber={recruiter?.gst_number}
        />
      </SettingCard>

      {/* Access & Security */}
      <SettingCard
        icon={
          <svg fill="none" stroke="#5A7A9F" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        }
        title="Access & Security"
        description="Change your password and manage active sessions"
      >
        <SecurityForm userEmail={user.email ?? ''} />
      </SettingCard>

    </div>
  )
}