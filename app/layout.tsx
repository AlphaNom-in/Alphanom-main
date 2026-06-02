import './globals.css'
import { Plus_Jakarta_Sans, Fraunces } from 'next/font/google'


/*
  FONT SETUP
  Fraunces        → --font-display  (logo italic + hero headline only)
  Plus Jakarta Sans → --font-ui     (everything else on the site)

  NOTE: Fraunces uses weight:'variable' because it's a variable font.
  axes can only be used with variable fonts — fixed here.
*/

const plusJakarta = Plus_Jakarta_Sans({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600', '700', '800'],
  style:    ['normal', 'italic'],
  variable: '--font-ui',
  display:  'swap',
})

// Fraunces is a variable font — do NOT set weight array, use 'variable'
const fraunces = Fraunces({
  subsets:  ['latin'],
  weight:   'variable',
  style:    ['normal', 'italic'],
  variable: '--font-display',
  display:  'swap',
})

export const metadata = {
  title:       "AlphaNom — India's Premium Recruitment Platform",
  description: 'Connecting top employers with elite specialist recruiters across India.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${fraunces.variable}`}>
    <body>
       <main>{children}</main>
    </body>
       
     
    </html>
  )
}