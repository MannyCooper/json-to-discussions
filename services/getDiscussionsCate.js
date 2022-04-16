import { GITHUB_GRAPHQL_API_URL } from './config'

export async function getDiscussionsCate(params, token) {
    const query = params;
    const REPOSITORY_QUERY = `
        query getDisCate($query: String!) {
            search(type: REPOSITORY query: $query  first:1) {
            nodes {
                ... on Repository {
                id
                discussionCategories(first: 100) {
                    nodes {
                    id
                    name
                    emojiHTML
                    }
                }
                }
            }
            }
        }      
    `

    return fetch(GITHUB_GRAPHQL_API_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
            query: REPOSITORY_QUERY,
            variables: {
                query
            }
        })
    }).then(response => response.json())

}