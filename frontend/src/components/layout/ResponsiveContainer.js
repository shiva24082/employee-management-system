import React from 'react';
import { Container, useMediaQuery, useTheme } from '@mui/material';

const ResponsiveContainer = ({ children, ...props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container 
      maxWidth="lg"
      sx={{
        pt: isMobile ? 2 : 4,
        pb: isMobile ? 10 : 4,
        px: isMobile ? 2 : 4
      }}
      {...props}
    >
      {children}
    </Container>
  );
};

export default ResponsiveContainer;