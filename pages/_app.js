import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"
import Layout from '../components/layout'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react'
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    AOS.init({
      easing: "ease-in-out-cubic",
      // once: true,
      // offset: 50,
    });
  }, []);
  

  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>)
}

export default MyApp
