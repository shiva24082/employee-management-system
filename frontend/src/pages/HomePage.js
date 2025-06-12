import React from 'react';
import EmployeeList from '../components/employees/EmployeeList';
import ResponsiveContainer from '../components/layout/ResponsiveContainer';

const HomePage = () => {
  return (
    <ResponsiveContainer>
      <EmployeeList />
    </ResponsiveContainer>
  );
};

export default HomePage;