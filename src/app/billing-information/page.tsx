"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Crown,
  Download,
  X,
  AlertTriangle,
  Lock,
  Edit,
  Plus,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchBillingInfo,
  updatePaymentMethod,
  cancelSubscription,
} from "@/redux/slices/billingInformationSlice";
import { fetchSubscriptions } from "@/redux/slices/subscriptionBillingSlice";
import Layout from "@/components/Layout";
import toast, { Toaster } from "react-hot-toast";

export default function SubscriptionBillingPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const {
    billingInfo,
    isLoading: billingLoading,
    error: billingError,
  } = useSelector((state: RootState) => state.billingInformation);
  const { subscriptions, isLoading: subscriptionLoading } = useSelector(
    (state: RootState) => state.subscriptionBilling
  );

  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);

  // Payment form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [isDefault, setIsDefault] = useState(true);

  useEffect(() => {
    dispatch(fetchBillingInfo());
    dispatch(fetchSubscriptions());

    // Check for payment success flag
    const paymentSuccess = localStorage.getItem("paymentSuccess");
    if (paymentSuccess === "true") {
      toast.success("Payment successful! Your plan has been upgraded.");
      localStorage.removeItem("paymentSuccess");
    }
  }, [dispatch]);

  // Refresh data when component mounts or when returning from other pages
  useEffect(() => {
    const handleFocus = () => {
      dispatch(fetchSubscriptions());
    };

    window.addEventListener("focus", handleFocus);

    // Force refresh subscriptions data on page load
    dispatch(fetchSubscriptions());

    return () => window.removeEventListener("focus", handleFocus);
  }, [dispatch]);

  // Additional refresh when subscriptions change
  useEffect(() => {
    if (subscriptions.length > 0) {
      // Force re-render when subscriptions update
      console.log("Subscriptions updated:", subscriptions);
    }
  }, [subscriptions]);

  const getCurrentSubscription = () => {
    // Get the most recent subscription (latest selectedAt date)
    const sortedSubs = [...subscriptions].sort(
      (a, b) =>
        new Date(b.selectedAt).getTime() - new Date(a.selectedAt).getTime()
    );

    const latestSub = sortedSubs[0];

    if (latestSub) {
      // Check if plan is expired using planExpiryDate
      const now = new Date();
      const expiryDate = new Date(latestSub.planExpiryDate);

      if (now > expiryDate) {
        return { ...latestSub, status: "inactive" };
      }
      return { ...latestSub, status: "active" };
    }

    return {
      planName: "Free",
      planPrice: "$0",
      status: "active",
      selectedAt: new Date().toISOString(),
      planExpiryDate: new Date().toISOString(),
    };
  };

  const hasSelectedPlanThisMonth = () => {
    const currentPlan = getCurrentSubscription()?.planName;

    // Always allow changes from Free plan
    if (currentPlan === "Free") {
      return false;
    }

    // Allow Pro to Elite upgrade, block Elite from any changes
    if (currentPlan === "Pro") {
      return false; // Allow Pro users to upgrade to Elite
    }

    if (currentPlan === "Elite") {
      return true; // Block Elite users from any changes (no downgrades)
    }

    return false;
  };

  const canChangePlan = () => {
    return !hasSelectedPlanThisMonth();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getNextBillingDate = () => {
    const currentSub = getCurrentSubscription();
    if (!currentSub || !currentSub.planExpiryDate) return "N/A";

    // Use the planExpiryDate as the next billing date
    return formatDate(currentSub.planExpiryDate);
  };

  const getBillingHistory = () => {
    if (!subscriptions.length) return [];

    return subscriptions
      .map((sub, index) => {
        const purchaseDate = new Date(sub.selectedAt);
        const day = String(purchaseDate.getDate()).padStart(2, "0");
        const month = String(purchaseDate.getMonth() + 1).padStart(2, "0");
        const year = purchaseDate.getFullYear();

        return {
          date: `${day}/${month}/${year}`, // DD/MM/YYYY format
          invoice: `INV-${year}-${month}`, // INV-year-mm format
          plan: sub.planName,
          amount: sub.planPrice,
          status: "Paid",
        };
      })
      .reverse(); // Show newest first
  };

  const handleUpdatePayment = async () => {
    try {
      await dispatch(
        updatePaymentMethod({
          cardNumber,
          expiration,
          cvc,
          cardholderName,
          isDefault,
        })
      ).unwrap();

      // Reset form and close modal
      setCardNumber("");
      setExpiration("");
      setCvc("");
      setCardholderName("");
      setIsDefault(true);
      setShowUpdatePaymentModal(false);

      toast.success("Payment method saved successfully!");
    } catch (error) {
      console.error("Failed to update payment method:", error);
      toast.error("Failed to save payment method");
    }
  };

  const getCurrentPaymentMethod = () => {
    return billingInfo.find((info) => info.isDefault) || billingInfo[0];
  };

  // Validation functions
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length >= 2) {
      setExpiration(value.slice(0, 2) + "/" + value.slice(2));
    } else {
      setExpiration(value);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvc(value);
  };

  const handleCancelSubscription = async () => {
    try {
      const currentSub = getCurrentSubscription();
      if (!currentSub || !("_id" in currentSub) || !currentSub._id) {
        toast.error("No active subscription to cancel");
        return;
      }

      await dispatch(cancelSubscription(currentSub._id)).unwrap();
      toast.success("Subscription cancelled successfully!");
      await dispatch(fetchSubscriptions()).unwrap();
      setShowCancelModal(false);
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      toast.error("Failed to cancel subscription");
    }
  };

  const handleCardholderNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/[^A-Za-z\s]/g, "");
    setCardholderName(value);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-white flex items-center justify-between p-3 border-b border-gray-200 min-h-[75px] shadow-sm">
            <div className="flex items-center space-x-2">
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Billing Information
                </h1>
                <p className="text-sm text-gray-500">
                  Manage your plan, payment methods, and invoices
                </p>
              </div>
            </div>
          </header>

          {/* Current Plan */}
          <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-xl p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8" />
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold">
                      Current Plan:{" "}
                      {getCurrentSubscription()?.planName || "No Plan"}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        getCurrentSubscription()?.status === "active"
                          ? "bg-white text-amber-600"
                          : getCurrentSubscription()?.status === "paused"
                          ? "bg-yellow-400"
                          : getCurrentSubscription()?.status === "inactive"
                          ? "bg-gray-400"
                          : "bg-red-400"
                      }`}
                    >
                      {getCurrentSubscription()?.status === "active"
                        ? "Active"
                        : getCurrentSubscription()?.status === "paused"
                        ? "Paused"
                        : getCurrentSubscription()?.status === "inactive"
                        ? "Inactive"
                        : getCurrentSubscription()?.status === "cancelled"
                        ? "Cancelled"
                        : "Inactive"}
                    </span>
                  </div>
                  <p className="text-amber-100 mt-1">
                    {getCurrentSubscription()?.planPrice || "$0"}/month
                  </p>
                  <p className="text-amber-100 text-sm">
                    Next billing: {getNextBillingDate()}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowPauseModal(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-white text-amber-600 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Pause Subscription
                </button>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-white text-amber-600 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  <X className="w-4 h-4" />
                  Cancel Subscription
                </button>
                <button
                  onClick={() => {
                    if (canChangePlan()) {
                      // Set flag to indicate coming from Change Plan button
                      localStorage.setItem("fromChangePlan", "true");
                      router.push("/subscription-billing");
                    }
                  }}
                  disabled={!canChangePlan()}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    canChangePlan()
                      ? "bg-white text-amber-600 hover:bg-gray-50"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  title={
                    !canChangePlan()
                      ? "You can only change plans once per month"
                      : ""
                  }
                >
                  Change Plan
                </button>
              </div>
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold">Billing History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Date
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Invoice #
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Plan
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Amount
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getBillingHistory().map((row, index) => (
                    <tr key={`${row.invoice}-${index}`}>
                      <td className="py-4 px-6 text-sm">{row.date}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {row.invoice}
                      </td>
                      <td className="py-4 px-6 text-sm">{row.plan}</td>
                      <td className="py-4 px-6 text-sm font-semibold">
                        {row.amount}
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-md text-xs font-medium">
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button className="flex items-center gap-1 text-teal-600 hover:text-teal-800 text-sm font-medium">
                          <Download className="w-4 h-4" />
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
              <CreditCard className="w-5 h-5 text-blue-500" />
              Payment Method
            </h3>

            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-2">
                Primary Payment Method
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-mono text-lg">
                    {getCurrentPaymentMethod()?.cardNumber
                      ? `•••• •••• •••• ${getCurrentPaymentMethod()?.cardNumber.slice(
                          -4
                        )}`
                      : "N/A"}
                  </p>
                  <div className="flex gap-4 text-sm text-gray-600 mt-1">
                    <span>
                      Expires<br></br>{" "}
                      {getCurrentPaymentMethod()?.expiration || "N/A"}
                    </span>
                    <span>
                      Card Type<br></br> {"Credit"}
                    </span>
                  </div>
                </div>
                {getCurrentPaymentMethod()?.cardNumber && (
                  <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">
                    VISA
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                const currentPayment = getCurrentPaymentMethod();
                if (currentPayment) {
                  // Pre-populate form for editing
                  setCardNumber(currentPayment.cardNumber || "");
                  setExpiration(currentPayment.expiration || "");
                  setCvc(currentPayment.cvc || ""); // Include CVC for editing
                  setCardholderName(currentPayment.cardholderName || "");
                  setIsDefault(currentPayment.isDefault || true);
                }
                setShowUpdatePaymentModal(true);
              }}
              disabled={billingLoading}
              className={`w-full py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition mb-4 flex items-center justify-center gap-2 ${
                billingLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {getCurrentPaymentMethod()?.cardNumber ? (
                <>
                  <Edit className="w-4 h-4" />
                  {billingLoading ? "Loading..." : "Update Payment Method"}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {billingLoading ? "Loading..." : "Add Payment Method"}
                </>
              )}
            </button>

            <div className="flex gap-2">
              <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                VISA
              </div>
              <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                MC
              </div>
              <div className="bg-blue-400 text-white px-2 py-1 rounded text-xs font-bold">
                AMEX
              </div>
              <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-bold">
                ACH
              </div>
            </div>
          </div>

          {/* Pause Subscription Modal */}
          {showPauseModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Pause Subscription
                  </h3>
                  <button
                    onClick={() => setShowPauseModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-600 mb-6 text-sm">
                  Your subscription will be paused and you'll retain access
                  until your current billing period ends.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPauseModal(false)}
                    className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition">
                    Pause Subscription
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cancel Subscription Modal */}
          {showCancelModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    Cancel Subscription
                  </h3>
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mb-6">
                  <p className="text-gray-600 mb-3 text-sm">
                    Are you sure you want to cancel your subscription? You'll
                    lose access to:
                  </p>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li>• Unlimited coupons</li>
                    <li>• Advanced analytics</li>
                    <li>• Boost credits</li>
                    <li>• Gallery photos & videos</li>
                  </ul>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    Keep Subscription
                  </button>
                  <button
                    onClick={handleCancelSubscription}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                  >
                    Cancel Subscription
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Update Payment Method Modal */}
          {showUpdatePaymentModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                <button
                  onClick={() => setShowUpdatePaymentModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold">Update Payment Method</h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="1234 1234 1234 1234"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiration
                      </label>
                      <input
                        type="text"
                        value={expiration}
                        onChange={handleExpirationChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cvc}
                        onChange={handleCvcChange}
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardholderName}
                      onChange={handleCardholderNameChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-sm">
                        Set as default payment
                      </p>
                      <p className="text-xs text-gray-600">
                        Use for all future payments
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsDefault(!isDefault)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        isDefault ? "bg-teal-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          isDefault ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 py-4">
                    <Lock className="w-4 h-4" />
                    <span>
                      Your payment information is encrypted and secure
                    </span>
                  </div>

                  <button
                    onClick={handleUpdatePayment}
                    disabled={billingLoading}
                    className={`w-full bg-teal-500 text-white py-4 rounded-lg font-semibold hover:bg-teal-600 transition flex items-center justify-center gap-2 ${
                      billingLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Lock className="w-5 h-5" />
                    {billingLoading ? "Saving..." : "Save Payment Method"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster position="top-right" />
    </Layout>
  );
}
