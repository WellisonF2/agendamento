import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Clock, DollarSign, Edit, Trash2, Scissors } from 'lucide-react';
import { FAB } from '../components/FAB';
import { Modal } from '../components/Modal';

interface Servico {
  id: string;
  nome: string;
  descricao?: string;
  duracao: number; // em minutos
  preco: number;
  categoria: string;
  ativo: boolean;
}

// Mock data
const mockServicos: Servico[] = [
  {
    id: '1',
    nome: 'Corte Feminino',
    descricao: 'Corte e finalização',
    duracao: 60,
    preco: 80,
    categoria: 'Cabelo',
    ativo: true
  },
  {
    id: '2',
    nome: 'Escova',
    descricao: 'Escova modeladora',
    duracao: 45,
    preco: 50,
    categoria: 'Cabelo',
    ativo: true
  },
  {
    id: '3',
    nome: 'Coloração',
    descricao: 'Tintura completa',
    duracao: 120,
    preco: 150,
    categoria: 'Cabelo',
    ativo: true
  },
  {
    id: '4',
    nome: 'Manicure',
    descricao: 'Cuidados com as unhas das mãos',
    duracao: 30,
    preco: 25,
    categoria: 'Unhas',
    ativo: true
  },
  {
    id: '5',
    nome: 'Pedicure',
    descricao: 'Cuidados com as unhas dos pés',
    duracao: 45,
    preco: 35,
    categoria: 'Unhas',
    ativo: true
  },
  {
    id: '6',
    nome: 'Limpeza de Pele',
    descricao: 'Limpeza facial profunda',
    duracao: 90,
    preco: 120,
    categoria: 'Estética',
    ativo: true
  }
];

const categorias = ['Todos', 'Cabelo', 'Unhas', 'Estética'];

export const Servicos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);

  const filteredServicos = mockServicos.filter(servico => {
    const matchesSearch = servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (servico.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesCategoria = selectedCategoria === 'Todos' || servico.categoria === selectedCategoria;
    return matchesSearch && matchesCategoria && servico.ativo;
  });

  const handleEditServico = (servico: Servico) => {
    setSelectedServico(servico);
    setShowModal(true);
  };

  const handleNewServico = () => {
    setSelectedServico(null);
    setShowModal(true);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
    }
    return `${mins}min`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Serviços</h1>
        <div className="text-sm text-gray-500">
          {filteredServicos.length} serviço{filteredServicos.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar serviços..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Categories */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categorias.map((categoria) => (
          <motion.button
            key={categoria}
            onClick={() => setSelectedCategoria(categoria)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategoria === categoria
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {categoria}
          </motion.button>
        ))}
      </div>

      {/* Serviços List */}
      <div className="space-y-3">
        {filteredServicos.map((servico, index) => (
          <motion.div
            key={servico.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-text text-lg">{servico.nome}</h3>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {servico.categoria}
                  </span>
                </div>
                
                {servico.descricao && (
                  <p className="text-gray-600 text-sm mb-3">{servico.descricao}</p>
                )}
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-gray-600">
                    <Clock size={16} className="mr-1" />
                    <span className="text-sm">{formatDuration(servico.duracao)}</span>
                  </div>
                  
                  <div className="flex items-center text-primary font-semibold">
                    <DollarSign size={16} className="mr-1" />
                    <span className="text-sm">{formatPrice(servico.preco)}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEditServico(servico)}
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

      {filteredServicos.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <Scissors size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500">
            {searchTerm || selectedCategoria !== 'Todos' 
              ? 'Nenhum serviço encontrado' 
              : 'Nenhum serviço cadastrado'
            }
          </p>
        </div>
      )}

      {/* FAB */}
      <FAB
        onClick={handleNewServico}
        icon={<Plus size={24} />}
        className="fixed bottom-24 right-4"
      />

      {/* Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={selectedServico ? 'Editar Serviço' : 'Novo Serviço'}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                defaultValue={selectedServico?.nome || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Nome do serviço"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                defaultValue={selectedServico?.categoria || 'Cabelo'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Cabelo">Cabelo</option>
                <option value="Unhas">Unhas</option>
                <option value="Estética">Estética</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                defaultValue={selectedServico?.descricao || ''}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Descrição do serviço"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duração (min) *
                </label>
                <input
                  type="number"
                  defaultValue={selectedServico?.duracao || ''}
                  min="15"
                  step="15"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  defaultValue={selectedServico?.preco || ''}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="50.00"
                />
              </div>
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
                {selectedServico ? 'Salvar' : 'Cadastrar'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};