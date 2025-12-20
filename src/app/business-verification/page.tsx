"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import toast, { Toaster } from "react-hot-toast";
import {
  fetchDocuments,
  uploadDocument,
} from "@/redux/slices/businessVerificationSlice";
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
  Loader2,
} from "lucide-react";

export default function BusinessVerificationPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { documents, isLoading } = useSelector(
    (state: RootState) => state.businessVerification
  );
  const [uploadingFiles, setUploadingFiles] = useState<{
    [key: string]: boolean;
  }>({});
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  const handleFileUpload = async (documentType: string, file: File) => {
    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error("Please upload only PDF files");
      // alert('Please upload only PDF files.');
      return;
    }

    setUploadingFiles((prev) => ({ ...prev, [documentType]: true }));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        console.log("File uploaded successfully:", result.url);

        const uploadResult = await dispatch(
          uploadDocument({
            documentType,
            url: result.url,
            status: "pending",
          })
        );

        console.log("Document saved to DB:", uploadResult);
      } else {
        console.error("Upload failed:", result.message);
        alert(`Upload failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [documentType]: false }));
    }
  };

  const triggerFileInput = (documentType: string) => {
    fileInputRefs.current[documentType]?.click();
  };

  const getDocumentByType = (type: string) => {
    return documents.find((doc) => doc.documentType === type);
  };

  const formatUploadDate = (doc: any) => {
    if (!doc || !doc.uploadedAt) return "";
    const date = new Date(doc.uploadedAt);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getLastUpdated = () => {
    const now = new Date();
    const today = now.toDateString();
    const currentDate = new Date().toDateString();

    if (today === currentDate) {
      return `Today at ${now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`;
    }
    return now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRemainingDocuments = () => {
    const totalDocuments = 5;
    const uploadedCount = documents.length;
    return Math.max(0, totalDocuments - uploadedCount);
  };

  const getVerificationStatus = () => {
    const requiredTypes = ["business-license", "proof-address"];
    const requiredDocs = requiredTypes
      .map((type) => getDocumentByType(type))
      .filter(Boolean);

    if (requiredDocs.length === requiredTypes.length) {
      return {
        status: "Verified",
        message: "All required documents have been uploaded successfully",
      };
    } else if (requiredDocs.length > 0) {
      return {
        status: "In Progress",
        message: "Required documents are being reviewed",
      };
    }
    return {
      status: "Not Verified",
      message: "Upload required documents to begin verification",
    };
  };

  const getDocumentStatus = (type: string) => {
    const doc = getDocumentByType(type);
    if (!doc) return "not-uploaded";
    if (doc.status === "approved") return "approved";
    if (doc.status === "rejected") return "needs-attention";
    return "under-review";
  };

  const renderDocumentSection = (
    type: string,
    title: string,
    description: string,
    isRequired: boolean = true,
    hasIssues: boolean = false,
    issueText: string = ""
  ) => {
    const status = getDocumentStatus(type);
    const doc = getDocumentByType(type);

    let iconBg = "bg-gray-100";
    let iconColor = "text-gray-500";
    let icon = Upload;
    let statusBg = "bg-slate-100";
    let statusText = "text-slate-600";
    let statusBorder = "border-slate-200";
    let statusLabel = "Not Uploaded";
    let sectionBg = "";

    if (status === "approved") {
      iconBg = "bg-green-100";
      iconColor = "text-green-600";
      icon = CheckCircle;
      statusBg = "bg-emerald-100";
      statusText = "text-emerald-700";
      statusBorder = "border-emerald-200";
      statusLabel = "Approved";
    } else if (status === "under-review") {
      iconBg = "bg-blue-100";
      iconColor = "text-blue-600";
      icon = Clock;
      statusBg = "bg-blue-100";
      statusText = "text-blue-700";
      statusBorder = "border-blue-200";
      statusLabel = "Under Review";
    } else if (status === "needs-attention" || hasIssues) {
      iconBg = "bg-red-100";
      iconColor = "text-red-600";
      icon = AlertCircle;
      statusBg = "bg-rose-100";
      statusText = "text-rose-700";
      statusBorder = "border-rose-200";
      statusLabel = "Needs Attention";
      sectionBg = "bg-red-50/30";
    }

    const IconComponent = icon;

    return (
      <>
     <Toaster position="top-right" />
      <div
        className={`flex flex-col sm:flex-row sm:items-start justify-between p-4 border-b border-gray-200 min-h-[75px] gap-4 ${sectionBg}`}
      >
        <div
          className={`flex items-start gap-4 ${
            hasIssues || status === "needs-attention" ? "flex-1" : ""
          }`}
        >
          <div className={`${iconBg} p-2 rounded-lg ${iconColor} mt-1`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div
            className={
              hasIssues || status === "needs-attention" ? "flex-1" : ""
            }
          >
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-medium text-gray-900">{title}</h4>
              {isRequired && (
                <span className="text-xs text-red-500 font-medium bg-red-50 px-1.5 py-0.5 rounded">
                  Required
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
            {doc && (
              <p className="text-xs text-gray-400 mt-1">
                Uploaded on {formatUploadDate(doc)}
              </p>
            )}

            {(hasIssues || status === "needs-attention") && issueText && (
              <>
                {/* Issues Found */}
                <div className="bg-red-50 border border-red-100 rounded-md p-3 mt-3">
                  <h5 className="font-semibold text-red-800 text-sm mb-1">
                    Issues Found:
                  </h5>
                  <ul className="list-disc list-inside text-sm text-red-600">
                    <li>{issueText}</li>
                  </ul>
                </div>

                {/* Extracted Data */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-md p-3 mt-3 mb-3">
                  <h5 className="font-semibold text-emerald-800 text-sm">
                    Extracted Data:
                  </h5>
                </div>
              </>
            )}

            <div className="flex items-center gap-3 mt-3">
              <input
                type="file"
                ref={(el) => {
                  fileInputRefs.current[type] = el;
                }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(type, file);
                }}
                accept=".pdf"
                className="hidden"
              />
              <Button
                variant={doc ? "outline" : "default"}
                size="sm"
                className={`h-8 gap-2 ${
                  !doc
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white border-0 shadow-md"
                    : ""
                }`}
                onClick={() => triggerFileInput(type)}
                disabled={uploadingFiles[type]}
              >
                {uploadingFiles[type] ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                {uploadingFiles[type]
                  ? "Verifying..."
                  : doc
                  ? "Re-upload"
                  : "Upload"}
              </Button>
              {doc && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => window.open(doc.url, '_blank')}
                >
                  View
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="sm:self-start">
          <span
            className={`inline-flex items-center border px-2.5 py-0.5 rounded-md text-xs font-medium hover:bg-primary/80 ${statusBg} ${statusText} ${statusBorder}`}
          >
            {statusLabel}
          </span>
        </div>
      </div>
    </>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white flex items-center justify-between p-4 border-b border-gray-200 min-h-[75px] shadow-sm">
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
      <div className="flex-1 overflow-auto p-6 pt-[91px]">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {/* Status Banner */}
            <div
              className={`bg-gradient-to-br border rounded-xl p-6 flex flex-col sm:flex-row gap-4 shadow-lg ${
                getVerificationStatus().status === "Verified"
                  ? "from-green-50 to-emerald-50 border-green-200"
                  : getVerificationStatus().status === "In Progress"
                  ? "from-blue-50 to-cyan-50 border-blue-200"
                  : "from-amber-50 to-orange-50 border-amber-200"
              }`}
            >
              <div
                className={`bg-white p-3 rounded-lg w-fit h-fit shadow-sm ${
                  getVerificationStatus().status === "Verified"
                    ? "text-green-600"
                    : getVerificationStatus().status === "In Progress"
                    ? "text-blue-600"
                    : "text-orange-600"
                }`}
              >
                {getVerificationStatus().status === "Verified" ? (
                  <ShieldCheck className="w-6 h-6" />
                ) : getVerificationStatus().status === "In Progress" ? (
                  <Clock className="w-6 h-6" />
                ) : (
                  <ShieldAlert className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-semibold text-lg text-gray-900">
                    Verification Status
                  </h2>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-medium border ${
                      getVerificationStatus().status === "Verified"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : getVerificationStatus().status === "In Progress"
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : "bg-amber-100 text-amber-700 border-amber-200"
                    }`}
                  >
                    {getVerificationStatus().status}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">
                  {getVerificationStatus().message}
                </p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                  <span>
                    Last Updated:{" "}
                    <span className="font-medium text-gray-900">
                      {getLastUpdated()}
                    </span>
                  </span>
                  <span>
                    Requirements Remaining:{" "}
                    <span className="font-medium text-gray-900">
                      {getRemainingDocuments()} documents
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
                      Upload PDF files of the following documents
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  {/* Business License */}
                  {renderDocumentSection(
                    "business-license",
                    "Business License",
                    "Valid business license or registration certificate",
                    true
                  )}

                  {/* Government ID */}
                  {renderDocumentSection(
                    "government-id",
                    "Government ID of Owner",
                    "Driver's license, passport, or state ID",
                    false
                  )}

                  {/* Proof of Address */}
                  {renderDocumentSection(
                    "proof-address",
                    "Proof of Address",
                    "Utility bill or bank statement (last 3 months)",
                    true
                  )}

                  {/* EIN / Tax Document */}
                  {renderDocumentSection(
                    "ein-tax",
                    "EIN / Tax Document",
                    "IRS EIN confirmation letter or tax ID",
                    false
                  )}

                  {/* Recycling Permit */}
                  {renderDocumentSection(
                    "recycling-permit",
                    "Recycling Permit",
                    "State or local recycling facility permit (if applicable)",
                    false
                  )}
                </div>

                {/* Go to Subscription Button */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center">
                  <Button
                    className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-medium py-3 px-6 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      !getDocumentByType("business-license") ||
                      !getDocumentByType("proof-address")
                    }
                  >
                    Go to Subscription
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
