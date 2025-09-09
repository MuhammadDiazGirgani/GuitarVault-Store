// src/components/ProductCard.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  ensureLoggedIn: () => boolean;
  isWishlisted: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  ensureLoggedIn,
  isWishlisted,
}: ProductCardProps) {
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!ensureLoggedIn()) return;
    setAnimate(true);
    onAddToCart(product);
    setTimeout(() => setAnimate(false), 800);
  };

  const handleBuyNow = () => {
    if (!ensureLoggedIn()) return;
    onAddToCart(product);
    toast.success(`Quick checkout for ${product.title} 🛍️`);
    navigate("/cart");
  };

  const goToDetail = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToWishlist = () => {
    if (!ensureLoggedIn()) return;
    onAddToWishlist(product);
  };

  return (
    <div className="card p-2 shadow-sm position-relative">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleAddToWishlist}
        className="btn btn-light position-absolute"
        style={{
          top: 10,
          right: 10,
          borderRadius: "50%",
          width: 36,
          height: 36,
          padding: 0,
        }}
      >
        <motion.i
          key={isWishlisted ? "fill" : "empty"}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className={`bi ${isWishlisted ? "bi-heart-fill" : "bi-heart"}`}
          style={{
            fontSize: 18,
            color: isWishlisted ? "red" : "gray",
          }}
        />
      </motion.button>

      <img
        src={product.image && product.image !== "" ? product.image : "/images/placeholder.png"}
        alt={product.title}
        className="card-img-top rounded"
        style={{ height: 125, objectFit: "cover", cursor: "pointer" }}
        onClick={goToDetail}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/images/placeholder.png";
        }}
      />

      <div className="card-body d-flex flex-column">
        <h6 className="card-title" style={{ cursor: "pointer" }} onClick={goToDetail}>
          {product.title}
        </h6>

        <p className="fw-bold mb-1">${Number(product.price_usd || 0).toLocaleString()}</p>
        <small className="text-muted mb-3">
          IDR {Number(product.price_idr || 0).toLocaleString()}
        </small>

        <div className="d-flex flex-column flex-md-row gap-2 mt-auto">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="btn btn-dark flex-fill btn-sm-mobile"
          >
            Add to Cart
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleBuyNow}
            className="btn btn-secondary flex-fill btn-sm-mobile"
          >
            Buy Now
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {animate && (
          <motion.div
            initial={{ opacity: 1, scale: 1, y: 0 }}
            animate={{ opacity: 0, scale: 0.2, y: -150, x: 150 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="position-absolute bg-dark rounded-circle"
            style={{
              width: 30,
              height: 30,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
