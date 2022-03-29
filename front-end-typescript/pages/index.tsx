import type { NextPage } from "next"
import { useMoralis, useMoralisQuery } from "react-moralis"
import { useEffect, useState } from "react"
import NFTBox from "../components/NFTBox"

const PAGE_SIZE = 9

const Home: NextPage = () => {
    // TODO: Implement paging in UI
    const [page, setPage] = useState(1)

    const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
        "ActiveItem",
        (query) =>
            query
                .limit(PAGE_SIZE)
                .descending("tokenId")
                .skip((page - 1) * PAGE_SIZE)
    )

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
                {fetchingListedNfts ? (
                    <div>Loading...</div>
                ) : (
                    listedNfts.map((nft /*, index*/) => {
                        const { price, nftAddress, tokenId, address, seller } = nft.attributes

                        return (
                            <NFTBox
                                price={price}
                                nftAddress={nftAddress}
                                tokenId={tokenId}
                                nftMarketplaceAddress={address}
                                seller={seller}
                                key={`${nftAddress}${tokenId}`}
                            />
                        )
                    })
                )}
            </div>
        </div>
    )
}
export default Home
