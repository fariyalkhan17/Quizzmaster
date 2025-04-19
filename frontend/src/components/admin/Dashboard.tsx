import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllUsers, getAllSubjects, getAllChapters, getAllQuizzes, getAllScores } from '../../services/api';
import Navigation from '../common/Navigation';

// Add type augmentation to allow Link as Button component prop
declare module 'react-bootstrap/Button' {
  interface ButtonProps {
    as?: any;
  }
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    users: 0,
    subjects: 0,
    chapters: 0,
    quizzes: 0,
    quizAttempts: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch stats data in parallel
        const [usersResponse, subjectsResponse, chaptersResponse, quizzesResponse, scoresResponse] = await Promise.all([
          getAllUsers(),
          getAllSubjects(),
          getAllChapters(),
          getAllQuizzes(),
          getAllScores()
        ]);
        
        setStats({
          users: usersResponse.data.length,
          subjects: subjectsResponse.data.length,
          chapters: chaptersResponse.data.length,
          quizzes: quizzesResponse.data.length,
          quizAttempts: scoresResponse.data.length
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <>
        <Navigation />
        <Container className="mt-4 text-center">
          <Spinner animation="border" />
          <p>Loading dashboard data...</p>
        </Container>
      </>
    );
  }
  
  return (
    <>
      <Navigation />
      <Container className="mt-4">
        <h2 className="mb-4">Admin Dashboard</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <Card.Title className="display-1">{stats.users}</Card.Title>
                <Card.Text>Total Users</Card.Text>
                <Button as={Link} to="/admin/users" variant="outline-primary">Manage Users</Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <Card.Title className="display-1">{stats.subjects}</Card.Title>
                <Card.Text>Subjects</Card.Text>
                <Button as={Link} to="/admin/subjects" variant="outline-primary">Manage Subjects</Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <Card.Title className="display-1">{stats.chapters}</Card.Title>
                <Card.Text>Chapters</Card.Text>
                <Button as={Link} to="/admin/chapters" variant="outline-primary">Manage Chapters</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row>
          <Col md={6} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <Card.Title className="display-1">{stats.quizzes}</Card.Title>
                <Card.Text>Quizzes</Card.Text>
                <Button as={Link} to="/admin/quizzes" variant="outline-primary">Manage Quizzes</Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <Card.Title className="display-1">{stats.quizAttempts}</Card.Title>
                <Card.Text>Quiz Attempts</Card.Text>
                <Button as={Link} to="/admin/scores" variant="outline-primary">View Scores</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header as="h5">Quick Actions</Card.Header>
              <Card.Body>
                <Row>
                  <Col sm={6} md={3} className="mb-2">
                    <Button as={Link} to="/admin/subjects/new" variant="primary" className="w-100">
                      Add Subject
                    </Button>
                  </Col>
                  <Col sm={6} md={3} className="mb-2">
                    <Button as={Link} to="/admin/chapters/new" variant="primary" className="w-100">
                      Add Chapter
                    </Button>
                  </Col>
                  <Col sm={6} md={3} className="mb-2">
                    <Button as={Link} to="/admin/quizzes/new" variant="primary" className="w-100">
                      Create Quiz
                    </Button>
                  </Col>
                  <Col sm={6} md={3} className="mb-2">
                    <Button as={Link} to="/dashboard" variant="outline-secondary" className="w-100">
                      User View
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminDashboard; 