import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Alert, Badge, Spinner, ProgressBar } from 'react-bootstrap';
import { getUserScores, getQuizById, Score, Quiz } from '../../services/api';
import Navigation from '../common/Navigation';

interface ResultsParams extends Record<string, string | undefined> {
  id: string;
}

const QuizResults: React.FC = () => {
  const { id } = useParams<ResultsParams>();
  const navigate = useNavigate();
  const [score, setScore] = useState<Score | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user's scores
        const scoreResponse = await getUserScores();
        const scoreData = scoreResponse.data.find((s: Score) => s.id === parseInt(id || '0'));
        
        if (!scoreData) {
          setError('Result not found.');
          setLoading(false);
          return;
        }
        
        setScore(scoreData);
        
        // Fetch quiz details
        const quizResponse = await getQuizById(scoreData.quiz_id);
        setQuiz(quizResponse.data);
      } catch (error) {
        console.error('Error fetching results:', error);
        setError('Failed to load results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [id]);
  
  if (loading) {
    return (
      <>
        <Navigation />
        <Container className="mt-4 text-center">
          <Spinner animation="border" />
          <p>Loading results...</p>
        </Container>
      </>
    );
  }
  
  if (error || !score) {
    return (
      <>
        <Navigation />
        <Container className="mt-4">
          <Alert variant="danger">{error || 'Result not found.'}</Alert>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Container>
      </>
    );
  }
  
  const percentage = Math.round((score.total_scored / score.total_questions) * 100);
  const isPassing = quiz && percentage >= (quiz.passingScore || 60);
  
  return (
    <>
      <Navigation />
      <Container className="mt-4">
        <Card className="mb-4">
          <Card.Header className="text-center">
            <h3>Quiz Result</h3>
          </Card.Header>
          <Card.Body>
            <div className="text-center mb-4">
              <h4>{quiz?.title}</h4>
              <p className="text-muted">{quiz?.description}</p>
              <p>
                <small>
                  Completed on {new Date(score.time_stamp_of_attempt).toLocaleDateString()} at{' '}
                  {new Date(score.time_stamp_of_attempt).toLocaleTimeString()}
                </small>
              </p>
              
              <Badge bg={isPassing ? 'success' : 'danger'} className="fs-6 p-2 mt-2">
                {isPassing ? 'PASSED' : 'FAILED'}
              </Badge>
            </div>
            
            <Row className="text-center mt-4">
              <Col md={4}>
                <div className="p-3 border rounded mb-3">
                  <h2>{score.total_scored} / {score.total_questions}</h2>
                  <p>Questions Answered Correctly</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="p-3 border rounded mb-3">
                  <h2>{percentage}%</h2>
                  <p>Your Score</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="p-3 border rounded mb-3">
                  <h2>{score.time_taken || 'N/A'}</h2>
                  <p>Time Taken</p>
                </div>
              </Col>
            </Row>
            
            <div className="mt-4">
              <p className="mb-2">Score: {percentage}% (Required: {quiz?.passingScore || 60}%)</p>
              <ProgressBar 
                now={percentage} 
                variant={isPassing ? 'success' : 'danger'} 
                label={`${percentage}%`} 
              />
            </div>
          </Card.Body>
        </Card>
        
        <div className="d-grid gap-2">
          <Button variant="primary" onClick={() => navigate('/quizzes')}>
            Take Another Quiz
          </Button>
          <Button variant="outline-secondary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </Container>
    </>
  );
};

export default QuizResults; 