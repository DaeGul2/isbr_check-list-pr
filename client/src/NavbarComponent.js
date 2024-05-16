import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar, Container, Button } from 'react-bootstrap';
import './App.css'; // 또는 './index.css'

const NavbarComponent = () => {
  const navigate = useNavigate();

  return (
    <Navbar bg="light" expand="lg" fixed="top">
      <Container className="d-flex justify-content-between align-items-center">
        <Button variant="outline-primary" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i>
        </Button>
        
        <div className="navbar-center">
          <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="navbar-logo" />
          <Navbar.Brand as={Link} to="/" className="mx-auto">
            인사바른 Check-List
          </Navbar.Brand>
        </div>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
