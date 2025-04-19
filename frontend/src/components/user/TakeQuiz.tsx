import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, ProgressBar, Alert, Spinner, Form, Modal } from 'react-bootstrap';
import { getQuizById, getQuestionsByQuiz, submitQuiz, Quiz, Question, Option } from '../../services/api';
import Navigation from '../common/Navigation';

interface QuizParams extends Record<string, string | undefined> {
  id: string;
}

interface Answer {
  question_id: number;
  selected_option: number;
}

const TakeQuiz: React.FC = () => {
  const { id } = useParams<QuizParams>();
  const navigate = useNavigate();
  const quizId = parseInt(id || '0');
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  
  const startTime = useRef<Date | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Fetch quiz and questions
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch quiz details
        const quizResponse = await getQuizById(quizId);
        const quizData = quizResponse.data;
        setQuiz(quizData);
        setTimeLeft(quizData.timeLimit * 60); // Convert minutes to seconds
        
        // Fetch questions
        const questionsResponse = await getQuestionsByQuiz(quizId);
        const questionsData = questionsResponse.data;
        setQuestions(questionsData);
        
        // Initialize answers array
        const initialAnswers = questionsData.map(question => ({
          question_id: question.id,
          selected_option: -1 // -1 means not answered
        }));
        setAnswers(initialAnswers);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        setError('Failed to load quiz. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizData();
    
    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizId]);
  
  // Timer function
  useEffect(() => {
    if (!quizStarted || quizFinished) return;
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current!);
          finishQuiz();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizStarted, quizFinished]);
  
  const startQuiz = () => {
    setQuizStarted(true);
    startTime.current = new Date();
  };
  
  const handleOptionSelect = (optionId: number) => {
    setSelectedOption(optionId);
    
    // Update answers array
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex].selected_option = optionId;
    setAnswers(updatedAnswers);
  };
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(answers[currentQuestionIndex + 1].selected_option === -1 
        ? null 
        : answers[currentQuestionIndex + 1].selected_option);
    } else {
      setShowConfirmModal(true);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(answers[currentQuestionIndex - 1].selected_option === -1 
        ? null 
        : answers[currentQuestionIndex - 1].selected_option);
    }
  };
  
  const finishQuiz = async () => {
    try {
      setQuizFinished(true);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      const endTime = new Date();
      const timeTaken = startTime.current 
        ? Math.floor((endTime.getTime() - startTime.current.getTime()) / 1000) 
        : 0;
      
      // Format time taken as HH:MM:SS
      const hours = Math.floor(timeTaken / 3600);
      const minutes = Math.floor((timeTaken % 3600) / 60);
      const seconds = timeTaken % 60;
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      // Filter out unanswered questions
      const validAnswers = answers.filter(answer => answer.selected_option !== -1);
      
      const response = await submitQuiz({
        quiz_id: quizId,
        answers: validAnswers,
        time_taken: formattedTime
      });
      
      navigate(`/results/${response.data.score.id}`);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('Failed to submit quiz. Please try again.');
      setQuizFinished(false);
    }
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (loading) {
    return (
      <>
        <Navigation />
        <Container className="mt-4 text-center">
          <Spinner animation="border" />
          <p>Loading quiz...</p>
        </Container>
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <Navigation />
        <Container className="mt-4">
          <Alert variant="danger">{error}</Alert>
          <Button variant="primary" onClick={() => navigate('/quizzes')}>
            Back to Quizzes
          </Button>
        </Container>
      </>
    );
  }
  
  if (!quizStarted) {
    return (
      <>
        <Navigation />
        <Container className="mt-4">
          <Card>
            <Card.Header as="h4">{quiz?.title}</Card.Header>
            <Card.Body>
              <Card.Title>Quiz Instructions</Card.Title>
              <Card.Text>{quiz?.description}</Card.Text>
              
              <div className="mb-4">
                <p><strong>Time Limit:</strong> {quiz?.timeLimit} minutes</p>
                <p><strong>Passing Score:</strong> {quiz?.passingScore}%</p>
                <p><strong>Total Questions:</strong> {questions.length}</p>
              </div>
              
              <div className="d-grid gap-2">
                <Button variant="primary" size="lg" onClick={startQuiz}>
                  Start Quiz
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate('/quizzes')}>
                  Back to Quizzes
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  return (
    <>
      <Navigation />
      <Container className="mt-4">
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span className="text-danger">Time Remaining: {formatTime(timeLeft)}</span>
          </Card.Header>
          
          <Card.Body>
            <ProgressBar now={progress} label={`${Math.round(progress)}%`} className="mb-4" />
            
            <Card.Title as="h4">{currentQuestion?.text}</Card.Title>
            
            <Form className="mt-4">
              {currentQuestion?.options?.map(option => (
                <Form.Check
                  key={option.id}
                  type="radio"
                  id={`option-${option.id}`}
                  name="quizOption"
                  label={option.text}
                  className="mb-3 fs-5"
                  checked={selectedOption === option.id}
                  onChange={() => handleOptionSelect(option.id)}
                />
              ))}
            </Form>
          </Card.Body>
          
          <Card.Footer className="d-flex justify-content-between">
            <Button 
              variant="outline-secondary" 
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            <Button 
              variant="primary" 
              onClick={goToNextQuestion}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Card.Footer>
        </Card>
      </Container>
      
      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Finish Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to finish this quiz?</p>
          <p>
            <strong>Answered Questions:</strong> {answers.filter(a => a.selected_option !== -1).length} of {questions.length}
          </p>
          {answers.filter(a => a.selected_option === -1).length > 0 && (
            <Alert variant="warning">
              You have {answers.filter(a => a.selected_option === -1).length} unanswered questions.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Continue Quiz
          </Button>
          <Button variant="primary" onClick={finishQuiz}>
            Finish Quiz
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TakeQuiz; 