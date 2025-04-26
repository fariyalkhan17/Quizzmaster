import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getQuizById,
  getQuestionsByQuiz,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from '../../services/api';
import { Question, Quiz } from '../../services/api';
import AdminNavbar from '../../components/admin/AdminNavbar';

const ManageQuestions: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const quizId = id ? parseInt(id) : 0;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [questionText, setQuestionText] = useState<string>('');
  const [option1, setOption1] = useState<string>('');
  const [option2, setOption2] = useState<string>('');
  const [option3, setOption3] = useState<string>('');
  const [option4, setOption4] = useState<string>('');
  const [correctOption, setCorrectOption] = useState<number | string>(1);
  const [editId, setEditId] = useState<number | null>(null);
  
  // Modal state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (quizId) {
      fetchData();
    } else {
      navigate('/admin/quizzes');
    }
  }, [quizId, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const quizResponse = await getQuizById(quizId);
      const questionsResponse = await getQuestionsByQuiz(quizId);
      
      setQuiz(quizResponse.data);
      setQuestions(questionsResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Creating question for quiz ID:', quizId);
      
      const questionData = {
        quizId: quizId,
        text: questionText,
        option1,
        option2,
        option3,
        option4,
        correct_option: Number(correctOption)
      };
      
      if (editId) {
        try {
          const response = await updateQuestion(editId, questionData);
          console.log('Success:', response);
        } catch (err: any) {
          console.error('Error details:', err.response?.data);
          throw err;
        }
      } else {
        try {
          const response = await createQuestion(questionData);
          console.log('Success:', response);
        } catch (err: any) {
          console.error('Error details:', err.response?.data);
          throw err;
        }
      }
      resetForm();
      fetchData();
    } catch (err) {
      setError('Failed to save question');
      console.error(err);
    }
  };

  const handleEdit = (question: Question) => {
    setQuestionText(question.question_statement || '');
    setOption1(question.option1 || '');
    setOption2(question.option2 || '');
    setOption3(question.option3 || '');
    setOption4(question.option4 || '');
    setCorrectOption(question.correct_option || 1);
    setEditId(question.id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteQuestion(deleteId);
        setShowDeleteModal(false);
        fetchData();
      } catch (err) {
        setError('Failed to delete question');
        console.error(err);
      }
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setQuestionText('');
    setOption1('');
    setOption2('');
    setOption3('');
    setOption4('');
    setCorrectOption(1);
    setEditId(null);
    setShowModal(false);
  };

  return (
    <>
      <AdminNavbar />
      <Container className="mt-4">
        <Row>
          <Col>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                  <h4>Manage Questions</h4>
                  {quiz && (
                    <div className="text-muted">Quiz: {quiz.name}</div>
                  )}
                </div>
                <div>
                  <Button 
                    variant="secondary" 
                    className="me-2"
                    onClick={() => navigate('/admin/quizzes')}
                  >
                    Back to Quizzes
                  </Button>
                  <Button variant="primary" onClick={() => setShowModal(true)}>
                    Add New Question
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                {error && <div className="alert alert-danger">{error}</div>}
                {loading ? (
                  <div className="text-center">Loading...</div>
                ) : (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Question</th>
                        <th>Options</th>
                        <th>Correct Answer</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center">No questions found</td>
                        </tr>
                      ) : (
                        questions.map((question, index) => (
                          <tr key={question.id}>
                            <td>{index + 1}</td>
                            <td>{question.question_statement}</td>
                            <td>
                              <ol>
                                <li>{question.option1}</li>
                                <li>{question.option2}</li>
                                <li>{question.option3}</li>
                                <li>{question.option4}</li>
                              </ol>
                            </td>
                            <td>{question.correct_option}</td>
                            <td>
                              <Button 
                                variant="info" 
                                size="sm" 
                                className="me-2"
                                onClick={() => handleEdit(question)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="danger" 
                                size="sm"
                                onClick={() => confirmDelete(question.id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Add/Edit Question Modal */}
      <Modal show={showModal} onHide={resetForm} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit Question' : 'Add New Question'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Question</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2} 
                placeholder="Enter question" 
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                required
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Option 1</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter option 1" 
                    value={option1}
                    onChange={(e) => setOption1(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Option 2</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter option 2" 
                    value={option2}
                    onChange={(e) => setOption2(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Option 3</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter option 3" 
                    value={option3}
                    onChange={(e) => setOption3(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Option 4</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter option 4" 
                    value={option4}
                    onChange={(e) => setOption4(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Correct Answer</Form.Label>
              <Form.Select 
                value={correctOption} 
                onChange={(e) => setCorrectOption(e.target.value)}
                required
              >
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
                <option value="4">Option 4</option>
              </Form.Select>
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={resetForm}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editId ? 'Update' : 'Save'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this question? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageQuestions; 