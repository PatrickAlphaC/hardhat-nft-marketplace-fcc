import type { NextPage } from "next"
import { Card, Tooltip, Icon, Illustration } from "web3uikit"
import nftAbi from "../constants/BasicNft.json"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"

import {
    useMoralisWeb3Api,
    useMoralis,
    useMoralisWeb3ApiCall,
    useWeb3Contract,
} from "react-moralis"
import { Moralis } from "moralis"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ethers } from "ethers"

interface NFTBoxProps {
    price: number
    nftAddress: string
    tokenId: string
    nftMarketplaceAddress: string
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

const NFTBox: NextPage<NFTBoxProps> = ({
    price,
    nftAddress,
    tokenId,
    nftMarketplaceAddress,
}: NFTBoxProps) => {
    const { chainId } = useMoralis()
    const Web3Api = useMoralisWeb3Api()
    const [imageURI, setImageURI] = useState<string | undefined>()

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

    async function updateUI() {
        console.log(`TokenURI is: ${tokenURI}`)
        // We are cheating a bit here...
        if (tokenURI) {
            const requestURL = (tokenURI as string).replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = (tokenURIResponse as any).image
            const imageURIURL = (imageURI as string).replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURIURL)
        }
    }

    useEffect(() => {
        updateUI()
    }, [tokenURI])

    useEffect(() => {
        getTokenURI()
    }, [])

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
    async function buy() {
        await buyItem()
        console.log(tokenId)
        console.log(nftAddress)
    }

    return (
        <div className="p-2">
            <Card
                title={`${ethers.utils.formatEther(price)} ETH`}
                onClick={async () => await buy()}
            >
                <Tooltip content="Buy me" position="top">
                    {imageURI ? (
                        <Image loader={() => imageURI} src={imageURI} height="200%" width="200%" />
                    ) : (
                        <div>
                            <Illustration height="180px" logo="lazyNft" width="100%" />
                            Loading...
                        </div>
                    )}
                </Tooltip>
            </Card>
        </div>
    )
}
export default NFTBox
