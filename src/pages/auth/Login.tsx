import { useState } from "react";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import bannerImg from "../../assets/auth.jpg";

interface User {
  username: string;
  email: string;
  password: string;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Hardcode akun admin
    if (email === "admin@shop.com" && password === "admin123") {
      const adminUser = { username: "Admin", email, role: "admin" };
      localStorage.setItem("loggedInUser", JSON.stringify(adminUser));
      navigate("/admin");
      return;
    }

    // Cek user biasa dari localStorage
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({ ...foundUser, role: "user" })
      );
      navigate("/dashboard");
    } else {
      setError("Email atau password salah. Silakan coba lagi.");
    }
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundImage: `url(${bannerImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
        }}
      />
      <Container
        style={{
          position: "relative",
          maxWidth: "400px",
          zIndex: 1,
        }}
      >
        <Card
          className="p-4 shadow-lg"
          style={{ backgroundColor: "rgba(255,255,255,0.9)", borderRadius: "12px" }}
        >
          <h3 className="mb-4 text-center">Login</h3>

          {error && <Alert variant="danger">{error}</Alert>}

<Form
  onSubmit={(e) => {
    e.preventDefault(); // mencegah reload halaman
    handleLogin();
  }}
>
  <Form.Group className="mb-3">
    <Form.Label>Email</Form.Label>
    <Form.Control
      type="email"
      placeholder="Enter Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  </Form.Group>

  <Form.Group className="mb-3">
    <Form.Label>Password</Form.Label>
    <Form.Control
      type="password"
      placeholder="Enter Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  </Form.Group>

  <Button variant="dark" className="w-100" type="submit">
    Login
  </Button>
</Form>

          <div className="mt-3 text-center">
            <span>Don't have an account?</span><br></br>
            <Link to="/register">Register here</Link>
          </div>
        </Card>
      </Container>
    </div>
  );
}
