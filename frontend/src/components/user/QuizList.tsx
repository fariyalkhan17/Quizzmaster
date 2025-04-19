import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllSubjects, getChaptersBySubject, getQuizzesByChapter, Subject, Chapter, Quiz } from '../../services/api';
import Navigation from '../common/Navigation';

const QuizList: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch subjects on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getAllSubjects();
        setSubjects(response.data);
        
        // If subjects exist, select the first one by default
        if (response.data.length > 0) {
          setSelectedSubject(response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setError('Failed to load subjects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubjects();
  }, []);

  // Fetch chapters when subject changes
  useEffect(() => {
    const fetchChapters = async () => {
      if (selectedSubject === null) return;
      
      try {
        setLoading(true);
        setError(null);
        setChapters([]);
        setQuizzes([]);
        setSelectedChapter(null);
        
        const response = await getChaptersBySubject(selectedSubject);
        setChapters(response.data);
        
        // If chapters exist, select the first one by default
        if (response.data.length > 0) {
          setSelectedChapter(response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching chapters:', error);
        setError('Failed to load chapters. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChapters();
  }, [selectedSubject]);

  // Fetch quizzes when chapter changes
  useEffect(() => {
    const fetchQuizzes = async () => {
      if (selectedChapter === null) return;
      
      try {
        setLoading(true);
        setError(null);
        setQuizzes([]);
        
        const response = await getQuizzesByChapter(selectedChapter);
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setError('Failed to load quizzes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizzes();
  }, [selectedChapter]);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subjectId = parseInt(e.target.value);
    setSelectedSubject(subjectId);
  };

  const handleChapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chapterId = parseInt(e.target.value);
    setSelectedChapter(chapterId);
  };

  return (
    <>
      <Navigation />
      <Container className="mt-4">
        <h2 className="mb-4">Available Quizzes</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Row>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Header as="h5">Filter Quizzes</Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Select Subject</Form.Label>
                    <Form.Select
                      value={selectedSubject || ''}
                      onChange={handleSubjectChange}
                      disabled={loading || subjects.length === 0}
                    >
                      {subjects.length === 0 && (
                        <option value="">No subjects available</option>
                      )}
                      {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Select Chapter</Form.Label>
                    <Form.Select
                      value={selectedChapter || ''}
                      onChange={handleChapterChange}
                      disabled={loading || chapters.length === 0}
                    >
                      {chapters.length === 0 && (
                        <option value="">No chapters available</option>
                      )}
                      {chapters.map(chapter => (
                        <option key={chapter.id} value={chapter.id}>
                          {chapter.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Header as="h5">Navigation</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item action as={Link} to="/dashboard">Back to Dashboard</ListGroup.Item>
                <ListGroup.Item action as={Link} to="/profile">Your Profile</ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
          
          <Col md={8}>
            <Card>
              <Card.Header as="h5">
                Quizzes
                {loading && <Spinner animation="border" size="sm" className="ms-2" />}
              </Card.Header>
              
              {quizzes.length > 0 ? (
                <ListGroup variant="flush">
                  {quizzes.map(quiz => (
                    <ListGroup.Item
                      key={quiz.id}
                      action
                      as={Link}
                      to={`/quiz/${quiz.id}`}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <h5>{quiz.title}</h5>
                        <p className="text-muted mb-0">{quiz.description}</p>
                        <small>
                          Time Limit: {quiz.timeLimit} minutes | 
                          Passing Score: {quiz.passingScore}%
                        </small>
                      </div>
                      <Badge bg="primary" pill>
                        Start
                      </Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <Card.Body className="text-center">
                  {loading ? (
                    <div>
                      <Spinner animation="border" />
                      <p>Loading quizzes...</p>
                    </div>
                  ) : (
                    <p>No quizzes available for the selected chapter.</p>
                  )}
                </Card.Body>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default QuizList; 