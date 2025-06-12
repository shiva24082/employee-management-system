import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployee, editEmployee, clearEmployee } from '../features/employees/employeeSlice';
import {
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';
import ResponsiveContainer from '../components/layout/ResponsiveContainer';
import EmployeeForm from '../components/employees/EmployeeForm';

const EditEmployeePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employee, status, error } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(getEmployee(id));
    return () => dispatch(clearEmployee());
  }, [dispatch, id]);

  const handleSubmit = async (values) => {
    try {
      await dispatch(editEmployee({ id, employeeData: values })).unwrap();
      navigate(`/employees/${id}`);
    } catch (err) {
      console.error('Failed to update employee:', err);
    }
  };

  if (status === 'loading' || !employee) {
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
          Edit Employee
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <EmployeeForm 
          initialValues={employee}
          onSubmit={handleSubmit}
          submitButtonText="Update Employee"
        />
      </Paper>
    </ResponsiveContainer>
  );
};

export default EditEmployeePage;