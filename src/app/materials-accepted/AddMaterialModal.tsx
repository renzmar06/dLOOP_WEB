'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addMaterial } from '@/redux/slices/materialsSlice';
import { AppDispatch, RootState } from '@/redux/store';

interface NewMaterial {
  materialname: string;
  programType: string;
  materialType: string;
  unitType: string;
  crvPrice: string;
  scrapPrice: string;
  perUnit: string;
  minQuantity: string;
  maxQuantity: string;
  specialNotes: string;
}

interface AddMaterialModalProps {
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  newMaterial: NewMaterial;
  setNewMaterial: (material: NewMaterial) => void;
}

export default function AddMaterialModal({
  showAddModal,
  setShowAddModal,
  newMaterial,
  setNewMaterial,
}: AddMaterialModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.materials);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newMaterial.materialType) newErrors.materialType = 'Material type is required';
    if (!newMaterial.unitType) newErrors.unitType = 'Unit type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      await dispatch(addMaterial(newMaterial)).unwrap();
      setShowAddModal(false);
      setNewMaterial({
        materialname: "",
        programType: "",
        materialType: "",
        unitType: "",
        crvPrice: "",
        scrapPrice: "",
        perUnit: "",
        minQuantity: "",
        maxQuantity: "",
        specialNotes: "",
      });
    } catch (error) {
      console.error('Failed to save material:', error);
    }
  };

  if (!showAddModal) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Add Custom Material
          </h2>
          <button
            onClick={() => setShowAddModal(false)}
            className="text-gray-600 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="space-y-5">
            
            {/* Material Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material Name *
              </label>
              <input
                type="text"
                value={newMaterial.materialname}
                onChange={(e) =>
                  setNewMaterial({ ...newMaterial, materialname: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Enter material name"
              />
            </div>

            {/* Program Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Program Type
              </label>
              <Select
                value={newMaterial.programType}
                onValueChange={(value: string) =>
                  setNewMaterial({ ...newMaterial, programType: value })
                }
              >
                <SelectTrigger className="w-full focus:ring-2 focus:ring-yellow-500">
                  <SelectValue placeholder="Select program type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bag-drop">Bag and Drop</SelectItem>
                  <SelectItem value="walk-in-crv">Walk-in CRV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type + Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Material Type *
                </label>
                <Select
                  value={newMaterial.materialType}
                  onValueChange={(value: string) => {
                    setNewMaterial({ ...newMaterial, materialType: value });
                    if (errors.materialType) setErrors({ ...errors, materialType: '' });
                  }}
                >
                  <SelectTrigger className={`w-full focus:ring-2 focus:ring-yellow-500 ${
                    errors.materialType ? 'border-red-500' : ''
                  }`}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CRV">CRV</SelectItem>
                    <SelectItem value="scrap">Scrap</SelectItem>
                    <SelectItem value="WDS">WDS</SelectItem>
                  </SelectContent>
                </Select>
                {errors.materialType && <p className="text-red-500 text-sm mt-1">{errors.materialType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Type *
                </label>
                <Select
                  value={newMaterial.unitType}
                  onValueChange={(value: string) => {
                    setNewMaterial({ ...newMaterial, unitType: value });
                    if (errors.unitType) setErrors({ ...errors, unitType: '' });
                  }}
                >
                  <SelectTrigger className={`w-full focus:ring-2 focus:ring-yellow-500 ${
                    errors.unitType ? 'border-red-500' : ''
                  }`}>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SC - Seggregated by Count">SC - Seggregated by Count</SelectItem>
                    <SelectItem value="SW - Seggregated by Weight">SW - Seggregated by Weight</SelectItem>
                    <SelectItem value="SP - Scrap">SP - Scrap</SelectItem>
                  </SelectContent>
                </Select>
                {errors.unitType && <p className="text-red-500 text-sm mt-1">{errors.unitType}</p>}
              </div>
            </div>

            {/* Conditional Price Field */}
            {newMaterial.unitType && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {newMaterial.unitType.startsWith('SC') ? 'Per Unit *' :
                   newMaterial.unitType.startsWith('SW') ? 'CRV Price *' :
                   newMaterial.unitType.startsWith('SP') ? 'Scrap ($/lb) *' : 'Price *'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={
                    newMaterial.unitType.startsWith('SC') ? newMaterial.perUnit :
                    newMaterial.unitType.startsWith('SW') ? newMaterial.crvPrice :
                    newMaterial.unitType.startsWith('SP') ? newMaterial.scrapPrice : ''
                  }
                  onChange={(e) => {
                    if (newMaterial.unitType.startsWith('SC')) {
                      setNewMaterial({ ...newMaterial, perUnit: e.target.value });
                    } else if (newMaterial.unitType.startsWith('SW')) {
                      setNewMaterial({ ...newMaterial, crvPrice: e.target.value });
                    } else if (newMaterial.unitType.startsWith('SP')) {
                      setNewMaterial({ ...newMaterial, scrapPrice: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-yellow-500"
                  placeholder="0.00"
                />
              </div>
            )}

            {/* Min/Max Quantity - 2 columns */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Quantity
                </label>
                <input
                  type="text"
                  value={newMaterial.minQuantity}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, minQuantity: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-yellow-500"
                  placeholder="Min qty"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Quantity
                </label>
                <input
                  type="text"
                  value={newMaterial.maxQuantity}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, maxQuantity: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-yellow-500"
                  placeholder="Max qty"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={newMaterial.specialNotes}
                onChange={(e) =>
                  setNewMaterial({
                    ...newMaterial,
                    specialNotes: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="Add any special notes..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                setNewMaterial({
                  materialname: "",
                  programType: "",
                  materialType: "",
                  unitType: "",
                  crvPrice: "",
                  scrapPrice: "",
                  perUnit: "",
                  minQuantity: "",
                  maxQuantity: "",
                  specialNotes: "",
                });
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Material'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}