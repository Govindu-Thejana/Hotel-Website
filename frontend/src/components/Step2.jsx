import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const AddOns = () => {
  const [addons, setAddons] = useState([
    {
      id: 1,
      name: "Breakfast Buffet",
      description: "Add daily breakfast. 1 per person",
      price: 15,
      count: 0,
    },
    {
      id: 2,
      name: "Dinner",
      description: "One-way. Includes one drink",
      price: 100,
      count: 0,
      note: "",
    },
    {
      id: 3,
      name: "Bon Fire",
      description:
        "60 minute full body massage. Includes complimentary drink and bathrobe",
      price: 250,
      count: 0,
    },
    {
      id: 4,
      name: "BBQ",
      description:
        "Gourmet wine and dine experience at our 3-star Michelin restaurant",
      price: 350,
      count: 0,
    },
  ]);

  const [showSummary, setShowSummary] = useState(true);

  const updateAddOnCount = (id, increment) => {
    setAddons(
      addons.map((addon) =>
        addon.id === id
          ? { ...addon, count: Math.max(0, addon.count + increment) }
          : addon
      )
    );
  };

  const handleNoteChange = (id, value) => {
    setAddons(
      addons.map((addon) =>
        addon.id === id ? { ...addon, note: value } : addon
      )
    );
  };

  const toggleSummary = () => {
    setShowSummary((prevShowSummary) => !prevShowSummary);
  };

  return (
    <div className="max-w-4xl bg-acolor px-6 py-6 mx-auto font-sans">
      {/* Step indicator */}
      <h1 className="text-2xl font-serif mb-8 text-left">Choose Add-ons</h1>

      <h2 className="text-xl font-serif mb-6 text-center">
        Would you like something extra?
      </h2>

      {/* Add-ons listings */}
      {addons.map((addon) => (
        <div
          key={addon.id}
          className="mb-4 pb-4 border-b bg-gray-100 p-4 border-gray-200 rounded-md"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">{addon.name}</h3>
              <p className="text-sm text-gray-500">{addon.description}</p>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => updateAddOnCount(addon.id, -1)}
                className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <Minus size={16} />
              </button>
              <span className="mx-4 w-8 text-center">{addon.count}</span>
              <button
                onClick={() => updateAddOnCount(addon.id, 1)}
                className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <Plus size={16} />
              </button>
            </div>
            <p className="text-sm font-bold text-gray-600 ml-4">
              LKR {addon.price}
            </p>
          </div>

          {/* Special field for "Dinner" add-on */}
          {addon.name === "Dinner" && addon.count > 0 && (
            <div className="mt-2">
              <textarea
                className="border rounded-sm p-2 w-full"
                placeholder="Please include arrival time"
                value={addon.note}
                onChange={(e) => handleNoteChange(addon.id, e.target.value)}
              />
            </div>
          )}
        </div>
      ))}

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

export default AddOns;