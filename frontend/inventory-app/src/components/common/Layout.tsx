import React from 'react';
import { Container } from 'react-bootstrap';
import { Header } from './Header';
import { ToastContainer } from 'react-toastify';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <>
      <Header title={title} />
      <Container>
        <main>
          {children}
        </main>
      </Container>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};