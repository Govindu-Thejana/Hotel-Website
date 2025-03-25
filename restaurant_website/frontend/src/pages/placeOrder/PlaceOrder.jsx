import React, { useState, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';
import './PlaceOrder.css';

const PlaceOrder = () => {
  const { cartItems, getTotalCartAmount, clearCart, products } = useContext(StoreContext);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    street: '',
    city: '',
    zipCode: '',
    country: '',
    paymentMethod: 'credit_card',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setFormErrors(prevErrors => ({ ...prevErrors, [name]: null }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) {
      errors.name = "Name is required";
    }
    if (!formData.email || !formData.email.includes('@')) {
      errors.email = "Invalid email address";
    }
    if (!formData.street) {
      errors.street = "Street address is required";
    }
    if (!formData.city) {
      errors.city = "City is required";
    }
    if (!formData.zipCode) {
      errors.zipCode = "ZIP Code is required";
    }
    if (!formData.country) {
      errors.country = "Country is required";
    }

    setFormErrors(errors);
    return errors;
  };

  const handleSubmit = async (e) => {
    Swal.fire({
      title: "Done!",
      text: "Your Order Placed Successfully!",
      icon: "success"
    });
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((error) => {
        toast.error(error, {
          position: "top-right",
          autoClose: 2000,
        });
      });
      return;
    }

    if (Object.keys(cartItems).length === 0 || getTotalCartAmount() === 0) {
      toast.error("Your cart is empty. Please add items before proceeding to checkout.");
      return;
    }

    const subtotal = getTotalCartAmount();
    const deliveryFee = 2;
    const total = subtotal + deliveryFee;

    const orderData = {
      name: formData.name,
      email: formData.email,
      street: formData.street,
      city: formData.city,
      country: formData.country,
      zipCode: formData.zipCode,
      paymentMethod: formData.paymentMethod,
      items: Object.keys(cartItems).map(itemId => {
        const itemInfo = products.find(product => product._id === itemId);
        return {
          productId: itemId,
          name: itemInfo.name,
          price: itemInfo.price,
          quantity: cartItems[itemId],
          image: itemInfo.image,
        };
      }),
      totalAmount: total,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/orders/new', orderData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        console.log('Order placed successfully:', response.data);
        Swal.fire({
          title: "Done!",
          text: "Your Order Placed Successfully!",
          icon: "success"
        });
      } else {
        toast.error("Failed to place order. Please try again.");
        console.error('Error placing order:', response.data);
      }
    } catch (error) {
      toast.error("An error occurred while placing your order. Please try again later.");
      console.error('Error response:', error);
    }
  };

  const subtotal = getTotalCartAmount();
  const deliveryFee = 2;
  const total = subtotal + deliveryFee;

  return (
    <div className="place-order-container">
      <h1>Place Your Order</h1>
      <div className="place-order-content">
        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            {formErrors.name && <div className="error">{formErrors.name}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
            {formErrors.email && <div className="error">{formErrors.email}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="street">Street Address</label>
            <input type="text" id="street" name="street" value={formData.street} onChange={handleInputChange} required />
            {formErrors.street && <div className="error">{formErrors.street}</div>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} required />
              {formErrors.city && <div className="error">{formErrors.city}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="zipCode">ZIP Code</label>
              <input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
              {formErrors.zipCode && <div className="error">{formErrors.zipCode}</div>}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input type="text" id="country" name="country" value={formData.country} onChange={handleInputChange} required />
            {formErrors.country && <div className="error">{formErrors.country}</div>}
          </div>
          <div className="form-group">
            <label>Payment Method</label>
            <div className="payment-options">
              <label>
                <input type="radio" name="paymentMethod" value="credit_card" checked={formData.paymentMethod === 'credit_card'} onChange={handleInputChange} />
                Credit Card
              </label>
              <label>
                <input type="radio" name="paymentMethod" value="paypal" checked={formData.paymentMethod === 'paypal'} onChange={handleInputChange} />
                PayPal
              </label>
            </div>
          </div>
          <button type="submit" className="place-order-button">Place Order</button>
        </form>
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-row"><span>Subtotal:</span><span>Rs:{subtotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Delivery Fee:</span><span>Rs:{deliveryFee.toFixed(2)}</span></div>
          <div className="summary-row total"><span>Total:</span><span>Rs:{total.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;