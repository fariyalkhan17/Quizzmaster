import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal } from 'react-bootstrap';
import { getAllChapters, createChapter, updateChapter, deleteChapter, getAllSubjects } from '../../services/api';
import { Chapter, Subject } from '../../services/api';
import AdminNavbar from '../../components/admin/AdminNavbar';

const ManageChapters: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [subjectId, setSubjectId] = useState<number | string>('');
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
      const chaptersResponse = await getAllChapters();
      const subjectsResponse = await getAllSubjects();
      
      setChapters(chaptersResponse.data);
      setSubjects(subjectsResponse.data);
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
    
    if (!subjectId) {
      setError('Please select a subject');
      return;
    }
    
    try {
      console.log('Creating chapter with subject ID:', subjectId);
      console.log('Available subjects:', subjects.map(s => ({ id: s.id, name: s.name })));
      
      const chapterData = {
        name,
        description,
        subjectId: typeof subjectId === 'string' ? parseInt(subjectId) : subjectId
      };
      
      if (editId) {
        await updateChapter(editId, chapterData);
      } else {
        try {
          const response = await createChapter(chapterData);
          console.log('Success:', response);
        } catch (err: any) {
          console.error('Error details:', err.response?.data);
          throw err;
        }
      }
      resetForm();
      fetchData();
    } catch (err) {
      setError('Failed to save chapter');
      console.error(err);
    }
  };

  const handleEdit = (chapter: Chapter) => {
    setName(chapter.name);
    setDescription(chapter.description || '');
    setSubjectId(chapter.subject_id);
    setEditId(chapter.id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteChapter(deleteId);
        setShowDeleteModal(false);
        fetchData();
      } catch (err) {
        setError('Failed to delete chapter');
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
    setDescription('');
    setSubjectId('');
    setEditId(null);
    setShowModal(false);
  };

  const getSubjectName = (subjectId: number) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };

  return (
    <>
      <AdminNavbar />
      <Container className="mt-4">
        <Row>
          <Col>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h4>Manage Chapters</h4>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                  Add New Chapter
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
                        <th>Subject</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chapters.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center">No chapters found</td>
                        </tr>
                      ) : (
                        chapters.map((chapter, index) => (
                          <tr key={chapter.id}>
                            <td>{index + 1}</td>
                            <td>{chapter.name}</td>
                            <td>{getSubjectName(chapter.subject_id)}</td>
                            <td>{chapter.description || '-'}</td>
                            <td>
                              <Button 
                                variant="info" 
                                size="sm" 
                                className="me-2"
                                onClick={() => handleEdit(chapter)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="danger" 
                                size="sm"
                                onClick={() => confirmDelete(chapter.id)}
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

      {/* Add/Edit Chapter Modal */}
      <Modal show={showModal} onHide={resetForm}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit Chapter' : 'Add New Chapter'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Select 
                value={subjectId} 
                onChange={(e) => setSubjectId(e.target.value)}
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter chapter name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Enter description (optional)" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
          Are you sure you want to delete this chapter? All associated quizzes and questions will also be deleted. This action cannot be undone.
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

export default ManageChapters; 