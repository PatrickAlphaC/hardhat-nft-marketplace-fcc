import "../styles/globals.css"
import Head from "next/head"
import type { AppProps } from "next/app"
import { MoralisProvider } from "react-moralis"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import Layout from "../components/Layout"
import NetworkBanner from "../components/NetworkBanner"
import { NotificationProvider } from "web3uikit"

const APP_ID = process.env.NEXT_PUBLIC_MORALIS_APP_ID
const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.studio.thegraph.com/query/23178/graph-nft-marketplace/0.0.9",
})

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>NFT Marketplace</title>
                <link rel="shortcut icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider appId={APP_ID!} serverUrl={SERVER_URL!} initializeOnMount={true}>
                <ApolloProvider client={client}>
                    <NotificationProvider>
                        <NetworkBanner />
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
        </>
    )
}
export default MyApp
