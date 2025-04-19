import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Spinner, Badge, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllUsers, deleteUser, User } from '../../services/api';
import Navigation from '../common/Navigation';

// Add type augmentation to allow Link as Button component prop
declare module 'react-bootstrap/Button' {
  interface ButtonProps {
    as?: any;
  }
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleShowDeleteModal = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };
  
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };
  
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setDeleting(true);
      
      await deleteUser(userToDelete.id);
      
      setSuccessMessage(`User '${userToDelete.username}' has been deleted successfully.`);
      fetchUsers(); // Refresh the list
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
    } finally {
      setDeleting(false);
    }
  };
  
  if (loading && users.length === 0) {
    return (
      <>
        <Navigation />
        <Container className="mt-4 text-center">
          <Spinner animation="border" />
          <p>Loading users...</p>
        </Container>
      </>
    );
  }
  
  return (
    <>
      <Navigation />
      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Manage Users</h2>
          <Button as={Link} to="/admin" variant="outline-secondary">
            Back to Dashboard
          </Button>
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        
        {users.length === 0 ? (
          <Alert variant="info">No users found.</Alert>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>Qualification</th>
                <th>Date of Birth</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.fullName}</td>
                  <td>
                    <Badge bg={user.role === 'admin' ? 'danger' : 'primary'}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </Badge>
                  </td>
                  <td>{user.qualification || '-'}</td>
                  <td>
                    {user.dob ? new Date(user.dob).toLocaleDateString() : '-'}
                  </td>
                  <td>
                    {user.role !== 'admin' && (
                      <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => handleShowDeleteModal(user)}
                      >
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the user <strong>{userToDelete?.username}</strong>?</p>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteUser} 
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete User'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageUsers; 