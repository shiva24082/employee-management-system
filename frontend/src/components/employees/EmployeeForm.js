import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import { showToast } from '../../utils/toast';

const EmployeeForm = ({ 
  initialValues = {}, 
  onSuccess,
  onCancel,
  submitButtonText = 'Submit'
}) => {
    const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
   useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        const profile = localStorage.getItem('profile');
        const { token } = JSON.parse(profile);
        
        const response = await axios.get('/api/v1/employees', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setEmployees(response.data.data);
      } catch (error) {
        showToast('Failed to load employees', 'error');
      } finally {
        setLoadingEmployees(false);
      }
    };
    
    fetchEmployees();
  }, []);
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      salary: '',
      hireDate: null,
      status: 'active',
      manager: null,
      ...initialValues
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .required('First name is required')
        .max(50, 'First name cannot be more than 50 characters'),
      lastName: Yup.string()
        .required('Last name is required')
        .max(50, 'Last name cannot be more than 50 characters'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      phone: Yup.string()
        .max(20, 'Phone number cannot be longer than 20 characters'),
      department: Yup.string()
        .required('Department is required'),
      position: Yup.string()
        .required('Position is required'),
      salary: Yup.number()
        .required('Salary is required')
        .min(0, 'Salary cannot be negative'),
      hireDate: Yup.date()
        .required('Hire date is required'),
      status: Yup.string()
        .required('Status is required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const profile = localStorage.getItem('profile');
        if (!profile) {
          throw new Error('Please login first');
        }
        
        const { token } = JSON.parse(profile);
        if (!token) {
          throw new Error('Please login first');
        }

        const isUpdate = initialValues._id;
        const url = isUpdate 
          ? `/api/v1/employees/${initialValues._id}`
          : '/api/v1/employees';
        const method = isUpdate ? 'put' : 'post';

        const response = await axios({
          method,
          url,
          data: values,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        showToast(isUpdate ? 'Employee updated successfully!' : 'Employee created successfully!', 'success');
        if (onSuccess) onSuccess(response.data.data);
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        showToast(errorMessage, 'error');
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
     <FormControl fullWidth margin="normal">
        <InputLabel id="manager-label">Manager (Optional)</InputLabel>
        <Select
          labelId="manager-label"
          id="manager"
          name="manager"
          label="Manager"
          value={formik.values.manager || ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={loadingEmployees}
        >
          <MenuItem value="">No Manager</MenuItem>
          {employees.map((emp) => (
            <MenuItem key={emp._id} value={emp._id}>
              {emp.firstName} {emp.lastName}
            </MenuItem>
          ))}
        </Select>
        {loadingEmployees && (
          <CircularProgress size={24} sx={{ position: 'absolute', right: 40, top: 20 }} />
        )}
      </FormControl>
      <TextField
        fullWidth
        id="firstName"
        name="firstName"
        label="First Name"
        margin="normal"
        value={formik.values.firstName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
        helperText={formik.touched.firstName && formik.errors.firstName}
      />
      
      <TextField
        fullWidth
        id="lastName"
        name="lastName"
        label="Last Name"
        margin="normal"
        value={formik.values.lastName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
        helperText={formik.touched.lastName && formik.errors.lastName}
      />
      
      <TextField
        fullWidth
        id="email"
        name="email"
        label="Email"
        margin="normal"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />
      
      <TextField
        fullWidth
        id="phone"
        name="phone"
        label="Phone"
        margin="normal"
        value={formik.values.phone}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.phone && Boolean(formik.errors.phone)}
        helperText={formik.touched.phone && formik.errors.phone}
      />
      
      <FormControl fullWidth margin="normal" error={formik.touched.department && Boolean(formik.errors.department)}>
        <InputLabel id="department-label">Department</InputLabel>
        <Select
          labelId="department-label"
          id="department"
          name="department"
          label="Department"
          value={formik.values.department}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <MenuItem value="IT">IT</MenuItem>
          <MenuItem value="HR">HR</MenuItem>
          <MenuItem value="Finance">Finance</MenuItem>
          <MenuItem value="Marketing">Marketing</MenuItem>
          <MenuItem value="Operations">Operations</MenuItem>
          <MenuItem value="Sales">Sales</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>
      
      <TextField
        fullWidth
        id="position"
        name="position"
        label="Position"
        margin="normal"
        value={formik.values.position}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.position && Boolean(formik.errors.position)}
        helperText={formik.touched.position && formik.errors.position}
      />
      
      <TextField
        fullWidth
        id="salary"
        name="salary"
        label="Salary"
        type="number"
        margin="normal"
        value={formik.values.salary}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.salary && Boolean(formik.errors.salary)}
        helperText={formik.touched.salary && formik.errors.salary}
      />
      
      <DatePicker
        label="Hire Date"
        value={formik.values.hireDate}
        onChange={(date) => formik.setFieldValue('hireDate', date)}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            margin="normal"
            error={formik.touched.hireDate && Boolean(formik.errors.hireDate)}
            helperText={formik.touched.hireDate && formik.errors.hireDate}
          />
        )}
      />
      
      <FormControl fullWidth margin="normal" error={formik.touched.status && Boolean(formik.errors.status)}>
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          id="status"
          name="status"
          label="Status"
          value={formik.values.status}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="on leave">On Leave</MenuItem>
          <MenuItem value="terminated">Terminated</MenuItem>
        </Select>
      </FormControl>
      
      <Box mt={4}>
        <Button
          type="submit"
          variant="contained"
          sx={{ mr: 2 }}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Processing...' : submitButtonText}
        </Button>
        {onCancel && (
          <Button
            variant="outlined"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default EmployeeForm;