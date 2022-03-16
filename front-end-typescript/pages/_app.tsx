import "../styles/globals.css"
import type { AppProps } from "next/app"
import { MoralisProvider, useMoralis } from "react-moralis"
import Header from "../components/Header"

const APP_ID = process.env.NEXT_PUBLIC_MORALIS_APP_ID
const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <MoralisProvider appId={APP_ID!} serverUrl={SERVER_URL!} initializeOnMount={true}>
            <Header />
            <Component {...pageProps} />
        </MoralisProvider>
    )
}
export default MyApp
