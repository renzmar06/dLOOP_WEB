"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

function SubscriptionSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (sessionId) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch("/api/stripe-verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ sessionId }),
          });

          const data = await response.json();
          if (data.success) {
            toast.success("Payment successful! Subscription activated.");
            router.push('/business-profile');
          } else {
            toast.error("Payment verification failed");
            router.push('/subscription-billing');
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error("Failed to verify payment");
          router.push('/subscription-billing');
        }
      } else {
        router.push('/business-profile');
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment</h2>
        <p className="text-gray-600">Please wait while we verify your payment...</p>
      </div>
    </div>
  );
}

export default function SubscriptionSuccess() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <SubscriptionSuccessContent />
    </Suspense>
  );
}
