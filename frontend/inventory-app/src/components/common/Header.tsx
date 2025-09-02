import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = "Sistema de Inventarios" }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="/">
          <i className="fas fa-warehouse me-2"></i>
          {title}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>
                <i className="fas fa-tachometer-alt me-1"></i>
                Dashboard
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/products">
              <Nav.Link>
                <i className="fas fa-box me-1"></i>
                Productos
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/transactions">
              <Nav.Link>
                <i className="fas fa-exchange-alt me-1"></i>
                Transacciones
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
