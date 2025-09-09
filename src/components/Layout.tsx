import { useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Badge,
  Offcanvas,
  Container,
} from "react-bootstrap";
import { BsCart3, BsGear, BsHeart, BsPencilSquare } from "react-icons/bs";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import guitarLogo from "../assets/guitar.png";
import Footer from "./Footer";

interface Product {
  id: number;
  title: string;
  price: number;
  images?: string[];
  qty?: number;
}

export default function Layout() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [navExpanded, setNavExpanded] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); // 🔑 detect route change

  // sync cart, wishlist, user
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const savedWishlist = JSON.parse(localStorage.getItem("wishlistItems") || "[]");
    setCart(Array.isArray(savedCart) ? savedCart : []);
    setWishlist(Array.isArray(savedWishlist) ? savedWishlist : []);

    const user = localStorage.getItem("loggedInUser");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUsername(parsed.username || parsed.name || "User");
      } catch {
        setUsername(user);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(wishlist));
  }, [wishlist]);

  // 🔑 Close navbar collapse when route changes
  useEffect(() => {
    setNavExpanded(false);
  }, [location.pathname]);

  const ensureLoggedIn = (redirect = true) => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      if (redirect) navigate("/login");
      return false;
    }
    return true;
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("isLoggedIn");
    setCart([]);
    setWishlist([]);
    setUsername(null);
    setShowSidebar(false);
    navigate("/dashboard", { replace: true });
  };
  useEffect(() => {
    const updateCart = () => {
      const savedCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setCart(Array.isArray(savedCart) ? savedCart : []);
    };

    const updateWishlist = () => {
      const savedWishlist = JSON.parse(
        localStorage.getItem("wishlistItems") || "[]"
      );
      setWishlist(Array.isArray(savedWishlist) ? savedWishlist : []);
    };

    window.addEventListener("storage", updateCart);
    window.addEventListener("storage", updateWishlist);

    updateCart();
    updateWishlist();

    return () => {
      window.removeEventListener("storage", updateCart);
      window.removeEventListener("storage", updateWishlist);
    };
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        fixed="top"
        className="px-3 py-2"
        expanded={navExpanded}
        onToggle={setNavExpanded} // manage toggle state
      >
        <Container fluid>
          <Navbar.Brand
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
            className="d-flex align-items-center gap-2"
          >
            <img
              src={guitarLogo}
              alt="GuitarVault Logo"
              style={{ width: "28px", height: "28px", objectFit: "contain" }}
            />
            <span>GuitarVault</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Form className="d-none d-lg-flex mx-auto w-50">
              <FormControl
                type="search"
                placeholder="Search products..."
                className="me-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form>
            <div className="d-flex align-items-center gap-3 my-2 my-lg-0 ms-auto">
              <Button
                variant="outline-light"
                className="position-relative d-flex align-items-center justify-content-center"
                style={{ width: 45, height: 45, borderRadius: "50%" }}
                onClick={() => {
                  navigate("/wishlist");
                  setNavExpanded(false); // close navbar
                }}
              >
                <BsHeart size={18} />
                {wishlist.length > 0 && (
                  <Badge
                    bg="danger"
                    pill
                    className="position-absolute top-0 start-100 translate-middle"
                  >
                    {wishlist.length}
                  </Badge>
                )}
              </Button>
              <Button
                variant="outline-light"
                className="position-relative d-flex align-items-center justify-content-center"
                style={{ width: 45, height: 45, borderRadius: "50%" }}
                onClick={() => {
                  navigate("/cart");
                  setNavExpanded(false); // close navbar
                }}
              >
                <BsCart3 size={18} />
                {cart.length > 0 && (
                  <Badge
                    bg="danger"
                    pill
                    className="position-absolute top-0 start-100 translate-middle"
                  >
                    {cart.reduce((s, it) => s + (it.qty || 1), 0)}
                  </Badge>
                )}
              </Button>
              <Button
                variant="outline-light"
                className="d-flex align-items-center justify-content-center"
                style={{ width: 45, height: 45, borderRadius: "50%" }}
                onClick={() => setShowSidebar(true)}
              >
                <BsGear size={18} />
              </Button>
            </div>
          </Navbar.Collapse>
          <Form className="d-flex d-lg-none my-2 w-100">
            <FormControl
              type="search"
              placeholder="Search products..."
              className="me-2 btn-sm-mobile"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Form>
        </Container>
      </Navbar>

      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>⚙️ Settings</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {username ? (
            <div className="d-flex flex-column align-items-center mb-4">
              <div
                className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center mb-2"
                style={{ width: 70, height: 70, fontSize: 24 }}
              >
                {username.charAt(0).toUpperCase()}
              </div>
              <h5 className="mb-1">{username}</h5>
              <Button
                variant="outline-dark"
                size="sm"
                className="d-flex align-items-center"
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/profile/edit");
                }}
              >
                <BsPencilSquare className="me-1" /> Edit Profile
              </Button>
            </div>
          ) : (
            <div className="mb-4 text-center text-muted">Not logged in</div>
          )}

          <hr />

          <Nav className="flex-column gap-2">
            <Button
              variant="outline-secondary"
              className="w-100 d-flex align-items-center justify-content-center"
              onClick={() => {
                setShowSidebar(false);
                navigate("/profile");
              }}
              disabled={!username}
            >
              👤 Account
            </Button>

            <Button
              variant="outline-secondary"
              className="w-100 d-flex align-items-center justify-content-center"
              onClick={() => {
                setShowSidebar(false);
                navigate("/orders");
              }}
              disabled={!username}
            >
              📦 My Orders
            </Button>
            {username ? (
              <Button
                variant="danger"
                className="w-100 d-flex align-items-center justify-content-center"
                onClick={handleLogout}
              >
                🚪 Logout
              </Button>
            ) : (
              <Button
                variant="success"
                className="w-100 d-flex align-items-center justify-content-center"
                onClick={() => {
                  setShowSidebar(false);
                  navigate("/login");
                }}
              >
                🔑 Login
              </Button>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      <main className="flex-grow-1">
        <Outlet
          context={{
            search,
            setSearch,
            cart,
            setCart,
            wishlist,
            setWishlist,
            ensureLoggedIn,
          }}
        />
      </main>

      <Footer />
    </div>
  );
}