import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";

interface Product {
  id: number;
  title: string;
  price: number;
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
    image?: string;
  };
  qty?: number;
}

interface LayoutContext {
  wishlist: Product[];
  setWishlist: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: Product[];
  setCart: React.Dispatch<React.SetStateAction<Product[]>>;
}

// normalize product untuk wishlist
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

// normalize untuk cart (dari wishlist)
const normalizeForCart = (p: Product): Product => ({
  ...p,
  price: Number(p.price ?? 0),
  qty: p.qty ?? 1,
  images: p.images && p.images.length > 0 ? p.images : ["https://via.placeholder.com/200"],
});

export default function Wishlist() {
  const { wishlist, setWishlist, cart, setCart } = useOutletContext<LayoutContext>();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const navigate = useNavigate();

  // ambil wishlist dari localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlistItems");
    if (savedWishlist) {
      const parsed: RawProduct[] = JSON.parse(savedWishlist);
      const normalized = parsed.map((p) => normalizeProduct(p));
      setWishlistItems(normalized);
    }
  }, [wishlist]);

  const removeItem = (id: number) => {
    const updated = wishlistItems.filter((item) => item.id !== id);
    setWishlistItems(updated);
    setWishlist(updated);
    localStorage.setItem("wishlistItems", JSON.stringify(updated));
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    setWishlist([]);
    localStorage.removeItem("wishlistItems");
    toast.error("Wishlist cleared 🗑️");
  };

  const moveToCart = (product: Product) => {
    const normalized = normalizeForCart(product);
    const updatedCart = [...cart, normalized];
    setCart(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    removeItem(product.id);
    toast.success("Product moved to cart 🛒");
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 mobilemargin">❤️ Your Wishlist</h2>

      {wishlistItems.length === 0 ? (
        <>
          <Alert variant="info">Your wishlist is empty</Alert>
          <div className="mt-4">
            <Button variant="outline-dark" onClick={() => navigate("/dashboard")}>
              ← Back to Shop
            </Button>
          </div>
        </>
      ) : (
        <>
          <Row className="g-4">
            {wishlistItems.map((item, index) => (
              <Col key={`${item.id}-${index}`} xs={12} md={6} lg={4}>
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={item.images[0]}
                    alt={item.title}
                    style={{ height: "200px", objectFit: "contain" }}
                  />
                  <Card.Body>
                    <Card.Title className="fs-6">{item.title}</Card.Title>
                    <Card.Text className="fw-bold">${item.price}</Card.Text>
                    <div className="d-flex justify-content-between">
                      <Button variant="dark" size="sm" onClick={() => moveToCart(item)}>
                        🛒 Move to Cart
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        ❌ Remove
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="d-flex justify-content-between mt-4 mb-5">
            <Button variant="outline-dark" onClick={() => navigate("/dashboard")} className="btn-detail">
              ← Back to Shop
            </Button>
            <Button variant="danger" onClick={clearWishlist} className="btn-detail">
              Clear Wishlist
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}
