// src/pages/admin/AddProduct.tsx
import { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";

const categories = ["Schecter", "Gibson", "Fender", "Epiphone"];

export default function AddProduct() {
  const [title, setTitle] = useState("");
  const [priceUsd, setPriceUsd] = useState("");
  const [priceIdr, setPriceIdr] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");

  // 🔹 Tambahan field detail produk
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [model, setModel] = useState("");
  const [strings, setStrings] = useState("");
  const [color, setColor] = useState("");

  type Materials = {
    body: string;
    back: string;
    top: string;
    fretboard: string;
    neck: string;
    strings: string;
  };

  const [materials, setMaterials] = useState<Materials>({
    body: "",
    back: "",
    top: "",
    fretboard: "",
    neck: "",
    strings: "",
  });

  const navigate = useNavigate();

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct = {
      id: Date.now(),
      title,
      price_usd: parseFloat(priceUsd),
      price_idr: parseFloat(priceIdr),
      description,
      images: imageUrl ? [imageUrl] : ["/images/no-image.png"],
      category: { name: category },
      weight,
      dimensions,
      model,
      strings: strings ? parseInt(strings) : undefined,
      color,
      materials,
      isCustom: true,
    };

    const customProducts = JSON.parse(localStorage.getItem("customProducts") || "[]");
    const updated = [...customProducts, newProduct];
    localStorage.setItem("customProducts", JSON.stringify(updated));

    alert("Product added successfully!");
    navigate("/admin");
  };

  return (
    <>
      <AdminNavbar />
      <Container className="mt-4" style={{ maxWidth: "600px" }}>
          <Button
            variant="secondary"
            className="mb-3"
            onClick={() => navigate("/admin")}
          >
            ← Back to Dashboard
          </Button>
        <Card className="p-4 shadow-sm">
          <h3 className="mb-3">➕ Add Product</h3>
          <Form onSubmit={handleAddProduct}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price (USD)</Form.Label>
              <Form.Control
                type="number"
                value={priceUsd}
                onChange={(e) => setPriceUsd(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price (IDR)</Form.Label>
              <Form.Control
                type="number"
                value={priceIdr}
                onChange={(e) => setPriceIdr(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Weight</Form.Label>
              <Form.Control
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Dimensions</Form.Label>
              <Form.Control
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Model</Form.Label>
              <Form.Control
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Number of Strings</Form.Label>
              <Form.Control
                type="number"
                value={strings}
                onChange={(e) => setStrings(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Color</Form.Label>
              <Form.Control
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </Form.Group>

            <h5 className="mt-3">Materials</h5>
            {(Object.keys(materials) as (keyof Materials)[]).map((key) => (
              <Form.Group className="mb-2" key={key}>
                <Form.Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Form.Label>
                <Form.Control
                  type="text"
                  value={materials[key]}
                  onChange={(e) =>
                    setMaterials((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                />
              </Form.Group>
            ))}

            <Button variant="dark" type="submit" className="w-100 mt-3">
              Add Product
            </Button>
          </Form>
        </Card>
      </Container>
    </>
  );
}
