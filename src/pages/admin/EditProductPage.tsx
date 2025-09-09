// src/pages/admin/EditProductPage.tsx
import { useEffect, useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";

interface Product {
  id: number;
  title: string;
  price_usd: number;
  price_idr: number;
  category: string;
  images: string[];
  description?: string;
  isCustom?: boolean;

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

interface RawProduct {
  id: number | string;
  title?: string;
  price_usd?: number;
  price_idr?: number;
  category?: string | { name: string };
  image?: string;
  images?: string[];
  description?: string;
}

const GITHUB_JSON_URL =
  "https://muhammaddiazgirgani.github.io/api-json/guitars.json";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [priceUsd, setPriceUsd] = useState(0);
  const [priceIdr, setPriceIdr] = useState(0);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [model, setModel] = useState("");
  const [strings, setStrings] = useState(6);
  const [color, setColor] = useState("");
  const [materials, setMaterials] = useState({
    body: "",
    back: "",
    top: "",
    fretboard: "",
    neck: "",
    strings: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(GITHUB_JSON_URL);
        if (!res.ok) throw new Error("Failed to fetch data from GitHub");
        const data: RawProduct[] = await res.json();

        const jsonProducts: Product[] = data.map((p) => ({
          id: Number(p.id),
          title: p.title ?? "No Title",
          category:
            typeof p.category === "object"
              ? p.category.name
              : p.category ?? "Uncategorized",
          images: Array.isArray(p.images)
            ? p.images
            : [p.image || "/images/no-image.png"],
          price_usd: p.price_usd ?? 0,
          price_idr: p.price_idr ?? 0,
          description: p.description ?? "",
          isCustom: false,
        }));

        const customProducts: Product[] = JSON.parse(
          localStorage.getItem("customProducts") || "[]"
        );
        const deletedIds: number[] = JSON.parse(
          localStorage.getItem("deletedProducts") || "[]"
        );

        const allProducts = [
          ...customProducts,
          ...jsonProducts.filter((p) => !deletedIds.includes(p.id)),
        ];

        const found = allProducts.find((p) => p.id === Number(id));
        if (found) {
          setProduct(found);
          setTitle(found.title);
          setPriceUsd(found.price_usd);
          setPriceIdr(found.price_idr);
          setCategory(found.category);
          setImage(found.images[0]);
          setDescription(found.description ?? "");
          setWeight(found.weight ?? "");
          setDimensions(found.dimensions ?? "");
          setModel(found.model ?? "");
          setStrings(found.strings ?? 6);
          setColor(found.color ?? "");
          setMaterials({
            body: "",
            back: "",
            top: "",
            fretboard: "",
            neck: "",
            strings: "",
            ...found.materials,
          });
        }
      } catch (err) {
        console.error("❌ Error fetching:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const updatedProduct: Product = {
      ...product,
      title,
      price_usd: priceUsd,
      price_idr: priceIdr,
      category,
      images: [image],
      description,
      weight,
      dimensions,
      model,
      strings,
      color,
      materials,
      isCustom: true,
    };

    const customList: Product[] = JSON.parse(
      localStorage.getItem("customProducts") || "[]"
    );
    const editedList: Product[] = JSON.parse(
      localStorage.getItem("editedProducts") || "[]"
    );

    if (product.isCustom) {
      const newCustomList = customList.map((p) =>
        p.id === product.id ? updatedProduct : p
      );
      localStorage.setItem("customProducts", JSON.stringify(newCustomList));
    } else {
      const newEditedList = [...editedList];
      const index = newEditedList.findIndex((p) => p.id === product.id);
      if (index >= 0) newEditedList[index] = updatedProduct;
      else newEditedList.push(updatedProduct);
      localStorage.setItem("editedProducts", JSON.stringify(newEditedList));
    }

    navigate("/admin");
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <p>Loading products...</p>
      </Container>
    );
  }

  if (!product)
    return <Alert variant="warning">Product not found</Alert>;

  return (
    <>
      <AdminNavbar />
      <Container className="mb-5" style={{ maxWidth: "600px" }}>
        <h3>Edit Product</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
  <Form.Label>Product Name</Form.Label>
  <Form.Control
    value={title}
    onChange={(e) => setTitle(e.target.value)}
  />
</Form.Group>

<Form.Group className="mb-3">
  <Form.Label>Price (USD)</Form.Label>
  <Form.Control
    type="number"
    value={priceUsd}
    onChange={(e) => setPriceUsd(Number(e.target.value))}
  />
</Form.Group>

<Form.Group className="mb-3">
  <Form.Label>Price (IDR)</Form.Label>
  <Form.Control
    type="number"
    value={priceIdr}
    onChange={(e) => setPriceIdr(Number(e.target.value))}
  />
</Form.Group>

<Form.Group className="mb-3">
  <Form.Label>Category</Form.Label>
  <Form.Select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
  >
    <option value="">Select Category</option>
    <option value="Schecter">Schecter</option>
    <option value="Ibanez">Ibanez</option>
    <option value="Gibson">Gibson</option>
    <option value="Stratocaster">Stratocaster</option>
    <option value="Telecaster">Telecaster</option>
    <option value="ESP">ESP</option>
  </Form.Select>
</Form.Group>


<Form.Group className="mb-3">
  <Form.Label>Image URL</Form.Label>
  <Form.Control
    value={image}
    onChange={(e) => setImage(e.target.value)}
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
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Dimensions</Form.Label>
            <Form.Control
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Model</Form.Label>
            <Form.Control
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Number of Strings</Form.Label>
            <Form.Control
              type="number"
              value={strings}
              onChange={(e) => setStrings(Number(e.target.value))}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Color</Form.Label>
            <Form.Control
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </Form.Group>

          <h5>Materials</h5>
          <Form.Group className="mb-3">
            <Form.Label>Body</Form.Label>
            <Form.Control
              value={materials.body}
              onChange={(e) =>
                setMaterials({ ...materials, body: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Back</Form.Label>
            <Form.Control
              value={materials.back}
              onChange={(e) =>
                setMaterials({ ...materials, back: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Top</Form.Label>
            <Form.Control
              value={materials.top}
              onChange={(e) =>
                setMaterials({ ...materials, top: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fretboard</Form.Label>
            <Form.Control
              value={materials.fretboard}
              onChange={(e) =>
                setMaterials({ ...materials, fretboard: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Neck</Form.Label>
            <Form.Control
              value={materials.neck}
              onChange={(e) =>
                setMaterials({ ...materials, neck: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Strings</Form.Label>
            <Form.Control
              value={materials.strings}
              onChange={(e) =>
                setMaterials({ ...materials, strings: e.target.value })
              }
            />
          </Form.Group>

          <Button type="submit" variant="dark">
            Save Changes
          </Button>
        </Form>
      </Container>
    </>
  );
}
