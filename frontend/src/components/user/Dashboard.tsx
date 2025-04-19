import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getUserStats, getUserScores, UserStats, Score } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navigation from '../common/Navigation';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentScores, setRecentScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user stats
        const statsResponse = await getUserStats();
        setStats(statsResponse.data);
        
        // Fetch recent scores
        const scoresResponse = await getUserScores();
        setRecentScores(scoresResponse.data.slice(0, 5)); // Get latest 5 scores
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data. Please try again later.');
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
          <p>Loading your dashboard...</p>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <Container className="mt-4">
        <h2 className="mb-4">Welcome, {user?.fullName || 'User'}!</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Row>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Header as="h5">Your Statistics</Card.Header>
              <Card.Body>
                {stats ? (
                  <Row>
                    <Col xs={6} className="text-center mb-3">
                      <h3>{stats.totalQuizzes}</h3>
                      <p>Quizzes Taken</p>
                    </Col>
                    <Col xs={6} className="text-center mb-3">
                      <h3>{stats.averageScore.toFixed(1)}%</h3>
                      <p>Average Score</p>
                    </Col>
                    <Col xs={6} className="text-center">
                      <h3>{stats.totalQuestions}</h3>
                      <p>Total Questions</p>
                    </Col>
                    <Col xs={6} className="text-center">
                      <h3>{stats.totalCorrect}</h3>
                      <p>Correct Answers</p>
                    </Col>
                  </Row>
                ) : (
                  <p className="text-center">No statistics available yet. Take a quiz to see your stats!</p>
                )}
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Header as="h5">Quick Actions</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item action as={Link} to="/quizzes">Browse Available Quizzes</ListGroup.Item>
                <ListGroup.Item action as={Link} to="/profile">Update Your Profile</ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card>
              <Card.Header as="h5">Recent Quiz Results</Card.Header>
              {recentScores.length > 0 ? (
                <ListGroup variant="flush">
                  {recentScores.map((score) => (
                    <ListGroup.Item key={score.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6>{score.quiz?.title || 'Unknown Quiz'}</h6>
                        <small className="text-muted">
                          {new Date(score.time_stamp_of_attempt).toLocaleDateString()}
                        </small>
                      </div>
                      <div className="text-end">
                        <h5>
                          {((score.total_scored / score.total_questions) * 100).toFixed(1)}%
                        </h5>
                        <small>
                          {score.total_scored} / {score.total_questions} correct
                        </small>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <Card.Body>
                  <p className="text-center">You haven't taken any quizzes yet.</p>
                </Card.Body>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard; 