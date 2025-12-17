import React from 'react';
import { X } from 'lucide-react';

interface BusinessHours {
  open: string;
  close: string;
  closed: boolean;
}

interface FormData {
  businessName: string;
  logo: string;
  phone: string;
  email: string;
  website: string;
  googleLocation: string;
  serviceArea: string;
  businessType: string;
  industry: string;
  description: string;
  registeredId: string;
  legalName: string;
  businessHours: {
    monday: BusinessHours;
    tuesday: BusinessHours;
    wednesday: BusinessHours;
    thursday: BusinessHours;
    friday: BusinessHours;
    saturday: BusinessHours;
    sunday: BusinessHours;
  };
  instagram: string;
  facebook: string;
  twitter: string;
  seoKeywords: string;
}

interface PreviewModalProps {
  form: FormData;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ form, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Business Profile Preview</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">{form.businessName || 'Business Name'}</h3>
            <p className="text-gray-600">{form.businessType}</p>
          </div>
          {form.description && (
            <div dangerouslySetInnerHTML={{ __html: form.description }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;