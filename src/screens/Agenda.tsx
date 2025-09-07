import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { Modal } from '../components/Modal';
import { AgendamentoForm } from '../components/AgendamentoForm';
import { 
  Calendar, 
  Clock, 
  Phone, 
  DollarSign, 
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

// Mock data para demonstração
const mockAgendamentos = [
  {
    id: 1,
    cliente_nome: 'Maria Silva',
    cliente_telefone: '(11) 99999-9999',
    hora: '09:00',
    total_cents: 8000,
    servicos: [
      { servico_nome: 'Corte + Escova', qtd: 1 }
    ]
  },
  {
    id: 2,
    cliente_nome: 'Ana Costa',
    cliente_telefone: '(11) 88888-8888',
    hora: '14:30',
    total_cents: 12000,
    servicos: [
      { servico_nome: 'Coloração', qtd: 1 },
      { servico_nome: 'Corte', qtd: 1 }
    ]
  }
];

export function Agenda() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showNewAgendamento, setShowNewAgendamento] = useState(false);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cents / 100);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => 
      direction === 'prev' 
        ? prev.subtract(1, 'day')
        : prev.add(1, 'day')
    );
  };

  return (
    <Layout 
      title="Agenda"
      showFAB
      fabAction={() => setShowNewAgendamento(true)}
      fabIcon={<Plus size={24} />}
    >
      <div className="p-4 space-y-4">
        {/* Seletor de Data */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => navigateDate('prev')}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={20} />
            </motion.button>
            
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedDate.format('dddd')}
              </h2>
              <p className="text-sm text-gray-500">
                {selectedDate.format('DD [de] MMMM [de] YYYY')}
              </p>
            </div>
            
            <motion.button
              onClick={() => navigateDate('next')}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Lista de Agendamentos */}
        <div className="space-y-3">
          {mockAgendamentos.length > 0 ? (
            mockAgendamentos.map((agendamento, index) => (
              <motion.div
                key={agendamento.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock size={16} className="text-pink-600" />
                      <span className="font-semibold text-gray-900">
                        {agendamento.hora}
                      </span>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 mb-1">
                      {agendamento.cliente_nome}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Phone size={14} />
                      <span>{agendamento.cliente_telefone}</span>
                    </div>
                    
                    <div className="space-y-1">
                      {agendamento.servicos.map((servico, idx) => (
                        <div key={idx} className="text-sm text-gray-600">
                          {servico.qtd}x {servico.servico_nome}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-600 font-semibold">
                      <DollarSign size={16} />
                      <span>{formatCurrency(agendamento.total_cents)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                Nenhum agendamento
              </h3>
              <p className="text-gray-400">
                Não há agendamentos para {selectedDate.format('DD/MM/YYYY')}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modal Novo Agendamento */}
      <Modal
        isOpen={showNewAgendamento}
        onClose={() => setShowNewAgendamento(false)}
        title="Novo Agendamento"
        size="lg"
      >
        <AgendamentoForm
          selectedDate={selectedDate.format('YYYY-MM-DD')}
          onSuccess={() => {
            setShowNewAgendamento(false);
            // Aqui você pode adicionar lógica para recarregar os agendamentos
          }}
          onCancel={() => setShowNewAgendamento(false)}
        />
      </Modal>
    </Layout>
  );
}