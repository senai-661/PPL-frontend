import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function TripRating() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const trip = {
    id: '1234',
    driver: 'João Silva',
    date: 'Hoje, 10:30',
    from: 'Av. Paulista, 1000',
    to: 'Shopping Center',
    value: 'R$ 25,00',
  };

  const tags = [
    'Motorista educado',
    'Veículo limpo',
    'Direção segura',
    'Pontual',
    'Prestativo',
    'Boa conversa',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Avaliação enviada com sucesso!');
    navigate('/passageiro/painel');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#5a34a1] to-[#7c51c9] text-white p-8 text-center">
            <ThumbsUp className="size-16 mx-auto mb-4" />
            <h1 className="text-3xl mb-2">Como foi sua viagem?</h1>
            <p className="text-white/80">Sua opinião nos ajuda a melhorar</p>
          </div>

          {/* Trip Info */}
          <div className="p-6 border-b bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Viagem #{trip.id}</p>
                <p className="text-lg">Motorista: {trip.driver}</p>
                <p className="text-sm text-gray-600">{trip.date}</p>
              </div>
              <p className="text-2xl text-[#5a34a1]">{trip.value}</p>
            </div>
            <p className="text-sm text-gray-600">
              {trip.from} → {trip.to}
            </p>
          </div>

          {/* Rating Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-8">
              <h2 className="text-xl mb-4 text-center">Avalie sua experiência</h2>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`size-12 ${
                        star <= rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center mt-2 text-gray-600">
                  {rating === 5 && 'Excelente!'}
                  {rating === 4 && 'Muito bom!'}
                  {rating === 3 && 'Bom'}
                  {rating === 2 && 'Regular'}
                  {rating === 1 && 'Precisa melhorar'}
                </p>
              )}
            </div>

            {rating > 0 && (
              <>
                <div className="mb-8">
                  <h3 className="text-lg mb-4">O que você achou? (opcional)</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-[#5a34a1] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg mb-4 flex items-center gap-2">
                    <MessageSquare className="size-5" />
                    Comentário (opcional)
                  </h3>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1] resize-none"
                    rows={4}
                    placeholder="Conte-nos mais sobre sua experiência..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#5a34a1] text-white py-3 rounded-lg hover:bg-[#4a2891] transition-colors"
                >
                  Enviar Avaliação
                </button>
              </>
            )}

            {rating === 0 && (
              <p className="text-center text-gray-500">
                Selecione uma avaliação acima para continuar
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
