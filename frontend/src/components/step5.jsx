import { useRef } from "react";

const BookingConfirmation = () => {
  const receiptRef = useRef();

  const handlePrint = () => {
    const printContent = receiptRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <header className="w-full bg-navy py-4 px-8 flex justify-between items-center">
        <div className="text-white">
          <a href="/" className="text-white hover:underline">
            &larr; Back to homepage
          </a>
        </div>
        <div className="text-white text-xl font-bold">LOGO</div>
      </header>

      <main className="flex flex-col items-center py-10">
        <h1 className="text-3xl font-bold mb-6">BOOKING CONFIRMED!</h1>

        <div
          ref={receiptRef}
          className="bg-gray-800 text-white p-5 rounded-md w-full max-w-md mx-auto mt-8 text-center"
        >
          <h2 className="text-xl font-semibold mb-4">SUNERAGIRA</h2>
          <ul className="text-left mb-6">
            <li className="flex justify-between">
              <span>ROOMS</span>
              <span>1 Room</span>
            </li>
            <li className="flex justify-between">
              <span>GUESTS</span>
              <span>2 Adults</span>
            </li>
            <li className="flex justify-between">
              <span>CHECK IN</span>
              <span>29-08-2022</span>
            </li>
            <li className="flex justify-between">
              <span>CHECK OUT</span>
              <span>09-09-2022</span>
            </li>
            <li className="flex justify-between">
              <span>Room Rate</span>
              <span>CHF 700.00</span>
            </li>
            <li className="flex justify-between">
              <span>City Tax</span>
              <span>CHF 70.00</span>
            </li>
            <li className="flex justify-between font-bold border-t pt-2">
              <span>TOTAL PRICE</span>
              <span>CHF 812.00</span>
            </li>
          </ul>
        </div>

        <div className="flex space-x-4 mt-6">
          <button
            onClick={handlePrint}
            className="bg-scolor text-white font-semibold px-4 py-2 rounded hover:bg-opacity-90 transition"
          >
            Print
          </button>
          <button className="bg-scolor text-white font-semibold px-4 py-2 rounded hover:bg-opacity-90 transition ">
            Exit
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-6">
          A confirmation email will be sent shortly. Please check your junk mail
          box if you do not receive it.
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Thank you for booking with SUNERAGIRA Hotel. We hope you enjoy your
          stay!
        </p>
      </main>
    </div>
  );
};

export default BookingConfirmation;
