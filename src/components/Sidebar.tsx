'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import {
  Shield,
  Building,
  Leaf,
  LayoutDashboard,
  Recycle,
  LocateIcon,
  CreditCard,
  LogOut
} from 'lucide-react';

interface MenuItem {
  id: string;
  icon: any;
  label: string;
  href: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const handleLogout = async () => {
    // Call logout API to clear server-side session
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }
    
    dispatch(logout());
    router.push('/login');
  };
  
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      id: 'business-profile',
      icon: Building,
      label: 'Business Profile',
      href: '/business-profile',
    },
    {
      id: 'business-verification',
      icon: Shield,
      label: 'Business Verification',
      href: '/business-verification',
    },
    {
      id: 'Locations',
      icon: LocateIcon,
      label: 'Locations',
      href: '/locations'
    },
    {
      id: 'SubscriptionBilling',
      icon: CreditCard,
      label: 'Subscription & Billing',
      href: '/SubscriptionBilling'
    },
    
    {
      id: 'BillingInformation',
      icon: CreditCard,
      label: 'Billing Information',
      href: '/billing-information'
    }
  ];  

  return (
    <aside className="w-64 min-w-[16rem] bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 min-h-[75px]">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-9 bg-gradient-to-br from-teal-500 to-green-500 rounded-lg flex items-center justify-center">
            <Leaf className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">dLoop</h1>
            <p className="text-xs text-gray-500"> Partner Business</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 pb-12 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.id} className="relative">
              <Link href={item.href} className="block">
                <div className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer group ${
                  pathname === item.href
                    ? 'bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}>
                  <Icon
                    size={20}
                    className="transition-colors group-hover:text-gray-700"
                  />
                  <span className="ml-3 text-sm font-medium truncate whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer group"
        >
          <LogOut size={20} className="transition-colors" />
          <span className="ml-3 text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}