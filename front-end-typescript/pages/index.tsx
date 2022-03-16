import type { NextPage } from "next"
import { useMoralisQuery } from "react-moralis"
import { useState } from "react"
import NFTBox from "../components/NFTBox"

const PAGE_SIZE = 9

const Home: NextPage = () => {
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
        <div>
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className="grid grid-cols-3">
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
    )
}
export default Home
