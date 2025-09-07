import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Clock, 
  Palette, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Phone,
  MapPin,
  Camera,
  Save
} from 'lucide-react';
import { Modal } from '../components/Modal';

interface ConfigItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: 'modal' | 'toggle' | 'navigation';
  value?: boolean;
}

interface PerfilData {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  foto?: string;
}

const mockPerfil: PerfilData = {
  nome: 'Marli Silva',
  email: 'marli@studiomarli.com',
  telefone: '(11) 99999-9999',
  endereco: 'Rua das Flores, 123 - Centro'
};

const configSections = [
  {
    title: 'Conta',
    items: [
      {
        id: 'perfil',
        title: 'Perfil',
        subtitle: 'Editar informações pessoais',
        icon: <User size={20} />,
        action: 'modal' as const
      },
      {
        id: 'notificacoes',
        title: 'Notificações',
        subtitle: 'Gerenciar alertas e lembretes',
        icon: <Bell size={20} />,
        action: 'toggle' as const,
        value: true
      }
    ]
  },
  {
    title: 'Agendamentos',
    items: [
      {
        id: 'horarios',
        title: 'Horários de Funcionamento',
        subtitle: 'Definir disponibilidade',
        icon: <Clock size={20} />,
        action: 'modal' as const
      },
      {
        id: 'confirmacao',
        title: 'Confirmação Automática',
        subtitle: 'Confirmar agendamentos automaticamente',
        icon: <Shield size={20} />,
        action: 'toggle' as const,
        value: false
      }
    ]
  },
  {
    title: 'Aparência',
    items: [
      {
        id: 'tema',
        title: 'Tema',
        subtitle: 'Personalizar cores e aparência',
        icon: <Palette size={20} />,
        action: 'modal' as const
      }
    ]
  },
  {
    title: 'Suporte',
    items: [
      {
        id: 'ajuda',
        title: 'Ajuda',
        subtitle: 'Tutoriais e perguntas frequentes',
        icon: <HelpCircle size={20} />,
        action: 'navigation' as const
      },
      {
        id: 'sair',
        title: 'Sair',
        subtitle: 'Fazer logout da conta',
        icon: <LogOut size={20} />,
        action: 'navigation' as const
      }
    ]
  }
];

const horariosFuncionamento = [
  { dia: 'Segunda-feira', inicio: '09:00', fim: '18:00', ativo: true },
  { dia: 'Terça-feira', inicio: '09:00', fim: '18:00', ativo: true },
  { dia: 'Quarta-feira', inicio: '09:00', fim: '18:00', ativo: true },
  { dia: 'Quinta-feira', inicio: '09:00', fim: '18:00', ativo: true },
  { dia: 'Sexta-feira', inicio: '09:00', fim: '18:00', ativo: true },
  { dia: 'Sábado', inicio: '09:00', fim: '16:00', ativo: true },
  { dia: 'Domingo', inicio: '09:00', fim: '16:00', ativo: false }
];

export const Configuracoes: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({
    notificacoes: true,
    confirmacao: false
  });

  const handleItemClick = (item: ConfigItem) => {
    if (item.action === 'modal') {
      setModalType(item.id);
      setShowModal(true);
    } else if (item.action === 'toggle') {
      setToggleStates(prev => ({
        ...prev,
        [item.id]: !prev[item.id]
      }));
    } else if (item.action === 'navigation') {
      // Handle navigation or logout
      if (item.id === 'sair') {
        // Implement logout logic
        console.log('Logout');
      }
    }
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'perfil':
        return (
          <div className="space-y-4">
            {/* Profile Photo */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                {mockPerfil.foto ? (
                  <img src={mockPerfil.foto} alt="Perfil" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User size={32} className="text-gray-400" />
                )}
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Camera size={16} />
                <span>Alterar Foto</span>
              </button>
            </div>

            {/* Form Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                defaultValue={mockPerfil.nome}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                defaultValue={mockPerfil.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                type="tel"
                defaultValue={mockPerfil.telefone}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
              <input
                type="text"
                defaultValue={mockPerfil.endereco}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Save size={16} />
                <span>Salvar</span>
              </button>
            </div>
          </div>
        );

      case 'horarios':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Defina os horários de funcionamento para cada dia da semana.
            </p>
            
            {horariosFuncionamento.map((horario) => (
              <div key={horario.dia} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  defaultChecked={horario.ativo}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{horario.dia}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    defaultValue={horario.inicio}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={!horario.ativo}
                  />
                  <span className="text-gray-500">às</span>
                  <input
                    type="time"
                    defaultValue={horario.fim}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={!horario.ativo}
                  />
                </div>
              </div>
            ))}

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        );

      case 'tema':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Personalize as cores do aplicativo.
            </p>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Rosa', color: '#A0144B' },
                { name: 'Azul', color: '#1E40AF' },
                { name: 'Verde', color: '#059669' },
                { name: 'Roxo', color: '#7C3AED' },
                { name: 'Laranja', color: '#EA580C' },
                { name: 'Vermelho', color: '#DC2626' }
              ].map((tema) => (
                <motion.button
                  key={tema.name}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center space-y-2 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div 
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: tema.color }}
                  />
                  <span className="text-xs text-gray-600">{tema.name}</span>
                </motion.button>
              ))}
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'perfil': return 'Editar Perfil';
      case 'horarios': return 'Horários de Funcionamento';
      case 'tema': return 'Personalizar Tema';
      default: return '';
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          <User size={24} className="text-gray-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text">{mockPerfil.nome}</h1>
          <p className="text-gray-500">{mockPerfil.email}</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 space-y-3">
        <div className="flex items-center space-x-3 text-gray-600">
          <Phone size={16} />
          <span className="text-sm">{mockPerfil.telefone}</span>
        </div>
        <div className="flex items-center space-x-3 text-gray-600">
          <MapPin size={16} />
          <span className="text-sm">{mockPerfil.endereco}</span>
        </div>
      </div>

      {/* Settings Sections */}
      {configSections.map((section) => (
        <div key={section.title} className="space-y-3">
          <h2 className="text-lg font-semibold text-text">{section.title}</h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {section.items.map((item, itemIndex) => (
              <motion.button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors ${
                  itemIndex < section.items.length - 1 ? 'border-b border-gray-100' : ''
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-gray-500">{item.icon}</div>
                  <div>
                    <div className="font-medium text-text">{item.title}</div>
                    {item.subtitle && (
                      <div className="text-sm text-gray-500">{item.subtitle}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {item.action === 'toggle' && (
                    <div className={`w-12 h-6 rounded-full transition-colors ${
                      toggleStates[item.id] ? 'bg-primary' : 'bg-gray-300'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
                        toggleStates[item.id] ? 'translate-x-6 ml-1' : 'translate-x-1'
                      }`} />
                    </div>
                  )}
                  {item.action !== 'toggle' && (
                    <ChevronRight size={16} className="text-gray-400" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ))}

      {/* Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={getModalTitle()}
        >
          {renderModalContent()}
        </Modal>
      )}
    </div>
  );
};