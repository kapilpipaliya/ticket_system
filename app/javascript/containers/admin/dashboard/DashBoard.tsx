import * as React from 'react';
import { Container } from 'react-bootstrap';
import 'react-google-flight-datepicker/dist/main.css';
import { DynamicDashboard } from './DynamicDashboard';
import { FixedDashboard } from './FixedDashboard';

const DashBoard = () => {
  return (
    <Container fluid className={'mt-2'}>
      <FixedDashboard />
      <DynamicDashboard />
    </Container>
  );
};
export default DashBoard;
