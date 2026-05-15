import { MapPin, Check } from 'lucide-react';

export function Cities() {
  const cities = [
    { name: 'São Paulo', state: 'SP', active: true },
    { name: 'Rio de Janeiro', state: 'RJ', active: true },
    { name: 'Brasília', state: 'DF', active: true },
    { name: 'Belo Horizonte', state: 'MG', active: true },
    { name: 'Curitiba', state: 'PR', active: true },
    { name: 'Porto Alegre', state: 'RS', active: true },
    { name: 'Salvador', state: 'BA', active: false },
    { name: 'Fortaleza', state: 'CE', active: false },
    { name: 'Recife', state: 'PE', active: false },
  ];

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-6">Cidades Atendidas</h1>
          <p className="text-xl text-white/90">
            A OpenLine está expandindo para levar acessibilidade a todo o Brasil
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl mb-8">Cidades com OpenLine Disponível</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {cities.filter(c => c.active).map((city, idx) => (
              <div key={idx} className="bg-gradient-to-br from-[#5a34a1] to-[#7c51c9] text-white p-6 rounded-lg">
                <Check className="size-8 mb-4" />
                <h3 className="text-2xl mb-2">{city.name}</h3>
                <p className="text-white/80">{city.state}</p>
              </div>
            ))}
          </div>

          <h2 className="text-3xl mb-8">Em Breve</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {cities.filter(c => !c.active).map((city, idx) => (
              <div key={idx} className="bg-gray-100 p-6 rounded-lg">
                <MapPin className="size-8 text-gray-400 mb-4" />
                <h3 className="text-2xl mb-2">{city.name}</h3>
                <p className="text-gray-600">{city.state}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
