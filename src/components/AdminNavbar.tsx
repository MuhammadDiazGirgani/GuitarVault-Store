// src/components/AdminNavbar.tsx
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface User {
  username: string;
  role: string;
}

export default function AdminNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  if (!user || user.role !== "admin") return null;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 px-3 py-2">
      <Container fluid>
        <Navbar.Brand
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/admin")}
        >
          ⚙️ Admin Panel
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="admin-navbar-nav" />

        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link onClick={handleLogout}>🚪 Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
