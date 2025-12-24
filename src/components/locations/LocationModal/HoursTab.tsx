import React from 'react';

interface DayHours {
  open: boolean;
  from: string;
  to: string;
}

interface StructuredHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

interface Location {
  _id?: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  hours?: string; // JSON string
  materials?: string;
  managers?: string[];
  status?: 'active' | 'inactive';
}

interface Props {
  editingLocation: Location | null;
  onNext: () => void;
  onBack: () => void;
}

export default function HoursTab({ editingLocation, onNext, onBack }: Props) {
  const [structuredHours, setStructuredHours] = React.useState<StructuredHours>({
    monday: { open: true, from: '09:00', to: '17:00' },
    tuesday: { open: true, from: '09:00', to: '17:00' },
    wednesday: { open: true, from: '09:00', to: '17:00' },
    thursday: { open: true, from: '09:00', to: '17:00' },
    friday: { open: true, from: '09:00', to: '17:00' },
    saturday: { open: true, from: '09:00', to: '17:00' },
    sunday: { open: true, from: '09:00', to: '17:00' },
  });

  React.useEffect(() => {
    if (editingLocation?.hours) {
      try {
        const parsed = JSON.parse(editingLocation.hours);
        if (typeof parsed === 'object' && parsed.monday) {
          setStructuredHours(parsed);
        }
      } catch (e) {
        console.log('Invalid hours JSON, using defaults');
      }
    }
  }, [editingLocation]);

  // Save hours to sessionStorage whenever they change
  React.useEffect(() => {
    sessionStorage.setItem('locationFormHours', JSON.stringify(structuredHours));
  }, [structuredHours]);
  const generateTimeOptions = () => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        options.push(<option key={time} value={time}>{time}</option>);
      }
    }
    return options;
  };

  const hours = structuredHours;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Hours of Operation <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              const allOpen: StructuredHours = {
                monday: { open: true, from: '09:00', to: '17:00' },
                tuesday: { open: true, from: '09:00', to: '17:00' },
                wednesday: { open: true, from: '09:00', to: '17:00' },
                thursday: { open: true, from: '09:00', to: '17:00' },
                friday: { open: true, from: '09:00', to: '17:00' },
                saturday: { open: true, from: '09:00', to: '17:00' },
                sunday: { open: true, from: '09:00', to: '17:00' },
              };
              setStructuredHours(allOpen);
            }}
            className="text-xs px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Set All Open
          </button>
          <button
            type="button"
            onClick={() => {
              const allClosed: StructuredHours = {
                monday: { open: false, from: '09:00', to: '17:00' },
                tuesday: { open: false, from: '09:00', to: '17:00' },
                wednesday: { open: false, from: '09:00', to: '17:00' },
                thursday: { open: false, from: '09:00', to: '17:00' },
                friday: { open: false, from: '09:00', to: '17:00' },
                saturday: { open: false, from: '09:00', to: '17:00' },
                sunday: { open: false, from: '09:00', to: '17:00' },
              };
              setStructuredHours(allClosed);
            }}
            className="text-xs px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Set All Closed
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => {
          const dayKey = day as keyof StructuredHours;
          const dayHours = hours[dayKey];
          const capitalized = day.charAt(0).toUpperCase() + day.slice(1);

          return (
            <div key={day} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
              <div className="w-24 text-sm font-medium text-gray-700">
                {capitalized}
              </div>

              <input
                type="checkbox"
                checked={dayHours.open}
                onChange={(e) =>
                  setStructuredHours((prev) => ({
                    ...prev,
                    [dayKey]: { ...prev[dayKey], open: e.target.checked },
                  }))
                }
                className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-gray-600 w-12">Open</span>

              <select
                value={dayHours.from}
                disabled={!dayHours.open}
                onChange={(e) =>
                  setStructuredHours((prev) => ({
                    ...prev,
                    [dayKey]: { ...prev[dayKey], from: e.target.value },
                  }))
                }
                className="px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:text-gray-400 text-sm"
              >
                {generateTimeOptions()}
              </select>

              <span className="text-sm text-gray-500">to</span>

              <select
                value={dayHours.to}
                disabled={!dayHours.open}
                onChange={(e) =>
                  setStructuredHours((prev) => ({
                    ...prev,
                    [dayKey]: { ...prev[dayKey], to: e.target.value },
                  }))
                }
                className="px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:text-gray-400 text-sm"
              >
                {generateTimeOptions()}
              </select>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors"
        >
          Next: Materials →
        </button>
      </div>
    </div>
  );
}