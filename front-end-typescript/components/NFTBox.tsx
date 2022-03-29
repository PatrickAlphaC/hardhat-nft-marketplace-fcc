import type { NextPage } from "next"
import { Card, Tooltip, Illustration, Modal } from "web3uikit"
import nftAbi from "../constants/BasicNft.json"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"

import {
    useMoralisWeb3Api,
    useMoralis,
    useMoralisWeb3ApiCall,
    useWeb3Contract,
} from "react-moralis"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ethers } from "ethers"

interface NFTBoxProps {
    price: number
    nftAddress: string
    tokenId: string
    nftMarketplaceAddress: string
    seller: string
}

// type chainType =
//     | "eth"
//     | "0x1"
//     | "ropsten"
//     | "0x3"
//     | "rinkeby"
//     | "0x4"
//     | "goerli"
//     | "0x5"
//     | "kovan"
//     | "0x2a"
//     | "polygon"
//     | "0x89"
//     | "mumbai"
//     | "0x13881"
//     | "bsc"
//     | "0x38"
//     | "bsc testnet"
//     | "0x61"
//     | "avalanche"
//     | "0xa86a"
//     | "avalanche testnet"
//     | "0xa869"
//     | "fantom"
//     | "0xfa"
//     | undefined

// type tokenIdMetadataParams = {
//     chain: chainType
//     address: string
//     token_id: string
// }

const truncateStr = (fullStr: string, strLen: number) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."

    var sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow / 2),
        backChars = Math.floor(charsToShow / 2)

    return (
        fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars)
    )
}

const NFTBox: NextPage<NFTBoxProps> = ({
    price,
    nftAddress,
    tokenId,
    nftMarketplaceAddress,
    seller,
}: NFTBoxProps) => {
    const { isWeb3Enabled, account } = useMoralis()
    const Web3Api = useMoralisWeb3Api()
    const [imageURI, setImageURI] = useState<string | undefined>()
    const [tokenName, setTokenName] = useState<string | undefined>()
    const [tokenDescription, setTokenDescription] = useState<string | undefined>()

    const { runContractFunction: getTokenURI, data: tokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: nftMarketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    })

    const { runContractFunction: cancelListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: nftMarketplaceAddress,
        functionName: "cancelListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    })

    async function updateUI() {
        console.log(`TokenURI is: ${tokenURI}`)
        // We are cheating a bit here...
        if (tokenURI) {
            const requestURL = (tokenURI as string).replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = (imageURI as string).replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
    }

    useEffect(() => {
        updateUI()
    }, [tokenURI])

    useEffect(() => {
        isWeb3Enabled && getTokenURI()
    }, [isWeb3Enabled])

    // These only work on valid chains, sorry - doesn't work locally
    // const options: tokenIdMetadataParams = {
    //     chain: chainId!.toString() as chainType,
    //     address: nftAddress,
    //     token_id: tokenId.toString(),
    // }

    // const { fetch, data, error, isLoading } = useMoralisWeb3ApiCall(
    //     Web3Api.token.getTokenIdMetadata,
    //     options
    // )
    // const getTokenIdMetadata = async () => {
    //     try {
    //         const result = await Web3Api.token.getTokenIdMetadata(options)
    //         console.log(result)
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    const isOwnedByUser = seller === account
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller, 15)

    const handleCardClick = () => (isOwnedByUser ? setShowCancelListingModal(true) : buyItem())

    const [showCancelListingModal, setShowCancelListingModal] = useState(false)

    const hideCancelListingModal = () => setShowCancelListingModal(false)

    const handleCancelListingSuccess = () => setShowCancelListingModal(false)

    return (
        <div className="p-2">
            <Modal
                isVisible={showCancelListingModal}
                id="regular"
                onCancel={hideCancelListingModal}
                onCloseButtonPressed={hideCancelListingModal}
                onOk={() =>
                    cancelListing({
                        onSuccess: () => handleCancelListingSuccess(),
                    })
                }
                title="NFT Details"
                okText="Cancel listing"
                cancelText="Leave it"
                okButtonColor="red"
            >
                <div
                    style={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <div className="flex flex-col items-end gap-2 border-solid border-2 border-gray-400 rounded p-2">
                        <div>#{tokenId}</div>
                        {imageURI ? (
                            <Image
                                loader={() => imageURI}
                                src={imageURI}
                                height="200"
                                width="200"
                            />
                        ) : (
                            <Illustration height="180px" logo="lazyNft" width="100%" />
                        )}
                        <div className="font-bold">{ethers.utils.formatEther(price)} ETH</div>
                    </div>
                    <p className="p-4 text-lg">
                        This is your listing. Would you like to cancel it?
                    </p>
                </div>
            </Modal>
            <Card title={tokenName} description={tokenDescription} onClick={handleCardClick}>
                <Tooltip content={isOwnedByUser ? "Cancel listing" : "Buy me"} position="top">
                    <div className="p-2">
                        {imageURI ? (
                            <div className="flex flex-col items-end gap-2">
                                <div>#{tokenId}</div>
                                <div className="italic text-sm">
                                    Owned by {formattedSellerAddress}
                                </div>
                                <Image
                                    loader={() => imageURI}
                                    src={imageURI}
                                    height="200"
                                    width="200"
                                />
                                <div className="font-bold">
                                    {ethers.utils.formatEther(price)} ETH
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-1">
                                <Illustration height="180px" logo="lazyNft" width="100%" />
                                Loading...
                            </div>
                        )}
                    </div>
                </Tooltip>
            </Card>
        </div>
    )
}
export default NFTBox
