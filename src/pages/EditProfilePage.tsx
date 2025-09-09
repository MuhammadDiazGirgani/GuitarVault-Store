import { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface User {
  username: string;
  email: string;
  password: string;
  address?: string; // ✅ tambahin address
}

export default function EditProfilePage() {
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    password: "",
    address: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        console.error("Failed to parse user data");
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    // Update di daftar users juga
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u: User) =>
      u.email === user.email ? user : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert("Profile updated successfully!");
    navigate("/profile");
  };

  return (
    <Container className="mt-5 " style={{ maxWidth: "500px" }}>
      <h3 className="editprofile">Edit Profile</h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter your full address"
            value={user.address || ""}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            required
          />
        </Form.Group>

        <Button variant="dark" onClick={handleSave}>
          Save Changes
        </Button>
      </Form>
    </Container>
  );
}
