import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  title: string;
  price_usd?: number;
  price_idr?: number;
  image?: string;
  images?: string[];
  qty?: number;
}

interface RawProduct {
  id: number | string;
  title: string;
  price?: number;
  price_usd?: number;
  price_idr?: number;
  image?: string;
  images?: string[];
  qty?: number;
}

interface User {
  name: string;
  email: string;
  address: string;
}

export default function Checkout() {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Normalisasi setiap product
  const normalizeProduct = (p: RawProduct): Product => ({
    id: typeof p.id === "string" ? parseInt(p.id) : p.id,
    title: p.title,
    price_usd: p.price_usd ?? p.price ?? p.price_idr ?? 0,
    images: p.images && p.images.length > 0 ? p.images : p.image ? [p.image] : ["https://via.placeholder.com/200"],
    qty: p.qty ?? 1,
  });

  useEffect(() => {
    // Ambil cart dari localStorage
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      try {
        const parsed: RawProduct[] = JSON.parse(savedCart);
        const normalized = parsed.map(normalizeProduct);
        setCartItems(normalized);
      } catch {
        setCartItems([]);
      }
    }

    // Ambil user dari localStorage
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const normalizedUser: User = {
          name: parsed.name || parsed.username || "Guest",
          email: parsed.email || "unknown@example.com",
          address: parsed.address || "No address provided",
        };
        setUser(normalizedUser);
      } catch {
        setUser({
          name: savedUser,
          email: "unknown@example.com",
          address: "No address provided",
        });
      }
    }
  }, []);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price_usd ?? 0) * (item.qty ?? 1),
    0
  );

const handleProceedToPayment = () => {
  if (!user) {
    // Jika belum login
    alert("User data not found. Please login first.");
    navigate("/login");
  } else if (!user.address || user.address.trim() === "" || user.address === "No address provided") {
    // Jika login tapi belum ada alamat
    alert("Address is not filled. Please complete your address on the profile page.");
    navigate("/profile/edit");
  } else {
    // Jika semua valid → simpan order dan lanjut ke payment
    const pendingOrder = {
      customer: user,
      items: cartItems,
      total: totalPrice,
      date: new Date().toISOString(),
    };
    localStorage.setItem("pendingOrder", JSON.stringify(pendingOrder));
    navigate("/payment");
  }
};

  if (cartItems.length === 0) {
    return (
      <Container className="mt-4">
        <Alert variant="info">Your cart is empty</Alert>
        <Button variant="dark" onClick={() => navigate("/dashboard")}>
          ← Back to Shop
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-2 mb-5">
      <Row>
        <Col md={6}>
          <h3>Checkout</h3>
          {user ? (
            <div className="mb-3">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Address:</strong> {user.address}</p>
            </div>
          ) : (
            <Alert variant="warning">User data not available</Alert>
          )}
          <Button
            variant="dark"
            className="w-100 btn-paymentd"
            onClick={handleProceedToPayment}
          >
            Proceed to Payment
          </Button>
        </Col>

        <Col md={6}>
          <h3>Order Summary</h3>
          <div className="order-summary">
            {cartItems.map((item) => (
              <Card key={item.id} className="mb-2 p-2">
                <Row>
                  <Col xs={3}>
                    <img
                      src={item.images?.[0] ?? "/images/no-image.png"}
                      alt={item.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/no-image.png";
                      }}
                      style={{ width: "100%", height: "80px", objectFit: "contain" }}
                    />
                  </Col>
                  <Col xs={9}>
                    <h6>{item.title}</h6>
                    <p>${item.price_usd ?? 0} × {item.qty ?? 1}</p>
                    <strong>
                      Subtotal: ${((item.price_usd ?? 0) * (item.qty ?? 1)).toFixed(2)}
                    </strong>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
          <h4 className="mt-3">Total: ${totalPrice.toFixed(2)}</h4>
          <Button
            variant="dark"
            className="w-100 mt-3 btn-paymentm"
            onClick={handleProceedToPayment}
          >
            Proceed to Payment
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
