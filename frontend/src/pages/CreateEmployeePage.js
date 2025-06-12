import React from 'react';
import { useDispatch , useSelector } from 'react-redux';
import { addEmployee } from '../features/employees/employeeSlice';
import {
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ResponsiveContainer from '../components/layout/ResponsiveContainer';
import EmployeeForm from '../components/employees/EmployeeForm';

const CreateEmployeePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.employees);

  const handleSubmit = async (values) => {
    try {
      await dispatch(addEmployee(values)).unwrap();
      navigate('/employees');
    } catch (err) {
      console.error('Failed to create employee:', err);
    }
  };

  if (status === 'loading') {
    return (
      <ResponsiveContainer>
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Add New Employee
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <EmployeeForm 
          onSubmit={handleSubmit}
          submitButtonText="Add Employee"
        />
      </Paper>
    </ResponsiveContainer>
  );
};

export default CreateEmployeePage;