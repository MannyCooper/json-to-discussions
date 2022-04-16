import useSWR from 'swr'
import { useState } from 'react'

export default function Test() {
    // const [fetch, setFetch] = useState(false)

    // const previewFetcher = () => fetch(fetch?`/api/github`:'').then(res => res.json())
    // const { data, error } = useSWR('/api/github', previewFetcher)

    const [json, setJson] = useState('')

    function test() {
        // setFetch(true)
        // console.log(data)
        console.log('Testing')
        fetch(`/api/github`).then(res => {
        if(res.ok){
            console.log(res.json())
            setJson(res.json())
            }            
        })
    }

    return (
        <>
            <div className="btn" onClick={test}>
                Test
            </div>
            <div>
                {JSON.stringify(json)}
            </div>
        </>
    )
}