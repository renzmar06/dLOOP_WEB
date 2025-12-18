'use client';

interface LayoutWrapperProps {
  children: React.ReactNode;
}
// hello

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}