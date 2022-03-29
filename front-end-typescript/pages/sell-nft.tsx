import type { NextPage } from "next"
import { Button, Form, useNotification } from "web3uikit"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/BasicNft.json"
import networkMapping from "../constants/networkMapping.json"
import { BigNumber, ethers } from "ethers"
import { useEffect, useState } from "react"

type NetworkConfigItem = {
    NftMarketplace: string[]
}

type NetworkConfigMap = {
    [chainId: string]: NetworkConfigItem
}

const SellNft: NextPage = () => {
    const dispatch = useNotification()

    const { chainId, account } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const currentNetworkMapping = (networkMapping as NetworkConfigMap)[chainString]

    if (!currentNetworkMapping) {
        const error = `No entry in networkMapping.json matching the current chain ID of ${chainString}`
        console.error(error)
        return <div>Error: {error}</div>
    }

    const nftMarketplaceAddress = currentNetworkMapping.NftMarketplace[0]

    // @ts-ignore
    const { data, error, runContractFunction, isFetching, isLoading } = useWeb3Contract()

    const handleListItemSuccess = () => {
        dispatch({
            type: "success",
            message: "Item listed successfully",
            title: "Item Listed",
            position: "topR",
        })
    }

    async function handleApproveSuccess(nftAddress: string, tokenId: string, price: string) {
        console.log("Approve successful")

        const options = {
            abi: nftMarketplaceAbi,
            contractAddress: nftMarketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: ethers.utils.parseEther(price),
            },
        }

        await runContractFunction({
            params: options,
            onSuccess: handleListItemSuccess,
        })
    }

    async function approveAndList(formSubmission: any) {
        const [nftAddress, tokenId, price] = formSubmission.data

        const options = {
            abi: nftAbi,
            contractAddress: nftAddress.inputResult,
            functionName: "approve",
            params: {
                to: nftMarketplaceAddress,
                tokenId: tokenId.inputResult,
            },
        }

        await runContractFunction({
            params: options,
            onSuccess: () =>
                handleApproveSuccess(
                    nftAddress.inputResult,
                    tokenId.inputResult,
                    price.inputResult
                ),
        })
    }

    const [availableProceeds, setAvailableProceeds] = useState<BigNumber | undefined>(undefined)

    const fetchAvailableProceeds = async () => {
        const options = {
            abi: nftMarketplaceAbi,
            contractAddress: nftMarketplaceAddress,
            functionName: "getProceeds",
            params: {
                seller: account,
            },
        }

        const result = await runContractFunction({
            params: options,
        })

        // @ts-ignore
        console.log(result)

        setAvailableProceeds(result as BigNumber)
    }

    useEffect(() => {
        fetchAvailableProceeds()
    }, [account])

    const handleWithdraw = async () => {
        const options = {
            abi: nftMarketplaceAbi,
            contractAddress: nftMarketplaceAddress,
            functionName: "withdrawProceeds",
        }

        await runContractFunction({
            params: options,
            onSuccess: handleWithdrawSuccess,
        })
    }

    const handleWithdrawSuccess = () => {
        dispatch({
            type: "success",
            message: "Proceeds withdrawn successfully",
            title: "Proceeds Withdrawn",
            position: "topR",
        })
    }

    const hasNonZeroAvailableProceeds =
        availableProceeds !== undefined && !availableProceeds.isZero()

    return (
        <div className="container mx-auto">
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
            <div className="p-2 flex flex-col gap-2 justify-items-start w-fit">
                <h2 className="text-2xl">Withdraw proceeds</h2>
                {hasNonZeroAvailableProceeds ? (
                    <p>
                        Sales proceeds available for withdrawal:{" "}
                        {ethers.utils.formatEther(availableProceeds as BigNumber)} ЕТH
                    </p>
                ) : (
                    <p>No withdrawable proceeds detected</p>
                )}
                <Button
                    disabled={!hasNonZeroAvailableProceeds}
                    id="withdraw-proceeds"
                    onClick={handleWithdraw}
                    text="Withdraw"
                    theme="primary"
                    type="button"
                />
            </div>
        </div>
    )
}
export default SellNft
