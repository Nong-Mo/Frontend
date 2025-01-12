import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthListener } from '../../hooks/useAuthListner';

const MainLayout = () => {
    useAuthListener();
    return (
        <div className="flex justify-center min-h-screen">
            <main className="content-container flex justify-center w-[414px] h-[852px] relative bg-white overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;