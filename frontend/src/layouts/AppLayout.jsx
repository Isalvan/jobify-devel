import { Outlet } from "react-router-dom";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import Breadcrumbs from "../components/common/Breadcrumbs";

function AppLayout() {
    return (
        <>
            <Header />
            <main>
                <Breadcrumbs />
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

export default AppLayout;