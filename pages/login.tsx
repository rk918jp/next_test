import { NextPage } from "next"
import { literals } from "../src/ui/Literals"
import Header from "../components/Header"
import React, { MouseEvent } from "react"
import { Link, Paper } from "@mui/material"
import Page from "../components/Page"
import styles from "../styles/Landing.module.scss"
import { signIn, signOut, useSession } from "next-auth/react"
import { scroller } from "react-scroll"
import { logger } from '../logger'

const Login: NextPage = () => {
    const [userId, setUserId] = React.useState<string | undefined>()
    const [password, setPassword] = React.useState<string | undefined>()
    const session = useSession()
    console.log(session)
    logger.info("test");

    const scrollTo = <T,>(
        event: MouseEvent<T>,
        destination: "subscribe" | "components" | "about"
    ) => {
        event.preventDefault()
        const navbarHeight = 50
        scroller.scrollTo(destination, {
            smooth: "easeInOutQuad",
            offset: -navbarHeight,
        })
    }

    const createNavBar = () => {
        return (
            <div className={styles.divRow}>
                <Link href="/blog" className={styles.navbarLink}>
                    Blog
                </Link>
            </div>
        )
    }
    return (
        <Page
            title={literals.brand}
            description={literals.defaultPageDescription}
            slideNavbar={true}
            navbarLinks={createNavBar()}
            header={
                <Header
                    onClick={(e) => scrollTo(e, "subscribe")}
                    navbarLinks={createNavBar()}
                />
            }
        >
            <Paper sx={{ margin: 5 }}>
                <input
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    onClick={() => {
                        signIn("credentials", {
                            userId,
                            password,
                            callbackUrl: "/",
                        })
                    }}
                >
                    login
                </button>
                <button
                    onClick={() => {
                        signOut()
                    }}
                >
                    logout
                </button>
            </Paper>
        </Page>
    )
}

export default Login
