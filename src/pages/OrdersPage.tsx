import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  id: number;
  title: string;

  price?: number;
  price_usd?: number;

  original_price?: number;
  discounted_price?: number;
  is_weekend_sale?: boolean;

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
const getFinalPrice = (item: OrderItem) => {
  return item.is_weekend_sale
    ? item.discounted_price ?? item.price_usd ?? item.price ?? 0
    : item.price_usd ?? item.price ?? 0;
};
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
              <p>
  <strong>Total:</strong> $
  {order.items
    .reduce(
      (sum, item) =>
        sum + getFinalPrice(item) * (item.qty || 1),
      0
    )
    .toFixed(2)}
</p>
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

  {item.is_weekend_sale ? (
    <>
      {/* ORIGINAL PRICE */}
      <div
        style={{
          textDecoration: "line-through",
          color: "#888",
          fontSize: "12px",
        }}
      >
        ${item.original_price}
      </div>

      {/* DISCOUNT PRICE */}
      <div
        style={{
          color: "#ff4d4f",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        ${item.discounted_price}
      </div>

      {/* BADGE */}
      <div
        style={{
          background: "#ff4d4f",
          color: "white",
          display: "inline-block",
          padding: "2px 6px",
          borderRadius: "6px",
          fontSize: "10px",
          marginBottom: "4px",
        }}
      >
        WEEKEND SALE
      </div>

      <div>
        ${item.discounted_price} × {item.qty || 1}
      </div>
    </>
  ) : (
    <>
      ${getFinalPrice(item)} × {item.qty || 1}
    </>
  )}

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
