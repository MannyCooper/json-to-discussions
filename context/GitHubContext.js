import { createContext } from 'react'

export const initDiscussion = {
    repoID: '',
    repoName: '',
    discussionCateID: '',
}

export const GitHubContext = createContext(initDiscussion)