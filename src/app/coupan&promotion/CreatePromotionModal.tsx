"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Percent,
  DollarSign,
  Users,
  RotateCcw,
  UserPlus,
  Clock,
  Gift,
  AlertCircle,
  Globe,
  MapPin,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { createPromotion } from "@/redux/slices/promotionsSlice";
import { fetchMaterials } from "@/redux/slices/materialsSlice";
import { AppDispatch, RootState } from "@/redux/store";

interface CreatePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const promotionTypes = [
  {
    id: "percentage",
    title: "Percentage Bonus",
    description: "Extra % on material payouts",
    icon: Percent,
    color: "text-green-600 bg-green-100 border-green-300",
  },
  {
    id: "flat",
    title: "Percentage Bonus",
    description: "Fixed dollar amount bonus",
    icon: DollarSign,
    color: "text-blue-600 bg-blue-100 border-blue-300",
  },
  {
    id: "first-time",
    title: "First-Time Visitor",
    description: "Welcome bonus for new customers",
    icon: UserPlus,
    color: "text-purple-600 bg-purple-100 border-purple-300",
  },
  {
    id: "returning",
    title: "Returning Customer",
    description: "Reward loyal customers",
    icon: RotateCcw,
    color: "text-orange-600 bg-orange-100 border-orange-300",
  },
  {
    id: "referral",
    title: "Referral Coupon",
    description: "Both referrer and friend get bonus",
    icon: Users,
    color: "text-pink-600 bg-pink-100 border-pink-300",
  },
  {
    id: "happy-hour",
    title: "Happy Hour",
    description: "Time-based special offer",
    icon: Clock,
    color: "text-indigo-600 bg-indigo-100 border-indigo-300",
  },
];

export default function CreatePromotionModal({
  isOpen,
  onClose,
}: CreatePromotionModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector(
    (state: RootState) => state.promotions
  );
  const { materials } = useSelector((state: RootState) => state.materials);
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("flat");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("All Materials");
  const [bonusType, setBonusType] = useState("Flat Amount");
  const [bonusValue, setBonusValue] = useState("");
  const [terms, setTerms] = useState("");
  const [targetAudience, setTargetAudience] = useState("everyone");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dailyRedemptionCap, setDailyRedemptionCap] = useState("");
  const [totalBudgetCap, setTotalBudgetCap] = useState("");
  const [autoPause, setAutoPause] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchMaterials());
    }
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  const validateStep = (stepNumber: number) => {
    const newErrors: { [key: string]: string } = {};

    if (stepNumber === 2) {
      if (!title.trim())
        newErrors.promotionTitle = "Promotion Title is required";
      if (!description.trim())
        newErrors.description = "Description is required";
      if (!bonusValue.trim()) newErrors.bonusValue = "Bonus Value is required";
      else if (isNaN(parseFloat(bonusValue)))
        newErrors.bonusValue = "Bonus Value must be a valid number";
      if (!terms.trim())
        newErrors.termsConditions = "Terms & Conditions is required";
    }

    if (stepNumber === 4) {
      if (!startDate) newErrors.startDate = "Start Date is required";
      if (!endDate) newErrors.endDate = "End Date is required";
      if (
        dailyRedemptionCap !== "Unlimited" &&
        isNaN(parseInt(dailyRedemptionCap))
      ) {
        newErrors.dailyRedemptionCap =
          "Daily Redemption Cap must be a valid number";
      }
      if (isNaN(parseFloat(totalBudgetCap))) {
        newErrors.totalBudgetCap = "Total Budget Cap must be a valid number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePublish = async () => {
    const promotionData = {
      choosePromotionType: selectedType,
      promotionTitle: title,
      description: description || "No description provided",
      materialSelection: material,
      bonusType: bonusType === "Flat Amount" ? "flat" : "percentage",
      bonusValue: parseFloat(bonusValue) || 0,
      termsConditions: terms || "No terms and conditions",
      visibility: targetAudience,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      dailyRedemptionCap:
        dailyRedemptionCap === "Unlimited"
          ? 999999
          : parseInt(dailyRedemptionCap) || 999999,
      totalBudgetCap: parseFloat(totalBudgetCap) || 500,
      autoPauseWhenBudgetReached: autoPause,
    };

    try {
      await dispatch(createPromotion(promotionData as any)).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to create promotion:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex">
        {/* Left Panel - Form */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Sticky Header */}
          <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
            <div className="flex justify-between items-center p-8 pb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Create New Promotion
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center pb-4">
              {[1, 2, 3, 4, 5].map((num, i) => (
                <React.Fragment key={num}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm ${
                      num < step
                        ? "bg-yellow-500 text-white"
                        : num === step
                        ? "bg-yellow-100 text-yellow-600 border-2 border-yellow-500"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {num < step ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      num
                    )}
                  </div>
                  {i < 4 && (
                    <div
                      className={`w-16 h-1 ${
                        num < step ? "bg-yellow-500" : "bg-gray-200"
                      } mx-2`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Step Title */}
            <div className="px-8 pb-4">
              {step === 1 && (
                <p className="text-gray-600">Choose promotion type</p>
              )}
              {step === 2 && (
                <p className="text-gray-600">Enter promotion details</p>
              )}
              {step === 3 && (
                <p className="text-gray-600">
                  Select who can see and redeem this promotion
                </p>
              )}
              {step === 4 && (
                <p className="text-gray-600">Set schedule and budget</p>
              )}
              {step === 5 && (
                <h3 className="text-xl font-semibold text-gray-900">
                  Review and publish
                </h3>
              )}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            {/* Step 1: Promotion Type */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {promotionTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedType === type.id;

                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`p-5 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? "border-yellow-500 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-lg ${type.color} flex items-center justify-center`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {type.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {type.description}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="mt-3 flex justify-end">
                            <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Step 2: Promotion Details */}
            {step === 2 && (
              <>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-teal-800 font-medium">
                      This promotion will use Reward Credits (BRC) from your
                      balance
                    </p>
                    <p className="text-sm text-teal-700">
                      Customer rewards are funded by your business, not Loop
                      Network Points
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Promotion Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., +500 Reward Credits for Aluminum"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                        errors.promotionTitle
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.promotionTitle && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.promotionTitle}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Brief description of the promotion..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none ${
                        errors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Material Selection
                    </label>
                    <select
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option>All Materials</option>
                      {materials.map((mat) => (
                        <option key={mat._id} value={mat.materialname}>
                          {mat.materialname}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bonus Type
                      </label>
                      <select
                        value={bonusType}
                        onChange={(e) => setBonusType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        <option>Flat Amount</option>
                        <option>Percentage</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bonus Value <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="$5.00"
                        value={bonusValue}
                        onChange={(e) => setBonusValue(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                          errors.bonusValue
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.bonusValue && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.bonusValue}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Terms & Conditions
                    </label>
                    <textarea
                      placeholder="Terms and conditions are required..."
                      value={terms}
                      onChange={(e) => setTerms(e.target.value)}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none ${
                        errors.termsConditions
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.termsConditions && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.termsConditions}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Target Audience */}
            {step === 3 && (
              <>
                <div className="space-y-4">
                  {[
                    { id: "everyone", label: "Everyone", icon: Globe },
                    {
                      id: "local",
                      label: "Local Customers Only",
                      icon: MapPin,
                    },
                    { id: "new", label: "New Customers Only", icon: UserPlus },
                    {
                      id: "returning",
                      label: "Returning Customers Only",
                      icon: UserCheck,
                    },
                  ].map((option) => {
                    const Icon = option.icon;
                    const isSelected = targetAudience === option.id;

                    return (
                      <button
                        key={option.id}
                        onClick={() => setTargetAudience(option.id)}
                        className={`w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? "border-yellow-500 bg-yellow-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              isSelected
                                ? "bg-yellow-500 text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className="text-lg font-medium text-gray-900">
                            {option.label}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Step 4: Schedule & Budget */}
            {step === 4 && (
              <>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          errors.startDate
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.startDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.startDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          errors.endDate ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.endDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.endDate}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Daily Redemption Cap
                      </label>
                      <input
                        type="number"
                        placeholder="Unlimited"
                        value={dailyRedemptionCap}
                        onChange={(e) => setDailyRedemptionCap(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Budget Cap
                      </label>
                      <input
                        type="number"
                        placeholder="$500"
                        value={totalBudgetCap}
                        onChange={(e) => setTotalBudgetCap(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="autoPause"
                        checked={autoPause}
                        onChange={(e) => setAutoPause(e.target.checked)}
                        className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <div>
                        <label
                          htmlFor="autoPause"
                          className="text-sm font-medium text-gray-900 cursor-pointer"
                        >
                          Auto-Pause When Budget Reached
                        </label>
                        <p className="text-sm text-gray-600 mt-1">
                          Promotion will pause automatically when budget limit
                          is hit
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 5: Review and Publish */}
            {step === 5 && (
              <>
                <div className="bg-yellow-50 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-yellow-500 p-3 rounded-lg">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.953a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.953c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.953a1 1 0 00-.364-1.118L2.317 9.38c-.784-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.953z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Promotion Summary
                    </h4>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Type:</span>
                      <p className="font-medium text-gray-900">
                        {promotionTypes.find((t) => t.id === selectedType)
                          ?.title || "Not set"}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Title:</span>
                      <p className="font-medium text-gray-900">
                        {title || "Not set"}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Bonus:</span>
                      <p className="font-medium text-gray-900">
                        {bonusValue ? `$${bonusValue}` : "$"}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Material:</span>
                      <p className="font-medium text-gray-900">{material}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Audience:</span>
                      <p className="font-medium text-gray-900">
                        {targetAudience === "everyone"
                          ? "Everyone"
                          : targetAudience === "local"
                          ? "Local Customers Only"
                          : targetAudience === "new"
                          ? "New Customers Only"
                          : "Returning Customers Only"}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Duration:</span>
                      <p className="font-medium text-gray-900">
                        {startDate && endDate
                          ? `${startDate} to ${endDate}`
                          : "Not set"}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-center text-xs text-gray-600 mt-4">
                  Review all details before publishing. You can edit this
                  promotion anytime.
                </p>
              </>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between border-t p-4 mt-6">
            {step > 1 && (
              <Button
                onClick={handleBack}
                variant="ghost"
                className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium"
              >
                ← Back
              </Button>
            )}
            {step < 5 ? (
              <Button
                onClick={handleNext}
                variant="yellowbutton"
                className="px-8 py-3 font-medium flex items-center gap-2 ml-auto"
              >
                Next
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            ) : (
              <Button
                onClick={handlePublish}
                disabled={loading}
                variant="yellowbutton"
                className="px-8 py-3 font-medium shadow-md transition ml-auto"
              >
                {loading ? "Publishing..." : "Publish Promotion"}
              </Button>
            )}
          </div>
        </div>

        {/* Right Panel - Live Preview (unchanged) */}
        <div className="hidden lg:block w-1/2 bg-gray-900 p-12 relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-white text-lg font-medium flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-500" />
              Live Preview
            </h3>
          </div>
          <p className="text-gray-400 mb-12">
            How customers will see this promotion
          </p>

          {/* Phone Mockup */}
          <div className="relative mx-auto w-80">
            <div className="bg-black rounded-3xl p-2 shadow-2xl">
              <div className="bg-white rounded-3xl overflow-hidden">
                {/* Header */}
                <div className=" p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Gift className="w-8 h-8" />
                    <div>
                      <h4 className="font-medium">EcoRecycle Center</h4>
                      <p className="text-sm opacity-80">0.8 miles away</p>
                    </div>
                  </div>
                  <button className="bg-white/20 px-4 py-1 rounded-full text-sm">
                    All Materials
                  </button>
                </div>

                {/* Promotion Card */}
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-2xl m-4 text-white">
                  <h2 className="text-2xl font-bold mb-3">
                    {title || "Your Promotion Title"}
                  </h2>
                  <p className="text-white/90 mb-6">
                    {description || "Promotion description will appear here"}
                  </p>
                  <div className="flex justify-center">
                    <button className="bg-white text-yellow-600 px-16 py-2 rounded-md font-semibold shadow-lg hover:shadow-xl transition-shadow">
                      Redeem Now
                    </button>
                  </div>
                </div>

                {/* Nearby Locations */}
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-3">
                    More Nearby Locations
                  </p>
                  <div className="space-y-2">
                    <div className="bg-gray-100 rounded-lg px-4 py-3 flex justify-between text-sm">
                      Other Location 1{" "}
                      <span className="text-gray-500">1.5 mi</span>
                    </div>
                    <div className="bg-gray-100 rounded-lg px-4 py-3 flex justify-between text-sm">
                      Other Location 2{" "}
                      <span className="text-gray-500">2.0 mi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
