import * as React from 'react';
import { Button, Container } from 'react-bootstrap';

const App = () => {
  return (
    <Container>
      <Button variant="link" href={'/tickets/new'}>
        Create Ticket
      </Button>
    </Container>
  );
};
export default App;
