import React, { type ReactElement } from "react";
import { Navigate, useLocation } from 'react-router';
import { useSelector } from "react-redux";

interface PrivateRouterProps {
    element: ReactElement;
}

const PrivateRouter: React.FC<PrivateRouterProps> = ({ element }) => {
    const location = useLocation();
    const { token: currentUser } = useSelector((state: any) => state.auth);

    if (!currentUser) {
        return <Navigate to="/landing" state={{ from: location }} />;
    }

    return element;
};

export default PrivateRouter;
