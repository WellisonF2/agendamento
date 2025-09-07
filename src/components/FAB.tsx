import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FABProps {
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function FAB({ 
  onClick, 
  icon = <Plus size={24} />, 
  className = '', 
  disabled = false 
}: FABProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        fixed bottom-20 right-4 z-50
        w-14 h-14 rounded-full
        bg-pink-600 hover:bg-pink-700
        text-white shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ 
        scale: disabled ? 0.9 : 1, 
        rotate: 0,
        opacity: disabled ? 0.5 : 1
      }}
      whileTap={{ scale: disabled ? 0.9 : 0.95 }}
      whileHover={{ scale: disabled ? 0.9 : 1.05 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }}
    >
      <motion.div
        animate={{ rotate: disabled ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </motion.div>
    </motion.button>
  );
}