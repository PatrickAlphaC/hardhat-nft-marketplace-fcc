import type { NextPage } from "next"
import { Form } from "web3uikit"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/BasicNft.json"
import networkMapping from "../constants/networkMapping.json"
import { useState } from "react"
import { ethers } from "ethers"

type NetworkConfigItem = {
    NftMarketplace: string[]
}

type NetworkConfigMap = {
    [chainId: string]: NetworkConfigItem
}

const SellNft: NextPage = () => {
    const { chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const currentNetworkMapping = (networkMapping as NetworkConfigMap)[chainString]

    if (!currentNetworkMapping) {
        const error = `No entry in networkMapping.json matching the current chain ID of ${chainString}`
        console.error(error)
        return <div>Error: {error}</div>
    }

    const nftMarketplaceAddress = currentNetworkMapping.NftMarketplace[0]
    const [nftAddress, setNftAddress] = useState("")
    const [tokenId, setTokenId] = useState(null)
    const [price, setPrice] = useState(0)

    const { runContractFunction: listItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: nftMarketplaceAddress,
        functionName: "buyItem",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            price: ethers.utils.formatEther(price.toString()),
        },
    })

    const { runContractFunction: approve } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "approve",
        params: {
            to: nftMarketplaceAddress,
            tokenId: tokenId,
        },
    })

    async function handleApproveSuccess() {
        await listItem()
    }

    async function approveAndList(data: any) {
        await approve()
        // setNftAddress(data.data[0].inputResult)
        // setTokenId(data.data[1].inputResult)
        // setPrice(data.data[2].inputResult)
        // await approve({
        //     onSuccess: await handleApproveSuccess,
        // })
    }

    return (
        <Form
            onSubmit={approveAndList}
            buttonConfig={{
                isLoading: false,
                type: "submit",
                theme: "primary",
                text: "Sell NFT!",
            }}
            data={[
                {
                    inputWidth: "50%",
                    name: "NFT Address",
                    type: "text",
                    value: "",
                    key: "nftAddress",
                },
                {
                    name: "NFT Token Id",
                    type: "number",
                    value: "",
                    key: "tokenId",
                },
                {
                    name: "Price (in ETH)",
                    type: "number",
                    value: "",
                    key: "price",
                },
            ]}
            title="Sell your NFT!"
            id="Main Form"
        />
    )
}
export default SellNft
