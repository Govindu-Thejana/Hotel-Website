import React, { useState, useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import Swal from 'sweetalert2'
import { toast } from 'react-toastify';
import './PlaceOrder.css';

const PlaceOrder = () => {
  const { cartItems, getTotalCartAmount, clearCart, products } = useContext(StoreContext);
  const [formErrors, setFormErrors] = useState({});
  const now = new Date();
  now.setHours(now.getHours() + 5);
  now.setMinutes(now.getMinutes() + 30);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    street: '',
    city: '',
    zipCode: '',
    country: '',
    paymentMethod: 'Cash_On_Delivery',
    orderType: 'Immediate',
    scheduleDateTime: now.toISOString().slice(0, 16),
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

    // Validate scheduling information
    if (formData.orderType === 'Scheduled' && !formData.scheduleDateTime) {
      errors.scheduleDateTime = "Please select a delivery date and time";
    }

    setFormErrors(errors);
    return errors;
  };

  const handleSubmit = async (e) => {
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
      orderType: formData.orderType,
      scheduleDateTime: formData.scheduleDateTime,
    };

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      const response = await axios.post(`${backendUrl}/api/orders/new`, orderData, {
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
        clearCart();
        toast.success("Your order has been placed successfully!", {
          position: "top-right",
          autoClose: 2000,
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

  // Calculate minimum date and time for scheduling (at least 2 hours from now)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 5);
    now.setMinutes(now.getMinutes() + 30);
    return now.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
  };

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

          {/* Order Type Selection */}
          <div className="form-group">
            <label>Delivery Type</label>
            <div className="delivery-options">
              <label>
                <input
                  type="radio"
                  name="orderType"
                  value="Immediate"
                  checked={formData.orderType === 'Immediate'}
                  onChange={handleInputChange}
                />
                Immediate Delivery
              </label>
              <label>
                <input
                  type="radio"
                  name="orderType"
                  value="Scheduled"
                  checked={formData.orderType === 'Scheduled'}
                  onChange={handleInputChange}
                />
                Schedule for Later
              </label>
            </div>
          </div>

          {/* Conditional Date/Time Picker */}
          {formData.orderType === 'Scheduled' && (
            <div className="form-group">
              <label htmlFor="scheduleDateTime">Select Delivery Date & Time</label>
              <input
                type="datetime-local"
                id="scheduleDateTime"
                name="scheduleDateTime"
                value={formData.scheduleDateTime}
                onChange={handleInputChange}
                min={getMinDateTime()}
                required={formData.orderType === 'Scheduled'}
              />
              {formErrors.scheduleDateTime && <div className="error">{formErrors.scheduleDateTime}</div>}
              <div className="schedule-note">
                Please select a delivery time at least 2 hours from now.
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Payment Method</label>
            <div className="payment-options">
              <label>
                <input type="radio" name="paymentMethod" value="Cash_On_Delivery" checked={formData.paymentMethod === 'Cash_On_Delivery'} onChange={handleInputChange} />
                Cash On delivery
              </label>
              <label>
                <input type="radio" name="paymentMethod" value="credit_card" checked={formData.paymentMethod === 'credit_card'} onChange={handleInputChange} />
                Credit/Debit Card
              </label>
            </div>
          </div>
          <button type="submit" className="place-order-button">Place Order</button>
        </form>
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="cart-items">
            {Object.keys(cartItems).length > 0 ? (
              Object.keys(cartItems).map(itemId => {
                const itemInfo = products.find(product => product._id === itemId);
                return (
                  <div key={itemId} className="cart-item">
                    <div>{itemInfo.name} x {cartItems[itemId]}</div>
                    <div>Rs.{(itemInfo.price * cartItems[itemId]).toFixed(2)}</div>
                  </div>
                );
              })
            ) : (
              <div className="empty-cart-message">Your cart is empty</div>
            )}
          </div>
          <div className="summary-row"><span>Subtotal:</span><span>Rs.{subtotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Delivery Fee:</span><span>Rs.{deliveryFee.toFixed(2)}</span></div>
          <div className="summary-row total"><span>Total:</span><span>Rs.{total.toFixed(2)}</span></div>

          {formData.orderType === 'Scheduled' && formData.scheduleDateTime && (
            <div className="scheduled-delivery-info">
              <div className="schedule-label">Scheduled Delivery:</div>
              <div className="schedule-time">
                {new Date(formData.scheduleDateTime).toLocaleString('en-US', {
                  dateStyle: 'short',
                  timeStyle: 'short'
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
