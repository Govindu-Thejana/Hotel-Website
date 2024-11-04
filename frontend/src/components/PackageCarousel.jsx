import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import RoomSelect from './Step1';
import AddOns from './Step2';
import PersonalDetails from './Step3';
import Payment from './Step4';

const StepCarousel = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const steps = [
    { title: 'Room select', component: <RoomSelect /> },
    { title: 'Choose Add-ons', component: <AddOns /> },
    { title: 'Personal Details', component: <PersonalDetails /> },
    { title: 'Payment', component: <Payment /> },
  ];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-5">
        
        {steps.map((step, index) => (
          
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${index === currentStep ? 'bg-pcolor text-white' : 'bg-acolor text-gray-600'
                }`}
            >
              {index + 1}
            </div>
            {/* line line line */}
            {/* {index < steps.length - 1 && <div className="w-16 h-0.5 bg-gray-300 mx-2" />} */}
            <span className="text-sm mt-2">{step.title}</span>
          </div>
        ))}
      </div>

      <div className="mb-1">{steps[currentStep].component}</div>

      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex items-center hover:bg-pcolor rounded-full px-4 py-2 bg-scolor text-white disabled:opacity"
        >
          <ChevronLeft className="mr-2" size={20} />
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="flex items-center px-4 py-2 bg-scolor rounded-full text-white disabled:opacity-50 hover:bg-pcolor"
        >
          Next
          <ChevronRight className="ml-2" size={20} />
        </button>
      </div>
    </div>
  );
};

export default StepCarousel;