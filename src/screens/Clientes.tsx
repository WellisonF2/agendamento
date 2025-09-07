import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Phone, Mail, MapPin, Edit, Trash2, Users } from 'lucide-react';
import { FAB } from '../components/FAB';
import { Modal } from '../components/Modal';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  endereco?: string;
  ultimoAgendamento?: string;
  totalAgendamentos: number;
}

// Mock data
const mockClientes: Cliente[] = [
  {
    id: '1',
    nome: 'Maria Silva',
    telefone: '(11) 99999-9999',
    email: 'maria@email.com',
    endereco: 'Rua das Flores, 123',
    ultimoAgendamento: '2024-01-15',
    totalAgendamentos: 12
  },
  {
    id: '2',
    nome: 'Ana Costa',
    telefone: '(11) 88888-8888',
    email: 'ana@email.com',
    ultimoAgendamento: '2024-01-10',
    totalAgendamentos: 8
  },
  {
    id: '3',
    nome: 'Carla Santos',
    telefone: '(11) 77777-7777',
    ultimoAgendamento: '2024-01-08',
    totalAgendamentos: 15
  }
];

export const Clientes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  const filteredClientes = mockClientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefone.includes(searchTerm)
  );

  const handleEditCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setShowModal(true);
  };

  const handleNewCliente = () => {
    setSelectedCliente(null);
    setShowModal(true);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Clientes</h1>
        <div className="text-sm text-gray-500">
          {filteredClientes.length} cliente{filteredClientes.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por nome ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Clientes List */}
      <div className="space-y-3">
        {filteredClientes.map((cliente, index) => (
          <motion.div
            key={cliente.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-text text-lg">{cliente.nome}</h3>
                
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-gray-600">
                    <Phone size={16} className="mr-2" />
                    <span className="text-sm">{cliente.telefone}</span>
                  </div>
                  
                  {cliente.email && (
                    <div className="flex items-center text-gray-600">
                      <Mail size={16} className="mr-2" />
                      <span className="text-sm">{cliente.email}</span>
                    </div>
                  )}
                  
                  {cliente.endereco && (
                    <div className="flex items-center text-gray-600">
                      <MapPin size={16} className="mr-2" />
                      <span className="text-sm">{cliente.endereco}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {cliente.totalAgendamentos} agendamento{cliente.totalAgendamentos !== 1 ? 's' : ''}
                  </div>
                  {cliente.ultimoAgendamento && (
                    <div className="text-xs text-gray-500">
                      Último: {new Date(cliente.ultimoAgendamento).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEditCliente(cliente)}
                  className="p-2 text-gray-500 hover:text-primary transition-colors"
                >
                  <Edit size={18} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredClientes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <Users size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500">
            {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
          </p>
        </div>
      )}

      {/* FAB */}
      <FAB
        onClick={handleNewCliente}
        icon={<Plus size={24} />}
        className="fixed bottom-24 right-4"
      />

      {/* Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={selectedCliente ? 'Editar Cliente' : 'Novo Cliente'}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                defaultValue={selectedCliente?.nome || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Nome completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone *
              </label>
              <input
                type="tel"
                defaultValue={selectedCliente?.telefone || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                defaultValue={selectedCliente?.email || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço
              </label>
              <input
                type="text"
                defaultValue={selectedCliente?.endereco || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Rua, número, bairro"
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
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                {selectedCliente ? 'Salvar' : 'Cadastrar'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};