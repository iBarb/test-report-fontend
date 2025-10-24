import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { notifService } from "@/lib/notificationServiceInstance";
import { useEffect } from "react";
import { queryClient } from "@/lib/queryClient";


const Layout = () => {

    useEffect(() => {
        const unsubscribe = notifService.onReportCompleted(() => {
            queryClient.invalidateQueries();
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar fijo arriba */}
            <Navbar />

            {/* Contenido dinámico */}
            <div className="flex-1"
            >
                <Outlet />
            </div>

            {/* Footer abajo */}
            <Footer />
        </div>
    );
};

export default Layout;
