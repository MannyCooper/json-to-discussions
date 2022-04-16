import Oauth from '../components/GitHub/Oauth'
import CheckRepository from '../components/GitHub/CheckRepository'
import SelectDisCate from '../components/GitHub/SelectDisCate'
import PosttoGithub from '../components/GitHub/PosttoGithub'
import { useState } from 'react'
import { GitHubContext, initDiscussion } from '../context/GitHubContext'
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function Github() {

    const [discussion, setDiscussion] = useState(initDiscussion)
    const { data: session } = useSession()

    return (
        <div className="hero min-h-screen">
            <div className="hero-container">
                <Link href="/" passHref>
                    <button className="btn btn-warning mb-4">Back</button>
                </Link>
                <h1 className="mb-5 text-5xl font-bold text-center">Submit to Discussions 🤖️</h1>
                <ul className="w-full steps my-6">
                    <li className="step step-primary">Read</li>
                    <li className="step step-primary">Format</li>
                    <li className="step step-primary">Authorize</li>
                    <li className={`step ${session ? 'step-primary' : ''}`}>Submit</li>
                </ul>
                <Oauth />
                <GitHubContext.Provider value={{ discussion, setDiscussion }} >
                    <CheckRepository />
                    {discussion.repoID !== "" && <>
                        <SelectDisCate />
                    </>}
                    {discussion.discussionCateID !== "" && <>
                        <PosttoGithub />
                    </>}
                </GitHubContext.Provider>
            </div>
        </div>
    )
}