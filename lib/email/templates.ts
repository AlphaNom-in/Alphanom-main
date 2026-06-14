export function recruiterApprovedEmailHtml({
  firstName,
  fullName,
  loginUrl,
  jobsUrl,
}: {
  firstName: string
  fullName: string
  loginUrl: string
  jobsUrl: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>You're approved on AlphaNom</title>
</head>
<body style="margin:0;padding:0;background:#F5F8FC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F5F8FC;padding:48px 16px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;width:100%;">

        <!-- Logo row -->
        <tr><td style="padding-bottom:28px;">
          <span style="font-size:18px;font-weight:700;color:#032655;letter-spacing:-0.03em;">Alpha<span style="color:#0FB9B1;">Nom</span></span>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#ffffff;border:1px solid #D0DBE8;border-radius:8px;overflow:hidden;">

          <!-- Top accent -->
          <div style="height:3px;background:#0FB9B1;font-size:0;line-height:0;">&nbsp;</div>

          <!-- Body -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">

            <!-- Greeting -->
            <tr><td style="padding:40px 40px 0;">
              <p style="margin:0 0 24px;font-size:13px;font-weight:600;color:#0FB9B1;text-transform:uppercase;letter-spacing:0.08em;">Account Approved</p>
              <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#032655;line-height:1.3;">Welcome aboard, ${firstName}.</h1>
              <p style="margin:0;font-size:15px;color:#5A7A9F;line-height:1.7;">
                Your recruiter profile has been reviewed and approved by the AlphaNom team.
                You now have full access to the platform and can begin submitting candidates immediately.
              </p>
            </td></tr>

            <!-- Divider -->
            <tr><td style="padding:28px 40px 0;"><div style="height:1px;background:#EEF3F8;"></div></td></tr>

            <!-- What's available -->
            <tr><td style="padding:24px 40px 0;">
              <p style="margin:0 0 16px;font-size:12px;font-weight:600;color:#96AFCA;text-transform:uppercase;letter-spacing:0.08em;">What you can do now</p>
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr><td style="padding:8px 0;border-bottom:1px solid #F5F8FC;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="width:20px;vertical-align:top;padding-top:4px;font-size:0;">
                      <div style="width:5px;height:5px;border-radius:50%;background:#0FB9B1;"></div>
                    </td>
                    <td style="font-size:14px;color:#032655;line-height:1.6;padding-left:10px;">Browse active job openings from verified employers</td>
                  </tr></table>
                </td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #F5F8FC;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="width:20px;vertical-align:top;padding-top:4px;font-size:0;">
                      <div style="width:5px;height:5px;border-radius:50%;background:#0FB9B1;"></div>
                    </td>
                    <td style="font-size:14px;color:#032655;line-height:1.6;padding-left:10px;">Submit up to 7 candidate profiles per role</td>
                  </tr></table>
                </td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #F5F8FC;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="width:20px;vertical-align:top;padding-top:4px;font-size:0;">
                      <div style="width:5px;height:5px;border-radius:50%;background:#0FB9B1;"></div>
                    </td>
                    <td style="font-size:14px;color:#032655;line-height:1.6;padding-left:10px;">Share public application links to collect inbound leads</td>
                  </tr></table>
                </td></tr>
                <tr><td style="padding:8px 0;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="width:20px;vertical-align:top;padding-top:4px;font-size:0;">
                      <div style="width:5px;height:5px;border-radius:50%;background:#0FB9B1;"></div>
                    </td>
                    <td style="font-size:14px;color:#032655;line-height:1.6;padding-left:10px;">Track candidate consent and pipeline status in real time</td>
                  </tr></table>
                </td></tr>
              </table>
            </td></tr>

            <!-- CTA -->
            <tr><td style="padding:32px 40px 40px;">
              <a href="${jobsUrl}" style="display:inline-block;padding:13px 28px;background:#0FB9B1;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;border-radius:6px;letter-spacing:-0.01em;">
                Browse open jobs
              </a>
              <p style="margin:16px 0 0;font-size:13px;color:#96AFCA;">
                Or <a href="${loginUrl}" style="color:#0FB9B1;text-decoration:none;font-weight:500;">go to your dashboard</a> directly.
              </p>
            </td></tr>

          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 0 0;text-align:center;">
          <p style="margin:0;font-size:12px;color:#96AFCA;line-height:1.7;">
            AlphaNom &middot; India&rsquo;s Confidential Recruitment Network<br>
            Sent to <span style="color:#5A7A9F;">${fullName}</span> &middot; Do not reply
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function employerApprovedEmailHtml({
  companyName,
  contactName,
  loginUrl,
  postJobUrl,
}: {
  companyName: string
  contactName: string
  loginUrl: string
  postJobUrl: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${companyName} verified on AlphaNom</title>
</head>
<body style="margin:0;padding:0;background:#F5F8FC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F5F8FC;padding:48px 16px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;width:100%;">

        <!-- Logo row -->
        <tr><td style="padding-bottom:28px;">
          <span style="font-size:18px;font-weight:700;color:#032655;letter-spacing:-0.03em;">Alpha<span style="color:#0FB9B1;">Nom</span></span>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#ffffff;border:1px solid #D0DBE8;border-radius:8px;overflow:hidden;">

          <!-- Top accent -->
          <div style="height:3px;background:#0FB9B1;font-size:0;line-height:0;">&nbsp;</div>

          <!-- Body -->
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">

            <!-- Greeting -->
            <tr><td style="padding:40px 40px 0;">
              <p style="margin:0 0 24px;font-size:13px;font-weight:600;color:#0FB9B1;text-transform:uppercase;letter-spacing:0.08em;">Company Verified</p>
              <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#032655;line-height:1.3;">Hi ${contactName}, ${companyName} is now live.</h1>
              <p style="margin:0;font-size:15px;color:#5A7A9F;line-height:1.7;">
                Your employer account has been verified by the AlphaNom team.
                You can now post jobs and start receiving curated candidates from our network of verified recruiters.
              </p>
            </td></tr>

            <!-- Divider -->
            <tr><td style="padding:28px 40px 0;"><div style="height:1px;background:#EEF3F8;"></div></td></tr>

            <!-- What's available -->
            <tr><td style="padding:24px 40px 0;">
              <p style="margin:0 0 16px;font-size:12px;font-weight:600;color:#96AFCA;text-transform:uppercase;letter-spacing:0.08em;">What you can do now</p>
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr><td style="padding:8px 0;border-bottom:1px solid #F5F8FC;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="width:20px;vertical-align:top;padding-top:4px;font-size:0;">
                      <div style="width:5px;height:5px;border-radius:50%;background:#0FB9B1;"></div>
                    </td>
                    <td style="font-size:14px;color:#032655;line-height:1.6;padding-left:10px;">Post job openings with full JD, requirements, and salary range</td>
                  </tr></table>
                </td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #F5F8FC;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="width:20px;vertical-align:top;padding-top:4px;font-size:0;">
                      <div style="width:5px;height:5px;border-radius:50%;background:#0FB9B1;"></div>
                    </td>
                    <td style="font-size:14px;color:#032655;line-height:1.6;padding-left:10px;">Receive pre-screened candidates directly from verified recruiters</td>
                  </tr></table>
                </td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #F5F8FC;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="width:20px;vertical-align:top;padding-top:4px;font-size:0;">
                      <div style="width:5px;height:5px;border-radius:50%;background:#0FB9B1;"></div>
                    </td>
                    <td style="font-size:14px;color:#032655;line-height:1.6;padding-left:10px;">Review, shortlist, and move candidates through your pipeline</td>
                  </tr></table>
                </td></tr>
                <tr><td style="padding:8px 0;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="width:20px;vertical-align:top;padding-top:4px;font-size:0;">
                      <div style="width:5px;height:5px;border-radius:50%;background:#0FB9B1;"></div>
                    </td>
                    <td style="font-size:14px;color:#032655;line-height:1.6;padding-left:10px;">Unlock candidate contact details after consent is confirmed</td>
                  </tr></table>
                </td></tr>
              </table>
            </td></tr>

            <!-- CTA -->
            <tr><td style="padding:32px 40px 40px;">
              <a href="${postJobUrl}" style="display:inline-block;padding:13px 28px;background:#0FB9B1;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;border-radius:6px;letter-spacing:-0.01em;">
                Post your first job
              </a>
              <p style="margin:16px 0 0;font-size:13px;color:#96AFCA;">
                Or <a href="${loginUrl}" style="color:#0FB9B1;text-decoration:none;font-weight:500;">go to your dashboard</a> directly.
              </p>
            </td></tr>

          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 0 0;text-align:center;">
          <p style="margin:0;font-size:12px;color:#96AFCA;line-height:1.7;">
            AlphaNom &middot; India&rsquo;s Confidential Recruitment Network<br>
            Sent to <span style="color:#5A7A9F;">${companyName}</span> &middot; Do not reply
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function consentEmailHtml({
  candidateFirstName,
  recruiterName,
  jobTitle,
  companyName,
  confirmUrl,
  withdrawUrl,
}: {
  candidateFirstName: string
  recruiterName: string
  jobTitle: string
  companyName: string
  confirmUrl: string
  withdrawUrl: string
}): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:560px;border:1px solid #e0e0e0;">

        <!-- Header -->
        <tr>
          <td style="background:#1a1a2e;padding:28px 40px;">
            <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:0.01em;">${companyName}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#a0aec0;letter-spacing:0.05em;text-transform:uppercase;">Human Resources</p>
          </td>
        </tr>

        <!-- Body -->
        <tr><td style="padding:36px 40px 0;">
          <p style="font-size:15px;color:#1a202c;margin:0 0 20px;line-height:1.7;">Dear ${candidateFirstName},</p>
          <p style="font-size:15px;color:#2d3748;margin:0 0 16px;line-height:1.8;">
            We are pleased to inform you that your profile has been submitted for the
            <strong style="color:#1a202c;">${jobTitle}</strong> position at <strong style="color:#1a202c;">${companyName}</strong>.
          </p>
          <p style="font-size:14px;color:#4a5568;margin:0 0 28px;line-height:1.8;">
            To proceed with your application, we require your confirmation. Please click the button below to confirm your interest in this opportunity.
          </p>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:0 40px 28px;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#1a1a2e;border-radius:4px;">
                <a href="${confirmUrl}" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.02em;">
                  Yes, proceed my application &rarr;
                </a>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding:0 40px 24px;"><div style="height:1px;background:#e2e8f0;"></div></td></tr>

        <!-- Note -->
        <tr><td style="padding:0 40px 32px;">
          <p style="font-size:13px;color:#718096;margin:0 0 8px;line-height:1.7;">
            If you are not interested in this opportunity or did not authorise this submission, please
            <a href="${withdrawUrl}" style="color:#c53030;text-decoration:none;font-weight:600;">decline here</a>.
          </p>
          <p style="font-size:12px;color:#a0aec0;margin:0;">This confirmation link will expire in <strong>48 hours</strong>. If no action is taken, your application will be automatically withdrawn.</p>
        </td></tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #e2e8f0;background:#f7fafc;">
            <p style="font-size:13px;color:#4a5568;margin:0 0 4px;line-height:1.7;">
              Regards,<br/>
              <strong style="color:#1a202c;">${recruiterName}</strong><br/>
              <span style="color:#718096;">Human Resources &middot; ${companyName}</span>
            </p>
          </td>
        </tr>

      </table>

      <!-- Disclaimer -->
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;margin-top:16px;">
        <tr><td style="padding:0 4px;">
          <p style="font-size:11px;color:#a0aec0;margin:0;line-height:1.6;text-align:center;">
            This is a confidential communication intended solely for the addressee. Please do not forward or share.
          </p>
        </td></tr>
      </table>

    </td></tr>
  </table>
</body>
</html>`
}

export function recruiterStatusUpdateEmailHtml({
  recruiterFirstName,
  candidateName,
  jobTitle,
  companyName,
  statusLabel,
  badgeBg,
  badgeColor,
  accentColor,
  heading,
  message,
  dashboardUrl,
}: {
  recruiterFirstName: string
  candidateName: string
  jobTitle: string
  companyName: string
  statusLabel: string
  badgeBg: string
  badgeColor: string
  accentColor: string
  heading: string
  message: string
  dashboardUrl: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${heading}</title>
</head>
<body style="margin:0;padding:0;background:#F5F8FC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F5F8FC;padding:48px 16px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;width:100%;">

        <!-- Logo -->
        <tr><td style="padding-bottom:28px;">
          <span style="font-size:18px;font-weight:700;color:#032655;letter-spacing:-0.03em;">Alpha<span style="color:#0FB9B1;">Nom</span></span>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#ffffff;border:1px solid #D0DBE8;border-radius:8px;overflow:hidden;">

          <!-- Status accent bar -->
          <div style="height:3px;background:${accentColor};font-size:0;line-height:0;">&nbsp;</div>

          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">

            <!-- Header -->
            <tr><td style="padding:36px 40px 0;">
              <span style="display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;background:${badgeBg};color:${badgeColor};">${statusLabel}</span>
              <h1 style="margin:14px 0 12px;font-size:20px;font-weight:700;color:#032655;line-height:1.35;">${heading}</h1>
              <p style="margin:0;font-size:14px;color:#5A7A9F;line-height:1.7;">Hi ${recruiterFirstName}, ${message}</p>
            </td></tr>

            <!-- Divider -->
            <tr><td style="padding:24px 40px 0;"><div style="height:1px;background:#EEF3F8;"></div></td></tr>

            <!-- Candidate + Job detail row -->
            <tr><td style="padding:20px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="width:50%;padding-right:12px;vertical-align:top;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.07em;color:#96AFCA;">Candidate</p>
                    <p style="margin:0;font-size:14px;font-weight:600;color:#032655;">${candidateName}</p>
                  </td>
                  <td style="width:50%;padding-left:12px;vertical-align:top;border-left:1px solid #EEF3F8;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.07em;color:#96AFCA;">Role at ${companyName}</p>
                    <p style="margin:0;font-size:14px;font-weight:600;color:#032655;">${jobTitle}</p>
                  </td>
                </tr>
              </table>
            </td></tr>

            <!-- CTA -->
            <tr><td style="padding:28px 40px 36px;">
              <a href="${dashboardUrl}" style="display:inline-block;padding:12px 26px;background:#0FB9B1;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;border-radius:6px;">
                View in Dashboard
              </a>
            </td></tr>

          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 0 0;text-align:center;">
          <p style="margin:0;font-size:12px;color:#96AFCA;line-height:1.7;">
            AlphaNom &middot; India&rsquo;s Confidential Recruitment Network<br>
            You received this because you submitted <span style="color:#5A7A9F;">${candidateName}</span> on AlphaNom.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function otpEmailHtml(
  otp: string,
  name?: string,
  role?: 'employer' | 'recruiter',
  type?: 'signup' | 'reset' | 'change_password'
): string {
  const greeting   = name ? `Hi ${name},` : 'Hi,'
  const roleLabel  = role === 'employer' ? 'Employer' : role === 'recruiter' ? 'Recruiter' : ''
  const isReset          = type === 'reset'
  const isChangePassword = type === 'change_password'
  const title      = isChangePassword ? 'Confirm password change'
                   : isReset          ? 'Reset your password'
                   :                    'Verify your email'
  const bodyText   = isChangePassword
    ? `Use the code below to confirm the password change for your ${roleLabel} account on AlphaNom. It expires in <strong style="color:#032655;">10 minutes</strong>.`
    : isReset
    ? `Use the code below to reset your password for your ${roleLabel} account on AlphaNom. It expires in <strong style="color:#032655;">10 minutes</strong>.`
    : `Use the code below to verify your ${roleLabel} account on AlphaNom. It expires in <strong style="color:#032655;">10 minutes</strong>.`
  const safetyText = isChangePassword
    ? "If you didn't request this change, please secure your account immediately."
    : isReset
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
