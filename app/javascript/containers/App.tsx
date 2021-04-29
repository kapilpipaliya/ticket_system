import * as React from 'react'
import {Button, Container} from "react-bootstrap";
import {Link} from "react-feather";

const App = (props) => {
    return <Container>  <Button variant="link" href={'/tickets/new'}>Create Ticket</Button> </Container>
}
export default App;