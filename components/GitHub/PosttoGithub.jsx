import { GitHubContext } from '../../context/GitHubContext'
import { useContext } from 'react';

export default function PosttoGithub() {
    const { discussion, setDiscussion } = useContext(GitHubContext)
    // console.log(discussion)

    return (
        <div className="flex justify-center my-6">
        <button className="w-full btn btn-error">
            Send 🚀
        </button>
        </div>
    )

}