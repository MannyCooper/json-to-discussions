import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export default NextAuth({
  secret: process.env.SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: "https://github.com/login/oauth/authorize?scope=repo"      
    }
    ),
  ],

  secret: process.env.SECRET,
  jwt: {
    encryption: true,
    secret: process.env.SECRET
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    //   signIn: '/'
  },
  callbacks: {
    async session({ session, user, token }) {
      session.accessToken = token.accessToken
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    }
  }
})