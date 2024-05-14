// src/components/NavbarComponent.js
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useState } from 'react';

const NavbarComponent = () => {
  const navigate = useNavigate();
  

  return (
    <Navbar bg="light" expand="lg" fixed="top">
      <Container>
        <Button variant="outline-primary" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i> 뒤로
        </Button>
        <img src="client\public\logo.png"></img>
        <Navbar.Brand as={Link} to="/" className="mx-auto">
          인사바른 Check-List
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
