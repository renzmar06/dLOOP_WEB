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
  ChevronDown,
  ChevronUp,
  Box,
  FileText,
  ShoppingBag,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  { id: 1, name: "AL - Aluminum", description: "CRV aluminum cans and containers", icon: Recycle, bg: "bg-yellow-100 text-yellow-700",active:"2" },
  { id: 2, name: "PET - PET Plastic", description: "PET plastic bottles and containers", icon: Droplet, bg: "bg-blue-100 text-blue-700",active:"4" },
  { id: 3, name: "HDPE - HDPE Plastic", description: "HDPE plastic bottles and containers", icon: Droplet, bg: "bg-sky-100 text-sky-700",active:"2" },
  { id: 4, name: "GLASS - Glass", description: "Glass bottles and containers", icon: Glasses, bg: "bg-orange-100 text-orange-700",active:"2" },
  { id: 5, name: "PVC - PVC Plastic", description: "Steel, iron, magnetic metals", icon: Layers, bg: "bg-gray-200 text-gray-700",active:"2" },
  { id: 6, name: "LDPE - LDPE Plastic", description: "Copper, brass, aluminum scrap", icon: Bolt, bg: "bg-red-100 text-red-700",active:"2" },
  { id: 7, name: "PP - PP Plastic", description: "Computers, phones, appliances", icon: Cpu, bg: "bg-purple-100 text-purple-700",active:"2" },
  { id: 8, name: "PS - PS Plastic", description: "Old corrugated containers", icon: Package, bg: "bg-amber-100 text-amber-700",active:"2" },
  { id: 9, name: "Bi-Metal", description: "Custom material buyback", icon: DollarSign, bg: "bg-emerald-100 text-emerald-700",active:"2" },
  { id: 10, name: "Bag-in-Box", description: "Custom material buyback", icon: Box, bg: "bg-teal-100 text-teal-700",active:"2" },
  { id: 11, name: "Paper Carton", description: "Custom material buyback", icon: FileText, bg: "bg-indigo-100 text-indigo-700",active:"2" },
  { id: 12, name: "Multi-Layer Pouch", description: "Custom material buyback", icon: Layers, bg: "bg-pink-100 text-pink-700",active:"2" },
  { id: 13, name: "Plastic Pouch", description: "Custom material buyback", icon: ShoppingBag, bg: "bg-cyan-100 text-cyan-700",active:"2" },
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
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [newMaterial, setNewMaterial] = useState({
    materialname: '',
    programType: '',
    materialType: '',
    unitType: '',
    crvPrice: '',
    scrapPrice: '',
    perUnit: '',
    minQuantity: '',
    maxQuantity: '',
    specialNotes: ''
  });
  const [editingSubtype, setEditingSubtype] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [openAccordion, setOpenAccordion] = useState<string>('');

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

      <div className="p-6 flex-1 overflow-y-auto">

      {/* ================= MATERIAL CATEGORIES ================= */}
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
              <Accordion key={cate.id} type="single" collapsible className="w-full" value={openAccordion} onValueChange={setOpenAccordion}>
                <AccordionItem value={`category-${cate.id}`} className="border-none">
                  <div className={`flex items-center justify-between p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition ${
                    isEnabled ? 'border-yellow-400 shadow-yellow-100' : ''
                  }`}>
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
                      <Button 
                        size="sm" 
                        className={`text-white text-xs px-2 py-1 ${
                          openAccordion === `category-${cate.id}` 
                            ? 'bg-yellow-500 hover:bg-yellow-600' 
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                        disabled={openAccordion !== `category-${cate.id}`}
                        onClick={() => {
                          if (openAccordion === `category-${cate.id}`) {
                            const newId = Math.max(...subtypes.map(s => s.id)) + 1;
                            setSubtypes([...subtypes, {
                              id: newId,
                              title: `${cate.name} Subtype ${newId}`,
                              description: "New subtype",
                              enabled: false
                            }]);
                          }
                        }}
                      >
                        <Plus className="w-3 h-3" /> 
                      </Button>
                      <AccordionTrigger className="p-0 h-4 w-4 hover:no-underline" />
                    </div>
                  </div>
                  
                  <AccordionContent className="pt-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-semibold text-gray-700">{cate.name} Subtypes</h3>
                      </div>
                      
                      {subtypes.map((subtype) => (
                        <SubtypeCard
                          key={subtype.id}
                          title={subtype.title}
                          description={subtype.description}
                          enabled={subtype.enabled}
                          isEditing={editingSubtype === subtype.id}
                          editTitle={editTitle}
                          onToggle={(enabled) => {
                            setSubtypes(subtypes.map(s => 
                              s.id === subtype.id ? { ...s, enabled } : s
                            ));
                          }}
                          onEditStart={() => {
                            setEditingSubtype(subtype.id);
                            setEditTitle(subtype.title);
                          }}
                          onEditSave={() => {
                            setSubtypes(subtypes.map(s => 
                              s.id === subtype.id ? { ...s, title: editTitle } : s
                            ));
                            setEditingSubtype(null);
                          }}
                          onEditCancel={() => setEditingSubtype(null)}
                          onTitleChange={setEditTitle}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          })}
        </div>
      </div>
    </div>

    <AddMaterialModal
      showAddModal={showAddModal}
      setShowAddModal={setShowAddModal}
      newMaterial={newMaterial}
      setNewMaterial={setNewMaterial}
    />
      </div>
    </Layout>
  );
}

/* -------------------- SUBTYPE CARD -------------------- */
function SubtypeCard({
  title,
  description,
  enabled,
  isEditing,
  editTitle,
  onToggle,
  onEditStart,
  onEditSave,
  onEditCancel,
  onTitleChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  isEditing?: boolean;
  editTitle?: string;
  onToggle: (v: boolean) => void;
  onEditStart?: () => void;
  onEditSave?: () => void;
  onEditCancel?: () => void;
  onTitleChange?: (title: string) => void;
}) {
  const [showConfig, setShowConfig] = useState(false);
  
  const handleToggle = (value: boolean) => {
    onToggle(value);
    if (!value) {
      setShowConfig(false);
    }
  };
  const [config, setConfig] = useState({
    programType: '',
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
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => onTitleChange?.(e.target.value)}
                className="text-sm font-semibold text-gray-900 bg-transparent border border-yellow-400 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onEditSave?.();
                  if (e.key === 'Escape') onEditCancel?.();
                }}
                autoFocus
              />
            ) : (
              <h3 className="text-sm font-semibold text-gray-900 cursor-pointer" onClick={onEditStart}>{title}</h3>
            )}
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
      
      {/* Program Type */}
    

      {/* Material Type */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Material Type *
        </label>
        <Select
          value={config.materialType}
          onValueChange={(value: string) =>
            setConfig({ ...config, materialType: value })
          }
        >
          <SelectTrigger className="w-full h-11 focus:ring-2 focus:ring-yellow-500">
            <SelectValue placeholder="Select Material Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="crv">CRV</SelectItem>
            <SelectItem value="Scrap">Scrap </SelectItem>
            <SelectItem value="WDS">WDS</SelectItem>
          </SelectContent>
        </Select>
      </div>
        <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Program Type
        </label>
        <Select
          value={config.programType}
          onValueChange={(value: string) =>
            setConfig({ ...config, programType: value })
          }
        >
          <SelectTrigger className="w-full h-11 focus:ring-2 focus:ring-yellow-500">
            <SelectValue placeholder="Select Program Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bag-drop">Bag and Drop</SelectItem>
            <SelectItem value="walk-in-crv">Walk-in CRV</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Unit Type */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Unit Type *
        </label>
        <Select
          value={config.unitType}
          onValueChange={(value: string) =>
            setConfig({ ...config, unitType: value })
          }
        >
          <SelectTrigger className="w-full h-11 focus:ring-2 focus:ring-yellow-500">
            <SelectValue placeholder="Select Unit Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SC">SC - Segregated by Count</SelectItem>
            <SelectItem value="SW">SW - Segregated by Weight</SelectItem>
            <SelectItem value="SP">SP - Scrap</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Conditional Price Field */}
      {config.unitType && (
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            {config.unitType === 'SC' ? 'Per Unit *' :
             config.unitType === 'SW' ? 'CRV Price *' :
             config.unitType === 'SP' ? 'Scrap ($/lb) *' : 'Price *'}
          </label>
          <input
            type="number"
            value={
              config.unitType === 'SC' ? config.perUnit :
              config.unitType === 'SW' ? config.crvPrice :
              config.unitType === 'SP' ? config.scrapPrice : ''
            }
            onChange={(e) => {
              if (config.unitType === 'SC') {
                setConfig({ ...config, perUnit: e.target.value });
              } else if (config.unitType === 'SW') {
                setConfig({ ...config, crvPrice: e.target.value });
              } else if (config.unitType === 'SP') {
                setConfig({ ...config, scrapPrice: e.target.value });
              }
            }}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500"
            placeholder="0.00"
          />
        </div>
      )}

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
