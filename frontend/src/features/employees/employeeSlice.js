import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchEmployees, 
  fetchEmployee, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee
} from '../../services/api';
import { showToast } from '../../utils/toast';

const initialState = {
  employees: [],
  employee: null,
  status: 'idle',
  error: null
};

export const getEmployees = createAsyncThunk(
  'employees/getEmployees',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await fetchEmployees(filters);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to load employees');
    }
  }
);

export const getEmployee = createAsyncThunk(
  'employees/getEmployee',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetchEmployee(id);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to load employee');
    }
  }
);

export const addEmployee = createAsyncThunk(
  'employees/addEmployee',
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await createEmployee(employeeData);
      showToast('Employee created successfully!');
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create employee');
    }
  }
);

export const editEmployee = createAsyncThunk(
  'employees/editEmployee',
  async ({ id, employeeData }, { rejectWithValue }) => {
    try {
      const response = await updateEmployee(id, employeeData);
      showToast('Employee updated successfully!');
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update employee');
    }
  }
);

export const removeEmployee = createAsyncThunk(
  'employees/removeEmployee',
  async (id, { rejectWithValue }) => {
    try {
      await deleteEmployee(id);
      showToast('Employee deleted successfully!');
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete employee');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearEmployee: (state) => {
      state.employee = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmployees.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees = action.payload;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getEmployee.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getEmployee.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employee = action.payload;
      })
      .addCase(getEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addEmployee.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees.push(action.payload);
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(editEmployee.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(editEmployee.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.employees.findIndex(
          (emp) => emp._id === action.payload._id
        );
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      .addCase(editEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(removeEmployee.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(removeEmployee.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employees = state.employees.filter(
          (emp) => emp._id !== action.payload
        );
      })
      .addCase(removeEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { clearEmployee, clearError } = employeeSlice.actions;

export const selectAllEmployees = (state) => state.employees.employees;
export const selectEmployeeById = (state) => state.employees.employee;
export const selectEmployeesStatus = (state) => state.employees.status;
export const selectEmployeesError = (state) => state.employees.error;

export default employeeSlice.reducer;