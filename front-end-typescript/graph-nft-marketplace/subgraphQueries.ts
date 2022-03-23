import { gql } from "@apollo/client"

// See more example queries on https://thegraph.com/explorer/subgraph/protofire/maker-protocol
const GET_ACTIVE_ITEMS = gql`
    {
        activeItems(first: 5, where: { buyer: "0x00000000" }) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`

export default GET_ACTIVE_ITEMS
