import type { NextPage } from "next"
import { useMoralis, useMoralisQuery } from "react-moralis"
import { useEffect, useState } from "react"
import NFTBox from "../components/NFTBox"
import networkMapping from "../constants/networkMapping.json"
import { BannerStrip } from "web3uikit"

const PAGE_SIZE = 9

const isValidNetwork = (network: string) => {
    if (networkMapping.hasOwnProperty(network)) {
        return true
    }
    return false
}

const Home: NextPage = () => {
    // TODO: Implement paging in UI
    const [page, setPage] = useState(1)

    const { Moralis, isAuthenticated, web3, isWeb3Enabled } = useMoralis()

    const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
        "ActiveItem",
        (query) =>
            query
                .limit(PAGE_SIZE)
                .descending("tokenId")
                .skip((page - 1) * PAGE_SIZE)
    )

    const [currentChainId, setCurrentChainId] = useState<number | undefined>(undefined)

    const getChainId = async () => {
        if (isAuthenticated && isWeb3Enabled && web3) {
            const network = await web3.getNetwork()
            setCurrentChainId(network.chainId ?? 0)
        }
        return 0
    }

    useEffect(() => {
        getChainId()
    }, [isAuthenticated, isWeb3Enabled])

    Moralis.onChainChanged(() => {
        window.location.reload()
    })

    const [showNetworkSwitcherDialog, setShowNetworkSwitcherDialog] = useState(false)

    useEffect(() => {
        if (
            currentChainId === undefined ||
            isValidNetwork(currentChainId ? currentChainId?.toString() : "")
        ) {
            setShowNetworkSwitcherDialog(false)
        } else {
            setShowNetworkSwitcherDialog(true)
        }
    }, [currentChainId])

    return (
        <>
            {showNetworkSwitcherDialog && (
                <BannerStrip type="error" text="Connected to unsupported network" />
            )}
            <div className="container mx-auto">
                <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
                <div className="flex flex-wrap">
                    {fetchingListedNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.map((nft /*, index*/) => (
                            <NFTBox
                                price={nft.attributes.price}
                                nftAddress={nft.attributes.nftAddress}
                                tokenId={nft.attributes.tokenId}
                                nftMarketplaceAddress={nft.attributes.address}
                                key={`${nft.attributes.nftAddress}${nft.attributes.tokenId}`}
                            />
                        ))
                    )}
                </div>
            </div>
        </>
    )
}
export default Home
