
// import { Outlet } from 'react-router-dom';
// import './App.css';
import Footer from './Footer';
import Navbar from './Navbar';
import { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}
function RootLayout({ children }: RootLayoutProps) {
  return (
   <>
    <Navbar/>
    <main className="flex flex-col justify-center items-center w-full bg-gray-100 min-h-screen">
       {children}
      </main>
    <Footer/>
   </>
  )
}

export default RootLayout;