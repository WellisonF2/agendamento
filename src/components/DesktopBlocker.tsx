import { QRCodeSVG } from 'qrcode.react';

interface DesktopBlockerProps {
  appUrl?: string;
}

export function DesktopBlocker({ appUrl = window.location.href }: DesktopBlockerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📱</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Studio Marli
          </h1>
          <p className="text-gray-600">
            Este app foi feito para celular e tablet
          </p>
        </div>

        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-xl mb-4">
            <QRCodeSVG 
              value={appUrl} 
              size={160}
              className="mx-auto"
              fgColor="#A0144B"
            />
          </div>
          <p className="text-sm text-gray-600">
            Escaneie o QR Code com seu celular
          </p>
        </div>

        <div className="space-y-4 text-left">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">📱 No iPhone/iPad:</h3>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Abra no Safari</li>
              <li>2. Toque no ícone de compartilhar</li>
              <li>3. Selecione "Adicionar à Tela Inicial"</li>
            </ol>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">🤖 No Android:</h3>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Abra no Chrome</li>
              <li>2. Toque nos 3 pontos (menu)</li>
              <li>3. Selecione "Instalar app"</li>
            </ol>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Para a melhor experiência, use o app instalado no seu dispositivo móvel
          </p>
        </div>
      </div>
    </div>
  );
}