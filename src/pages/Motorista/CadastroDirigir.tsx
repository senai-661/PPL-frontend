import { Link } from 'react-router';
import { Car, FileCheck, GraduationCap, CheckCircle } from 'lucide-react';

export function DriveRegistration() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4">Comece a Dirigir com a OpenLine</h1>
          <p className="text-xl text-gray-600">
            Processo simples e transparente para se tornar um motorista parceiro
          </p>
        </div>

        <div className="space-y-8">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-lg shadow-md flex items-start gap-6">
            <div className="bg-[#5a34a1] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <h2 className="text-2xl mb-3 flex items-center gap-2">
                <FileCheck className="size-6 text-[#5a34a1]" />
                Cadastro e Documentação
              </h2>
              <p className="text-gray-700 mb-4">
                Preencha o formulário de cadastro e envie seus documentos para análise.
                Você precisará de CNH válida, certidão de antecedentes criminais e documentos pessoais.
              </p>
              <Link
                to="/motorista/cadastro"
                className="inline-block bg-[#5a34a1] text-white px-6 py-3 rounded-lg hover:bg-[#4a2891] transition-colors"
              >
                Iniciar Cadastro
              </Link>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-lg shadow-md flex items-start gap-6">
            <div className="bg-[#5a34a1] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <h2 className="text-2xl mb-3 flex items-center gap-2">
                <GraduationCap className="size-6 text-[#5a34a1]" />
                Treinamento Obrigatório
              </h2>
              <p className="text-gray-700 mb-4">
                Após aprovação dos documentos, você participará de um treinamento online sobre:
              </p>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li>• Acessibilidade e atendimento a pessoas com deficiência</li>
                <li>• Segurança e direção defensiva</li>
                <li>• Uso do aplicativo OpenLine</li>
                <li>• Políticas e diretrizes da comunidade</li>
              </ul>
              <p className="text-gray-600 text-sm">Duração: aproximadamente 4 horas</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-lg shadow-md flex items-start gap-6">
            <div className="bg-[#5a34a1] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <h2 className="text-2xl mb-3 flex items-center gap-2">
                <Car className="size-6 text-[#5a34a1]" />
                Cadastro do Veículo
              </h2>
              <p className="text-gray-700 mb-4">
                Cadastre seu veículo adaptado na plataforma. O veículo precisa:
              </p>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li>• Ser modelo 2015 ou superior</li>
                <li>• Possuir rampa ou elevador para cadeiras de rodas</li>
                <li>• Estar em boas condições de conservação</li>
                <li>• Ter documentação regularizada</li>
              </ul>
              <Link
                to="/motorista/cadastro-carro"
                className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cadastrar Veículo
              </Link>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-8 rounded-lg shadow-md flex items-start gap-6">
            <div className="bg-[#5a34a1] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0">
              4
            </div>
            <div className="flex-1">
              <h2 className="text-2xl mb-3 flex items-center gap-2">
                <CheckCircle className="size-6 text-[#5a34a1]" />
                Aprovação e Início
              </h2>
              <p className="text-gray-700 mb-4">
                Após a aprovação final, você receberá:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Acesso ao aplicativo do motorista</li>
                <li>• Kit de boas-vindas OpenLine</li>
                <li>• Orientações sobre como começar</li>
                <li>• Suporte dedicado 24/7</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-br from-[#5a34a1] to-[#7c51c9] text-white p-8 rounded-lg text-center">
          <h3 className="text-2xl mb-4">Pronto para começar?</h3>
          <p className="mb-6">
            Junte-se a centenas de motoristas que estão transformando a mobilidade urbana
          </p>
          <Link
            to="/motorista/cadastro"
            className="inline-block bg-white text-[#5a34a1] px-8 py-4 rounded-full hover:bg-gray-100 transition-colors"
          >
            Iniciar Cadastro Agora
          </Link>
        </div>
      </div>
    </div>
  );
}

