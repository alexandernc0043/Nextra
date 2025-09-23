import {Footer, Layout, Navbar} from 'nextra-theme-docs'
import {Banner, Head, Search} from 'nextra/components'
import {getPageMap} from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import {Analytics} from '@vercel/analytics/next'
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'
import type {ReactNode} from 'react'

export const metadata = {
    // Define your metadata here
    // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
}
const authControls = (
  <div style={{display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', padding: '0.75rem 1rem'}}>
    <SignedOut>
      <div style={{display: 'flex', gap: '0.75rem'}}>
        <SignInButton mode="modal">
          <button type="button" style={{padding: '0.4rem 0.9rem', borderRadius: '0.5rem', border: '1px solid rgba(0,0,0,0.1)'}}>
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button type="button" style={{padding: '0.4rem 0.9rem', borderRadius: '0.5rem', border: '1px solid rgba(0,0,0,0.1)'}}>
            Sign up
          </button>
        </SignUpButton>
      </div>
    </SignedOut>
    <SignedIn>
      <UserButton afterSignOutUrl="/"/>
    </SignedIn>
  </div>
)
const banner = <Banner storageKey="some-key" dismissible={false}>WORK IN PROGRESS PAGE</Banner>
const navbar = (
    <Navbar
        logo={<b>Alexander Prechtel's Instructions</b>}
        // ... Your additional navbar options
        projectLink={'https://github.com/alexandernc0043/Nextra'}
    >{authControls}</Navbar>
)
const footer = <Footer>MIT {new Date().getFullYear()} © Alexander Prechtel.</Footer>



export default async function RootLayout({children}: {children: ReactNode}) {
    return (
        <ClerkProvider>
            <html
                // Not required, but good for SEO
                lang="en"
                // Required to be set
                dir="ltr"
                // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
                suppressHydrationWarning
            >
            <Head
                // ... Your additional head options
            >
                <Analytics/>
                {/* Your additional tags should be passed as `children` of `<Head>` element */}
            </Head>
            <body data-pagefind-body>
            
            <Layout
                banner={banner}
                navbar={navbar}
                pageMap={await getPageMap()}
                docsRepositoryBase="https://github.com/alexandernc0043/Nextra/tree/main"
                footer={footer}
                search={<Search placeholder={"Search Instructions"}/>}
                // ... Your additional layout options
            >
                {children}
            </Layout>
            </body>
            </html>
        </ClerkProvider>
    )
}
