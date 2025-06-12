import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployee, clearError, removeEmployee } from '../features/employees/employeeSlice';
import { selectIsAuthenticated, selectCurrentUser } from '../features/auth/authSlice';
import {
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Chip,
  Avatar,
  Divider,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import ResponsiveContainer from '../components/layout/ResponsiveContainer';

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employee, status, error } = useSelector((state) => state.employees);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleDelete = async () => {
    setDeleteConfirmOpen(false);
    try {
      await dispatch(removeEmployee(id)).unwrap();
      navigate('/employees');
    } catch (err) {
      console.error('Failed to delete employee:', err);
    }
  };

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        await dispatch(getEmployee(id)).unwrap();
      } catch (err) {
        console.error('Failed to fetch employee:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployee();
    
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, id]);

  if (isLoading || status === 'loading') {
    return (
      <ResponsiveContainer>
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </ResponsiveContainer>
    );
  }

  if (status === 'failed') {
    return (
      <ResponsiveContainer>
        <Alert severity="error">{error}</Alert>
      </ResponsiveContainer>
    );
  }

  if (!employee) {
    return (
      <ResponsiveContainer>
        <Alert severity="error">Employee not found</Alert>
      </ResponsiveContainer>
    );
  }

  const isAdmin = currentUser?.role === 'admin';

  return (
    <ResponsiveContainer>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h3" gutterBottom>
            {employee.firstName} {employee.lastName}
          </Typography>
          
          {isAdmin && (
            <Box>
              <Button
                component={Link}
                to={`/employees/${id}/edit`}
                color="primary"
                startIcon={<Edit />}
                sx={{ mr: 2 }}
              >
                Edit
              </Button>
              <Button
                onClick={() => setDeleteConfirmOpen(true)}
                color="error"
                startIcon={<Delete />}
              >
                Delete
              </Button>
            </Box>
          )}
        </Box>
        
        <Box display="flex" alignItems="center" mb={2}>
          <Chip 
            label={employee.department} 
            color="primary" 
            sx={{ mr: 2 }}
          />
          <Chip 
            label={employee.status} 
            color={
              employee.status === 'active' ? 'success' : 
              employee.status === 'on leave' ? 'warning' : 'error'
            } 
          />
        </Box>
        
        <Typography variant="h6" gutterBottom>
          Employee Details
        </Typography>
        
        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={3} mb={3}>
          <Box>
            <Typography variant="subtitle2">Email</Typography>
            <Typography>{employee.email}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">Phone</Typography>
            <Typography>{employee.phone || 'N/A'}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">Position</Typography>
            <Typography>{employee.position}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">Salary</Typography>
            <Typography>${employee.salary}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2">Hire Date</Typography>
            <Typography>{new Date(employee.hireDate).toLocaleDateString()}</Typography>
          </Box>
          {employee.manager && (
            <Box>
              <Typography variant="subtitle2">Manager</Typography>
              <Typography>
                {employee.manager.firstName} {employee.manager.lastName}
              </Typography>
            </Box>
          )}
        </Box>
        
        <Box mt={4}>
          <Button
            variant="contained"
            onClick={() => navigate('/employees')}
            sx={{ mr: 2 }}
          >
            Back to Employees
          </Button>
        </Box>
      </Paper>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete "{employee.firstName} {employee.lastName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            startIcon={<Delete />}
          >
            Delete Employee
          </Button>
        </DialogActions>
      </Dialog>
    </ResponsiveContainer>
  );
};

export default EmployeeDetailPage;