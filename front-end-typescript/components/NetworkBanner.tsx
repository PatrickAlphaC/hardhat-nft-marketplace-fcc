import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import networkMapping from "../constants/networkMapping.json"
import { BannerStrip } from "web3uikit"

const isValidNetwork = (network: string) => {
    if (networkMapping.hasOwnProperty(network)) {
        return true
    }
    return false
}

const NetworkBanner = () => {

    const { Moralis, isAuthenticated, web3, isWeb3Enabled } = useMoralis()

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
        </>
    )
}

export default NetworkBanner