import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            type: "credentials",
            credentials: {
                userId: {
                    label: "userId",
                    type: "text",
                },
                password: {
                    label: "password",
                    type: "password",
                },
            },
            authorize: async (credentials: any) => {
                // 認証サーバーへリクエストするイメージ
                const data = await new Promise<{
                    status: "ok" | "ng"
                    userId: string
                    name?: string
                    email?: string
                }>((resolve) => {
                    const { userId, password } = credentials
                    if (userId === "user01" && password === "test") {
                        // ログイン成功の想定
                        resolve({
                            status: "ok",
                            userId,
                            name: "USER_01",
                            email: "hoge@fuga.com",
                        })
                    } else {
                        // ログイン失敗の想定
                        resolve({
                            status: "ng",
                            userId,
                        })
                    }
                })

                if (data?.status === "ok") {
                    return Promise.resolve({
                        id: data.userId,
                        name: data.name,
                        userId: data.userId,
                        email: data.email,
                        status: data.status,
                    })
                } else {
                    throw new Error(data?.status)
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        // eslint-disable-next-line
        async jwt({ user, token, account }) {
            if (user?.id) {
                token.userId = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user && token.userId) {
                session.user.userId = token.userId as string
            }
            return session
        },
    },
    debug: true,
})
