"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchMaterials, deleteSubmaterial } from '@/redux/slices/materialsSlice';
import toast, { Toaster } from 'react-hot-toast';
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
  UndoIcon,
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
// import Layout from '@/components/Layout';
import AddMaterialModal from './AddMaterialModal';


/* -------------------- TYPES -------------------- */
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
  submaterial: any[];
}





/* -------------------- COMPONENT -------------------- */
export default function MaterialsAcceptedMain() {
  const dispatch = useDispatch<AppDispatch>();
  const { materials, isLoading, error } = useSelector((state: RootState) => state.materials);
  

  const [showAddModal, setShowAddModal] = useState(false);

  const [newMaterial, setNewMaterial] = useState<NewMaterial>({
    materialname: '',
    programType: '',
    materialType: '',
    unitType: '',
    crvPrice: '',
    scrapPrice: '',
    perUnit: '',
    minQuantity: '',
    maxQuantity: '',
    specialNotes: '',
    submaterial: []
  });
  const [editingSubtype, setEditingSubtype] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [materialSubmaterials, setMaterialSubmaterials] = useState<Record<string, any[]>>({});
  const [openAccordion, setOpenAccordion] = useState<string>('');

  // Fetch materials on component mount
  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);

  return (
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

        {/* <Button
          variant="outline"
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </Button> */}
      </div>
    </div>

      <div className="p-6 flex-1 overflow-y-auto">



      {/* ================= DATABASE MATERIALS ================= */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          <Leaf className="w-4 h-4 inline mr-2 text-yellow-600" />
          Materials from Database
          {materials.length > 0 && (
            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
              {materials.length} Found
            </span>
          )}
        </h2>

        {error && (
          <div className="text-center py-8">
            <div className="text-red-500">Error: {error}</div>
          </div>
        )}

        {!isLoading && !error && materials.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">No materials found in database</div>
          </div>
        )}

        {!isLoading && materials.length > 0 && (
          <div className="space-y-3">
            {materials.map((material) => {
              const isEnabled = true;
              return (
                <Accordion key={material._id} type="single" collapsible className="w-full" value={openAccordion} onValueChange={setOpenAccordion}>
                  <AccordionItem value={`material-${material._id}`} className="border-none">
                    <div className={`flex items-center justify-between p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition ${
                      isEnabled ? ' shadow-white' : ''
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-yellow-100 text-yellow-700">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{material.materialname}</h3>
                          <p className="text-xs text-gray-500">{material.materialType} - {material.unitType}</p>
                        
                          {[...(material.submaterial || []), ...(materialSubmaterials[material._id!] || [])].length > 0 && (
                            <span className="text-xs mt-1 text-yellow-700">
                              {[...(material.submaterial || []), ...(materialSubmaterials[material._id!] || [])].length} active
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Switch checked={isEnabled} onCheckedChange={() => {}} />
                        <AccordionTrigger className="p-0 h-4 w-4 hover:no-underline" />
                      </div>
                    </div>
                    
                    <AccordionContent className="pt-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-sm font-semibold text-gray-700">{material.materialname} Submaterials</h3>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1"
                              onClick={() => {
                                const materialId = material._id!;
                                const currentSubs = materialSubmaterials[materialId] || [];
                                const newId = `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                                const newSubmaterial = {
                                  id: newId,
                                  submaterialname: `${material.materialname} Subtype ${currentSubs.length + 1}`,
                                  programType: 'bag-drop',
                                  materialType: 'crv',
                                  unitType: 'SW - Segregated by Weight',
                                  crvPrice: 0,
                                  scrapPrice: 0,
                                  perUnit: 0,
                                  minQuantity: 0,
                                  maxQuantity: 0,
                                  specialNotes: '',
                                  enabled: false
                                };
                                setMaterialSubmaterials({
                                  ...materialSubmaterials,
                                  [materialId]: [...currentSubs, newSubmaterial]
                                });
                              }}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Submaterial
                            </Button>
                          </div>
                        </div>
                        
                        {material.submaterial && material.submaterial.length > 0 || materialSubmaterials[material._id!]?.length > 0 ? (
                          [...(material.submaterial || []), ...(materialSubmaterials[material._id!] || [])].map((sub, index) => (
                            <SubtypeCard
                              key={`${material._id}-${sub.id}-${index}`}
                              title={sub.submaterialname}
                              description={`${sub.programType} - ${sub.materialType}`}
                              enabled={sub.enabled}
                              isEditing={editingSubtype === sub.id}
                              editTitle={editTitle}
                              submaterialData={sub}
                              materialId={material._id}
                              materialSubmaterials={materialSubmaterials}
                              setMaterialSubmaterials={setMaterialSubmaterials}
                              onToggle={(enabled) => {
                                if (sub.id.startsWith('new-')) {
                                  const materialId = material._id!;
                                  const updatedSubs = materialSubmaterials[materialId]?.map(s => 
                                    s.id === sub.id ? { ...s, enabled } : s
                                  ) || [];
                                  setMaterialSubmaterials({
                                    ...materialSubmaterials,
                                    [materialId]: updatedSubs
                                  });
                                } else {
                                  console.log('Toggle submaterial:', sub.id, enabled);
                                }
                              }}
                              onEditStart={() => {
                                setEditingSubtype(sub.id);
                                setEditTitle(sub.submaterialname);
                              }}
                              onEditSave={() => {
                                if (sub.id.startsWith('new-')) {
                                  const materialId = material._id!;
                                  const updatedSubs = materialSubmaterials[materialId]?.map(s => 
                                    s.id === sub.id ? { ...s, submaterialname: editTitle } : s
                                  ) || [];
                                  setMaterialSubmaterials({
                                    ...materialSubmaterials,
                                    [materialId]: updatedSubs
                                  });
                                } else {
                                  console.log('Save submaterial:', sub.id, editTitle);
                                }
                                setEditingSubtype(null);
                              }}
                              onEditCancel={() => setEditingSubtype(null)}
                              onTitleChange={setEditTitle}
                            />
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500 text-sm">
                            No submaterials found
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              );
            })}
          </div>
        )}
      </div>
    </div>

    <AddMaterialModal
      showAddModal={showAddModal}
      setShowAddModal={setShowAddModal}
      newMaterial={newMaterial}
      setNewMaterial={setNewMaterial}
    />
    <Toaster />
      </div>
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
  submaterialData,
  materialId,
  materialSubmaterials,
  setMaterialSubmaterials,
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
  submaterialData?: any;
  materialId?: string;
  materialSubmaterials?: Record<string, any[]>;
  setMaterialSubmaterials?: (materials: Record<string, any[]>) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [showConfig, setShowConfig] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleToggle = (value: boolean) => {
    onToggle(value);
    if (!value) {
      setShowConfig(false);
    }
  };
  const [config, setConfig] = useState({
    submaterialname: '',
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
  const [priceError, setPriceError] = useState('');

  useEffect(() => {
    if (submaterialData && showConfig) {
      setConfig({
        submaterialname: submaterialData.submaterialname || '',
        programType: submaterialData.programType || '',
        materialType: submaterialData.materialType || '',
        unitType: submaterialData.unitType || '',
        crvPrice: submaterialData.crvPrice?.toString() || '',
        scrapPrice: submaterialData.scrapPrice?.toString() || '',
        perUnit: submaterialData.perUnit?.toString() || '',
        minQuantity: submaterialData.minQuantity?.toString() || '',
        maxQuantity: submaterialData.maxQuantity?.toString() || '',
        specialNotes: submaterialData.specialNotes || ''
      });
    }
  }, [submaterialData, showConfig]);

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
                onBlur={onEditSave}
                autoFocus
                className="text-sm font-semibold text-gray-900 bg-transparent border-b border-yellow-400 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onEditSave?.();
                  if (e.key === 'Escape') onEditCancel?.();
                }}
              />
            ) : (
              <h3 className="text-sm font-semibold text-gray-900 cursor-pointer" onClick={onEditStart}>{title}</h3>
            )}
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* <Copy className="w-4 h-4 text-gray-500 cursor-pointer" /> */}
          <Trash2 
            className="w-4 h-4 text-red-500 cursor-pointer" 
            onClick={async () => {
              if (submaterialData?.id?.startsWith('new-') && materialSubmaterials && setMaterialSubmaterials) {
                const updatedSubs = materialSubmaterials[materialId!]?.filter(s => s.id !== submaterialData.id) || [];
                setMaterialSubmaterials({
                  ...materialSubmaterials,
                  [materialId!]: updatedSubs
                });
              } else {
                await dispatch(deleteSubmaterial({ materialId: materialId!, submaterialId: submaterialData?.id }));
                toast.success('Submaterial deleted successfully!', {
                  position: 'bottom-right'
                });
              }
            }}
          />
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
          value={config.materialType || undefined}
          onValueChange={(value: string) =>
            setConfig({ ...config, materialType: value })
          }
        >
          <SelectTrigger className="w-full h-11 focus:ring-2 focus:ring-yellow-500">
            <SelectValue placeholder="Select Material Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="crv">CRV</SelectItem>
            <SelectItem value="Scrap">Scrap</SelectItem>
            <SelectItem value="WDS">WDS</SelectItem>
          </SelectContent>
        </Select>
      </div>
        <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Program Type
        </label>
        <Select
          value={config.programType || undefined}
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
          value={config.unitType || undefined}
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
              const value = e.target.value;
              setPriceError('');
              if (config.unitType === 'SC') {
                setConfig({ ...config, perUnit: value });
              } else if (config.unitType === 'SW') {
                setConfig({ ...config, crvPrice: value });
              } else if (config.unitType === 'SP') {
                setConfig({ ...config, scrapPrice: value });
              }
            }}
            className={`w-full h-11 px-3 rounded-lg border focus:ring-2 focus:ring-yellow-500 ${
              priceError ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {priceError && (
            <p className="text-red-500 text-xs mt-1">{priceError}</p>
          )}
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

      {/* Save Button */}
      <div className="flex justify-end pt-3">
        <Button
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSaving}
          onClick={async () => {
            setIsSaving(true);
            // Validate price field
            const currentPrice = config.unitType === 'SC' ? config.perUnit :
                               config.unitType === 'SW' ? config.crvPrice :
                               config.unitType === 'SP' ? config.scrapPrice : '';
            
            if (!currentPrice || parseFloat(currentPrice) <= 0) {
              const fieldName = config.unitType === 'SC' ? 'Per Unit' :
                               config.unitType === 'SW' ? 'CRV Price' :
                               config.unitType === 'SP' ? 'Scrap Price' : 'Price';
              setPriceError(`${fieldName} is required and must be greater than 0`);
              toast.error(`${fieldName} is required and must be greater than 0`, {
                position: 'bottom-right'
              });
              setIsSaving(false);
              return;
            }
            
            try {
              const response = await fetch(`/api/materials/${materialId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  submaterialId: submaterialData?.id,
                  config: config
                })
              });
              
              if (response.ok) {
                const result = await response.json();
                toast.success('Configuration saved successfully!', {
                  position: 'bottom-right'
                });
                setShowConfig(false);
                
                // If it was a new submaterial, remove it from local state and refresh
                if (submaterialData?.id?.startsWith('new-') && materialSubmaterials && setMaterialSubmaterials) {
                  const materialIdStr = materialId!;
                  const updatedSubs = materialSubmaterials[materialIdStr]?.filter((s: any) => s.id !== submaterialData.id) || [];
                  setMaterialSubmaterials({
                    ...materialSubmaterials,
                    [materialIdStr]: updatedSubs
                  });
                  // Refresh materials data to get the new submaterial from database
                  dispatch(fetchMaterials());
                }
              } else {
                toast.error('Failed to save configuration', {
                  position: 'bottom-right'
                });
              }
            } catch (error) {
              console.error('Error saving configuration:', error);
              toast.error('An error occurred while saving', {
                position: 'bottom-right'
              });
            } finally {
              setIsSaving(false);
            }
          }}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
