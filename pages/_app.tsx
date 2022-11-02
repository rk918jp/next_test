import "../styles/globals.css"
import App, { AppContext, AppProps } from 'next/app'
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
import { logger } from '../logger'

const cache = createCache({
    key: "css",
    prepend: true,
})

// 未認証でログインページに遷移させる
const NeedLogin: FC = (props) => {
    const router = useRouter()
    const { status, data } = useSession()
    // 未認証かつログインページでないならリダイレクト
    React.useEffect(() => {
        if (
            status !== "loading" &&
            !data &&
            !["/login"].includes(router.pathname)
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

const MyApp = ({
    Component,
    pageProps: { session, ...pageProps },
} : AppProps): ReactElement => {

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
MyApp.getInitialProps = async (context: AppContext) => {
    const pageProps = await App.getInitialProps(context);
    const req = context?.ctx?.req;
    if (req) {
        const ip = req.headers["x-real-ip"] || req.connection.remoteAddress;
        logger.info(`${req.method} ${req.url} ${ip}`)
    }

    return pageProps;
}
export default MyApp
