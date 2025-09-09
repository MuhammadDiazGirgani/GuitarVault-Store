// src/pages/admin/AdminDashboard.tsx
import { useEffect, useState } from "react";
import {
  Container,
  Button,
  Alert,
  Spinner,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";

interface Product {
  id: number;
  title: string;
  price_usd: number;
  price_idr: number;
  category: { name: string };
  images: string[];
  isCustom?: boolean;
}

interface RawProduct {
  id: number | string;
  title?: string;
  category?: string | { name: string };
  images?: string[];
  image?: string;
  price_usd?: number;
  price_idr?: number;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔐 Cek login & admin
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [navigate]);

  // 📦 Fetch produk dari GitHub + merge localStorage
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          "https://muhammaddiazgirgani.github.io/api-json/guitars.json"
        );
        if (!res.ok) throw new Error("Gagal fetch data dari GitHub");
        const data: RawProduct[] = await res.json();

        const storedCustom = JSON.parse(
          localStorage.getItem("customProducts") || "[]"
        );
        const editedProducts = JSON.parse(
          localStorage.getItem("editedProducts") || "[]"
        );
        const deletedIds: number[] = JSON.parse(
          localStorage.getItem("deletedProducts") || "[]"
        );

        const jsonProducts: Product[] = data.map((p: RawProduct) => ({
          id: Number(p.id),
          title: p.title ?? "No Title",
          category:
            typeof p.category === "object"
              ? p.category
              : { name: p.category ?? "Uncategorized" },
          images: Array.isArray(p.images)
            ? p.images
            : [p.image || "/images/no-image.png"],
          price_usd: p.price_usd ?? 0,
          price_idr: p.price_idr ?? 0,
        }));

        const filteredJson = jsonProducts.filter(
          (p) => !deletedIds.includes(p.id)
        );

        const mergedProducts = filteredJson.map((p) => {
          const edited = editedProducts.find((e: Product) => e.id === p.id);
          return edited ? edited : p;
        });

        const combined = [...storedCustom, ...mergedProducts].map((p) => ({
          ...p,
          category:
            typeof p.category === "object"
              ? p.category
              : { name: p.category || "Uncategorized" },
        }));

        setProducts(combined);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Terjadi kesalahan yang tidak diketahui");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 🗑 Hapus produk
  const handleDelete = (id: number, isCustom?: boolean) => {
    if (!isCustom) {
      alert("GitHub products cannot be deleted!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this product?")) return;

    const updatedProducts = products.filter((p) => p.id !== id);

    const updatedCustom = updatedProducts.filter((p) => p.isCustom);
    localStorage.setItem("customProducts", JSON.stringify(updatedCustom));

    setProducts(updatedProducts);
  };

  const handleEdit = (id: number, isCustom?: boolean) => {
    if (!isCustom) {
      alert("GitHub products cannot be edited!");
      return;
    }
    navigate(`/admin/edit-product/${id}`);
  };

  return (
    <>
      <AdminNavbar />
      <Container className="my-4">
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" /> <p>Loading products...</p>
          </div>
        ) : (
          <>
            <div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
              <h4 className="me-auto">Product Management</h4>
              {location.pathname !== "/admin" && (
                <Button
                  variant="secondary"
                  onClick={() => navigate("/admin")}
                >
                  📦 Product
                </Button>
              )}
              {location.pathname !== "/admin/add-product" && (
                <Button
                  variant="dark"
                  onClick={() => navigate("/admin/add-product")}
                >
                  ➕ Add Product
                </Button>
              )}
            </div>
<Row className="g-3">
  {products.map((p, index) => (
    <Col xs={12} key={p.id}>
      <Card className="shadow-sm">
        <Card.Body className="d-flex align-items-center flex-wrap">
          <div style={{ width: "40px", textAlign: "center" }}>{index + 1}</div>
          <div style={{ width: "60px", marginRight: "10px" }}>
            <img
              src={p.images && p.images.length > 0 ? p.images[0] : "/images/no-image.png"}
              alt={p.title}
              style={{ width: "60px", height: "60px", objectFit: "cover" }}
            />
          </div>
          <div className="flex-grow-1">
            <h6 className="mb-1">
              {p.title}{" "}
              {p.isCustom && <small style={{ color: "green" }}>(Editable)</small>}
            </h6>
            <div className="d-flex flex-wrap gap-3">
              <span>Price: ${p.price_usd}</span>
              <span>Category: {typeof p.category === "string" ? p.category : p.category?.name}</span>
            </div>
          </div>
          <div className="d-flex gap-2 mt-2 mt-md-0">
            <Button
              variant="warning"
              size="sm"
              onClick={() => handleEdit(p.id, p.isCustom)}
              disabled={!p.isCustom}
            >
              ✏️ Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(p.id, p.isCustom)}
              disabled={!p.isCustom}
            >
              🗑 Delete
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  ))}
</Row>
      </>
        )}
      </Container>
    </>
  );
}
