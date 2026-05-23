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



  const isWeekendSale = () => {
    const day = new Date().getDay();
    return day === 0 || day === 6;
  };

  const getDiscountedPrice = (price: number) => {
    return Math.round(price * 0.8);
  };

  const getFinalPrice = (price: number) => {
    return isWeekendSale()
      ? getDiscountedPrice(price)
      : price;
  };


  const normalizeProduct = (p: RawProduct): Product => ({
    id: typeof p.id === "string" ? parseInt(p.id) : p.id,

    title: p.title,

    price_usd:
      p.price_usd ??
      p.price ??
      p.price_idr ??
      0,

    images:
      p.images && p.images.length > 0
        ? p.images
        : p.image
        ? [p.image]
        : ["https://via.placeholder.com/200"],

    qty: p.qty ?? 1,
  });

  useEffect(() => {
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
    (sum, item) =>
      sum +
      getFinalPrice(item.price_usd ?? 0) *
        (item.qty ?? 1),
    0
  );

  const handleProceedToPayment = () => {
    if (!user) {
      alert("User data not found. Please login first.");

      navigate("/login");

      return;
    }

    if (
      !user.address ||
      user.address.trim() === "" ||
      user.address === "No address provided"
    ) {
      alert(
        "Address is not filled. Please complete your address on the profile page."
      );

      navigate("/profile/edit");

      return;
    }

    const pendingOrder = {
      customer: user,

      items: cartItems,

      total: totalPrice,

      weekendSale: isWeekendSale(),

      date: new Date().toISOString(),
    };

    localStorage.setItem(
      "pendingOrder",
      JSON.stringify(pendingOrder)
    );

    navigate("/payment");
  };

  if (cartItems.length === 0) {
    return (
      <Container className="mt-4">
        <Alert variant="info">
          Your cart is empty
        </Alert>

        <Button
          variant="dark"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Shop
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-2 mb-5">
      <Row>
        <Col md={6}>
          <h3 className="mobilemargin"></h3>

          {user ? (
            <div className="mb-3">
              <p>
                <strong>Name:</strong> {user.name}
              </p>

              <p>
                <strong>Email:</strong> {user.email}
              </p>

              <p>
                <strong>Address:</strong> {user.address}
              </p>
            </div>
          ) : (
            <Alert variant="warning">
              User data not available
            </Alert>
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
          <h3 className="ordermargin">
            Order Summary
          </h3>
          {isWeekendSale() && (
            <div
              style={{
                background: "#ff4d4f",
                color: "white",
                padding: "10px 15px",
                borderRadius: "12px",
                marginBottom: "20px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              🎸 WEEKEND SALE 20% OFF ACTIVE
            </div>
          )}

          <div className="order-summary">
            {cartItems.map((item) => (
              <Card
                key={item.id}
                className="mb-2 p-2"
              >
                <Row>
                  <Col xs={3}>
                    <img
                      src={
                        item.images?.[0] ??
                        "/images/no-image.png"
                      }
                      alt={item.title}
                      onError={(e) => {
                        (
                          e.target as HTMLImageElement
                        ).src =
                          "/images/no-image.png";
                      }}
                      style={{
                        width: "100%",
                        height: "80px",
                        objectFit: "contain",
                      }}
                    />
                  </Col>
                  <Col xs={9}>
                    <h6>{item.title}</h6>
                    {isWeekendSale() ? (
                      <>
                        <div
                          style={{
                            textDecoration:
                              "line-through",
                            color: "#888",
                            fontSize: "14px",
                          }}
                        >
                          ${item.price_usd}
                        </div>
                        <div
                          style={{
                            color: "#ff4d4f",
                            fontWeight: "bold",
                            fontSize: "22px",
                          }}
                        >
                          $
                          {getFinalPrice(
                            item.price_usd ?? 0
                          )}
                        </div>
                        <div
                          style={{
                            background: "#ff4d4f",
                            color: "white",
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: "8px",
                            fontSize: "11px",
                            marginBottom: "6px",
                          }}
                        >
                          WEEKEND SALE
                        </div>

                        <p>
                          $
                          {getFinalPrice(
                            item.price_usd ?? 0
                          )}{" "}
                          × {item.qty ?? 1}
                        </p>

                        <strong>
                          Subtotal: $
                          {(
                            getFinalPrice(
                              item.price_usd ?? 0
                            ) *
                            (item.qty ?? 1)
                          ).toFixed(2)}
                        </strong>
                      </>
                    ) : (
                      <>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: "20px",
                          }}
                        >
                          ${item.price_usd}
                        </div>

                        <p>
                          ${item.price_usd} ×{" "}
                          {item.qty ?? 1}
                        </p>

                        <strong>
                          Subtotal: $
                          {(
                            (item.price_usd ?? 0) *
                            (item.qty ?? 1)
                          ).toFixed(2)}
                        </strong>
                      </>
                    )}
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
          <h4 className="mt-3">
            Total: ${totalPrice.toFixed(2)}
          </h4>
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