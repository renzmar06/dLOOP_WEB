'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Building,
} from 'lucide-react';

interface MenuItem {
  id: string;
  icon: any;
  label: string;
  href: string;
}

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const menuItems: MenuItem[] = [
    {
      id: 'business-verification',
      icon: Shield,
      label: 'Business Verification',
      href: '/business-verification',
    },
    {
      id: 'business-profile',
      icon: Building,
      label: 'Business Profile',
      href: '/business-profile',
    },
  ];

  return (
    <aside
      className={`${
        isOpen ? 'w-64 min-w-[16rem]' : 'w-20 min-w-[5rem]'
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-full overflow-y-auto`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 min-h-[75px]">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-9 bg-gradient-to-br from-teal-500 to-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">dloop</span>
          </div>
          {isOpen && (
            <div>
              <h1 className="text-lg font-bold text-gray-900">dloop</h1>
              <p className="text-xs text-gray-500"> Operations</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 pb-12 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.id} className="relative">
              <Link href={item.href} className="block">
                <div className="w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer group text-gray-600 hover:bg-gray-100 hover:text-gray-800">
                  <Icon
                    size={20}
                    className="transition-colors group-hover:text-gray-700"
                  />
                  {isOpen && (
                    <span className="ml-3 text-sm font-medium truncate whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </nav>

     
    </aside>
  );
}