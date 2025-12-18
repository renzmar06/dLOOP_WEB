"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchDocuments, uploadDocument } from '@/redux/slices/businessVerificationSlice';
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowUpFromLine,
  ShieldCheck,
  Zap,
  TrendingUp,
  ShieldAlert,
  Star,
  Upload,
  Rocket,
} from "lucide-react";
import Layout from "@/components/Layout";

export default function BusinessVerificationPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { documents, isLoading } = useSelector((state: RootState) => state.businessVerification);
  const [uploadingFiles, setUploadingFiles] = useState<{
    [key: string]: boolean;
  }>({});
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  const handleFileUpload = async (documentType: string, file: File) => {
    setUploadingFiles((prev) => ({ ...prev, [documentType]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        console.log('File uploaded successfully:', result.url);
        
        const uploadResult = await dispatch(uploadDocument({
          documentType,
          url: result.url,
          status: 'pending'
        }));
        
        console.log('Document saved to DB:', uploadResult);

      } else {
        console.error('Upload failed:', result.message);
        alert(`Upload failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [documentType]: false }));
    }
  };

  const triggerFileInput = (documentType: string) => {
    fileInputRefs.current[documentType]?.click();
  };

  return (
     <Layout>
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 min-h-[75px] -mt-6">
        <div className="flex items-center space-x-2">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Business Verification
            </h1>
            <p className="text-sm text-gray-500">
              Verify your business to unlock full access and build customer
              trust
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Banner */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 flex flex-col sm:flex-row gap-4 shadow-lg">
                <div className="bg-white p-3 rounded-lg w-fit h-fit shadow-sm text-orange-600">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-semibold text-lg text-gray-900">
                      Verification Status
                    </h2>
                    <span className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-primary/80 text-xs px-2 py-0.5 rounded-md font-medium border border-orange-200">
                      Not Verified
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">
                    Upload required documents to begin verification
                  </p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                    <span>
                      Last Updated:{" "}
                      <span className="font-medium text-gray-900">
                        Today at 2:45 PM
                      </span>
                    </span>
                    <span>
                      Requirements Remaining:{" "}
                      <span className="font-medium text-gray-900">
                        5 documents
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
                  {/* Required Documents Header */}
                  <div className="flex items-center gap-4 p-4 border-b border-gray-100">
                    <div className="bg-emerald-100 p-2 rounded-lg text-green-600">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        Required Documents
                      </h3>
                      <p className="text-sm text-gray-500">
                        Upload clear photos or scans of the following documents
                      </p>
                    </div>
                  </div>

                  {/* Business License - Approved */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-5 p-4 border-b border-gray-200 min-h-[75px] gap-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 p-2 rounded-lg text-green-600 mt-1 ">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium text-gray-900">
                            Business License
                          </h4>
                          <span className="text-xs text-red-500 font-medium bg-red-50 px-1.5 py-0.5 rounded">
                            Required
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Valid business license or registration certificate
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Uploaded on Dec 8, 2025
                        </p>

                        <div className="flex items-center gap-3 mt-3">
                          <input
                            type="file"
                            ref={(el) => {
                              fileInputRefs.current["business-license"] = el;
                            }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file)
                                handleFileUpload("business-license", file);
                            }}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-2 text-gray-900"
                            onClick={() => triggerFileInput("business-license")}
                            disabled={uploadingFiles["business-license"]}
                          >
                            <ArrowUpFromLine className="w-3.5 h-3.5" />
                            {uploadingFiles["business-license"]
                              ? "Uploading..."
                              : "Re-upload"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-gray-900 hover:text-gray-900"
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="sm:self-start">
                      <span className="inline-flex items-center border px-2.5 py-0.5 rounded-md text-xs font-medium hover:bg-primary/80 bg-emerald-100 text-emerald-700 border-emerald-200">
                        Approved
                      </span>
                    </div>
                  </div>

                  {/* Government ID - Under Review */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-200 min-h-[75px] gap-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium text-gray-900">
                            Government ID of Owner
                          </h4>
                          <span className="text-xs text-red-500 font-medium bg-red-50 px-1.5 py-0.5 rounded">
                            Required
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Driver&apos;s license, passport, or state ID
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Uploaded on Dec 10, 2025
                        </p>

                        <div className="flex items-center gap-3 mt-3">
                          <input
                            type="file"
                            ref={(el) => {
                              fileInputRefs.current["government-id"] = el;
                            }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload("government-id", file);
                            }}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-2 text-gray-900"
                            onClick={() => triggerFileInput("government-id")}
                            disabled={uploadingFiles["government-id"]}
                          >
                            <ArrowUpFromLine className="w-3.5 h-3.5" />
                            {uploadingFiles["government-id"]
                              ? "Uploading..."
                              : "Re-upload"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-gray-900 hover:text-gray-900"
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="sm:self-start">
                      <span className="inline-flex items-center border px-2.5 py-0.5 rounded-md text-xs font-medium hover:bg-primary/80 bg-blue-100 text-blue-700 border-blue-200">
                        Under Review
                      </span>
                    </div>
                  </div>

                  {/* Proof of Address - Needs Attention */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-200 min-h-[75px] gap-4 bg-red-50/30">
                    <div className="flex items-start gap-4">
                      <div className="bg-red-100 p-2 rounded-lg text-red-600 mt-1">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium text-gray-900">
                            Proof of Address
                          </h4>
                          <span className="text-xs text-red-500 font-medium bg-red-50 px-1.5 py-0.5 rounded">
                            Required
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Utility bill or bank statement (last 3 months)
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Uploaded on Dec 9, 2025
                        </p>

                        <div className="flex items-center gap-3 mt-3">
                          <input
                            type="file"
                            ref={(el) => {
                              fileInputRefs.current["proof-address"] = el;
                            }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload("proof-address", file);
                            }}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-2 text-gray-900"
                            onClick={() => triggerFileInput("proof-address")}
                            disabled={uploadingFiles["proof-address"]}
                          >
                            <ArrowUpFromLine className="w-3.5 h-3.5" />
                            {uploadingFiles["proof-address"]
                              ? "Uploading..."
                              : "Re-upload"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-gray-900 hover:text-gray-900"
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="sm:self-start">
                      <span className="inline-flex items-center border px-2.5 py-0.5 rounded-md text-xs font-medium hover:bg-primary/80 bg-rose-100 text-rose-700 border-rose-200">
                        Needs Attention
                      </span>
                    </div>
                  </div>

                  {/* EIN / Tax Document - Not Uploaded */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-200 min-h-[75px] gap-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-gray-100 p-2 rounded-lg text-gray-500 mt-1">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium text-gray-900">
                            EIN / Tax Document
                          </h4>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">
                          IRS EIN confirmation letter or tax ID
                        </p>

                        <div className="flex items-center gap-3 mt-3">
                          <input
                            type="file"
                            ref={(el) => {
                              fileInputRefs.current["ein-tax"] = el;
                            }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload("ein-tax", file);
                            }}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                          />
                          <Button
                            className="h-8 gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white border-0 shadow-md"
                            size="sm"
                            onClick={() => triggerFileInput("ein-tax")}
                            disabled={uploadingFiles["ein-tax"]}
                          >
                            <Upload className="w-3.5 h-3.5" />
                            {uploadingFiles["ein-tax"]
                              ? "Uploading..."
                              : "Upload"}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="sm:self-start">
                      <span className="inline-flex items-center border px-2.5 py-0.5 rounded-md text-xs font-medium hover:bg-primary/80 bg-slate-100 text-slate-600 border-slate-200">
                        Not Uploaded
                      </span>
                    </div>
                  </div>

                  {/* Recycling Permit - Not Uploaded */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 min-h-[75px] gap-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-gray-100 p-2 rounded-lg text-gray-500 mt-1">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium text-gray-900">
                            Recycling Permit
                          </h4>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">
                          State or local recycling facility permit (if
                          applicable)
                        </p>

                        <div className="flex items-center gap-3 mt-3">
                          <input
                            type="file"
                            ref={(el) => {
                              fileInputRefs.current["recycling-permit"] = el;
                            }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file)
                                handleFileUpload("recycling-permit", file);
                            }}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                          />
                          <Button
                            className="h-8 gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white border-0 shadow-md"
                            size="sm"
                            onClick={() => triggerFileInput("recycling-permit")}
                            disabled={uploadingFiles["recycling-permit"]}
                          >
                            <Upload className="w-3.5 h-3.5" />
                            {uploadingFiles["recycling-permit"]
                              ? "Uploading..."
                              : "Upload"}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="sm:self-start">
                      <span className="inline-flex items-center border px-2.5 py-0.5 rounded-md text-xs font-medium hover:bg-primary/80 bg-slate-100 text-slate-600 border-slate-200">
                        Not Uploaded
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 sticky top-6 self-start">
              <div className="rounded-md overflow-hidden bg-white shadow-sm border border-gray-100">
                <div className="flex flex-col space-y-1.5 p-6 border-b border-slate-100 bg-gradient-to-br from-emerald-50 to-teal-50">
                  <h3 className="font-semibold tracking-tight text-base">
                    Verification Benefits
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Unlock these features when verified
                  </p>
                </div>

                <div className="p-5 space-y-5">
                  <div className="flex gap-3">
                    <div className="bg-green-100 p-1.5 rounded-md h-8 w-8 flex items-center justify-center text-green-600 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        Verified Business Badge
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                        Displayed prominently to customers on your profile
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-blue-100 p-1.5 rounded-md h-8 w-8 flex items-center justify-center text-blue-600 shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        Higher Search Ranking
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                        Verified businesses appear first in search results
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-purple-100 p-1.5 rounded-md h-8 w-8 flex items-center justify-center text-purple-600 shrink-0">
                      <Rocket className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        Boost Campaigns
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                        Unlock the ability to run paid advertising campaigns
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-amber-100 p-1.5 rounded-md h-8 w-8 flex items-center justify-center text-amber-600 shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        Faster Payout Processing
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                        Instant settlements without additional review delays
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-red-100 p-1.5 rounded-md h-8 w-8 flex items-center justify-center text-red-600 shrink-0">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        Advanced Promotions
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                        Access to premium coupon features and events
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 text-white rounded-xl p-6 relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center text-center">
                  <ShieldCheck className="w-12 h-12 text-emerald-400 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Secure & Trusted</h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                    All documents are encrypted and stored securely. We never
                    share your information with third parties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}