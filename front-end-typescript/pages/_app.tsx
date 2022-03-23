import "../styles/globals.css"
import type { AppProps } from "next/app"
import { MoralisProvider, useMoralis } from "react-moralis"
import Header from "../components/Header"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"

const APP_ID = process.env.NEXT_PUBLIC_MORALIS_APP_ID
const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.studio.thegraph.com/query/23178/graph-nft-marketplace/0.0.9",
})

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <MoralisProvider appId={APP_ID!} serverUrl={SERVER_URL!} initializeOnMount={true}>
            <ApolloProvider client={client}>
                <Header />
                <Component {...pageProps} />
            </ApolloProvider>
        </MoralisProvider>
    )
}
export default MyApp
