import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Clock, 
  BarChart3,
  ChevronDown,
  Filter
} from 'lucide-react';
import dayjs from 'dayjs';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

interface AgendamentoPorDia {
  data: string;
  agendamentos: number;
  faturamento: number;
}

interface ServicoPopular {
  nome: string;
  quantidade: number;
  faturamento: number;
}

// Mock data
const mockMetrics: MetricCard[] = [
  {
    title: 'Faturamento',
    value: 'R$ 12.450',
    change: '+15%',
    trend: 'up',
    icon: <DollarSign size={24} />
  },
  {
    title: 'Agendamentos',
    value: '156',
    change: '+8%',
    trend: 'up',
    icon: <Calendar size={24} />
  },
  {
    title: 'Clientes',
    value: '89',
    change: '+12%',
    trend: 'up',
    icon: <Users size={24} />
  },
  {
    title: 'Tempo Médio',
    value: '75min',
    change: '-5%',
    trend: 'down',
    icon: <Clock size={24} />
  }
];

const mockAgendamentosPorDia: AgendamentoPorDia[] = [
  { data: '2024-01-15', agendamentos: 12, faturamento: 980 },
  { data: '2024-01-16', agendamentos: 8, faturamento: 640 },
  { data: '2024-01-17', agendamentos: 15, faturamento: 1200 },
  { data: '2024-01-18', agendamentos: 10, faturamento: 800 },
  { data: '2024-01-19', agendamentos: 18, faturamento: 1440 },
  { data: '2024-01-20', agendamentos: 14, faturamento: 1120 },
  { data: '2024-01-21', agendamentos: 9, faturamento: 720 }
];

const mockServicosPopulares: ServicoPopular[] = [
  { nome: 'Corte Feminino', quantidade: 45, faturamento: 3600 },
  { nome: 'Escova', quantidade: 38, faturamento: 1900 },
  { nome: 'Manicure', quantidade: 32, faturamento: 800 },
  { nome: 'Coloração', quantidade: 18, faturamento: 2700 },
  { nome: 'Pedicure', quantidade: 25, faturamento: 875 }
];

const periodos = [
  { label: 'Últimos 7 dias', value: '7d' },
  { label: 'Últimos 30 dias', value: '30d' },
  { label: 'Últimos 3 meses', value: '3m' },
  { label: 'Este ano', value: '1y' }
];

export const Relatorio: React.FC = () => {
  const [selectedPeriodo, setSelectedPeriodo] = useState('7d');
  const [showPeriodoDropdown, setShowPeriodoDropdown] = useState(false);

  const selectedPeriodoLabel = periodos.find(p => p.value === selectedPeriodo)?.label || 'Últimos 7 dias';

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return <TrendingUp size={16} />;
    if (trend === 'down') return <TrendingUp size={16} className="rotate-180" />;
    return null;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const maxAgendamentos = Math.max(...mockAgendamentosPorDia.map(d => d.agendamentos));
  const maxFaturamento = Math.max(...mockAgendamentosPorDia.map(d => d.faturamento));

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Relatórios</h1>
        
        {/* Period Selector */}
        <div className="relative">
          <motion.button
            onClick={() => setShowPeriodoDropdown(!showPeriodoDropdown)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <Filter size={16} />
            <span>{selectedPeriodoLabel}</span>
            <ChevronDown size={16} className={`transition-transform ${showPeriodoDropdown ? 'rotate-180' : ''}`} />
          </motion.button>
          
          {showPeriodoDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
            >
              {periodos.map((periodo) => (
                <button
                  key={periodo.value}
                  onClick={() => {
                    setSelectedPeriodo(periodo.value);
                    setShowPeriodoDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    selectedPeriodo === periodo.value ? 'text-primary font-medium' : 'text-gray-700'
                  }`}
                >
                  {periodo.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-4">
        {mockMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-primary">{metric.icon}</div>
              <div className={`flex items-center space-x-1 text-sm ${getTrendColor(metric.trend)}`}>
                {getTrendIcon(metric.trend)}
                <span>{metric.change}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-text mb-1">{metric.value}</div>
            <div className="text-sm text-gray-500">{metric.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-text">Agendamentos por Dia</h2>
        </div>
        
        <div className="space-y-3">
          {mockAgendamentosPorDia.map((dia, index) => (
            <motion.div
              key={dia.data}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3"
            >
              <div className="w-16 text-xs text-gray-500">
                {dayjs(dia.data).format('DD/MM')}
              </div>
              
              <div className="flex-1 space-y-1">
                {/* Agendamentos Bar */}
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(dia.agendamentos / maxAgendamentos) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                  <span className="text-xs text-gray-600">{dia.agendamentos} agend.</span>
                </div>
                
                {/* Faturamento Bar */}
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(dia.faturamento / maxFaturamento) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                      className="h-full bg-green-500 rounded-full"
                    />
                  </div>
                  <span className="text-xs text-gray-600">{formatCurrency(dia.faturamento)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Popular Services */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-text mb-4">Serviços Mais Populares</h2>
        
        <div className="space-y-3">
          {mockServicosPopulares.map((servico, index) => (
            <motion.div
              key={servico.nome}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <div className="font-medium text-text">{servico.nome}</div>
                <div className="text-sm text-gray-500">{servico.quantidade} agendamentos</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-primary">{formatCurrency(servico.faturamento)}</div>
                <div className="text-xs text-gray-500">
                  {formatCurrency(servico.faturamento / servico.quantidade)} média
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};