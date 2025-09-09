// src/pages/Dashboard.tsx
import { useEffect, useState, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Dropdown,
  Spinner,
  Alert,
  Offcanvas,
  Form,
} from "react-bootstrap";
import { useOutletContext, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard";
import bannerImg from "../assets/banner2.jpg";
import type { Product, RawProduct } from "../types";

interface LayoutContext {
  search: string;
  cart: Product[];
  setCart: React.Dispatch<React.SetStateAction<Product[]>>;
  wishlist: Product[];
  setWishlist: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function Dashboard() {
  const { search, setCart, wishlist, setWishlist } =
    useOutletContext<LayoutContext>();

  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(15000);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const navigate = useNavigate();

  const ensureLoggedIn = () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      navigate("/login");
      return false;
    }
    return true;
  };

  const normalizeProduct = (p: RawProduct): Product => {
    const categoryRaw = p.category ?? p.category_name ?? "Uncategorized";
    let category: string;

    if (typeof categoryRaw === "object" && categoryRaw !== null) {
      category = categoryRaw.name ?? categoryRaw.label ?? "Uncategorized";
    } else {
      category = String(categoryRaw);
    }

    const price_usd = Number(p.price_usd ?? p.price ?? 0) || 0;
    const price_idr = Number(p.price_idr ?? Math.round(price_usd * 15500)) || 0;

    let image = "";
    if (Array.isArray(p.images) && p.images.length > 0) {
      const first = p.images[0];
      image = typeof first === "string" ? first : first.url ?? "";
    } else if (p.image) {
      image = typeof p.image === "string" ? p.image : p.image.url ?? "";
    }

    return {
      id: Number(p.id) || Date.now(),
      title: p.title ?? "Unknown Product",
      category,
      price_usd,
      price_idr,
      image,
      weight: p.weight,
      dimensions: p.dimensions,
      model: p.model,
      strings: p.strings,
      color: p.color,
      materials: p.materials,
    };
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          "https://muhammaddiazgirgani.github.io/api-json/guitars.json"
        );
        if (!res.ok) throw new Error("Failed to fetch API data");

        const guitarsData: RawProduct[] = await res.json();

        const customProductsRaw = JSON.parse(
          localStorage.getItem("customProducts") || "[]"
        );

        const combinedRaw: RawProduct[] = [
          ...(Array.isArray(customProductsRaw) ? customProductsRaw : []),
          ...(Array.isArray(guitarsData) ? guitarsData : []),
        ];

        const normalized = combinedRaw.map(normalizeProduct);

        const uniqueProducts = normalized.filter(
          (p, index, self) => index === self.findIndex((x) => x.id === p.id)
        );

        setProducts(uniqueProducts);
        setFiltered(uniqueProducts);

        const uniqueCategories = Array.from(
          new Set(uniqueProducts.map((p) => p.category))
        ).filter(Boolean) as string[];
        setCategories(uniqueCategories);

        const maxPrice = uniqueProducts.length
          ? Math.max(...uniqueProducts.map((p) => p.price_usd))
          : 15000;
        setPrice(maxPrice);
      } catch (err) {
        console.error(err);
        setError("⚠️ Failed to load products from API.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filterProducts = useCallback(
    (category: string, keyword: string, maxPrice: number) => {
      let temp = products.slice();

      if (category && category !== "All") {
        temp = temp.filter((p) => p.category === category);
      }

      if (keyword) {
        temp = temp.filter((p) =>
          p.title.toLowerCase().includes(keyword.toLowerCase())
        );
      }

      if (maxPrice) {
        temp = temp.filter((p) => p.price_usd <= maxPrice);
      }

      setFiltered(temp);
    },
    [products]
  );

  useEffect(() => {
    filterProducts(activeCategory, search, price);
  }, [search, price, activeCategory, filterProducts]);

  const handleFilter = (category: string) => {
    setActiveCategory(category);
    filterProducts(category, search, price);
  };

  const handleSort = (type: string) => {
    const temp = [...filtered];
    if (type === "low-high") temp.sort((a, b) => a.price_usd - b.price_usd);
    if (type === "high-low") temp.sort((a, b) => b.price_usd - a.price_usd);
    if (type === "newest") temp.sort((a, b) => b.id - a.id);
    setFiltered(temp);
  };

  const addToCart = (product: Product) => {
    if (!ensureLoggedIn()) return;

    const storedCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const existing = storedCart.find((item: Product) => item.id === product.id);

    let updated;
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
      updated = storedCart.map((item: Product) =>
        item.id === product.id ? existing : item
      );
    } else {
      updated = [...storedCart, { ...product, qty: 1 }];
    }

    setCart(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    toast.success(`${product.title} has been added to cart 🛒`);
  };

  const addToWishlist = (product: Product) => {
    if (!ensureLoggedIn()) return;

    const storedWishlist = JSON.parse(
      localStorage.getItem("wishlistItems") || "[]"
    );
    const exists = storedWishlist.some((item: Product) => item.id === product.id);

    let updated;
    if (!exists) {
      updated = [...storedWishlist, product];
      toast.success(`${product.title} added to wishlist ❤️`);
    } else {
      updated = storedWishlist.filter((item: Product) => item.id !== product.id);
      toast.error(`${product.title} removed from wishlist ❌`);
    }

    setWishlist(updated);
    localStorage.setItem("wishlistItems", JSON.stringify(updated));
  };

  const SidebarContent = () => (
    <div className="p-3">
      <div className="sidebar">
        <h6>Categories</h6>
        <Form.Check
          key="all"
          type="radio"
          id="category-all"
          name="category"
          label="All"
          checked={activeCategory === "All"}
          onChange={() => handleFilter("All")}
        />
        {categories.map((cat, idx) => (
          <Form.Check
            key={`${cat}-${idx}`}
            type="radio"
            id={`category-${idx}`}
            name="category"
            label={cat}
            checked={activeCategory === cat}
            onChange={() => handleFilter(cat)}
          />
        ))}
      </div>

      <div className="mb-3">
        <h6>Price (USD)</h6>
        <Form.Range
          min={0}
          max={Math.max(price, 10000)}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <div className="d-flex justify-content-between small text-muted">
          <span>$0</span>
          <span>up to ${price.toLocaleString()}</span>
        </div>
      </div>

      <div>
        <h6>Sort</h6>
        <Dropdown>
          <Dropdown.Toggle variant="secondary">Sort By</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleSort("low-high")}>
              💲 Lowest Price
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSort("high-low")}>
              💲 Highest Price
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSort("newest")}>
              🆕 Newest
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );

  return (
    <>
      <Container fluid className="p-0 mb-4 mt-5 d-none d-md-block">
        <img
          src={bannerImg}
          alt="Shop Banner"
          className="img-fluid w-100"
          style={{ maxHeight: "600px", objectFit: "cover" }}
        />
      </Container>

      <Container fluid>
        <Row>
          <div
            className="d-md-none"
            style={{ position: "fixed", bottom: 20, right: 10, zIndex: 1050 }}
          >
            <Button
              onClick={() => {
                setShowSidebar(!showSidebar);
                setIsRotating(true);
              }}
              className={`sidebar-toggle-btn ${isRotating ? "active" : ""}`}
              onAnimationEnd={() => setIsRotating(false)}
            >
              ☰
            </Button>
          </div>

          <Col md={3} lg={2} className="d-none d-md-block mb-4">
            <div className="border rounded bg-light">
              <SidebarContent />
            </div>
          </Col>

          <Col xs={12} md={9} lg={10}>
            {loading && (
              <div className="d-flex justify-content-center my-5">
                <Spinner animation="border" variant="dark" />
              </div>
            )}
            {error && <Alert variant="danger">{error}</Alert>}
            {!loading && !error && (
              <Row xs={1} md={4} lg={4} className="g-4 productmobile">
                {filtered.map((product, idx) => (
                  <Col key={`${product.id}-${idx}`}>
                    <ProductCard
                      product={product}
                      onAddToCart={addToCart}
                      onAddToWishlist={addToWishlist}
                      ensureLoggedIn={ensureLoggedIn}
                      isWishlisted={wishlist.some((w) => w.id === product.id)}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>

      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="title-sidebar">Filter Products</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <SidebarContent />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
