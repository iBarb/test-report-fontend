import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Landing from '../features/landing/page/Landing';
import Login from '@/features/auth/pages/Login';
import Register from '@/features/auth/pages/Register';
import PrivateRouter from './PrivateRouter';
import PublicRouter from './PublicRouter';
import Layout from '@/components/layout/Layout';
import ProjectList from '@/features/projects/page/ProjectList';
import ProjectDetail from '@/features/projects/page/ProjectDetail';
import ReportDefail from '@/features/reports/page/ReportDefail';

const AppRouter: React.FC = () => {

    const router = createBrowserRouter([
        {
            path: '/landing',
            element: <PublicRouter element={<Landing />} />,
        },
        {
            path: '/login',
            element: <PublicRouter element={<Login />} />,
        },
        {
            path: '/register',
            element: <PublicRouter element={<Register />} />,
        },
        {
            path: '/',
            element: <PrivateRouter element={<Layout />} />,
            children: [
                {
                    path: '/',
                    element: <ProjectList />,
                },
                {
                    path: '/projects/:id',
                    element: < ProjectDetail />,
                },
                {
                    path: '/projects/:id/reports/:reportId',
                    element: <ReportDefail />,
                }
            ]

        }
    ]);

    return (
        <RouterProvider router={router} />
    );
};

export default AppRouter;