import * as React from 'react';
import { Button, Form, FormControl, Nav, Navbar } from 'react-bootstrap';

export const TopNavBar = () => {
  return (
    <Navbar bg="primary" variant="dark">
      <Navbar.Brand href="/">Ticket System</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="/">Home</Nav.Link>
        <Nav.Link href="/">Features</Nav.Link>
      </Nav>
      <Form inline>
        <Button variant="outline-light">Search</Button>
      </Form>
    </Navbar>
  );
};
