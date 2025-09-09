import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  id: number;
  title: string;
  price: number;
  images: string[];
  qty?: number;
}

interface Order {
  date: string;
  status: string;
  payment: string;
  total: number;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (err) {
        console.error("Failed to parse orders:", err);
      }
    }
  }, []);

  if (orders.length === 0) {
    return (
      <Container className="mt-4">
        <Alert variant="info">You don’t have any orders yet</Alert>
        <Button variant="dark" onClick={() => navigate("/dashboard")}>
          ← Back to Shop
        </Button>
      </Container>
    );
  }

  return (
    <Container className="container">
      {orders.map((order, idx) => (
        <Card key={idx} className=" p-3 mb-4 margin">
          <Row>
            <Col>
              <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Payment:</strong> {order.payment}</p>
              <p><strong>Total:</strong> ${order.total}</p>
            </Col>
          </Row>
          <Row>
            {order.items.map((item) => (
              <Col key={item.id} xs={6} md={3} className="mb-2">
                <Card>
                  <Card.Img
                    src={item.images[0]}
                    style={{ height: "100px", objectFit: "contain" }}
                  />
                  <Card.Body >
                    <Card.Title className="ordertext">{item.title}</Card.Title>
                    <Card.Text className="ordertext">
                      ${item.price} × {item.qty || 1}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      ))}
      <div className="mt-5">
        <Button variant="outline-dark" onClick={() => navigate("/dashboard")}>
          ← Back to Shop
        </Button>
      </div>
    </Container>
  );
}
