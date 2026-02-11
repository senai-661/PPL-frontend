/* ===== MAPA MOTORISTA - FUNCIONALIDADE ===== */

let mapType = 'ROADMAP';
let currentMapInstance = null;

// Inicializar página do mapa
document.addEventListener('DOMContentLoaded', () => {
    initMapPage();
    updateClock();
    setInterval(updateClock, 1000);
});

// Inicializar mapa da página
function initMapPage() {
    const mapOptions = {
        zoom: 15,
        center: { lat: -23.5505, lng: -46.6333 },
        mapTypeControl: true,
        zoomControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: getMapStyles(),
    };

    currentMapInstance = new google.maps.Map(document.querySelector('.mapa-container'), mapOptions);

    // Obter localização do usuário
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                currentMapInstance.setCenter(pos);
                addUserMarkerToMap(pos);
                updateLocationDisplay(pos);
            },
            () => {
                console.log('Erro ao obter localização');
            }
        );
    }

    // Configurar autocomplete
    setupAutocompleteForMap();
}

// Adicionar marcador do usuário ao mapa
function addUserMarkerToMap(location) {
    const userMarker = new google.maps.Marker({
        position: location,
        map: currentMapInstance,
        title: 'Sua localização',
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 14,
            fillColor: '#5a34a1',
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 2,
        },
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div class="marker-info-window">
                <h5>Sua Localização</h5>
                <p><strong>Coordenadas:</strong> ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}</p>
            </div>
        `,
    });

    userMarker.addListener('click', () => {
        infoWindow.open(currentMapInstance, userMarker);
    });
}

// Atualizar display da localização
function updateLocationDisplay(location) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: location }, (results, status) => {
        if (status === 'OK' && results[0]) {
            const addressParts = results[0].address_components;
            const city = addressParts.find(c => c.types.includes('locality'));
            const state = addressParts.find(c => c.types.includes('administrative_area_level_1'));
            
            if (city && state) {
                document.getElementById('currentLocationText').textContent = 
                    `${city.long_name}, ${state.short_name}`;
            }
        }
    });
}

// Atualizar relógio
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('currentTime').textContent = `${hours}:${minutes}`;
}

// Alternar tipo de mapa
function toggleMapType() {
    if (mapType === 'ROADMAP') {
        mapType = 'SATELLITE';
    } else if (mapType === 'SATELLITE') {
        mapType = 'HYBRID';
    } else {
        mapType = 'ROADMAP';
    }
    currentMapInstance.setMapTypeId(mapType);
}

// Centralizar mapa na localização atual
function centerMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            currentMapInstance.setCenter(pos);
            currentMapInstance.setZoom(15);
            addUserMarkerToMap(pos);
            updateLocationDisplay(pos);
        });
    }
}

// Abrir configurações
function openSettings() {
    const settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
    settingsModal.show();
}

// Alternar status online/offline
function toggleOnlineStatus() {
    const statusText = document.getElementById('statusText');
    const checkbox = document.querySelector('.toggle-checkbox');
    
    if (checkbox.checked) {
        statusText.textContent = 'Online';
        statusText.style.color = 'var(--primary)';
    } else {
        statusText.textContent = 'Offline';
        statusText.style.color = '#999';
    }
}

// Aceitar corrida
function acceptRide(rideId) {
    alert(`Corrida ${rideId} aceita! Você será redirecionado para os detalhes.`);
}

// Selecionar corrida
function selectRide(rideId) {
    const rideCards = document.querySelectorAll('.ride-card');
    rideCards.forEach(card => {
        card.style.borderColor = 'var(--border-light)';
        card.style.backgroundColor = 'linear-gradient(135deg, var(--bg-lighter) 0%, white 100%)';
    });
    
    const selectedCard = event.currentTarget;
    selectedCard.style.borderColor = 'var(--primary)';
    selectedCard.style.backgroundColor = 'rgba(90, 52, 161, 0.05)';
}

// Atualizar corridas
function refreshRides() {
    const button = event.currentTarget;
    button.style.transform = 'rotate(180deg)';
    
    setTimeout(() => {
        button.style.transform = 'rotate(0deg)';
    }, 600);
    
    alert('Corridas atualizadas!');
}

// Calcular rota do modal
function calculateRouteFromModal() {
    const origin = document.getElementById('originInput').value;
    const destination = document.getElementById('destinationInput').value;
    const travelMode = document.getElementById('travelMode').value;

    if (!origin || !destination) {
        alert('Por favor, preencha ambos os campos.');
        return;
    }

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
        map: currentMapInstance,
        polylineOptions: {
            strokeColor: '#5a34a1',
            strokeOpacity: 0.8,
            strokeWeight: 5,
        },
    });

    const request = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode[travelMode],
    };

    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
            
            const leg = result.routes[0].legs[0];
            alert(`Rota calculada!\n\nDistância: ${leg.distance.text}\nTempo: ${leg.duration.text}`);
            
            // Fechar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('routeModal'));
            if (modal) modal.hide();
        } else {
            alert('Erro ao calcular rota: ' + status);
        }
    });
}

// Usar localização atual no modal
function useCurrentLocationModal() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: pos }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    document.getElementById('originInput').value = results[0].formatted_address;
                } else {
                    document.getElementById('originInput').value = `${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`;
                }
            });
        });
    }
}

// Configurar autocomplete para inputs
function setupAutocompleteForMap() {
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

    originAutocomplete.addListener('place_changed', () => {
        const place = originAutocomplete.getPlace();
        if (place.geometry) {
            currentMapInstance.setCenter(place.geometry.location);
        }
    });

    destinationAutocomplete.addListener('place_changed', () => {
        const place = destinationAutocomplete.getPlace();
        if (place.geometry) {
            currentMapInstance.setCenter(place.geometry.location);
        }
    });
}

// Estilos customizados do mapa
function getMapStyles() {
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
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#c9b2a6' }],
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#f5f1e6' }],
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#f8c967' }],
        },
        {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [{ color: '#b9d3f5' }],
        },
    ];
}
