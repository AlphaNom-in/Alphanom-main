export function otpEmailHtml(
  otp: string,
  name?: string,
  role?: 'employer' | 'recruiter',
  type?: 'signup' | 'reset'
): string {
  const greeting   = name ? `Hi ${name},` : 'Hi,'
  const roleLabel  = role === 'employer' ? 'Employer' : role === 'recruiter' ? 'Recruiter' : ''
  const isReset    = type === 'reset'
  const title      = isReset ? 'Reset your password' : 'Verify your email'
  const bodyText   = isReset
    ? `Use the code below to reset your password for your ${roleLabel} account on AlphaNom. It expires in <strong style="color:#032655;">10 minutes</strong>.`
    : `Use the code below to verify your ${roleLabel} account on AlphaNom. It expires in <strong style="color:#032655;">10 minutes</strong>.`
  const safetyText = isReset
    ? "If you didn't request a password reset, you can safely ignore this email."
    : "If you didn't request this, you can safely ignore this email."

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F8FC;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F8FC;padding:40px 16px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;border:1px solid #D0DBE8;overflow:hidden;">
        <tr><td style="height:4px;background:linear-gradient(90deg,#032655,#0FB9B1);font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:28px 36px 0;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="width:36px;height:36px;border-radius:9px;background:linear-gradient(135deg,#0FB9B1,#0A9E97);text-align:center;vertical-align:middle;">
              <span style="font-weight:900;font-size:12px;color:#fff;letter-spacing:0.04em;">AN</span>
            </td>
            <td style="padding-left:10px;font-weight:800;font-size:16px;color:#032655;letter-spacing:-0.02em;">AlphaNom</td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:24px 36px 32px;">
          <h1 style="font-size:20px;font-weight:800;color:#032655;margin:0 0 8px;letter-spacing:-0.025em;">${title}</h1>
          <p style="font-size:14px;color:#5A7A9F;margin:0 0 24px;line-height:1.6;">${greeting} ${bodyText}</p>
          <div style="background:#F5F8FC;border:1.5px solid #D0DBE8;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
            <p style="font-size:11px;font-weight:700;color:#96AFCA;letter-spacing:0.14em;text-transform:uppercase;margin:0 0 12px;">Your Code</p>
            <p style="font-size:42px;font-weight:900;color:#032655;letter-spacing:0.18em;margin:0;">${otp}</p>
          </div>
          <p style="font-size:13px;color:#96AFCA;margin:0 0 8px;line-height:1.6;">${safetyText}</p>
          <p style="font-size:12px;color:#B0C4D8;margin:0;">Valid for 10 minutes · Single use only</p>
        </td></tr>
        <tr><td style="padding:20px 36px;border-top:1px solid #EEF3F8;">
          <p style="font-size:12px;color:#B0C4D8;margin:0;text-align:center;">AlphaNom &mdash; India's Premium Recruitment Network<br/>Do not reply to this automated email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
