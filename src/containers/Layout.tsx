import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <div className='p-50' />
      <Footer />
    </>
  );
}

export default Layout;