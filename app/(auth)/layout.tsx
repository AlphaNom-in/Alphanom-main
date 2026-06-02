import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/footer"



export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>  <body>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </body></>
}