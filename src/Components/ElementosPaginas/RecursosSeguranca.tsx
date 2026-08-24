import { Shield, Phone, AlertTriangle, CheckCircle } from 'lucide-react';

export function SafetyResources() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-6">Recursos de Segurança</h1>
          <p className="text-xl text-white/90">
            Ferramentas e recursos para garantir sua segurança em cada viagem
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div>
              <Shield className="size-12 text-[#5a34a1] mb-4" />
              <h2 className="text-3xl mb-4">Compartilhamento de Viagem em Tempo Real</h2>
              <p className="text-lg text-gray-700 mb-4">
                Compartilhe sua localização e detalhes da viagem com amigos e familiares. 
                Eles poderão acompanhar sua rota em tempo real até você chegar ao destino.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Compartilhe via WhatsApp, SMS ou e-mail</li>
                <li>• Atualização automática de localização</li>
                <li>• Informações do motorista e veículo visíveis</li>
              </ul>
            </div>

            <div>
              <Phone className="size-12 text-[#5a34a1] mb-4" />
              <h2 className="text-3xl mb-4">Botão de Emergência</h2>
              <p className="text-lg text-gray-700 mb-4">
                Em caso de emergência, pressione o botão de emergência no app. Isso alertará 
                imediatamente nossa central de segurança e, se necessário, as autoridades.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Acesso rápido durante a viagem</li>
                <li>• Alerta silencioso disponível</li>
                <li>• Gravação automática de áudio</li>
                <li>• Resposta em menos de 30 segundos</li>
              </ul>
            </div>

            <div>
              <CheckCircle className="size-12 text-[#5a34a1] mb-4" />
              <h2 className="text-3xl mb-4">Verificação de Motoristas</h2>
              <p className="text-lg text-gray-700 mb-4">
                Todos os motoristas passam por rigorosa verificação antes de se juntarem à plataforma:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Verificação de antecedentes criminais</li>
                <li>• Verificação de CNH e histórico de direção</li>
                <li>• Treinamento obrigatório em segurança e acessibilidade</li>
                <li>• Avaliação contínua baseada em feedback de passageiros</li>
              </ul>
            </div>

            <div>
              <AlertTriangle className="size-12 text-[#5a34a1] mb-4" />
              <h2 className="text-3xl mb-4">Recursos Adicionais</h2>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <strong className="text-[#5a34a1]">Verificação de PIN:</strong> Confirme que 
                  está entrando no veículo correto verificando o PIN com o motorista
                </li>
                <li>
                  <strong className="text-[#5a34a1]">RideCheck:</strong> Sistema que detecta 
                  paradas inesperadas e verifica se está tudo bem
                </li>
                <li>
                  <strong className="text-[#5a34a1]">Avaliação Bidirecional:</strong> Motoristas 
                  e passageiros se avaliam mutuamente para manter a qualidade
                </li>
                <li>
                  <strong className="text-[#5a34a1]">Suporte 24/7:</strong> Equipe de segurança 
                  disponível a qualquer momento pelo app, telefone ou chat
                </li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
              <h3 className="text-xl mb-3 text-red-900">Em Caso de Emergência</h3>
              <p className="text-red-800 mb-4">
                Se você se sentir em perigo durante uma viagem:
              </p>
              <ol className="space-y-2 text-red-800 list-decimal list-inside">
                <li>Pressione o botão de emergência no app</li>
                <li>Ligue para 190 (Polícia) ou 192 (SAMU) se necessário</li>
                <li>Nossa central de segurança: 0800 123 4567</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
