import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer style={{marginTop: "100px"}}>
      <Container>
        <Row>
          <Col className="text-center">
            Copyright &copy;See
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
