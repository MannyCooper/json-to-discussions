/* eslint-disable import/no-anonymous-default-export */
import { getSession } from 'next-auth/react'

export default async (req, res) => {
  const session = await getSession({ req })
  let accessToken = session.accessToken;

  if (session) {
    fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: `
        mutation addReply($body: String!, $discussionId: ID!, $replyToId: ID!) {
          addDiscussionReply: addDiscussionComment(input: {body: $body, discussionId: $discussionId, replyToId: $replyToId}) {
            reply: comment {
              id
              author {
                avatarUrl
                login
                url
              }
              viewerDidAuthor
              createdAt
              url
              authorAssociation
              lastEditedAt
              deletedAt
              isMinimized
              bodyHTML
              reactionGroups {
                content
                users {
                  totalCount
                }
                viewerHasReacted
              }
              replyTo {
                id
              }
            }
          }
        }
      `,
      variables: {
        "input": {
          "repositoryId": "R_kgDOGtIyjw",
          "title": "GraphQL_test",
          "body": "test from GraphQL API",
          "categoryId": "DIC_kwDOGtIyj84CAxTy"
        },
        "query": "repo:MannyCooper/giscus-discussions fork:true",
        "body": "test reply from graphQL",
        "discussionId": "D_kwDOGtIyj84AOmpA",
        "replyToId": "DC_kwDOGtIyj84AHv-J"
      }
      }),
    })
      .then((res) => res.json())
      .then((result) => res.send(result));
  } else {
    res.send({ error: 'You must be sign in.' })
  }
}