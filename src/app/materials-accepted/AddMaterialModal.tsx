'use client';

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
  name: string;
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

  const handleSave = async () => {
    try {
      await dispatch(addMaterial(newMaterial)).unwrap();
      setShowAddModal(false);
      setNewMaterial({
        name: "",
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
                value={newMaterial.name}
                onChange={(e) =>
                  setNewMaterial({ ...newMaterial, name: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Enter material name"
              />
            </div>

            {/* Type + Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Material Type
                </label>
                <Select
                  value={newMaterial.materialType}
                  onValueChange={(value: string) =>
                    setNewMaterial({ ...newMaterial, materialType: value })
                  }
                >
                  <SelectTrigger className="w-full focus:ring-2 focus:ring-yellow-500">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="can">Can</SelectItem>
                    <SelectItem value="bottle">Bottle</SelectItem>
                    <SelectItem value="scrap">Scrap</SelectItem>
                    <SelectItem value="plastic">Plastic</SelectItem>
                    <SelectItem value="glass">Glass</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Type *
                </label>
                <Select
                  value={newMaterial.unitType}
                  onValueChange={(value: string) =>
                    setNewMaterial({ ...newMaterial, unitType: value })
                  }
                >
                  <SelectTrigger className="w-full focus:ring-2 focus:ring-yellow-500">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lb">Pound (lb)</SelectItem>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="piece">Per Piece</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* CRV Price, Scrap, Per Unit - 3 columns */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CRV Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newMaterial.crvPrice}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, crvPrice: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-yellow-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scrap ($/lb)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newMaterial.scrapPrice}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, scrapPrice: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-yellow-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Per Unit
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newMaterial.perUnit}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, perUnit: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-yellow-500"
                  placeholder="0.00"
                />
              </div>
            </div>

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
                  name: "",
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