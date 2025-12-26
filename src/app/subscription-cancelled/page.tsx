"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SubscriptionCancelled() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Redirect user back to pricing page
      router.push("/subscription-billing");
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <h2 className="text-lg font-semibold text-red-600">
        Payment Cancelled
      </h2>
      <p className="text-sm text-gray-600">
        You were not charged. Redirecting back…
      </p>
    </div>
  );
}
