import React from "react";
const PastWeddings = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Column 1 */}
      <div className="space-y-6">
        {/* Salvatore Wedding */}
        <div className="relative group overflow-hidden rounded-lg shadow-lg">
          <img
            src="https://img.freepik.com/free-photo/full-shot-married-couple-posing_23-2150327236.jpg?t=st=1727780790~exp=1727784390~hmac=fc4234e5cbbaaf5f951961f5d987e90a1dcfef7530d912f04b22faf29d0b6232&w=360"
            alt="Mr & Miss Salvatore"
            className="w-full h-64 object-cover transition-transform transform group-hover:scale-110 duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-60 transition-all duration-500 flex items-end">
            <p className="text-white text-lg font-semibold m-4 group-hover:text-xl transition-all duration-300">
              MR & MISS SALVATORE
            </p>
          </div>
        </div>

        {/* Additional Image */}
        <div className="relative group overflow-hidden rounded-lg shadow-lg">
          <img
            src="https://img.freepik.com/free-photo/charming-young-expecting-couple-poses-white-studio-rich-decorated-with-pink-flowers_8353-8287.jpg?t=st=1727780934~exp=1727784534~hmac=50697009653728103827e5c6e94273280cd9fbc2d6543380bae4832844ba7195&w=360"
            alt="Mr & Miss Haven"
            className="w-full h-72 object-cover transition-transform transform group-hover:scale-110 duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-60 transition-all duration-500 flex items-end">
            <p className="text-white text-lg font-semibold m-4 group-hover:text-xl transition-all duration-300">
              MR & MISS Haven
            </p>
          </div>
        </div>
      </div>

      {/* Column 2 */}
      <div className="space-y-6">
        {/* Lockwood Wedding */}
        <div className="relative group overflow-hidden rounded-lg shadow-lg">
          <img
            src="https://img.freepik.com/free-photo/full-shot-couple-posing-together_23-2149956397.jpg?t=st=1727780657~exp=1727784257~hmac=8e53915c2882364a101104517952e0db99f4370fa091e29ab7e5a208b63872b9&w=360"
            alt="Mr & Miss Lockwood"
            className="w-full h-96 object-cover transition-transform transform group-hover:scale-110 duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-60 transition-all duration-500 flex items-end">
            <p className="text-white text-lg font-semibold m-4 group-hover:text-xl transition-all duration-300">
              MR & MISS LOCKWOOD
            </p>
          </div>
        </div>
      </div>

      {/* Column 3 */}
      <div className="space-y-6">
        {/* Mikaelson Wedding */}
        <div className="relative group overflow-hidden rounded-lg shadow-lg">
          <img
            src="https://img.freepik.com/free-photo/side-view-couple-getting-married_23-2150889287.jpg?t=st=1727780708~exp=1727784308~hmac=15bab063f71a815e811d5da2cea08cdc4cf599c6ba31b8828ba5e89d7a7c5cde&w=360"
            alt="Mr & Miss Mikaelson"
            className="w-full h-96 object-cover transition-transform transform group-hover:scale-110 duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-60 transition-all duration-500 flex items-end">
            <p className="text-white text-lg font-semibold m-4 group-hover:text-xl transition-all duration-300">
              MR & MISS MIKAELSON
            </p>
          </div>
        </div>

        {/* Additional Image */}
        <div className="relative group overflow-hidden rounded-lg shadow-lg">
          <img
            src="https://img.freepik.com/free-photo/bride-groom-having-their-wedding-beach_23-2149043965.jpg?t=st=1727780738~exp=1727784338~hmac=b5aefcf83c0ad8d505c25cf6f01d2f1caffc06bb341cdd02c8954291db504a5d&w=360"
            alt="Mr & Miss Mikaelson"
            className="w-full h-72 object-cover transition-transform transform group-hover:scale-110 duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-60 transition-all duration-500 flex items-end">
            <p className="text-white text-lg font-semibold m-4 group-hover:text-xl transition-all duration-300">
              MR & MISS MIKAELSON
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastWeddings;
