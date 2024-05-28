import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';

function LayoutPage() {
  return (
    <div className="flex flex-col overflow-y-auto justify-center w-screen h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-y-auto md:overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default LayoutPage;
