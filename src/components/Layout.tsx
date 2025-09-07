import React from 'react';
import { motion } from 'framer-motion';
import { BottomNav } from './BottomNav';
import { FAB } from './FAB';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showFAB?: boolean;
  fabAction?: () => void;
  fabIcon?: React.ReactNode;
  className?: string;
}

export function Layout({ 
  children, 
  title, 
  showFAB = false, 
  fabAction, 
  fabIcon, 
  className = '' 
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      {title && (
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 sticky top-0 z-40"
        >
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </motion.header>
      )}

      {/* Main Content */}
      <main className={`flex-1 relative ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="h-full"
        >
          {children}
        </motion.div>

        {/* FAB */}
        {showFAB && fabAction && (
          <FAB onClick={fabAction} icon={fabIcon} />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}