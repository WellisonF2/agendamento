import { useState } from 'react'
import { useViewport } from './hooks/useViewport'
import { usePWA } from './hooks/usePWA'
import { DesktopBlocker } from './components/DesktopBlocker'
import { PWAInstallBanner } from './components/PWAInstallBanner'

// Import screens
import { Agenda } from './screens/Agenda'
import { Clientes } from './screens/Clientes'
import { Servicos } from './screens/Servicos'
import { Relatorio } from './screens/Relatorio'
import { Configuracoes } from './screens/Configuracoes'
import './App.css'

export type TabType = 'agenda' | 'clientes' | 'servicos' | 'relatorio' | 'configuracoes'

function App() {
  const { isMobile } = useViewport()
  const { isInstalled } = usePWA()
  const [activeTab, setActiveTab] = useState<TabType>('agenda')

  // Bloquear acesso em desktop
  if (!isMobile) {
    return <DesktopBlocker />
  }

  // Show PWA install banner if not installed
  if (!isInstalled) {
    return <PWAInstallBanner />
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'agenda':
        return <Agenda />
      case 'clientes':
        return <Clientes />
      case 'servicos':
        return <Servicos />
      case 'relatorio':
        return <Relatorio />
      case 'configuracoes':
        return <Configuracoes />
      default:
        return <Agenda />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="pb-20">
        {renderActiveScreen()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex justify-around items-center">
          {[
            { id: 'agenda', label: 'Agenda', icon: '📅' },
            { id: 'clientes', label: 'Clientes', icon: '👥' },
            { id: 'servicos', label: 'Serviços', icon: '✂️' },
            { id: 'relatorio', label: 'Relatório', icon: '📊' },
            { id: 'configuracoes', label: 'Config', icon: '⚙️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'text-primary bg-primary/10'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default App
