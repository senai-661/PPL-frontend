import { useState } from 'react';
import { User, Mail, Phone, FileText, Upload } from 'lucide-react';

export function DriverRegistration() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    cnh: '',
    address: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-4">Cadastro de Motorista</h1>
          <p className="text-gray-600">Preencha suas informações para se tornar um parceiro OpenLine</p>
        </div>

        {/* Steps Progress */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                s <= step ? 'bg-[#5a34a1] text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`w-20 h-1 ${s < step ? 'bg-[#5a34a1]' : 'bg-gray-300'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl mb-6">Dados Pessoais</h2>
                
                <div>
                  <label className="block text-gray-700 mb-2">Nome Completo *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                      placeholder="Seu nome completo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">E-mail *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Telefone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                      placeholder="(11) 98765-4321"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">CPF *</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                    <input
                      type="text"
                      required
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl mb-6">Documentação</h2>
                
                <div>
                  <label className="block text-gray-700 mb-2">Número da CNH *</label>
                  <input
                    type="text"
                    required
                    value={formData.cnh}
                    onChange={(e) => setFormData({ ...formData, cnh: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
                    placeholder="00000000000"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Upload da CNH (frente) *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#5a34a1] transition-colors cursor-pointer">
                    <Upload className="size-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Clique para fazer upload ou arraste o arquivo</p>
                    <input type="file" className="hidden" accept="image/*" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Upload da CNH (verso) *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#5a34a1] transition-colors cursor-pointer">
                    <Upload className="size-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Clique para fazer upload ou arraste o arquivo</p>
                    <input type="file" className="hidden" accept="image/*" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Certidão de Antecedentes Criminais *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#5a34a1] transition-colors cursor-pointer">
                    <Upload className="size-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Clique para fazer upload ou arraste o arquivo</p>
                    <input type="file" className="hidden" accept="image/*,.pdf" />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-8">
                <div className="bg-green-100 text-green-800 p-6 rounded-lg mb-6">
                  <h2 className="text-2xl mb-2">Cadastro Enviado!</h2>
                  <p>Sua solicitação foi recebida e está em análise. Entraremos em contato em até 48 horas.</p>
                </div>
                <p className="text-gray-600 mb-4">Próximos passos:</p>
                <ul className="text-left max-w-md mx-auto space-y-2 text-gray-700">
                  <li>✓ Análise de documentos (24-48h)</li>
                  <li>✓ Verificação de antecedentes</li>
                  <li>✓ Treinamento online obrigatório</li>
                  <li>✓ Cadastro do veículo</li>
                  <li>✓ Aprovação final</li>
                </ul>
              </div>
            )}

            {step < 3 && (
              <div className="flex gap-4 mt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Voltar
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 bg-[#5a34a1] text-white py-3 rounded-lg hover:bg-[#4a2891] transition-colors"
                >
                  {step === 2 ? 'Finalizar Cadastro' : 'Continuar'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
