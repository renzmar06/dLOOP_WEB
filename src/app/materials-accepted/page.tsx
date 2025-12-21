"use client";

import { useState } from "react";
import {
  MoreVertical,
  Pencil,
  Copy,
  Trash2,
  Plus,
  Droplet,
  Recycle,
  Glasses,
  Cpu,
  Package,
  DollarSign,
  Bolt,
  Layers,
  Save,
  Leaf,
} from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Layout from '@/components/Layout';
import AddMaterialModal from './AddMaterialModal';

/* -------------------- TYPES -------------------- */
type Category = {
  id: number;
  name: string;
  description: string;
  icon: any;
  bg: string;
  active: string;
};

/* -------------------- DATA -------------------- */
const categories: Category[] = [
  { id: 1, name: "Aluminum", description: "CRV aluminum cans and containers", icon: Recycle, bg: "bg-yellow-100 text-yellow-700",active:"2" },
  { id: 2, name: "Plastic (PET #1)", description: "PET plastic bottles and containers", icon: Droplet, bg: "bg-blue-100 text-blue-700",active:"4" },
  { id: 3, name: "Plastic (HDPE #2)", description: "HDPE plastic bottles and containers", icon: Droplet, bg: "bg-sky-100 text-sky-700",active:"2" },
  { id: 4, name: "Glass", description: "Glass bottles and containers", icon: Glasses, bg: "bg-orange-100 text-orange-700",active:"2" },
  { id: 5, name: "Ferrous Metals", description: "Steel, iron, magnetic metals", icon: Layers, bg: "bg-gray-200 text-gray-700",active:"2" },
  { id: 6, name: "Non-Ferrous Metals", description: "Copper, brass, aluminum scrap", icon: Bolt, bg: "bg-red-100 text-red-700",active:"2" },
  { id: 7, name: "Electronics / E-Waste", description: "Computers, phones, appliances", icon: Cpu, bg: "bg-purple-100 text-purple-700",active:"2" },
  { id: 8, name: "Cardboard / OCC", description: "Old corrugated containers", icon: Package, bg: "bg-amber-100 text-amber-700",active:"2" },
  { id: 9, name: "Buyback Program", description: "Custom material buyback", icon: DollarSign, bg: "bg-emerald-100 text-emerald-700",active:"2" },
];

/* -------------------- COMPONENT -------------------- */
export default function MaterialsAcceptedMain() {
  const [enabled, setEnabled] = useState<Record<number, boolean>>({});
  const [aluminumSW, setAluminumSW] = useState(true);
  const [aluminumCW, setAluminumCW] = useState(true);
  const [subtypes, setSubtypes] = useState([
    { id: 1, title: "Aluminum Cans (SW)", description: "Segregated weight", enabled: true },
    { id: 2, title: "Aluminum Cans (CW)", description: "Commingled weight", enabled: true }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    materialType: '',
    unitType: '',
    crvPrice: '',
    scrapPrice: '',
    perUnit: '',
    minQuantity: '',
    maxQuantity: '',
    specialNotes: ''
  });

  return (
    <Layout>
      <div className="flex flex-col h-full">
    
    {/* ===== FIXED HEADER (SAME AS BUSINESS VERIFICATION) ===== */}
    <div className="flex items-center justify-between p-2 border-b border-gray-200 min-h-[75px] -mt-6">
      <div>
        <h1 className="text-lg font-bold text-gray-900">
          Materials Accepted – Advanced Settings
        </h1>
        <p className="text-sm text-gray-500">
          Configure material types, pricing, and payout rules for your recycling center
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4" />
          Add Custom Material
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </div>

      <div className="grid grid-cols-2 gap-6 p-6 flex-1 overflow-y-auto">

      {/* ================= LEFT: MATERIAL CATEGORIES ================= */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
            <Leaf className="w-4 h-4 inline mr-2 text-yellow-600" />
          Material Categories  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">2 Active</span>
        </h2>

        <div className="space-y-3">
          {categories.map((cate) => {
            const Icon = cate.icon;
            const isEnabled = enabled[cate.id] || false;
            return (
              <div
                key={cate.id}
                className={`flex items-center justify-between p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition ${
                  isEnabled ? 'border-yellow-400 shadow-yellow-100' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${cate.bg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{cate.name}</h3>
                    <p className="text-xs text-gray-500">{cate.description}</p>
                    <h3 className="text-xs mt-2 text-yellow-700">{cate.active} active</h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={(v) => setEnabled({ ...enabled, [cate.id]: v })}
                  />

                  <div className="relative">
                    <MoreVertical 
                      className="w-4 h-4 text-gray-500 cursor-pointer" 
                      onClick={() => setOpenDropdown(openDropdown === cate.id ? null : cate.id)}
                    />
                    {openDropdown === cate.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-50">
                        <button 
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full text-left"
                          onClick={() => {
                            setSelectedCategory(cate);
                            setShowRenameModal(true);
                            setOpenDropdown(null);
                          }}
                        >
                          <Pencil className="w-4 h-4" /> Rename
                        </button>
                        <button 
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full text-left"
                          onClick={() => {
                            console.log('Duplicate', cate.name);
                            setOpenDropdown(null);
                          }}
                        >
                          <Copy className="w-4 h-4" /> Duplicate
                        </button>
                        <button 
                          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                          onClick={() => {
                            console.log('Delete', cate.name);
                            setOpenDropdown(null);
                          }}
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= RIGHT: ALUMINUM ================= */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">
            <Recycle className="w-4 h-4 inline mr-2 text-yellow-600" />
            Aluminum
          </h2>
          <Button 
            size="sm" 
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={() => {
              const newId = Math.max(...subtypes.map(s => s.id)) + 1;
              setSubtypes([...subtypes, {
                id: newId,
                title: `Aluminum Subtype ${newId}`,
                description: "New subtype",
                enabled: false
              }]);
            }}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Subtype
          </Button>
        </div>

        {/* Dynamic Subtypes */}
        {subtypes.map((subtype) => (
          <SubtypeCard
            key={subtype.id}
            title={subtype.title}
            description={subtype.description}
            enabled={subtype.enabled}
            onToggle={(enabled) => {
              setSubtypes(subtypes.map(s => 
                s.id === subtype.id ? { ...s, enabled } : s
              ));
            }}
          />
        ))}
      </div>
    </div>

    <AddMaterialModal
      showAddModal={showAddModal}
      setShowAddModal={setShowAddModal}
      newMaterial={newMaterial}
      setNewMaterial={setNewMaterial}
    />

{/* Edit Category Modal */}
{showRenameModal && selectedCategory && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
      
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-bold text-gray-900">
          Edit Category
        </h2>
        <button
          onClick={() => {
            setShowRenameModal(false);
            setSelectedCategory(null);
          }}
          className="text-gray-600 hover:text-black"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="space-y-4">
          
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              defaultValue={selectedCategory.name}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Enter category name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              defaultValue={selectedCategory.description}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Enter description"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setShowRenameModal(false);
              setSelectedCategory(null);
            }}
          >
            Cancel
          </Button>
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={() => {
              console.log("Save category changes");
              setShowRenameModal(false);
              setSelectedCategory(null);
            }}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  </div>
)}

      </div>
    </Layout>
  );
}

/* -------------------- SUBTYPE CARD -------------------- */
function SubtypeCard({
  title,
  description,
  enabled,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
}) {
  const [showConfig, setShowConfig] = useState(false);
  
  const handleToggle = (value: boolean) => {
    onToggle(value);
    if (!value) {
      setShowConfig(false);
    }
  };
  const [config, setConfig] = useState({
    materialType: '',
    unitType: '',
    crvPrice: '',
    scrapPrice: '',
    perUnit: '',
    minQuantity: '',
    maxQuantity: '',
    specialNotes: ''
  });

  return (
    <div className={`p-4 mb-4 rounded-xl border bg-white shadow-sm ${
      enabled ? 'border-yellow-400 shadow-yellow-100' : ''
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg">
          <Switch checked={enabled} onCheckedChange={handleToggle} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Copy className="w-4 h-4 text-gray-500 cursor-pointer" />
          <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
        </div>
      </div>

      {enabled && (
        <button 
          onClick={() => setShowConfig(!showConfig)}
          className="mt-3 text-xs font-medium text-yellow-700 hover:underline"
        >
          Edit Configuration
        </button>
      )}

     {showConfig && (
  <div className="mt-4 rounded-xl border bg-[#F9FBFA]">
    
    {/* Divider */}
    <div className="border-t border-gray-200" />

    <div className="p-5 space-y-5">
      
      {/* Material Type */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Material Type
        </label>
        <Select
          value={config.materialType}
          onValueChange={(value: string) =>
            setConfig({ ...config, materialType: value })
          }
        >
          <SelectTrigger className="w-full h-11 focus:ring-2 focus:ring-yellow-500">
            <SelectValue placeholder="CRV (California Redemption)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="crv">CRV (California Redemption)</SelectItem>
            <SelectItem value="Scrap Metal/Material">Scrap Metal/Material</SelectItem>
            <SelectItem value="Mixed (CRV + Scrap)">Mixed (CRV + Scrap)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Unit Type */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Unit Type
        </label>
        <Select
          value={config.unitType}
          onValueChange={(value: string) =>
            setConfig({ ...config, unitType: value })
          }
        >
          <SelectTrigger className="w-full h-11 focus:ring-2 focus:ring-yellow-500">
            <SelectValue placeholder="CW (Commingled Weight)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cw">CW (Commingled Weight)</SelectItem>
            <SelectItem value="sw">SW (Segregated Weight)</SelectItem>
            <SelectItem value="UNIT (Count-Based)">UNIT (Count-Based)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Prices */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            CRV Price
          </label>
          <input
            type="number"
            value={config.crvPrice}
            onChange={(e) =>
              setConfig({ ...config, crvPrice: e.target.value })
            }
            className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500"
            placeholder="0.05"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Scrap ($/lb)
          </label>
          <input
            type="number"
            value={config.scrapPrice}
            onChange={(e) =>
              setConfig({ ...config, scrapPrice: e.target.value })
            }
            className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500"
            placeholder="0.65"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Per Unit
          </label>
          <input
            type="number"
            value={config.perUnit}
            onChange={(e) =>
              setConfig({ ...config, perUnit: e.target.value })
            }
            className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500"
            placeholder="0"
          />
        </div>
      </div>

      {/* Min / Max Quantity */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Min Quantity
          </label>
          <input
            type="text"
            value={config.minQuantity}
            onChange={(e) =>
              setConfig({ ...config, minQuantity: e.target.value })
            }
            className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Max Quantity
          </label>
          <input
            type="text"
            value={config.maxQuantity}
            onChange={(e) =>
              setConfig({ ...config, maxQuantity: e.target.value })
            }
            className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500"
            placeholder="Optional"
          />
        </div>
      </div>

      {/* Special Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Special Notes
        </label>
        <textarea
          rows={3}
          value={config.specialNotes}
          onChange={(e) =>
            setConfig({ ...config, specialNotes: e.target.value })
          }
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500"
          placeholder="Customer prep instructions, handling notes..."
        />
      </div>
    </div>
  </div>
)}

    </div>
  );
}
