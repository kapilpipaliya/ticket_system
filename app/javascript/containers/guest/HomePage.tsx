import * as React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import blueDotLeftBars from '../../../assets/icons/dots/blue-dot-left-bars.svg';
import yellowDotRightShield from '../../../assets/icons/dots/yellow-dot-right-shield.svg';
import zPicture from '../../../assets/images/z-picture.png';

interface HomePageProps {}

export const HomePage = (props: HomePageProps) => {
  return (
    <>
      <Container className={'mt-8'}>
        <Row className="align-items-center">
          <Col xs={12} lg={6} className="mb-5 mb-lg-0">
            <span className="small text-info fw-bold">What's new at Mentor</span>
            <h1 className="mt-8 mb-8 mb-lg-12">Lets' talk.</h1>
            <p className="lead text-muted mb-8 mb-lg-12">Didn’t Find Any Solution? Just create a ticket. our team will respond in 24 hours.</p>
            <div className="d-flex flex-wrap">
              <a className="btn btn-primary me-4" href="/tickets/new">
                Create Ticket
              </a>
              <a className="btn btn-outline-dark" href="/tickets/new">
                Learn More
              </a>
            </div>
          </Col>
          <Col xs={12} lg={6} className="position-relative">
            <img className="d-none d-lg-block position-absolute top-0 end-0 mt-5" src={yellowDotRightShield} alt="" />
            <img className="position-relative img-fluid" src={zPicture} alt="" />
            <img className="d-none d-lg-block position-absolute bottom-0 start-0 mb-5" src={blueDotLeftBars} alt="" />
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default HomePage;
