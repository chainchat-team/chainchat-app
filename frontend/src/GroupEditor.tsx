import * as React from "react"
import SyncingEditor from "./SyncingEditor"
import { useLoaderData } from "react-router-dom"

type PropsType = { id: string }
export async function loader({ params }) {
    return params
}

const GroupEditor = () => {
    const params = useLoaderData()
    console.log(params)
    return (
        <div>
            <SyncingEditor groupId={params.id} />
        </div>
    )
}


export default GroupEditor;