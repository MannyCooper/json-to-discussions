import Oauth from '../components/GitHub/Oauth'
import FilePicker from '../components/JSON/FilePicker'
import FormatData from '../components/JSON/FormatData'
import { useSession } from "next-auth/react"
import { JSONContext, initJSON } from '../context/JSONContent'
import { useState, useEffect } from 'react'

export default function Home() {
    const { data: session } = useSession()
    const [jsonData, setJsonData] = useState(initJSON)
    const [render, setRender] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            if (jsonData.rawData.length > 0) {
                setRender(false)
            } else {
                setRender(true)
            }
        }, 500)
    }, [jsonData])

    return (
        <div className="min-h-screen hero">
            <div className="flex flex-col items-center justify-center hero-container">
                <h1 className="my-5 text-5xl font-bold text-center">Json-to-Discussions💬</h1>
                <ul className="w-full my-6 steps">
                    <li className="step step-primary">Read</li>
                    <li className={`step ${render?'':'step-primary'}`}>Format</li>
                    <li className="step">Authorize</li>
                    <li className="step">Submit</li>
                </ul>

                <div className="container max-w-lg px-4 md:px-0">
                <JSONContext.Provider value={{ jsonData, setJsonData }}>
                    {
                        render ? <FilePicker /> :
                            <FormatData />
                    }
                </JSONContext.Provider>
                </div>
                {/* <Oauth />
                {
                    session ? 
                    <div className="flex space-x-4">
                    <FilePicker />
                    <Test /> 
                    </div>
                    : <></>
                } */}
            </div>
        </div>
    )
}