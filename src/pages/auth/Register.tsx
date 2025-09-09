import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Card } from "react-bootstrap";
import bannerImg from "../../assets/auth.jpg";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!username || !email || !password) {
      alert("All fields are required!");
      return;
    }

    const newUser = { username, email, password };

    // simpan ke localStorage (array users)
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    alert("Registration successful, please login!");
    navigate("/login");
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
          <h3 className="mb-4 text-center">Register</h3>

<Form
  onSubmit={(e) => {
    e.preventDefault();
    handleRegister();
  }}
>
  <Form.Group className="mb-3">
    <Form.Label>Username</Form.Label>
    <Form.Control
      type="text"
      placeholder="Enter Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
  </Form.Group>

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
    Register
  </Button>
</Form>
        </Card>
      </Container>
    </div>
  );
}
