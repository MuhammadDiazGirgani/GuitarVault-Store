import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  ButtonGroup,
} from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";

interface Product {
  id: number;
  title: string;
  price: number; // gunakan price sebagai standar
  description?: string;
  images: string[];
  category?: {
    id: number;
    name: string;
    image?: string;
  };
  qty?: number;
}
interface RawProduct {
  id: number | string;
  title: string;
  price?: number;
  price_usd?: number;
  description?: string;
  image?: string;
  images?: string[];
  category?: {
    id: number;
    name: string;
    image: string;
  };
  qty?: number;
}

interface LayoutContext {
  cart: Product[];
  setCart: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function Cart() {
  const { cart, setCart } = useOutletContext<LayoutContext>();
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const navigate = useNavigate();

const normalizeProduct = (p: RawProduct): Product => ({
  id: typeof p.id === "string" ? parseInt(p.id) : p.id,
  title: p.title,
  price: Number(p.price ?? p.price_usd ?? 0),
  description: p.description ?? "",
  images:
    p.images && p.images.length > 0
      ? p.images
      : p.image
      ? [p.image]
      : ["https://via.placeholder.com/200"],
  category: p.category,
  qty: p.qty ?? 1,
});

useEffect(() => {
  const savedCart = localStorage.getItem("cartItems");
  if (savedCart) {
    const parsed: RawProduct[] = JSON.parse(savedCart);
    const normalized = parsed.map((p) => normalizeProduct(p));
    setCartItems(normalized);
  }
}, [cart]);


  const updateCart = (updated: Product[]) => {
    setCartItems(updated);
    setCart(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
  };

  const removeItem = (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id);
    updateCart(updated);
    toast.error("Product removed from cart ❌");
  };

  const clearCart = () => {
    setCartItems([]);
    setCart([]);
    localStorage.removeItem("cartItems");
    toast.error("Cart cleared 🗑️");
  };

  const increaseQty = (id: number) => {
  const updated = cartItems.map((item) =>
    item.id === id ? { ...item, qty: (item.qty ?? 1) + 1 } : item
  );
  updateCart(updated);
};

const decreaseQty = (id: number) => {
  const updated = cartItems
    .map((item) =>
      item.id === id ? { ...item, qty: (item.qty ?? 1) - 1 } : item
    )
    .filter((item) => (item.qty ?? 1) > 0);
  updateCart(updated);
};


const totalPrice = cartItems.reduce(
  (sum, item) => sum + item.price * (item.qty || 1),
  0
);

  return (
    <Container className="mt-4 mb-4">
      <h2 className="mb-4 mobilemargin">🛒 Your Cart</h2>
      {cartItems.length === 0 ? (
        <Alert variant="info">Cart is empty</Alert>
      ) : (
        <>
          <Row className="g-4">
            {cartItems.map((item) => (
              <Col key={item.id} xs={12} md={6} lg={4}>
                <Card className="h-100 shadow-sm">
                  <Card.Img
  variant="top"
  src={item.images[0]}
  alt={item.title}
  style={{ height: "200px", objectFit: "contain" }}
/>

                  <Card.Body>
                    <Card.Title className="fs-6">{item.title}</Card.Title>
<Card.Text className="fw-bold">
  ${item.price} × {item.qty ?? 1}
</Card.Text>
   <ButtonGroup className="mb-2">
                      <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={() => decreaseQty(item.id)}
                      >
                        -
                      </Button>
                      <Button variant="light" size="sm" disabled>
  {item.qty ?? 1}
</Button>

                      <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={() => increaseQty(item.id)}
                      >
                        +
                      </Button>
                    </ButtonGroup>

                    <div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mt-4 gap-3">
            <h4 className="mb-2 mb-md-0">Total: ${totalPrice.toFixed(2)}</h4>
            <div className="d-flex flex-column flex-md-row gap-2 w-100 w-md-auto ">
              <Button variant="danger" onClick={clearCart} className="btn-detail">
                Clear Cart
              </Button>
              <Button variant="dark" onClick={() => navigate("/checkout")} className="btn-detail">
                Checkout
              </Button>
            </div>
          </div>
        </>
      )}

      <div className="mt-4 mb-4">
        <Button variant="outline-dark" onClick={() => navigate("/dashboard")} className="btn-detail">
          ← Back to Shop
        </Button>
      </div>
    </Container>
  );
}
