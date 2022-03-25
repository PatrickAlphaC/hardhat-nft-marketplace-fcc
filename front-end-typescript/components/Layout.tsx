import Header from "./Header"

const Layout = ({ children }: any) => {

    return (
        <>
            <Header />
            <main>{children}</main>
        </>
    )
}

export default Layout
