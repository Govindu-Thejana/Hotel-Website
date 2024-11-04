
const AvailabilityCheck = () => {
    return (
        <div className="bg-pcolor p-4 px-40 flex justify-between items-center">
            <div className="flex items-center space-x-20">
                <div className="flex flex-col items-start">
                    <label className="text-white" htmlFor="check-in">Check-in</label>
                    <input
                        type="date"
                        id="check-in"
                        className="bg-scolor text-white border border-gray-600 "
                    />
                </div>
                <div className="flex flex-col items-start">
                    <label className="text-white" htmlFor="check-out">Check-out</label>
                    <input
                        type="date"
                        id="check-out"
                        className="bg-scolor text-white border border-gray-600 "
                    />
                </div>
                <div className="flex flex-col items-start">
                    <label className="text-white" htmlFor="promo-code">Promo Code</label>
                    <input
                        type="text"
                        id="promo-code"
                        className="bg-scolor text-white border border-gray-600 "
                        placeholder="Enter promo code"
                    />
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <button className=" text-scolor px-4 py-2">Flexible Dates</button>
                <button className="bg-scolor text-white  px-6 py-2">Check Availability</button>
            </div>
        </div>
    );
};

export default AvailabilityCheck;
