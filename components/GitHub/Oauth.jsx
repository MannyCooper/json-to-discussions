import { useSession, signIn, signOut } from "next-auth/react"

export default function Oauth() {
    const { data: session, status } = useSession()
    const loading = status === "loading"
    return (
        <div className="shadow-xl flex my-8 flex-row bg-primary items-center justify-between rounded-3xl p-4 text-white space-x-5">
                {!session && (
                    <>
                        <span >
                            You are not signed in
                        </span>
                        <a
                            className="btn"
                            // href={`/api/auth/signin`}
                            onClick={(e) => {
                                e.preventDefault()
                                signIn('github')
                            }}
                        >
                            Sign in
                        </a>
                    </>
                )}
                {session && (
                    <>
                    <div className="flex space-x-4 items-center">
                        {session.user.image && (
                            <img className="h-16 w-16 rounded-xl" src={session.user.image} alt="avatar" />
                        )}
                        <span className="">
                            <span>Signed in as</span>
                            <br />
                            <span className="font-bold">{session.user.email || session.user.name}</span>
                        </span>
                        </div>
                        <a
                            href={`/api/auth/signout`}
                            className="btn btn-primary btn-outline bg-white"
                            onClick={(e) => {
                                e.preventDefault()
                                signOut()
                            }}
                        >
                            Sign out
                        </a>
                    </>
                )}
        </div>
    )
}