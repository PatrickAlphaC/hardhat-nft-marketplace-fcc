import type { NextPage } from "next"
import GET_ACTIVE_ITEMS from "../graph-nft-marketplace/subgraphQueries"
import { useQuery } from "@apollo/client"

const GraphExample: NextPage = () => {
    const { loading, error: subgraphQueryError, data } = useQuery(GET_ACTIVE_ITEMS)
    console.log(data)
    return <div>Hi :) </div>
}
export default GraphExample
