import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const Navigation: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to={isAdmin() ? '/admin' : '/dashboard'}>
          Quiz Master
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {isAdmin() ? (
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/admin">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/admin/users">Users</Nav.Link>
              <Nav.Link as={Link} to="/admin/subjects">Subjects</Nav.Link>
              <Nav.Link as={Link} to="/admin/chapters">Chapters</Nav.Link>
              <Nav.Link as={Link} to="/admin/quizzes">Quizzes</Nav.Link>
            </Nav>
          ) : (
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/quizzes">Quizzes</Nav.Link>
              <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            </Nav>
          )}
          <Nav>
            <Nav.Item className="text-light d-flex align-items-center me-3">
              <span>Welcome, {user.fullName}</span>
            </Nav.Item>
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation; 