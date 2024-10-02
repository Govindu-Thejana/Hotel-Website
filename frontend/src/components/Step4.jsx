import { useState } from "react";

const PaymentOptions = () => {
  const [paymentOption, setPaymentOption] = useState("full");
  const [cardDetails, setCardDetails] = useState({
    name: "",
    cardNumber: "",
    expiryDate: "",
    securityCode: "",
  });

  const handlePaymentOptionChange = (option) => {
    setPaymentOption(option);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add payment submission logic here
    console.log("Payment details submitted:", { paymentOption, cardDetails });
  };

  const [showSummary, setShowSummary] = useState(true);

  const toggleSummary = () => {
    setShowSummary((prevShowSummary) => !prevShowSummary);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 font-sans">
      {/* Step Indicator */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-500">1. Room select</span>
        <span className="text-gray-500">2. Choose Add-ons</span>
        <span className="text-gray-500">3. Personal Details</span>
        <span className="text-navy font-bold">4. Payment</span>
      </div>

      {/* Payment Options */}
      <h2 className="text-xl font-semibold mb-4">PAYMENT OPTIONS</h2>
      <div className="mb-6">
        <label className="block mb-2">
          <input
            type="radio"
            value="full"
            checked={paymentOption === "full"}
            onChange={() => handlePaymentOptionChange("full")}
            className="mr-2"
          />
          Pay in full now (CHF 812.00)
        </label>
        <label className="block mb-2">
          <input
            type="radio"
            value="half"
            checked={paymentOption === "half"}
            onChange={() => handlePaymentOptionChange("half")}
            className="mr-2"
          />
          Pay half now, half later (CHF 406.00 now)
        </label>
      </div>

      {/* Card Details */}
      <h3 className="text-lg font-semibold mb-4">CARD DETAILS</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm mb-1">Name on card</label>
          <input
            type="text"
            name="name"
            value={cardDetails.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-sm"
            placeholder="E. JAEGER"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Card number</label>
          <input
            type="text"
            name="cardNumber"
            value={cardDetails.cardNumber}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-sm"
            placeholder="1234 5678 9012 1632"
          />
        </div>
        <div className="flex mb-6">
          <div className="mr-4">
            <label className="block text-sm mb-1">Expiry date</label>
            <input
              type="text"
              name="expiryDate"
              value={cardDetails.expiryDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-sm"
              placeholder="12/34"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Security Code</label>
            <input
              type="text"
              name="securityCode"
              value={cardDetails.securityCode}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-sm"
              placeholder="607"
            />
          </div>
        </div>

        {/* Payment Button */}
        <button
          type="submit"
          className="w-full bg-scolor text-white py-3 rounded-sm font-semibold"
        >
          PAY NOW
        </button>
      </form>

      {/* Booking Summary */}
      {showSummary && (
        <div className="bg-gray-800 text-white p-5 rounded-md w-full max-w-md mx-auto mt-8">
          <h3 className="text-center font-bold mb-4">SUNERAGIRA</h3>
          <p className="text-center">7 nights</p>
          <p className="text-center">Rooms: 1 Room</p>
          <p className="text-center">Guests: 2 Adults</p>
          <p className="text-center">Check In: 28.04.2022</p>
          <p className="text-center">Check Out: 05.05.2022</p>
          <div className="mt-4">
            <p className="text-center">
              Twin Guest Room: CHF 700.80 (116 CHF per/night)
            </p>
            <p className="text-center">10% VAT: CHF 81.20</p>
            <p className="text-center">City tax: CHF 30.00</p>
          </div>
          <div className="text-center font-bold mt-4">
            TOTAL PRICE: CHF 812.00
          </div>
        </div>
      )}

      {/* Toggle Summary Button */}
      <button
        onClick={toggleSummary}
        className="mt-4 px-4 py-2 rounded-sm bg-gray-500 text-white block mx-auto"
      >
        {showSummary ? "Hide Summary" : "Show Summary"}
      </button>
    </div>
  );
};

export default PaymentOptions;
