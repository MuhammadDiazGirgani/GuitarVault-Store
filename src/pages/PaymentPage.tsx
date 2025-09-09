import { useEffect, useState } from "react";
import { Container, Form, Button, Alert, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import type { Order } from "../types";

export default function PaymentPage() {
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("pendingOrder");
    if (saved) {
      setPendingOrder(JSON.parse(saved));
    } else {
      navigate("/checkout");
    }
  }, [navigate]);

  const completePayment = () => {
    if (!pendingOrder) return;

    const savedOrders: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");

    const newOrder: Order = {
      ...pendingOrder,
      payment: paymentMethod,
      status: "Paid",
    };

    localStorage.setItem("orders", JSON.stringify([...savedOrders, newOrder]));
    localStorage.removeItem("cartItems");
    localStorage.removeItem("pendingOrder");

    window.dispatchEvent(new Event("storage"));

    setShowModal(false);
    navigate("/orders");
  };

  const handlePayment = () => {
    if (paymentMethod === "Transfer") {
      setShowModal(true);
    } else {
      completePayment();
    }
  };

const handleCopy = () => {
  const accountNumber = "1234567890123456";
  navigator.clipboard.writeText(accountNumber).then(() => {
    setCopied(true);
  });
};


  if (!pendingOrder) {
    return (
      <Container className="mt-4">
        <Alert variant="info">No pending order found</Alert>
        <Button variant="dark" onClick={() => navigate("/dashboard")}>
          ← Back to Shop
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-2">
      <h3>Payment</h3>
      <p>Total Items: {pendingOrder.items?.length || 0}</p>
      <p>Total Price: ${pendingOrder.total?.toFixed(2) || 0}</p>

      <Form>
        <Form.Group>
          <Form.Label>Select Payment Method</Form.Label>
          <Form.Select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="COD">Cash on Delivery</option>
            <option value="Transfer">Bank Transfer</option>
            <option value="E-Wallet">E-Wallet</option>
          </Form.Select>
        </Form.Group>
      </Form>

      <Button className="mt-3" variant="dark" onClick={handlePayment}>
        Pay Now
      </Button>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Bank Transfer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please transfer to the following account:</p>
          <div className="border p-3 rounded mb-2">
            <strong>Bank CIJ</strong> <br />
<strong>GuitarVault Store</strong><br />
            No. Rekening:{" "}
            <span style={{ fontFamily: "monospace" }}>1234567890123456</span> <br />
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <span>1234567890123456</span>
            <Button variant="outline-dark" size="sm" onClick={handleCopy}>
              Copy
            </Button>
          </div>
          {copied && (
            <Alert variant="success" className="mt-2 p-1">
              Account number copied!
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="dark" onClick={completePayment}>
            Already Transferred
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
