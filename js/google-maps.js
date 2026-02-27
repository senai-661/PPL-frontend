/* ===== GOOGLE MAPS FUNCTIONALITY ===== */

let map;
let directionsService;
let directionsRenderer;
let geolocationService;
let placesService;
let currentLocation = { lat: -23.5505, lng: -46.6333 }; // São Paulo por padrão
let userMarker;
let currentRoute = null;

// Inicializar o mapa
function initMap() {
    // Configuração do mapa
    const mapOptions = {
        zoom: 15,
        center: currentLocation,
        mapTypeControl: true,
        zoomControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: getCustomMapStyle(),
    };

    // Criar mapa
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Inicializar serviços
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        panel: null,
        polylineOptions: {
            strokeColor: '#5a34a1',
            strokeOpacity: 0.8,
            strokeWeight: 4,
        },
    });

    placesService = new google.maps.places.PlacesService(map);

    // Adicionar marcador da localização do usuário
    addUserMarker(currentLocation);

    // Obter localização do usuário
    getUserLocation();

    // Configurar autocomplete nos campos de entrada
    setupAutocomplete();

    // Adicionar listeners
    setupMapListeners();
}

// Obter localização do usuário via Geolocation API
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                currentLocation = pos;
                map.setCenter(pos);
                updateUserMarker(pos);
                updateCurrentLocationDisplay(pos);
                updateOriginInput(pos);
            },
            () => {
                console.log('Erro ao obter localização. Usando padrão (São Paulo).');
                updateCurrentLocationDisplay(currentLocation);
            }
        );
    }
}

// Adicionar marcador do usuário
function addUserMarker(location) {
    if (userMarker) {
        userMarker.setMap(null);
    }

    userMarker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'Sua localização',
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: '#5a34a1',
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 2,
        },
    });

    // Info window para o marcador do usuário
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div class="marker-info-window">
                <h5>Sua Localização</h5>
                <p><strong>Coordenadas:</strong> ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}</p>
            </div>
        `,
    });

    userMarker.addListener('click', () => {
        infoWindow.open(map, userMarker);
    });
}

// Atualizar marcador do usuário
function updateUserMarker(location) {
    if (userMarker) {
        userMarker.setPosition(location);
    } else {
        addUserMarker(location);
    }
}

// Usar localização atual como ponto de partida
function useCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            currentLocation = pos;

            // Converter coordenadas em endereço
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: pos }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    document.getElementById('originInput').value = results[0].formatted_address;
                } else {
                    document.getElementById('originInput').value = `${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`;
                }
            });
        });
    } else {
        alert('Geolocalização não suportada neste navegador.');
    }
}

// Calcular rota
function calculateRoute() {
    const origin = document.getElementById('originInput').value;
    const destination = document.getElementById('destinationInput').value;
    const travelMode = document.getElementById('travelMode').value;

    if (!origin || !destination) {
        alert('Por favor, preencha ambos os campos de origem e destino.');
        return;
    }

    const request = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode[travelMode],
        avoidHighways: false,
        avoidTolls: false,
    };

    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
            currentRoute = result;

            // Atualizar informações da rota
            updateRouteInfo(result);

            // Fechar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('routeModal'));
            if (modal) modal.hide();
        } else {
            alert(
                'Rota não encontrada. Verifique os endereços informados. Erro: ' + status
            );
        }
    });
}

// Atualizar informações da rota
function updateRouteInfo(result) {
    const leg = result.routes[0].legs[0];

    // Atualizar distância e duração
    document.getElementById('routeDistance').textContent = leg.distance.text;
    document.getElementById('routeDuration').textContent = leg.duration.text;

    // Atualizar endereços
    document.getElementById('originInput').value = leg.start_address;
    document.getElementById('destinationInput').value = leg.end_address;

    // Atualizar passos
    updateDirectionsSteps(leg.steps);

    // Centralize o mapa na rota
    const bounds = new google.maps.LatLngBounds();
    leg.start_location && bounds.extend(leg.start_location);
    leg.end_location && bounds.extend(leg.end_location);
    map.fitBounds(bounds);
}

// Atualizar passos de direção
function updateDirectionsSteps(steps) {
    const stepsContainer = document.getElementById('directionsSteps');
    stepsContainer.innerHTML = '';

    steps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-item';
        stepDiv.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                <span class="step-number">${index + 1}</span>
                <div style="flex: 1;">
                    <div class="step-instruction">${step.instructions}</div>
                    <div class="step-distance">
                        <i class="fas fa-arrows-left-right me-1"></i>${step.distance.text}
                        <span style="color: var(--text-secondary); margin-left: 1rem;">
                            <i class="fas fa-hourglass-end me-1"></i>${step.duration.text}
                        </span>
                    </div>
                </div>
            </div>
        `;
        stepsContainer.appendChild(stepDiv);
    });
}

// Configurar Autocomplete
function setupAutocomplete() {
    const originInput = document.getElementById('originInput');
    const destinationInput = document.getElementById('destinationInput');

    const originAutocomplete = new google.maps.places.Autocomplete(originInput, {
        componentRestrictions: { country: 'br' },
        types: ['geocode'],
    });

    const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput, {
        componentRestrictions: { country: 'br' },
        types: ['geocode'],
    });

    // Listener para origem
    originAutocomplete.addListener('place_changed', () => {
        const place = originAutocomplete.getPlace();
        if (place.geometry) {
            map.setCenter(place.geometry.location);
            map.setZoom(15);
        }
    });

    // Listener para destino
    destinationAutocomplete.addListener('place_changed', () => {
        const place = destinationAutocomplete.getPlace();
        if (place.geometry) {
            map.setCenter(place.geometry.location);
        }
    });
}

// Configurar listeners do mapa
function setupMapListeners() {
    // Click no mapa para adicionar marcador de destino
    map.addListener('click', (mapsMouseEvent) => {
        // Não adicionar marcador na primeira vez (deixar para autocomplete)
        console.log('Clique no mapa:', mapsMouseEvent.latLng);
    });

    // Atualizar localização na sideBar quando o mapa é movido
    map.addListener('center_changed', () => {
        const center = map.getCenter();
        updateCurrentLocationDisplay(center);
    });
}

// Atualizar display da localização atual
function updateCurrentLocationDisplay(location) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: location }, (results, status) => {
        if (status === 'OK' && results[0]) {
            document.getElementById('currentLocation').textContent = results[0].address_components[0].long_name + ', ' + results[0].address_components[results[0].address_components.length - 2].long_name;
        } else {
            document.getElementById('currentLocation').textContent = `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
        }
    });
}

// Atualizar campo de origem com endereço
function updateOriginInput(location) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: location }, (results, status) => {
        if (status === 'OK' && results[0]) {
            document.getElementById('originInput').value = results[0].formatted_address;
        }
    });
}

// Estilo customizado do mapa
function getCustomMapStyle() {
    return [
        {
            elementType: 'geometry',
            stylers: [{ color: '#ebe3cd' }],
        },
        {
            elementType: 'labels.text.fill',
            stylers: [{ color: '#523735' }],
        },
        {
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#f5f1e6' }],
        },
        {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#c9b2a6' }],
        },
        {
            featureType: 'administrative.land_parcel',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#dcd2be' }],
        },
        {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#ae9e90' }],
        },
        {
            featureType: 'landscape.natural',
            elementType: 'geometry',
            stylers: [{ color: '#ddf5ff' }],
        },
        {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{ color: '#dcd2be' }],
        },
        {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9e5f6b' }],
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [{ color: '#a5c45d' }],
        },
        {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#447530' }],
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#f5f1e6' }],
        },
        {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [{ color: '#fdfcf8' }],
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#f8c967' }],
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#e9bc62' }],
        },
        {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry',
            stylers: [{ color: '#e98d58' }],
        },
        {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#db8555' }],
        },
        {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#806b63' }],
        },
        {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [{ color: '#dcd2be' }],
        },
        {
            featureType: 'transit.line',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#8f7d77' }],
        },
        {
            featureType: 'transit.line',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#ebe3cd' }],
        },
        {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [{ color: '#dcd2be' }],
        },
        {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [{ color: '#b9d3f5' }],
        },
        {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#92998d' }],
        },
    ];
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('map')) {
        initMap();
    }
});

// Função para exportar rota (opcional)
function exportRoute() {
    if (!currentRoute) {
        alert('Nenhuma rota calculada ainda.');
        return;
    }

    const leg = currentRoute.routes[0].legs[0];
    const routeData = {
        origem: leg.start_address,
        destino: leg.end_address,
        distancia: leg.distance.text,
        duracao: leg.duration.text,
        data: new Date().toLocaleString('pt-BR'),
    };

    console.log('Dados da rota:', routeData);
    alert('Rota exportada! Verifique o console para os detalhes.');
}

// Função para limpar rota
function clearRoute() {
    directionsRenderer.setDirections({ routes: [] });
    document.getElementById('directionsSteps').innerHTML = '<p class="text-muted">Calcule uma rota para ver as instruções</p>';
    document.getElementById('routeDistance').textContent = '--';
    document.getElementById('routeDuration').textContent = '--';
    document.getElementById('originInput').value = '';
    document.getElementById('destinationInput').value = '';
    currentRoute = null;
}
