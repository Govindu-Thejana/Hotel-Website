import React from "react";

const WeddingPlanners = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Planner 1 */}
      <div className="text-center">
        <img
          src="https://img.freepik.com/free-photo/serious-businesswoman-meeting_23-2147636032.jpg?t=st=1727780202~exp=1727783802~hmac=44c17f744de3d7167c14e5b04efc3d5bf160d7f05d28f7203e80819e3bd8d860&w=996"
          alt="Kayla Hurley"
          className="w-full h-64 object-cover mb-4"
        />
        <h3 className="text-xl font-semibold">Kayla Hurley</h3>
        <p className="text-sm text-gray-500 mb-2">Wedding planner</p>
        <p className="text-gray-600 max-w-md mx-auto">
          Sed lectus ultricies id id massa tellus. Gravida ullamcorper lectus
          vita tristique cursus tempor rutrum. Aenean posuere urna feugiat nunc
          in nulla.
        </p>
      </div>

      {/* Planner 2 */}
      <div className="text-center">
        <img
          src="https://img.freepik.com/premium-photo/smiling-woman-sitting-desk_1124848-131940.jpg?ga=GA1.1.603473978.1697991262&semt=ais_hybrid"
          alt="Jeffrey Padilla"
          className="w-full h-64 object-cover mb-4"
        />
        <h3 className="text-xl font-semibold">Jeffrey Padilla</h3>
        <p className="text-sm text-gray-500 mb-2">Wedding planner</p>
        <p className="text-gray-600 max-w-md mx-auto">
          Sed lectus ultricies id id massa tellus. Gravida ullamcorper lectus
          vita tristique cursus tempor rutrum. Aenean posuere urna feugiat nunc
          in nulla.
        </p>
      </div>

      {/* Planner 3 */}
      <div className="text-center">
        <img
          src="https://img.freepik.com/free-photo/young-brunette-woman-sitting-desk_273609-11209.jpg?t=st=1727780612~exp=1727784212~hmac=683832445ec92e758a7bd088cb1c9dd2545720cd56fc086c92a76027fe4e265f&w=996"
          alt="Henry Potter"
          className="w-full h-64 object-cover mb-4"
        />
        <h3 className="text-xl font-semibold">Henry Potter</h3>
        <p className="text-sm text-gray-500 mb-2">Wedding planner</p>
        <p className="text-gray-600 max-w-md mx-auto">
          Sed lectus ultricies id id massa tellus. Gravida ullamcorper lectus
          vita tristique cursus tempor rutrum. Aenean posuere urna feugiat nunc
          in nulla.
        </p>
      </div>
    </div>
  );
};

export default WeddingPlanners;