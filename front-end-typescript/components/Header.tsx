import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
            <Link href="/">
                <a>
                    <h1 className="py-4 px-4 font-bold text-3xl">NFT Marketplace</h1>
                </a>
            </Link>
            <div className="flex flex-row items-center">
                <Link href="/">
                    {/* Home is going to be the recent listings page */}
                    <a className="mr-4 p-6">Home</a>
                </Link>
                <Link href="/sell-nft">
                    {/* This is going to include cancel listings, update listings, and withdraw proceeds */}
                    <a className="mr-4 p-6">Sell NFTs</a>
                </Link>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
