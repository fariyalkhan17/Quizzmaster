import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  getAllQuizzes, 
  createQuiz, 
  updateQuiz, 
  deleteQuiz, 
  getAllChapters 
} from '../../services/api';
import { Quiz, Chapter } from '../../services/api';
import AdminNavbar from '../../components/admin/AdminNavbar';

const ManageQuizzes: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [chapterId, setChapterId] = useState<number | string>('');
  const [datePicker, setDatePicker] = useState<string>('');
  const [timeDuration, setTimeDuration] = useState<string>('00:30');
  const [editId, setEditId] = useState<number | null>(null);
  
  // Modal state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const quizzesResponse = await getAllQuizzes();
      const chaptersResponse = await getAllChapters();
      
      setQuizzes(quizzesResponse.data);
      setChapters(chaptersResponse.data);
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
    
    if (!chapterId) {
      setError('Please select a chapter');
      return;
    }
    
    try {
      console.log('Creating quiz with chapter ID:', chapterId);
      
      // Convert the time duration from "HH:MM" format to total minutes
      const [hours, minutes] = timeDuration.split(':').map(Number);
      const totalMinutes = (hours * 60) + minutes;
      
      const quizData = {
        chapterId: Number(chapterId),
        title: name,
        description: remarks,
        timeLimit: totalMinutes // Convert from string to number
      };
      
      if (editId) {
        await updateQuiz(editId, quizData);
      } else {
        try {
          const response = await createQuiz(quizData);
          console.log('Success:', response);
        } catch (err: any) {
          console.error('Error details:', err.response?.data);
          throw err;
        }
      }
      resetForm();
      fetchData();
    } catch (err) {
      setError('Failed to save quiz');
      console.error(err);
    }
  };

  const handleEdit = (quiz: Quiz) => {
    setName(quiz.name || '');
    setRemarks(quiz.remarks || '');
    setChapterId(quiz.chapter_id);
    setDatePicker(quiz.date_of_quiz || formatDate(new Date()));
    setTimeDuration(quiz.time_duration || '00:30');
    setEditId(quiz.id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteQuiz(deleteId);
        setShowDeleteModal(false);
        fetchData();
      } catch (err) {
        setError('Failed to delete quiz');
        console.error(err);
      }
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setName('');
    setRemarks('');
    setChapterId('');
    setDatePicker(formatDate(new Date()));
    setTimeDuration('00:30');
    setEditId(null);
    setShowModal(false);
  };

  const getChapterName = (chapterId: number) => {
    const chapter = chapters.find(c => c.id === chapterId);
    return chapter ? chapter.name : 'Unknown Chapter';
  };

  // Format date for the date input
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Initialize date picker with today's date
  useEffect(() => {
    setDatePicker(formatDate(new Date()));
  }, []);

  return (
    <>
      <AdminNavbar />
      <Container className="mt-4">
        <Row>
          <Col>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h4>Manage Quizzes</h4>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                  Add New Quiz
                </Button>
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
                        <th>Name</th>
                        <th>Chapter</th>
                        <th>Date</th>
                        <th>Duration</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizzes.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center">No quizzes found</td>
                        </tr>
                      ) : (
                        quizzes.map((quiz, index) => (
                          <tr key={quiz.id}>
                            <td>{index + 1}</td>
                            <td>{quiz.name}</td>
                            <td>{getChapterName(quiz.chapter_id)}</td>
                            <td>{quiz.date_of_quiz || 'N/A'}</td>
                            <td>{quiz.time_duration || 'N/A'}</td>
                            <td>
                              <Button 
                                variant="info" 
                                size="sm" 
                                className="me-2"
                                onClick={() => handleEdit(quiz)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="danger" 
                                size="sm"
                                className="me-2"
                                onClick={() => confirmDelete(quiz.id)}
                              >
                                Delete
                              </Button>
                              <Button 
                                variant="success" 
                                size="sm"
                                as={Link}
                                to={`/admin/quizzes/${quiz.id}/questions`}
                              >
                                Questions
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

      {/* Add/Edit Quiz Modal */}
      <Modal show={showModal} onHide={resetForm}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit Quiz' : 'Add New Quiz'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Chapter</Form.Label>
              <Form.Select 
                value={chapterId} 
                onChange={(e) => setChapterId(e.target.value)}
                required
              >
                <option value="">Select Chapter</option>
                {chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter quiz name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control 
                type="date" 
                value={datePicker}
                onChange={(e) => setDatePicker(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duration (HH:MM)</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="00:30" 
                value={timeDuration}
                onChange={(e) => setTimeDuration(e.target.value)}
                pattern="[0-9]{2}:[0-9]{2}"
                required
              />
              <Form.Text className="text-muted">
                Format: HH:MM (e.g., 00:30 for 30 minutes)
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Remarks</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Enter remarks (optional)" 
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
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
          Are you sure you want to delete this quiz? All associated questions and scores will also be deleted. This action cannot be undone.
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

export default ManageQuizzes; 