import { useState } from "react"; // Only import what's necessary

const PersonalDetails = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    contactNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form Data:", formData);
  };

  const [showSummary, setShowSummary] = useState(true);

  const toggleSummary = () => {
    setShowSummary((prevShowSummary) => !prevShowSummary);
  };

  return (
    <div className="max-w-4xl bg-acolor px-5 py-5 mx-auto p-1 font-sans">
      {/* Step Indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <span className="w-8 h-8 bg-navy text-white flex items-center justify-center rounded-full mr-2">
            1
          </span>
          <span>Room select</span>
        </div>
        <div className="flex items-center ml-4">
          <span className="w-8 h-8 bg-navy text-white flex items-center justify-center rounded-full mr-2">
            2
          </span>
          <span>Choose Add-ons</span>
        </div>
        <div className="flex items-center ml-4">
          <span className="w-8 h-8 bg-navy text-white flex items-center justify-center rounded-full mr-2">
            3
          </span>
          <span>Personal Details</span>
        </div>
        <div className="flex items-center ml-4">
          <span className="w-8 h-8 bg-gray-300 text-black flex items-center justify-center rounded-full mr-2">
            4
          </span>
          <span>Payment</span>
        </div>
      </div>

      {/* Personal Details Form */}
      <h1 className="text-2xl font-serif mb-8">PERSONAL DETAILS</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Eren"
          />
          <p className="text-gray-500 text-xs mt-1">
            This must match the name of the card holder
          </p>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="surname"
          >
            Surname
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="surname"
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            placeholder="Jaeger"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="erenjaeger@gmail.com"
          />
          <p className="text-gray-500 text-xs mt-1">
            Your confirmation email will be sent here
          </p>
        </div>

        <div className="mb-8">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="contactNumber"
          >
            Contact Number (Optional)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="contactNumber"
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder=""
          />
          <p className="text-gray-500 text-xs mt-1">
            We will only contact you if there is an issue with your booking
          </p>
        </div>

        <div className="flex justify-between items-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Next
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-400 rounded-md">
            <img
              src="/google-logo.png"
              alt="Google Logo"
              className="w-6 h-6 mr-2"
            />
            Sign in with Google
          </button>
        </div>
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

      {/* Button to toggle summary */}
      <button
        onClick={toggleSummary}
        className="px-4 py-2 rounded-sm bg-gray-500 text-white mt-4 block mx-auto"
      >
        {showSummary ? "Hide Summary" : "Show Summary"}
      </button>
    </div>
  );
};

export default PersonalDetails;
