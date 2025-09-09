import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { BsInstagram, BsFacebook, BsTwitter } from "react-icons/bs";
import guitarLogo from "../assets/guitar.png";

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        marginTop: "80px",
        padding: "30px 0",
        backgroundColor: "#1c1c1c",
        color: "#fff",
        fontSize: "0.9rem",
      }}
    >
      <Container>
        <Row className="text-md-start text-center">
          <Col md={6} className="mb-3 mb-md-0">
            <div className="d-flex align-items-center gap-2 justify-content-center justify-content-md-start mb-2">
              <img
                src={guitarLogo}
                alt="GuitarVault Logo"
                style={{ width: "28px", height: "28px", objectFit: "contain" }}
              />
              <h5 className="mb-0">GuitarVault Store</h5>
            </div>
            <p className="mb-1">© 2025 All rights reserved.</p>
            <p className="mb-0">Email: dzgrgn@guitarvault.com</p>
          </Col>

          <Col
            md={6}
            className="d-flex align-items-center justify-content-center justify-content-md-end gap-4"
          >
            <a
              href="https://instagram.com/"
              style={{ color: "#fff" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsInstagram size={20} />
            </a>
            <a
              href="https://facebook.com/"
              style={{ color: "#fff" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsFacebook size={20} />
            </a>
            <a
              href="https://twitter.com/"
              style={{ color: "#fff" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsTwitter size={20} />
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
