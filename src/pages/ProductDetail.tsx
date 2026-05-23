import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";

interface Product {
  id: number;
  title: string;
  price_usd: number;
  price_idr: number;
  description?: string;
  images: string[];
  category: {
    name: string;
  };
  weight?: string;
  dimensions?: string;
  model?: string;
  strings?: number;
  color?: string;
  materials?: {
    body?: string;
    back?: string;
    top?: string;
    fretboard?: string;
    neck?: string;
    strings?: string;
  };
  isCustom?: boolean;
  qty?: number;
}

interface RawProduct {
  id: number | string;
  title?: string;
  description?: string;
  category?: string | { name: string };
  images?: string[];
  image?: string;
  price_usd?: number;
  price_idr?: number;
  weight?: string;
  dimensions?: string;
  model?: string;
  strings?: number;
  color?: string;
  materials?: {
    body?: string;
    back?: string;
    top?: string;
    fretboard?: string;
    neck?: string;
    strings?: string;
  };
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("loggedInUser");
  const isWeekend = () => {
    const day = new Date().getDay();
    return day === 0 || day === 6;
  };

  const discountedPrice = (price: number) => {
    return Math.round(price * 0.8);
  };

  const weekendSale = isWeekend();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          "https://muhammaddiazgirgani.github.io/api-json/guitars.json"
        );

        if (!res.ok) throw new Error("Gagal fetch data API");

        const data: RawProduct[] = await res.json();
        const jsonProducts: Product[] = data.map((p: RawProduct) => ({
          id: Number(p.id),
          title: p.title ?? "No Title",
          description: p.description ?? "No description",

          category:
            typeof p.category === "object"
              ? p.category
              : { name: p.category ?? "Uncategorized" },

          images: Array.isArray(p.images)
            ? p.images
            : [p.image || "/images/no-image.png"],

          price_usd: p.price_usd ?? 0,
          price_idr: p.price_idr ?? 0,

          weight: p.weight,
          dimensions: p.dimensions,
          model: p.model,
          strings: p.strings,
          color: p.color,
          materials: p.materials,
        }));
        const storedCustom = JSON.parse(
          localStorage.getItem("customProducts") || "[]"
        );
        const editedProducts = JSON.parse(
          localStorage.getItem("editedProducts") || "[]"
        );
        const deletedIds: number[] = JSON.parse(
          localStorage.getItem("deletedProducts") || "[]"
        );
        const filteredJson = jsonProducts.filter(
          (p) => !deletedIds.includes(p.id)
        );
        const mergedProducts = filteredJson.map((p) => {
          const edited = editedProducts.find(
            (e: Product) => e.id === p.id
          );

          return edited ? edited : p;
        });
        const combined = [...storedCustom, ...mergedProducts];
        const found = combined.find((p) => String(p.id) === id);

        setProduct(found || null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Terjadi kesalahan yang tidak diketahui");
        }

        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!product) return;

    const storedCart = JSON.parse(
      localStorage.getItem("cartItems") || "[]"
    );

    const existing = storedCart.find(
      (item: Product) => item.id === product.id
    );

    const finalPrice = weekendSale
      ? discountedPrice(product.price_usd)
      : product.price_usd;

    let updated;

    if (existing) {
      existing.qty = (existing.qty || 1) + 1;

      updated = storedCart.map((item: Product) =>
        item.id === product.id ? existing : item
      );
    } else {
      updated = [
        ...storedCart,
        {
          ...product,
          price_usd: finalPrice,
          qty: 1,
        },
      ];
    }

    localStorage.setItem("cartItems", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };
  const handleBuyNow = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!product) return;

    const finalPrice = weekendSale
      ? discountedPrice(product.price_usd)
      : product.price_usd;

    localStorage.setItem(
      "cartItems",
      JSON.stringify([
        {
          ...product,
          price_usd: finalPrice,
          qty: 1,
        },
      ])
    );

    navigate("/checkout");
  };
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <h3 className="text-center mt-5">
        ❌ Product not found
      </h3>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="g-4 productdetail">
        <Col md={6}>
          <img
            src={product.images[0]}
            alt={product.title}
            className="img-fluid rounded shadow-sm"
          />
        </Col>
        <Col md={6}>
          <h2>{product.title}</h2>
          {weekendSale ? (
            <div className="mb-3">
              <div className="d-flex align-items-center gap-3">

                <span
                  style={{
                    textDecoration: "line-through",
                    color: "#888",
                    fontSize: "20px",
                  }}
                >
                  ${product.price_usd}
                </span>
                <span
                  style={{
                    color: "#ff4d4f",
                    fontWeight: "bold",
                    fontSize: "32px",
                  }}
                >
                  ${discountedPrice(product.price_usd)}
                </span>
              </div>
              <div
                style={{
                  marginTop: "10px",
                  background: "#ff4d4f",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "10px",
                  width: "fit-content",
                  fontSize: "14px",
                  fontWeight: "600",
                  boxShadow: "0 0 15px rgba(255,77,79,0.35)",
                }}
              >
                WEEKEND SALE 20% OFF
              </div>

              <small className="text-muted d-block mt-2">
                Weekend promotion ends Sunday midnight
              </small>
            </div>
          ) : (
            <h4 className="text-muted">
              ${product.price_usd}
            </h4>
          )}

          <p>
            <strong>Category:</strong>{" "}
            {product.category.name}
          </p>

          {product.weight && (
            <p>
              <strong>Weight:</strong> {product.weight}
            </p>
          )}

          {product.dimensions && (
            <p>
              <strong>Dimensions:</strong>{" "}
              {product.dimensions}
            </p>
          )}

          {product.model && (
            <p>
              <strong>Model:</strong> {product.model}
            </p>
          )}

          {product.strings && (
            <p>
              <strong>Strings:</strong> {product.strings}
            </p>
          )}

          {product.color && (
            <p>
              <strong>Color:</strong> {product.color}
            </p>
          )}

          {product.materials && (
            <div>
              <strong>Materials:</strong>

              <ul>
                {product.materials.body && (
                  <li>
                    Body: {product.materials.body}
                  </li>
                )}

                {product.materials.back && (
                  <li>
                    Back: {product.materials.back}
                  </li>
                )}

                {product.materials.top && (
                  <li>
                    Top: {product.materials.top}
                  </li>
                )}

                {product.materials.fretboard && (
                  <li>
                    Fretboard:{" "}
                    {product.materials.fretboard}
                  </li>
                )}

                {product.materials.neck && (
                  <li>
                    Neck: {product.materials.neck}
                  </li>
                )}

                {product.materials.strings && (
                  <li>
                    Strings: {product.materials.strings}
                  </li>
                )}
              </ul>
            </div>
          )}
        </Col>
        <div className="d-flex justify-content-between mt-4 mb-5 align-items-center">
          <div>
            <Button
              variant="outline-dark"
              onClick={() => navigate("/dashboard")}
              className="btn-detail"
            >
              ← Back to Shop
            </Button>
          </div>
          <div className="d-flex gap-2 align-items-center">

            <Button
              variant="dark"
              onClick={handleAddToCart}
              className="btn-detail"
            >
              Add to Cart
            </Button>

            <Button
              variant="secondary"
              onClick={handleBuyNow}
              className="btn-detail"
            >
              Buy Now
            </Button>

          </div>
        </div>
      </Row>
    </Container>
  );
}