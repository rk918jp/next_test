import "../styles/globals.css"
import { AppProps } from "next/app"
import React, { FC, ReactElement } from "react"
import { StyledEngineProvider } from "@mui/material/styles"
import { Provider as ReduxProvider } from "react-redux"
import { store } from "../src/ui/redux/store"
import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import ChangeTheme from "../components/ChangeTheme"
import { CssBaseline } from "@mui/material"
import { SessionProvider, useSession } from "next-auth/react"
import { useRouter } from "next/router"

const cache = createCache({
    key: "css",
    prepend: true,
})

// 未認証でログインページに遷移させる
const NeedLogin: FC = (props) => {
    const router = useRouter()
    const { status, data } = useSession({ required: true })
    // 未認証かつログインページでないならリダイレクト
    React.useEffect(() => {
        if (
            status !== "loading" &&
            !data &&
            ["/login"].includes(router.pathname)
        ) {
            router.push("/login")
        }
    }, [status, data])

    // ローディング中はローディング表示
    if (status === "loading") {
        return <>loading...</>
    }
    return <>{props.children}</>
}

const MyApp: FC<AppProps> = ({
    Component,
    pageProps: { session, ...pageProps },
}): ReactElement => {
    return (
        <StyledEngineProvider injectFirst>
            <CacheProvider value={cache}>
                <ChangeTheme>
                    <CssBaseline />
                    <SessionProvider session={session}>
                        <ReduxProvider store={store}>
                            <NeedLogin>
                                <Component {...pageProps} />
                            </NeedLogin>
                        </ReduxProvider>
                    </SessionProvider>
                </ChangeTheme>
            </CacheProvider>
        </StyledEngineProvider>
    )
}
export default MyApp
