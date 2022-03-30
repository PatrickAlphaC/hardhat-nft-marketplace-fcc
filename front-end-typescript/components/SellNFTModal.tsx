import { Modal, useNotification, Input, Illustration } from "web3uikit"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import Image from "next/image"

export interface SellNFTModalProps {
    isVisible: boolean
    onClose: () => void
    nftAbi: object
    nftMarketplaceAbi: object
    nftMarketplaceAddress: string
    nftAddress: string
    tokenId: string
    imageURI: string | undefined
}

export const SellNFTModal = ({
    isVisible,
    onClose,
    nftAbi,
    nftMarketplaceAbi,
    nftMarketplaceAddress,
    nftAddress,
    tokenId,
    imageURI
}: SellNFTModalProps) => {
    const dispatch = useNotification()
    const [priceToListWith, setPriceToListWith] = useState<string | undefined>()

    // @ts-ignore
    const { data, error, runContractFunction, isFetching, isLoading } = useWeb3Contract()

    const handleListItemSuccess = () => {
        dispatch({
            type: "success",
            message: "Item listed successfully",
            title: "Item Listed",
            position: "topR",
        })
        onClose && onClose()
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

    async function approveAndList() {
        if (!priceToListWith) {
            console.error("listing price not set")
            return
        }

        const options = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: nftMarketplaceAddress,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: options,
            onSuccess: () => handleApproveSuccess(nftAddress, tokenId, priceToListWith),
        })
    }

    return (
        <Modal
            isVisible={isVisible}
            id="regular"
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={approveAndList}
            title="NFT Details"
            okText="Create Listing"
            cancelText="Cancel"
            isOkDisabled={!priceToListWith}
        >
            <div
                style={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                <div className="flex flex-col items-center gap-4">
                    <p className="p-4 text-lg">
                        Create a listing to allow others to purchase your NFT.
                    </p>
                    <div className="flex flex-col items-end gap-2 border-solid border-2 border-gray-400 rounded p-2 w-fit">
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
                    </div>
                    <Input
                        label="Set listing price"
                        name="Listing price"
                        onChange={(event) => {
                            setPriceToListWith(event.target.value)
                        }}
                        type="number"
                    />
                </div>
            </div>
        </Modal>
    )
}
