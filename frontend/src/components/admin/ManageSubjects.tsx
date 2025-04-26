import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal } from 'react-bootstrap';
import { getAllSubjects, createSubject, updateSubject, deleteSubject } from '../../services/api';
import { Subject } from '../../services/api';
import AdminNavbar from '../../components/admin/AdminNavbar';

const ManageSubjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [editId, setEditId] = useState<number | null>(null);
  
  // Modal state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await getAllSubjects();
      setSubjects(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load subjects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateSubject(editId, { name, description });
      } else {
        await createSubject({ name, description });
      }
      resetForm();
      fetchSubjects();
    } catch (err) {
      setError('Failed to save subject');
      console.error(err);
    }
  };

  const handleEdit = (subject: Subject) => {
    setName(subject.name);
    setDescription(subject.description || '');
    setEditId(subject.id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteSubject(deleteId);
        setShowDeleteModal(false);
        fetchSubjects();
      } catch (err) {
        setError('Failed to delete subject');
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
                <h4>Manage Subjects</h4>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                  Add New Subject
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
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center">No subjects found</td>
                        </tr>
                      ) : (
                        subjects.map((subject, index) => (
                          <tr key={subject.id}>
                            <td>{index + 1}</td>
                            <td>{subject.name}</td>
                            <td>{subject.description || '-'}</td>
                            <td>
                              <Button 
                                variant="info" 
                                size="sm" 
                                className="me-2"
                                onClick={() => handleEdit(subject)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="danger" 
                                size="sm"
                                onClick={() => confirmDelete(subject.id)}
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

      {/* Add/Edit Subject Modal */}
      <Modal show={showModal} onHide={resetForm}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit Subject' : 'Add New Subject'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter subject name" 
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
          Are you sure you want to delete this subject? All associated chapters, quizzes, and questions will also be deleted. This action cannot be undone.
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

export default ManageSubjects; 