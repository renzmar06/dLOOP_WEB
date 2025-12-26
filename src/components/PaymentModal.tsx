"use client";

import React, { useState } from "react";
import { X, CreditCard, Lock, AlertCircle } from "lucide-react";

interface PaymentModalProps {
  plan: {
    name: string;
    price: number;
  };
  billingCycle: "monthly" | "yearly";
  onClose: () => void;
  onSuccess: (paymentDetails: any) => void;
  isProcessing: boolean;
}

export default function PaymentModal({
  plan,
  billingCycle,
  onClose,
  onSuccess,
  isProcessing,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalPrice = billingCycle === "yearly" ? plan.price * 12 * 0.8 : plan.price;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Format card number
    if (name === "cardNumber") {
      formattedValue = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
      formattedValue = formattedValue.slice(0, 19); // Max 16 digits + 3 spaces
    }
    
    // Format expiry date
    if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2, 4);
      }
      formattedValue = formattedValue.slice(0, 5);
    }
    
    // Format CVV
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }
    
    setFormData({ ...formData, [name]: formattedValue });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod === "card") {
      if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, "").length !== 16) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number";
      }
      if (!formData.cardName) {
        newErrors.cardName = "Cardholder name is required";
      }
      if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
      }
      if (!formData.cvv || formData.cvv.length < 3) {
        newErrors.cvv = "Please enter a valid CVV";
      }
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const paymentDetails = {
      method: paymentMethod,
      ...formData,
      amount: totalPrice,
      billingCycle,
      planName: plan.name,
    };

    onSuccess(paymentDetails);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
            <p className="text-sm text-gray-500 mt-1">Upgrade to {plan.name}</p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{plan.name} Plan</span>
              <span className="font-medium">${plan.price}/{billingCycle === "monthly" ? "mo" : "yr"}</span>
            </div>
            {billingCycle === "yearly" && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Billing cycle</span>
                  <span className="font-medium">Yearly (12 months)</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Annual discount (20%)</span>
                  <span className="font-medium">-${(plan.price * 12 * 0.2).toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="pt-2 border-t border-gray-300 flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-xl text-yellow-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`p-4 border-2 rounded-lg flex items-center justify-center gap-2 transition ${
                  paymentMethod === "card"
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("paypal")}
                className={`p-4 border-2 rounded-lg flex items-center justify-center gap-2 transition ${
                  paymentMethod === "paypal"
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="font-bold text-blue-600">PayPal</span>
              </button>
            </div>
          </div>

          {/* Card Payment Fields */}
          {paymentMethod === "card" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                    errors.cardNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isProcessing}
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                    errors.cardName ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isProcessing}
                />
                {errors.cardName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.cardName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                      errors.expiryDate ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isProcessing}
                  />
                  {errors.expiryDate && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.expiryDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                      errors.cvv ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isProcessing}
                  />
                  {errors.cvv && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.cvv}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isProcessing}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Secure Payment</p>
              <p className="text-xs text-blue-700 mt-1">
                Your payment information is encrypted and secure
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-yellow-500 text-white py-4 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>Pay ${totalPrice.toFixed(2)}</>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            By completing this purchase, you agree to our Terms of Service and Privacy Policy
          </p>
        </form>
      </div>
    </div>
  );
}