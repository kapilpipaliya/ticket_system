import * as React from 'react'
import {Col, Container, Row} from "react-bootstrap";
import blueDotLeftBars from '../../../assets/icons/dots/blue-dot-left-bars.svg'
import yellowDotRightShield from '../../../assets/icons/dots/yellow-dot-right-shield.svg'
import zPicture from '../../../assets/images/z-picture.png'
interface HomePageProps {

}
export const HomePage = (props: HomePageProps) => {
    return <>
            <Container className={"mt-8"}>
                <Row className="align-items-center">
                    <Col xs={12} lg={6} className="mb-5 mb-lg-0">
                        <span className="small text-info fw-bold">What's new at Shuffle</span>
                        <h1 className="mt-8 mb-8 mb-lg-12">Take care of your performance every day.</h1>
                        <p className="lead text-muted mb-8 mb-lg-12">Build a well-presented brand that everyone will
                            love. Take care to develop resources continually and integrity them with previous
                            projects.</p>
                        <div className="d-flex flex-wrap"><a className="btn btn-primary me-4" href="#">Track your
                            performance</a><a className="btn btn-outline-dark" href="#">Learn More</a></div>
                    </Col>
                    <Col xs={12} lg={6} className="position-relative">
                        <img className="position-relative img-fluid" src={zPicture} alt="" />
                    </Col>
                </Row>
            </Container>
        </>
}
export default HomePage