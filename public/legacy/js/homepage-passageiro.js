// homepage-passageiro.js
// Lógica do mapa e requisição de viagem para o passageiro

let map, directionsService, directionsRenderer, autocompleteOrigem, autocompleteDestino;

function initPassengerMap() {
    // Inicializa o mapa centralizado em uma localização padrão (ex: São Paulo)
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -23.55052, lng: -46.633308 },
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: false
    });

    // Autocomplete para origem e destino
    autocompleteOrigem = new google.maps.places.Autocomplete(
        document.getElementById('inputOrigem'),
        { types: ['geocode'] }
    );
    autocompleteDestino = new google.maps.places.Autocomplete(
        document.getElementById('inputDestino'),
        { types: ['geocode'] }
    );
}

function calcularRotaPassageiro(event) {
    event.preventDefault();
    const origem = document.getElementById('inputOrigem').value;
    const destino = document.getElementById('inputDestino').value;
    if (!origem || !destino) {
        mostrarInfoViagem('Por favor, preencha origem e destino.');
        return;
    }
    directionsService.route({
        origin: origem,
        destination: destino,
        travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
            const distancia = response.routes[0].legs[0].distance.text;
            const duracao = response.routes[0].legs[0].duration.text;
            const preco = calcularPrecoViagem(response.routes[0].legs[0].distance.value);
            mostrarInfoViagem(`Distância: ${distancia}<br>Duração: ${duracao}<br><strong>Preço estimado: R$ ${preco}</strong>`);
        } else {
            mostrarInfoViagem('Não foi possível calcular a rota.');
        }
    });
}

function calcularPrecoViagem(distanciaMetros) {
    // Exemplo: preço base + preço por km
    const precoBase = 5.00;
    const precoPorKm = 2.50;
    const km = distanciaMetros / 1000;
    return (precoBase + precoPorKm * km).toFixed(2);
}

function mostrarInfoViagem(html) {
    document.getElementById('rideInfo').innerHTML = html;
}

// Histórico de viagens (mock)
const historicoViagens = [
    { origem: 'Av. Paulista, 1000', destino: 'Rua Augusta, 1500', data: '2024-06-01', status: 'Concluída' },
    { origem: 'Shopping Morumbi', destino: 'Aeroporto de Congonhas', data: '2024-05-28', status: 'Concluída' },
    { origem: 'Estação Sé', destino: 'Parque Ibirapuera', data: '2024-05-20', status: 'Cancelada' }
];

function renderizarHistoricoViagens() {
    const lista = document.getElementById('rideHistoryList');
    lista.innerHTML = '';
    historicoViagens.forEach(v => {
        const item = document.createElement('li');
        item.className = 'list-group-item';
        item.innerHTML = `<strong>${v.origem}</strong> → <strong>${v.destino}</strong><br><small>${v.data} - ${v.status}</small>`;
        lista.appendChild(item);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    renderizarHistoricoViagens();
    document.getElementById('rideRequestForm').addEventListener('submit', calcularRotaPassageiro);
});

// A função initPassengerMap deve ser chamada pelo callback do script do Google Maps
window.initPassengerMap = initPassengerMap;
