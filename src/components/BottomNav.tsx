import React from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarDays, 
  Users, 
  Scissors, 
  BarChart3, 
  Settings 
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  {
    id: 'agenda',
    label: 'Agenda',
    icon: <CalendarDays size={20} />,
    path: '/agenda'
  },
  {
    id: 'clientes',
    label: 'Clientes',
    icon: <Users size={20} />,
    path: '/clientes'
  },
  {
    id: 'servicos',
    label: 'Serviços',
    icon: <Scissors size={20} />,
    path: '/servicos'
  },
  {
    id: 'relatorio',
    label: 'Relatório',
    icon: <BarChart3 size={20} />,
    path: '/relatorio'
  },
  {
    id: 'config',
    label: 'Config',
    icon: <Settings size={20} />,
    path: '/configuracoes'
  }
];

export function BottomNav() {
  // Por enquanto, vamos simular a rota atual
  const currentPath = window.location.pathname || '/agenda';

  const handleNavigation = (path: string) => {
    // Por enquanto, apenas atualiza a URL
    window.history.pushState({}, '', path);
    // Força re-render
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="bg-white border-t border-gray-200 px-2 py-2 safe-area-bottom"
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || 
            (currentPath === '/' && item.path === '/agenda');
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg min-w-[60px] transition-colors ${
                isActive 
                  ? 'text-pink-600 bg-pink-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ 
                  scale: isActive ? 1.1 : 1,
                  color: isActive ? '#db2777' : '#6b7280'
                }}
                transition={{ duration: 0.2 }}
              >
                {item.icon}
              </motion.div>
              <span className={`text-xs mt-1 font-medium ${
                isActive ? 'text-pink-600' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}