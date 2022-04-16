import { GITHUB_GRAPHQL_API_URL } from './config'

export async function getRepositoryID(params, token) {
    const { owner, name } = params;
    const REPOSITORY_QUERY = `
        query getRepositoryID {
            repository(owner:"${owner}",name:"${name}") {
            id
            name
            owner {
                id
                login
            }
            }
        }      
    `

    return fetch(GITHUB_GRAPHQL_API_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
            query: REPOSITORY_QUERY            
        })
     }).then(response => response.json())

}