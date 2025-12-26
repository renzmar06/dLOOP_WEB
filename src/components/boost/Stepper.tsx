interface StepperProps {
  steps: string[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        
        return (
          <div key={index} className="flex items-center" style={{ width: index < steps.length - 1 ? 'calc(25% - 8px)' : '25%' }}>
            {/* Compact Step Circle */}
            <div className="flex flex-col items-center w-full">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isActive
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              
              {/* Compact Step Label */}
              <div className="mt-1 text-center">
                <p className={`text-xs font-medium leading-tight ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}
                  style={{ fontSize: '10px', lineHeight: '12px' }}
                >
                  {step}
                </p>
              </div>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="absolute" style={{ 
                left: `${((index + 1) * 25) - 2}%`, 
                width: '16px', 
                top: '14px',
                zIndex: 1
              }}>
                <div className={`h-0.5 w-full ${
                    stepNumber < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}