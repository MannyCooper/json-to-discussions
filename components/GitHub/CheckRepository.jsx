import { useSession } from "next-auth/react"
import Oauth from './Oauth'
import { useState, useContext } from 'react';
import { getRepositoryID } from '../../services/getRepositoryID'
import { GitHubContext } from '../../context/GitHubContext'

export default function CheckRepository() {
    const { data: session } = useSession()
    const [inputOwner, setInputOwner] = useState('')
    const [inputName, setInputName] = useState('')
    const [res, setRes] = useState('')
    const { setDiscussion } = useContext(GitHubContext)

    async function handleSubmit(evt) {
        evt.preventDefault()
        const res = await getRepositoryID({ owner: inputOwner, name: inputName }, session.accessToken)
        if (res.errors !== undefined) {
            setRes("❌ Invalid, wrong GitHub user/repository name")
            setDiscussion( otherValue => ({                
                ...otherValue,
                repoID: "",
                repoName: ""
        }))
        } else {
            const fullName = `${res.data.repository.owner.login}/${res.data.repository.name}`
            setRes(`✅ Valid, the repository you select is ${fullName}`)
            setDiscussion( otherValue => ({                
                    ...otherValue,
                    repoID: res.data.repository.id,
                    repoName: fullName
            }))
        }
    }

    return (

        session ?
            // <div className="shadow-xl p-4 rounded-3xl my-8">
            <div className="my-6">
                <form onSubmit={handleSubmit} className="form-control">
                    <div className="flex space-x-2 items-end justify-between">
                        <div>
                            <label className="label">
                                <span className="label-text">Your Github Name</span>
                            </label>
                            <input type="text" placeholder="GitHub Name"
                                value={inputOwner}
                                onChange={e => setInputOwner(e.target.value)}
                                className="w-full input input-primary input-bordered" />
                        </div>
                        <div>
                            <p className="text-primary text-2xl h-10">/</p>
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text">Your Repository Name</span>
                            </label>
                            <input type="text" placeholder="Repository Name"
                                value={inputName}
                                onChange={e => setInputName(e.target.value)}
                                className="w-full input input-primary input-bordered" />
                        </div>
                        <button className="btn btn-primary">check</button>
                    </div>
                </form>
                {res !== '' ? <p className="text-primary my-2">{res}</p> : ''}
            </div>
             :      
            // <div className="shadow-xl p-4 rounded-3xl my-8">      
                <div className="form-control my-6">
                    <div className="flex space-x-2 items-end justify-between">
                        <div>
                            <label className="label">
                                <span className="label-text">Your Github Name</span>
                            </label>
                            <input type="text" placeholder="You need to sign in first" disabled="disabled" className="input input-bordered" />
                        </div>
                        <div>
                            <p className="text-primary text-2xl h-10">/</p>
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text">Your Repository Name</span>
                            </label>
                            <input type="text" placeholder="You need to sign in first" disabled="disabled" className="input input-bordered" />
                        </div>
                        <button className="btn btn-disabled">check</button>
                    </div>
                    </div>
                // </div>            

    )
}