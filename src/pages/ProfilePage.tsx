import { useEffect, useState } from "react";
import { Container, Card, Button, Badge, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface User {
  username: string;
  email: string;
  password: string;
  address: string;
}

interface Order {
  date: string;
  items: { id: number; title: string; price: number; quantity?: number }[];
  total: number;
  method: string;
  status: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }

    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  if (!user) {
    return (
      <Container className="mt-5 text-center">
        <h4>Not logged in</h4>
        <Button variant="dark" onClick={() => navigate("/login")}>
          Please login
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-5 " style={{ maxWidth: "700px" }}>
      <Card className="p-4 shadow-sm mb-4 editprofile">
        <h3 className="mb-3">👤 Profil Saya</h3>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p>
          <strong>Address:</strong>{" "}
          {user.address ? user.address : <Badge bg="warning">Not filled</Badge>}
        </p>
        <Button variant="dark" onClick={() => navigate("/profile/edit")}>
          ✏️ Edit Profile
        </Button>
      </Card>

      <Card className="p-4 shadow-sm mb-4">
        <h4 className="mb-3">🛒 Order History</h4>
        {orders.length === 0 ? (
          <p><Badge bg="secondary">No orders yet</Badge></p>
        ) : (
          <ListGroup>
            {orders.map((order, idx) => (
              <ListGroup.Item key={idx}>
                <p><strong>Date:</strong> {order.date}</p>
                <p><strong>Status:</strong> <Badge bg="info">{order.status}</Badge></p>
                <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.title} x {item.quantity || 1} (${item.price})
                    </li>
                  ))}
                </ul>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card>

      <div className="mt-4">
        <Button variant="outline-dark" onClick={() => navigate("/dashboard")}>
          ← Back to Shop
        </Button>
      </div>
    </Container>
  );
}
