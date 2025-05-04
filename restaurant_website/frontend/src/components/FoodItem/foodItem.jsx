import { useContext } from "react";
import "./foodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"; // Import star icons

// Star rating component
const StarRating = ({ rating = 4.5 }) => {
  const stars = [];
  const maxStars = 5;

  for (let i = 1; i <= maxStars; i++) {
    if (i <= rating) {
      // Full star
      stars.push(<FaStar key={i} className="star-icon filled" />);
    } else if (i - 0.5 <= rating) {
      // Half star
      stars.push(<FaStarHalfAlt key={i} className="star-icon filled" />);
    } else {
      // Empty star
      stars.push(<FaRegStar key={i} className="star-icon" />);
    }
  }

  return <div className="star-rating">{stars}</div>;
};

const FoodItem = ({ id, name, description, price, image }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  return (
    <motion.div
      className="food-item"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="food-item-content">
        <div className="food-item-image-container">
          <img className="food-item-image" src={image} alt={name} />
        </div>
        <div className="food-item-info">
          <h3 className="food-item-name">{name}</h3>
          <div className="rating-price">
            <span className="food-item-price">Rs.{price}</span>
            <StarRating rating={4.5} /> {/* Moved after the price */}
          </div>
          <p className="food-item-description">{description}</p>

          <div className="food-item-actions">
            {!cartItems[id] ? (
              <motion.button
                className="add-to-cart-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={async () => {
                  try {
                    await addToCart(id);
                    toast.success("Item added to cart!");
                  } catch (error) {
                    console.error("Error adding item to cart:", error);
                    toast.error(
                      "Failed to add item to cart. Please try again."
                    );
                  }
                }}
              >
                Add to Cart
              </motion.button>
            ) : (
              <div className="quantity-control">
                <motion.button
                  className="quantity-btn decrease"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeFromCart(id)}
                >
                  -
                </motion.button>
                <span className="quantity">{cartItems[id]}</span>
                <motion.button
                  className="quantity-btn increase"
                  whileTap={{ scale: 0.9 }}
                  onClick={() => addToCart(id)}
                >
                  +
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodItem;
