//To generate your own kind NFT, put the image in /img/nft-imgs and then run this script
//Now go to /constans/token-URIs.json and pick the IPFS string and then put it into BasicNft.sol

const { storeImages, storeTokeUriMetadata } = require("../utils/uploadToPinata")
const fs = require("fs")
const { uriContracts } = require("../helper-hardhat-config")

const imagesLoc = "./img/nft-imgs"

const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_type: "Cuteness",
            value: 100,
        },
    ],
}

async function handleTokenUris() {
    tokenUris = []

    const { responses: imageUploadResponses, files } = await storeImages(imagesLoc)
    for (imageUploadResponseIndex in imageUploadResponses) {
        let tokenUriMetadata = { ...metadataTemplate }
        tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "")
        tokenUriMetadata.description = `An awesome ${tokenUriMetadata.name}, looking Yoooo!`
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
        console.log(`Uploading ${tokenUriMetadata.name}...`)
        const metadataUploadResponse = await storeTokeUriMetadata(tokenUriMetadata)
        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    console.log("Token URIs uploaded! They are:")
    console.log(tokenUris)
    console.log("Writting into file...")
    const tokenUriFile = JSON.parse(fs.readFileSync(uriContracts, "utf8"))
    console.log(tokenUriFile)
    tokenUriFile["tokenURIs"] = tokenUris
    fs.writeFileSync(uriContracts, JSON.stringify(tokenUriFile))
    console.log("Writting done!")
}

handleTokenUris()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
