import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployees, clearError } from '../../features/employees/employeeSlice';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Chip,
  Alert,
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import ResponsiveContainer from '../layout/ResponsiveContainer';

const EmployeeList = () => {
  const dispatch = useDispatch();
  const { employees, status, error } = useSelector((state) => state.employees);
  
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    search: ''
  });

  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales', 'Other'];

  useEffect(() => {
    dispatch(getEmployees(filters));
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      department: '',
      status: '',
      search: ''
    });
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

  if (status === 'failed') {
    return (
      <ResponsiveContainer>
        <Alert severity="error">{error}</Alert>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer>
      <Typography variant="h4" gutterBottom sx={{ mt: 2, mb: 3 }}>
        Employee Directory
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Search Employees"
              variant="outlined"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                label="Department"
              >
                <MenuItem value="">All Departments</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                label="Status"
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="on leave">On Leave</MenuItem>
                <MenuItem value="terminated">Terminated</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button 
            variant="outlined" 
            onClick={clearFilters}
            disabled={!filters.department && !filters.status && !filters.search}
          >
            Clear Filters
          </Button>
        </Box>
      </Paper>
      
      {employees.length === 0 ? (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" gutterBottom>
            {Object.values(filters).some(Boolean) 
              ? "No employees match your filters" 
              : "No employees found"}
          </Typography>
          {Object.values(filters).some(Boolean) && (
            <Button variant="text" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {employees.map((employee) => (
            <Grid item key={employee._id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {employee.firstName} {employee.lastName}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {employee.email}
                  </Typography>
                  <Chip 
                    label={employee.department} 
                    color="primary" 
                    size="small" 
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" paragraph>
                    {employee.position}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${employee.salary}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Status: {employee.status}
                  </Typography>
                </CardContent>
                <Button 
                  component={Link} 
                  to={`/employees/${employee._id}`}
                  variant="contained"
                  fullWidth
                  sx={{ mt: 'auto' }}
                >
                  View Details
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </ResponsiveContainer>
  );
};

export default EmployeeList;