import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Footer from "./Footer"; // Asegúrate de que la ruta sea correcta

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Footer /> 
    </SessionProvider>
  );
}
