import React, { type ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router';

interface PublicRouterProps {
    element: ReactElement; // el componente que vas a renderizar
}

const PublicRouter: React.FC<PublicRouterProps> = ({ element }) => {
    const location = useLocation();

    const { token: currentUser } = useSelector((state: any) => state.auth);

    const previousURL: string = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

    return !currentUser ? element : <Navigate to={previousURL} />;
};

export default PublicRouter;
