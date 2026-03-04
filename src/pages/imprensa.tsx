import { Newspaper, Download, Mail } from 'lucide-react';

export function Press() {
  const releases = [
    {
      date: '15 Jan 2026',
      title: 'OpenLine anuncia expansão para 3 novas cidades brasileiras',
      excerpt: 'Empresa de mobilidade acessível chega a Salvador, Fortaleza e Recife no primeiro trimestre de 2026.',
    },
    {
      date: '02 Dez 2025',
      title: 'OpenLine atinge marca de 10 mil viagens acessíveis realizadas',
      excerpt: 'Plataforma celebra marco importante na transformação da mobilidade urbana inclusiva.',
    },
    {
      date: '18 Nov 2025',
      title: 'Prêmio de Inovação Social reconhece impacto da OpenLine',
      excerpt: 'Empresa recebe premiação por contribuição à inclusão e acessibilidade no transporte.',
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-6">Sala de Imprensa</h1>
          <p className="text-xl text-white/90">
            Notícias, comunicados e recursos para a imprensa
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <Newspaper className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Comunicados</h3>
              <p className="text-gray-600">Press releases e notícias oficiais</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <Download className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Kit de Imprensa</h3>
              <p className="text-gray-600">Logos, fotos e materiais gráficos</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <Mail className="size-12 text-[#5a34a1] mx-auto mb-4" />
              <h3 className="text-xl mb-3">Contato</h3>
              <p className="text-gray-600">imprensa@openline.com.br</p>
            </div>
          </div>

          <h2 className="text-3xl mb-8">Últimos Comunicados</h2>
          <div className="space-y-6">
            {releases.map((release, idx) => (
              <article key={idx} className="bg-gray-50 p-6 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">{release.date}</p>
                <h3 className="text-2xl mb-3 text-[#5a34a1]">{release.title}</h3>
                <p className="text-gray-700">{release.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
