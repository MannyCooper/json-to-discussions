import { useSession } from "next-auth/react"
import { getDiscussionsCate } from "../../services/getDiscussionsCate"
import { GitHubContext } from '../../context/GitHubContext'
import { useState, useContext, useEffect, useCallback } from 'react';

export default function SelectDisCate() {
    const { data: session } = useSession()
    const [categories, setCategories] = useState([])
    const [message, setMessage] = useState("")
    const { discussion, setDiscussion } = useContext(GitHubContext)
    const [category, setCategory] = useState({})

    useEffect(() => {
        handleClick()
    }, [discussion, handleClick, session.accessToken])

    const handleClick = useCallback(async () => {
        const res = await getDiscussionsCate(`repo:${discussion.repoName} fork:true`, session.accessToken)
        if (res.errors !== undefined || res.data.search.nodes.length === 0) {
            setMessage("❌ Cannot find any categories, please make sure your discussions of repository is opened")
        } else {
            const cateArray = res.data.search.nodes[0].discussionCategories.nodes
            if (cateArray.length > 0) {
                setCategories(cateArray)
            }
            else {
                setMessage("❌ This repository has no discussions")
                setCategories([])
            }
        }
    }
        , [discussion, session.accessToken])

    function handleSelect(e) {
        setDiscussion(otherValue => ({
            ...otherValue,
            discussionCateID: e.target.value,
        }))
    }

    return (
        // <div className="shadow-xl p-4 rounded-3xl my-8">
        <div className="flex justify-between items-center">
            <button className="btn btn-primary" onClick={handleClick}>
                Show Categories
            </button>
            {
                categories.length > 0 ?
                    <select className="select select-bordered select-primary w-full max-w-xs" defaultValue={"DEFAULT"} onChange={handleSelect}>
                        <option value="DEFAULT" disabled="disabled">Choose your discussions category</option>
                        {
                            categories.map(c => {
                                return (
                                    <option value={c.id} key={c.id} dangerouslySetInnerHTML={{ __html: c.emojiHTML + " " + c.name }}
                                    >
                                    </option>
                                )
                            })
                        }
                    </select> : message
            }
        </div>
        // </div>
    )
}
