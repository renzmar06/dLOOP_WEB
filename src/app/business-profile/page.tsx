"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchBusinesses,
  createBusiness,
  updateBusiness,
  clearError,
} from "@/redux/slices/businessSlice";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  User,
  MapPin,
  Star,
  Bold,
  Italic,
  Underline,
  Eye,
  Home,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  RotateCcw,
  Building,
  Clock,
  Save,
} from "lucide-react";
import PreviewModal from "@/components/PreviewModal";
import Layout from "@/components/Layout";
import Material from "./Material";

const Input = ({
  label,
  value,
  onChange,
  icon: Icon,
  iconColor,
  ...props
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  [key: string]: unknown;
}) => (
  <div className="mt-4">
    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
      {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
      {label}
    </label>
    <input
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
      {...props}
    />
  </div>
);

const Textarea = ({
  label,
  value,
  onChange,
  icon: Icon,
  iconColor,
  ...props
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  [key: string]: unknown;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
      {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
      {label}
    </label>
    <textarea
      value={value}
      onChange={onChange}
      rows={4}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
      {...props}
    />
  </div>
);

const RichTextEditor = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: { target: { value: string } }) => void;
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      const selection = window.getSelection();
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
      const startOffset = range?.startOffset || 0;

      editorRef.current.innerHTML = value;

      if (range && editorRef.current.firstChild) {
        try {
          const newRange = document.createRange();
          newRange.setStart(
            editorRef.current.firstChild,
            Math.min(startOffset, editorRef.current.textContent?.length || 0)
          );
          newRange.collapse(true);
          selection?.removeAllRanges();
          selection?.addRange(newRange);
        } catch (e) {
          // Ignore cursor positioning errors
        }
      }
    }
  }, [value]);

  const updateActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
    });
  };

  const handleFormat = (format: string) => {
    document.execCommand(format, false, "");
    if (editorRef.current) {
      onChange({ target: { value: editorRef.current.innerHTML } });
      updateActiveFormats();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-yellow-400">
        <div className="flex gap-2 p-2 border-b border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => handleFormat("bold")}
            className={`p-1 rounded ${
              activeFormats.bold ? "bg-yellow-200" : "hover:bg-gray-200"
            }`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat("italic")}
            className={`p-1 rounded ${
              activeFormats.italic ? "bg-yellow-200" : "hover:bg-gray-200"
            }`}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat("underline")}
            className={`p-1 rounded ${
              activeFormats.underline ? "bg-yellow-200" : "hover:bg-gray-200"
            }`}
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat("removeFormat")}
            className="p-1 rounded hover:bg-gray-200"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        <div
          ref={editorRef}
          contentEditable
          onInput={(e) =>
            onChange({ target: { value: e.currentTarget.innerHTML } })
          }
          onMouseUp={updateActiveFormats}
          onKeyUp={updateActiveFormats}
          className="p-3 min-h-[100px] focus:outline-none"
          suppressContentEditableWarning
        />
      </div>
    </div>
  );
};

export default function BusinessProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const businessState = useSelector((state: RootState) => {
    console.log("Full Redux state:", state);
    console.log("Business slice:", state.business);
    return state.business || {};
  });
  const {
    businesses = [],
    currentBusiness = null,
    loading = false,
    error = null,
  } = businessState;

  console.log("Redux business state:", businessState);
  console.log("Businesses array:", businesses);
  console.log("Businesses length:", businesses.length);

  const [activeTab, setActiveTab] = useState("business-info");
  const [showPreview, setShowPreview] = useState(false);

  interface BusinessFormData {
    _id?: string;
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
    businessHours: Record<
      string,
      { open: string; close: string; closed: boolean }
    >;
    instagram: string;
    facebook: string;
    twitter: string;
    seoKeywords: string;
  }

  const [form, setForm] = useState<BusinessFormData>({
    businessName: "",
    logo: "",
    phone: "",
    email: "",
    website: "",
    googleLocation: "",
    serviceArea: "",
    businessType: "",
    industry: "",
    description: "",
    registeredId: "",
    legalName: "",
    businessHours: {
      monday: { open: "09:00", close: "17:00", closed: true },
      tuesday: { open: "09:00", close: "17:00", closed: true },
      wednesday: { open: "09:00", close: "17:00", closed: true },
      thursday: { open: "09:00", close: "17:00", closed: true },
      friday: { open: "09:00", close: "17:00", closed: true },
      saturday: { open: "09:00", close: "17:00", closed: true },
      sunday: { open: "09:00", close: "17:00", closed: true },
    },
    instagram: "",
    facebook: "",
    twitter: "",
    seoKeywords: "",
  });

  useEffect(() => {
    const loadBusinessData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/business", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("Direct API call result:", data);

        if (data.success && data.data.length > 0) {
          const business = data.data[0];
          console.log("Loading business directly:", business);

          // Convert business hours
          const businessHoursObj: Record<
            string,
            { open: string; close: string; closed: boolean }
          > = {
            monday: { open: "09:00", close: "17:00", closed: true },
            tuesday: { open: "09:00", close: "17:00", closed: true },
            wednesday: { open: "09:00", close: "17:00", closed: true },
            thursday: { open: "09:00", close: "17:00", closed: true },
            friday: { open: "09:00", close: "17:00", closed: true },
            saturday: { open: "09:00", close: "17:00", closed: true },
            sunday: { open: "09:00", close: "17:00", closed: true },
          };

          if (Array.isArray(business.businessHours)) {
            business.businessHours.forEach((entry: any) => {
              businessHoursObj[entry.day] = {
                open: entry.open,
                close: entry.close,
                closed: entry.closed,
              };
            });
          }

          setForm({
            _id: business._id,
            businessName: business.businessName || "",
            logo: business.logo || "",
            phone: business.phone || "",
            email: business.email || "",
            website: business.website || "",
            googleLocation: business.googleLocation || "",
            serviceArea: business.serviceArea || "",
            businessType: business.businessType || "",
            industry: business.industry || "",
            description: business.description || "",
            registeredId: business.registeredId || "",
            legalName: business.legalName || "",
            businessHours: businessHoursObj,
            instagram: business.instagram || "",
            facebook: business.facebook || "",
            twitter: business.twitter || "",
            seoKeywords: business.seoKeywords || "",
          });

          console.log("Form populated directly from API");
        }
      } catch (error) {
        console.error("Direct API call failed:", error);
      }
    };

    loadBusinessData();
  }, []);

  useEffect(() => {
    console.log("=== FORM POPULATION useEffect ===");
    console.log("useEffect triggered, businesses length:", businesses.length);
    console.log("businesses array:", businesses);
    console.log("Type of businesses:", typeof businesses);
    console.log("Is array?:", Array.isArray(businesses));

    if (businesses.length > 0) {
      const business = businesses[0];
      console.log("Loading business data:", business);
      console.log("Business name from API:", business.businessName);

      // Convert business hours array to object
      const businessHoursObj: Record<
        string,
        { open: string; close: string; closed: boolean }
      > = {
        monday: { open: "09:00", close: "17:00", closed: true },
        tuesday: { open: "09:00", close: "17:00", closed: true },
        wednesday: { open: "09:00", close: "17:00", closed: true },
        thursday: { open: "09:00", close: "17:00", closed: true },
        friday: { open: "09:00", close: "17:00", closed: true },
        saturday: { open: "09:00", close: "17:00", closed: true },
        sunday: { open: "09:00", close: "17:00", closed: true },
      };

      if (Array.isArray(business.businessHours)) {
        business.businessHours.forEach((entry: any) => {
          businessHoursObj[entry.day] = {
            open: entry.open,
            close: entry.close,
            closed: entry.closed,
          };
        });
      }

      // Set the complete form data
      setForm({
        _id: business._id,
        businessName: business.businessName || "",
        logo: business.logo || "",
        phone: business.phone || "",
        email: business.email || "",
        website: business.website || "",
        googleLocation: business.googleLocation || "",
        serviceArea: business.serviceArea || "",
        businessType: business.businessType || "",
        industry: business.industry || "",
        description: business.description || "",
        registeredId: business.registeredId || "",
        legalName: business.legalName || "",
        businessHours: businessHoursObj,
        instagram: business.instagram || "",
        facebook: business.facebook || "",
        twitter: business.twitter || "",
        seoKeywords: business.seoKeywords || "",
      });

      console.log("About to set form with data:", {
        businessName: business.businessName,
        phone: business.phone,
      });

      console.log("Form populated with business data");
      console.log("New form state:", {
        businessName: business.businessName,
        phone: business.phone,
        email: business.email,
      });
    } else {
      console.log("No businesses data to populate form");
    }
  }, [businesses]);

  // Debug: Log form state changes
  useEffect(() => {
    console.log("Form state updated:", form.businessName);
  }, [form.businessName]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onChange = (key: string, value: string | Record<string, unknown>) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validateForm = () => {
    if (!form.businessName.trim()) {
      toast.error("Business name is required");
      return false;
    }
    if (!form.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!form.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      // Convert businessHours object to array format
      const businessHoursArray = Object.entries(form.businessHours).map(
        ([day, hours]) => ({
          day,
          open: hours.open,
          close: hours.close,
          closed: hours.closed,
        })
      );

      const businessData = {
        ...form,
        businessHours: businessHoursArray,
      };

      if (form._id) {
        await dispatch(
          updateBusiness({ id: form._id, businessData: businessData as any })
        ).unwrap();
        toast.success("Business updated successfully!");
      } else {
        await dispatch(createBusiness(businessData as any)).unwrap();
        toast.success("Business created successfully!");
      }
    } catch (error) {
      const errorMessage =
        typeof error === "string" ? error : "Failed to save business";
      toast.error(errorMessage);
      console.error("Save error:", error);
    }
  };

  return (
    <Layout>
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white flex items-center justify-between p-4 border-b border-gray-200 min-h-[75px] -m-6 mb-6">
        <div className="flex items-center space-x-2">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Business Profile
            </h1>
            <p className="text-sm text-gray-500">
              Complete your business information
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="w-4 h-4" />
            Preview Public Profile
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleSave}
            disabled={loading}
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Side - Form */}
          <div className="col-span-1 xl:col-span-2 bg-white rounded-lg shadow-sm">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  ["business-info", "Business Information"],
                  ["social-settings", "Social Media & Settings"],
                  ["locations", "Business Locations"],
                  ["working-hours", "Working Hours"],
                  ["material", "Material"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === id
                        ? "border-yellow-400 text-yellow-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "business-info" && (
                <div className="space-y-6 max-w-2xl">
                  {/* Business Logo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Logo
                    </label>
                    <div className="flex justify-center">
                      <div className="relative w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100">
                        {form.logo ? (
                          <img
                            src={form.logo}
                            alt="Logo"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-xs text-gray-400 text-center">
                            Upload
                            <br />
                            Logo
                          </span>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                const result = e.target?.result;
                                if (typeof result === "string") {
                                  onChange("logo", result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <Input
                    label="Business Name *"
                    icon={Building}
                    iconColor="text-blue-600"
                    value={form.businessName}
                    onChange={(e) => onChange("businessName", e.target.value)}
                    onFocus={() => console.log("Current form state:", form)}
                    placeholder="Enter business name"
                  />

                  <Input
                    label="Business Type "
                    icon={Star}
                    iconColor="text-yellow-500"
                    value={form.businessType}
                    onChange={(e) => onChange("businessType", e.target.value)}
                    placeholder="e.g., Restaurant, Retail, Service"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Phone *"
                      icon={Phone}
                      iconColor="text-green-500"
                      value={form.phone}
                      onChange={(e) => onChange("phone", e.target.value)}
                      placeholder="Phone number"
                    />
                    <Input
                      label="Email *"
                      icon={Mail}
                      iconColor="text-red-500"
                      value={form.email}
                      onChange={(e) => onChange("email", e.target.value)}
                      placeholder="Business email"
                    />
                  </div>

                  <Input
                    label="Website"
                    icon={Globe}
                    iconColor="text-purple-500"
                    value={form.website}
                    onChange={(e) => onChange("website", e.target.value)}
                    placeholder="https://website.com"
                  />

                  <RichTextEditor
                    label="Business Description *"
                    value={form.description}
                    onChange={(e) => onChange("description", e.target.value)}
                  />
                </div>
              )}

              {activeTab === "social-settings" && (
                <div className="space-y-6 max-w-2xl">
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      label="Instagram"
                      icon={Instagram}
                      iconColor="text-pink-500"
                      value={form.instagram}
                      onChange={(e) => onChange("instagram", e.target.value)}
                      placeholder="URL"
                    />
                    <Input
                      label="Facebook"
                      icon={Facebook}
                      iconColor="text-blue-600"
                      value={form.facebook}
                      onChange={(e) => onChange("facebook", e.target.value)}
                      placeholder="URL"
                    />
                    <Input
                      label="Twitter"
                      icon={Twitter}
                      iconColor="text-sky-500"
                      value={form.twitter}
                      onChange={(e) => onChange("twitter", e.target.value)}
                      placeholder="URL"
                    />
                  </div>

                  <Textarea
                    label="SEO Enhancers"
                    value={form.seoKeywords}
                    onChange={(e) => onChange("seoKeywords", e.target.value)}
                    placeholder="Keywords to help customers find your business (comma separated)"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Registered ID / Legal Info"
                      value={form.registeredId}
                      onChange={(e) => onChange("registeredId", e.target.value)}
                      placeholder="e.g., Business Registration Number"
                    />
                  </div>
                </div>
              )}

              {activeTab === "locations" && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Home className="w-4 h-4 text-blue-500" />
                      Primary Location / Service Area
                    </label>
                    <div className="relative">
                      <input
                        value={form.googleLocation}
                        onChange={(e) =>
                          onChange("googleLocation", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 pl-10"
                        placeholder="Search Google Maps location"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                          <MapPin className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                    </div>
                    {form.googleLocation && (
                      <div className="mt-2 space-y-3">
                        <div className="w-full h-48 bg-gray-100 rounded-lg border border-gray-300 overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                                  <MapPin className="w-4 h-4 text-white" />
                                </div>
                                <p className="text-sm font-medium text-gray-700">
                                  {form.googleLocation}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Map Preview
                                </p>
                              </div>
                            </div>
                            <div className="absolute top-4 left-4 bg-white rounded px-2 py-1 text-xs text-gray-600 shadow">
                              Google Maps
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                          <div className="flex items-center gap-2 text-sm text-yellow-800">
                            <MapPin className="w-4 h-4 text-yellow-600" />
                            <span className="font-medium">
                              Selected Location:
                            </span>
                            <span>{form.googleLocation}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Input
                    label="Service Area Description"
                    value={form.serviceArea}
                    onChange={(e) => onChange("serviceArea", e.target.value)}
                    placeholder="Describe your service coverage area"
                  />
                </div>
              )}

              {activeTab === "working-hours" && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        Business Hours *
                      </label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newHours = JSON.parse(
                              JSON.stringify(form.businessHours)
                            );
                            Object.keys(newHours).forEach((day) => {
                              newHours[day].closed = false;
                              newHours[day].open = "09:00";
                              newHours[day].close = "17:00";
                            });
                            onChange("businessHours", newHours);
                          }}
                        >
                          Set All Open
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newHours = JSON.parse(
                              JSON.stringify(form.businessHours)
                            );
                            Object.keys(newHours).forEach((day) => {
                              newHours[day].closed = true;
                            });
                            onChange("businessHours", newHours);
                          }}
                        >
                          Set All Closed
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(form.businessHours).map(
                        ([day, hours]) => (
                          <div
                            key={day}
                            className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg"
                          >
                            <div className="w-20 text-sm font-medium capitalize text-gray-700">
                              {day}
                            </div>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={!hours.closed}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  const newHours = JSON.parse(
                                    JSON.stringify(form.businessHours)
                                  );
                                  newHours[day].closed = !e.target.checked;
                                  onChange("businessHours", newHours);
                                }}
                                className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
                              />
                              <span className="text-sm text-gray-600">
                                Open
                              </span>
                            </label>
                            <div className="flex items-center gap-2">
                              <select
                                value={hours.open}
                                onChange={(
                                  e: React.ChangeEvent<HTMLSelectElement>
                                ) => {
                                  const newHours = JSON.parse(
                                    JSON.stringify(form.businessHours)
                                  );
                                  newHours[day].open = e.target.value;
                                  onChange("businessHours", newHours);
                                }}
                                disabled={hours.closed}
                                className={`px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                  hours.closed
                                    ? "bg-gray-100 text-gray-400"
                                    : ""
                                }`}
                              >
                                {Array.from({ length: 24 }, (_, i) => {
                                  const hour = i.toString().padStart(2, "0");
                                  return (
                                    <option
                                      key={`${hour}:00`}
                                      value={`${hour}:00`}
                                    >
                                      {hour}:00
                                    </option>
                                  );
                                })}
                              </select>
                              <span className="text-sm text-gray-500">to</span>
                              <select
                                value={hours.close}
                                onChange={(
                                  e: React.ChangeEvent<HTMLSelectElement>
                                ) => {
                                  const newHours = JSON.parse(
                                    JSON.stringify(form.businessHours)
                                  );
                                  newHours[day].close = e.target.value;
                                  onChange("businessHours", newHours);
                                }}
                                disabled={hours.closed}
                                className={`px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                  hours.closed
                                    ? "bg-gray-100 text-gray-400"
                                    : ""
                                }`}
                              >
                                {Array.from({ length: 24 }, (_, i) => {
                                  const hour = i.toString().padStart(2, "0");
                                  return (
                                    <option
                                      key={`${hour}:00`}
                                      value={`${hour}:00`}
                                    >
                                      {hour}:00
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "material" && <Material />}
            </div>
          </div>

          {/* Right Side - Mobile Preview */}
          <div className="col-span-1 xl:col-span-1">
            <div className="sticky top-32">
              <div className="flex justify-center">
                <div className="origin-top scale-[0.85] 2xl:scale-[0.9]">
                  <div className="w-[360px] h-[720px] bg-black rounded-[3rem] p-[6px] shadow-2xl">
                    <div className="relative bg-white w-full h-full rounded-[2.6rem] overflow-hidden">
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20" />

                      <div className="relative h-44 bg-gradient-to-r from-yellow-400 to-yellow-600">
                        <div className="absolute -bottom-8 left-5 w-20 h-20 rounded-3xl bg-white shadow-lg border overflow-hidden">
                          {form.logo && (
                            <img
                              src={form.logo}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col h-full">
                        <div className="px-3 pt-8 pb-12 space-y-2 text-sm flex-1 overflow-hidden">
                          {/* Business Header */}
                          <div>
                            <h1 className="text-2xl font-bold text-gray-900 leading-tight truncate">
                              {form.businessName || "Business Name"}
                            </h1>
                            {form.businessType && (
                              <div className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mt-2">
                                {form.businessType}
                              </div>
                            )}
                          </div>

                          {/* Contact Grid */}
                          <div className="grid grid-cols-2 gap-1.5">
                            {form.phone && (
                              <div className="flex items-center gap-1 p-1.5 bg-green-50 rounded text-sm">
                                <Phone className="w-2.5 h-2.5 text-green-600" />
                                <span className="text-green-600 font-medium truncate">
                                  {form.phone}
                                </span>
                              </div>
                            )}
                            {form.email && (
                              <div className="flex items-center gap-1 p-1.5 bg-red-50 rounded text-sm">
                                <Mail className="w-2.5 h-2.5 text-red-600" />
                                <span className="text-red-600 truncate">
                                  {form.email}
                                </span>
                              </div>
                            )}
                          </div>

                          {form.website && (
                            <div className="flex items-center gap-1 p-1.5 bg-purple-50 rounded text-sm">
                              <Globe className="w-2.5 h-2.5 text-purple-600" />
                              <span className="text-purple-600 truncate">
                                {form.website}
                              </span>
                            </div>
                          )}

                          {form.googleLocation && (
                            <div className="flex items-start gap-1 p-1.5 bg-yellow-50 rounded text-sm">
                              <MapPin className="w-2.5 h-2.5 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <span className="text-yellow-600 leading-tight line-clamp-2">
                                {form.googleLocation}
                              </span>
                            </div>
                          )}

                          {/* Description */}
                          {form.description && (
                            <div className="bg-gray-50 p-1.5 rounded text-sm">
                              <div
                                className="text-gray-700 leading-tight line-clamp-3 overflow-hidden text-ellipsis"
                                dangerouslySetInnerHTML={{
                                  __html: form.description,
                                }}
                              />
                            </div>
                          )}

                          {/* Business Hours */}
                          {Object.values(form.businessHours).some(
                            (h) => !h.closed
                          ) && (
                            <div className="bg-blue-50 p-1.5 rounded text-sm">
                              <div className="flex items-center gap-1 mb-1">
                                <Clock className="w-2.5 h-2.5 text-blue-600" />
                                <span className="text-sm font-semibold text-blue-800">
                                  Hours
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-1 text-sm">
                                {Object.entries(form.businessHours)
                                  .filter(([_, h]) => !h.closed)
                                  .slice(0, 6)
                                  .map(([day, h]) => (
                                    <div
                                      key={day}
                                      className="flex justify-between"
                                    >
                                      <span className="text-blue-700 capitalize">
                                        {day.slice(0, 3)}
                                      </span>
                                      <span className="text-blue-800 font-medium">
                                        {h.open}-{h.close}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}

                          {/* Legal Info */}
                          {(form.registeredId || form.legalName) && (
                            <div className="bg-gray-50 p-1.5 rounded text-sm">
                              {form.registeredId && (
                                <div className="flex items-center gap-1">
                                  <Building className="w-2.5 h-2.5 text-gray-500" />
                                  <span className="text-gray-600">
                                    ID: {form.registeredId}
                                  </span>
                                </div>
                              )}
                              {form.legalName &&
                                form.legalName !== form.businessName && (
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <User className="w-2.5 h-2.5 text-gray-500" />
                                    <span className="text-gray-600 truncate">
                                      Legal: {form.legalName}
                                    </span>
                                  </div>
                                )}
                            </div>
                          )}

                          {/* Social Media */}
                          {(form.instagram ||
                            form.facebook ||
                            form.twitter) && (
                            <div className="flex gap-2 justify-center p-1.5 bg-gray-50 rounded">
                              {form.instagram && (
                                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
                                  <Instagram className="w-3 h-3 text-white" />
                                </div>
                              )}
                              {form.facebook && (
                                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                                  <Facebook className="w-3 h-3 text-white" />
                                </div>
                              )}
                              {form.twitter && (
                                <div className="w-6 h-6 bg-sky-500 rounded flex items-center justify-center">
                                  <Twitter className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                          )}

                          {/* SEO Keywords */}
                          {form.seoKeywords && (
                            <div className="bg-yellow-50 p-1.5 rounded text-sm">
                              <div className="flex flex-wrap gap-1">
                                {form.seoKeywords
                                  .split(",")
                                  .slice(0, 6)
                                  .map((keyword, index) => (
                                    <span
                                      key={index}
                                      className="px-1 py-0.5 overflow-hidden text-ellipsis bg-yellow-200 text-yellow-800 text-sm rounded"
                                    >
                                      {keyword.trim()}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
                          <div className="flex gap-2">
                            <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold shadow-md text-sm">
                              Get Directions
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <PreviewModal
            form={form as any}
            onClose={() => setShowPreview(false)}
          />
        )}
      </div>

      <Toaster position="bottom-right" />
    </Layout>
  );
}
