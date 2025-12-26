'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import Stepper from './Stepper';
import BudgetSlider from './BudgetSlider';
import ResultCard from './ResultCard';
import AudiencePreview from './AudiencePreview';

interface BoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  boostType: string;
}

export default function BoostModal({ isOpen, onClose, boostType }: BoostModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    target: '',
    dailyBudget: 25,
    duration: 7,
    continuous: false,
    radius: 5,
    audience: 'all-customers'
  });

  const steps = [
    'Choose Boost Target',
    'Budget & Duration',
    'Estimated Results',
    'Audience Targeting'
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setCurrentStep(1);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLaunch = () => {
    // Handle campaign launch
    console.log('Launching campaign with data:', formData);
    onClose();
  };

  const totalSpend = formData.continuous ? 'Ongoing' : `$${(formData.dailyBudget * formData.duration).toFixed(2)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl transform transition-transform duration-300 translate-x-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Create Boost Campaign</h2>
            <p className="text-sm text-gray-600 mt-1">Step {currentStep} of {steps.length}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Stepper */}
        <div className="px-6 py-4 border-b border-gray-100">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Choose Boost Target */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">What would you like to boost?</h3>
                <select
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select boost target</option>
                  <option value="coupon-offer">Coupon Offer</option>
                  <option value="business-profile">Business Profile</option>
                  <option value="special-event">Special Event</option>
                  <option value="new-product">New Product Launch</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Budget & Duration */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Set your budget and duration</h3>
                
                <BudgetSlider
                  label="Daily Budget"
                  value={formData.dailyBudget}
                  min={5}
                  max={200}
                  step={5}
                  onChange={(value) => setFormData({ ...formData, dailyBudget: value })}
                  prefix="$"
                />

                <BudgetSlider
                  label="Campaign Duration"
                  value={formData.duration}
                  min={1}
                  max={30}
                  step={1}
                  onChange={(value) => setFormData({ ...formData, duration: value })}
                  suffix={formData.duration === 1 ? 'day' : 'days'}
                />

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="continuous"
                    checked={formData.continuous}
                    onChange={(e) => setFormData({ ...formData, continuous: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="continuous" className="text-sm text-gray-700">
                    Run continuously until paused
                  </label>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-900">Total Spend:</span>
                    <span className="text-lg font-bold text-blue-900">{totalSpend}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Estimated Results */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Estimated campaign results</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <ResultCard
                    title="Estimated Impressions"
                    value="8,500"
                    percentage="+45%"
                    percentageColor="text-green-600"
                    icon="👁️"
                  />
                  <ResultCard
                    title="Estimated Profile Views"
                    value="1,200"
                    percentage="+180%"
                    percentageColor="text-blue-600"
                    icon="👤"
                  />
                  <ResultCard
                    title="Estimated Redemptions"
                    value="85"
                    percentage="+220%"
                    percentageColor="text-green-600"
                    icon="🎯"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-6">
                  <p className="text-xs text-gray-600">
                    * Estimates based on similar campaigns in your area and industry. Actual results may vary.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Audience Targeting */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Target your audience</h3>
                
                <BudgetSlider
                  label="Radius"
                  value={formData.radius}
                  min={1}
                  max={25}
                  step={1}
                  onChange={(value) => setFormData({ ...formData, radius: value })}
                  suffix={formData.radius === 1 ? 'mile' : 'miles'}
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Target Audience</label>
                  <select
                    value={formData.audience}
                    onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all-customers">All Customers</option>
                    <option value="new-customers">New Customers</option>
                    <option value="returning-customers">Returning Customers</option>
                    <option value="high-value">High-Value Customers</option>
                  </select>
                </div>

                <AudiencePreview radius={formData.radius} audience={formData.audience} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={currentStep === 1 && !formData.target}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button
                onClick={handleLaunch}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Launch Boost Campaign
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}