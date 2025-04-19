import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile, getUserProfile } from '../../services/api';
import Navigation from '../common/Navigation';

const Profile: React.FC = () => {
  const { user: authUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    qualification: '',
    dob: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getUserProfile();
        const userData = response.data;
        
        setFormData({
          fullName: userData.fullName || '',
          qualification: userData.qualification || '',
          dob: userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : ''
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load your profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccess(null);
      setError(null);
      
      await updateUserProfile(formData);
      
      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <Container className="mt-4 text-center">
          <Spinner animation="border" />
          <p>Loading your profile...</p>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <Container className="mt-4">
        <Row>
          <Col md={{ span: 8, offset: 2 }}>
            <Card>
              <Card.Header as="h4">Your Profile</Card.Header>
              <Card.Body>
                {success && <Alert variant="success">{success}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="fullName" className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group controlId="qualification" className="mb-3">
                    <Form.Label>Qualification</Form.Label>
                    <Form.Control
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      placeholder="e.g., Bachelor of Science, High School Diploma"
                    />
                    <Form.Text className="text-muted">
                      Your highest educational qualification
                    </Form.Text>
                  </Form.Group>
                  
                  <Form.Group controlId="dob" className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  
                  <div className="d-grid gap-2 mt-4">
                    <Button variant="primary" type="submit" disabled={saving}>
                      {saving ? 'Saving...' : 'Update Profile'}
                    </Button>
                  </div>
                </Form>
                
                <div className="mt-4 text-center">
                  <p>
                    <strong>Username:</strong> {authUser?.username}
                  </p>
                  <p>
                    <strong>Role:</strong> {authUser?.role === 'admin' ? 'Administrator' : 'User'}
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile; 