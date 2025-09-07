import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, User, Scissors, Save, X } from 'lucide-react';
import dayjs from 'dayjs';

// Validation schema
const agendamentoSchema = z.object({
  clienteId: z.string().min(1, 'Selecione um cliente'),
  servicoId: z.string().min(1, 'Selecione um serviço'),
  data: z.string().min(1, 'Selecione uma data'),
  horario: z.string().min(1, 'Selecione um horário'),
  observacoes: z.string().optional(),
  novoCliente: z.object({
    nome: z.string().optional(),
    telefone: z.string().optional(),
    email: z.string().email('E-mail inválido').optional().or(z.literal(''))
  }).optional()
});

type AgendamentoFormData = z.infer<typeof agendamentoSchema>;

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
}

interface Servico {
  id: string;
  nome: string;
  duracao: number;
  preco: number;
}

interface AgendamentoFormProps {
  onSubmit?: (data: AgendamentoFormData) => void;
  onSuccess?: () => void;
  onCancel: () => void;
  clientes?: Cliente[];
  servicos?: Servico[];
  selectedDate?: string;
  dataInicial?: string;
  horarioInicial?: string;
}

const horariosDisponiveis = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

// Mock data
const mockClientes: Cliente[] = [
  { id: '1', nome: 'Maria Silva', telefone: '(11) 99999-1111', email: 'maria@email.com' },
  { id: '2', nome: 'Ana Costa', telefone: '(11) 99999-2222', email: 'ana@email.com' },
  { id: '3', nome: 'Carla Santos', telefone: '(11) 99999-3333' }
];

const mockServicos: Servico[] = [
  { id: '1', nome: 'Corte Feminino', duracao: 60, preco: 50.00 },
  { id: '2', nome: 'Escova', duracao: 45, preco: 35.00 },
  { id: '3', nome: 'Coloração', duracao: 120, preco: 120.00 },
  { id: '4', nome: 'Manicure', duracao: 30, preco: 25.00 }
];

export const AgendamentoForm: React.FC<AgendamentoFormProps> = ({
  onSubmit,
  onSuccess,
  onCancel,
  clientes = mockClientes,
  servicos = mockServicos,
  selectedDate,
  dataInicial,
  horarioInicial
}) => {
  const [isNovoCliente, setIsNovoCliente] = useState(false);
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<AgendamentoFormData>({
    resolver: zodResolver(agendamentoSchema),
    defaultValues: {
      data: selectedDate || dataInicial || dayjs().format('YYYY-MM-DD'),
      horario: horarioInicial || '',
      clienteId: '',
      servicoId: '',
      observacoes: ''
    }
  });

  const watchedServicoId = watch('servicoId');
  const watchedData = watch('data');

  React.useEffect(() => {
    if (watchedServicoId) {
      const servico = servicos.find(s => s.id === watchedServicoId);
      setSelectedServico(servico || null);
    }
  }, [watchedServicoId, servicos]);

  const handleFormSubmit = (data: AgendamentoFormData) => {
    console.log('Agendamento criado:', data);
    
    if (onSubmit) {
      onSubmit(data);
    }
    
    if (onSuccess) {
      onSuccess();
    }
  };

  const getHorarioFim = (horarioInicio: string, duracao: number) => {
    if (!horarioInicio) return '';
    const [hora, minuto] = horarioInicio.split(':').map(Number);
    const inicioMinutos = hora * 60 + minuto;
    const fimMinutos = inicioMinutos + duracao;
    const horaFim = Math.floor(fimMinutos / 60);
    const minutoFim = fimMinutos % 60;
    return `${horaFim.toString().padStart(2, '0')}:${minutoFim.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Cliente Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User size={16} className="inline mr-2" />
            Cliente
          </label>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={!isNovoCliente}
                  onChange={() => setIsNovoCliente(false)}
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                />
                <span className="text-sm">Cliente existente</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={isNovoCliente}
                  onChange={() => setIsNovoCliente(true)}
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                />
                <span className="text-sm">Novo cliente</span>
              </label>
            </div>

            {!isNovoCliente ? (
              <div>
                <select
                  {...register('clienteId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome} - {cliente.telefone}
                    </option>
                  ))}
                </select>
                {errors.clienteId && (
                  <p className="text-red-500 text-sm mt-1">{errors.clienteId.message}</p>
                )}
              </div>
            ) : (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <div>
                  <input
                    {...register('novoCliente.nome')}
                    placeholder="Nome completo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    {...register('novoCliente.telefone')}
                    placeholder="Telefone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    {...register('novoCliente.email')}
                    type="email"
                    placeholder="E-mail (opcional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {errors.novoCliente?.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.novoCliente.email.message}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Serviço */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Scissors size={16} className="inline mr-2" />
            Serviço
          </label>
          <select
            {...register('servicoId')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Selecione um serviço</option>
            {servicos.map((servico) => (
              <option key={servico.id} value={servico.id}>
                {servico.nome} - {servico.duracao}min - R$ {servico.preco.toFixed(2)}
              </option>
            ))}
          </select>
          {errors.servicoId && (
            <p className="text-red-500 text-sm mt-1">{errors.servicoId.message}</p>
          )}
        </div>

        {/* Data */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar size={16} className="inline mr-2" />
            Data
          </label>
          <input
            {...register('data')}
            type="date"
            min={dayjs().format('YYYY-MM-DD')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {errors.data && (
            <p className="text-red-500 text-sm mt-1">{errors.data.message}</p>
          )}
        </div>

        {/* Horário */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock size={16} className="inline mr-2" />
            Horário
          </label>
          <div className="grid grid-cols-3 gap-2">
            {horariosDisponiveis.map((horario) => {
              const isSelected = watch('horario') === horario;
              return (
                <button
                  key={horario}
                  type="button"
                  onClick={() => setValue('horario', horario)}
                  className={`p-2 text-sm rounded-lg border transition-colors ${
                    isSelected
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  {horario}
                  {selectedServico && isSelected && (
                    <div className="text-xs opacity-75">
                      até {getHorarioFim(horario, selectedServico.duracao)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {errors.horario && (
            <p className="text-red-500 text-sm mt-1">{errors.horario.message}</p>
          )}
        </div>

        {/* Observações */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações (opcional)
          </label>
          <textarea
            {...register('observacoes')}
            rows={3}
            placeholder="Observações sobre o agendamento..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Resumo */}
        {selectedServico && watch('horario') && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Resumo do Agendamento</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>Serviço: {selectedServico.nome}</div>
              <div>Duração: {selectedServico.duracao} minutos</div>
              <div>Valor: R$ {selectedServico.preco.toFixed(2)}</div>
              {watchedData && (
                <div>Data: {dayjs(watchedData).format('DD/MM/YYYY')}</div>
              )}
              {watch('horario') && (
                <div>
                  Horário: {watch('horario')} às {getHorarioFim(watch('horario'), selectedServico.duracao)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <X size={16} />
            <span>Cancelar</span>
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Save size={16} />
            <span>{isSubmitting ? 'Salvando...' : 'Agendar'}</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};