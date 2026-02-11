# Implementação do Google Maps - Guia de Configuração

## 📋 Resumo da Implementação

Foi implementada com sucesso a integração do Google Maps na interface do motorista com as seguintes funcionalidades:

- ✅ Mapa interativo com múltiplos estilos
- ✅ Cálculo automático de rotas
- ✅ Detecção de localização do usuário (Geolocation API)
- ✅ Autocomplete para endereços
- ✅ Informações de distância e tempo estimado
- ✅ Instruções passo a passo
- ✅ Suporte a diferentes modos de viagem (Carro, Transporte, Bicicleta, A pé)
- ✅ Interface responsiva e moderna

## 🔑 Como Obter sua API Key do Google Maps

### Passo 1: Acessar Google Cloud Console
1. Vá para [Google Cloud Console](https://console.cloud.google.com/)
2. Faça login com sua conta Google (crie uma se não tiver)

### Passo 2: Criar um Novo Projeto
1. Clique no dropdown "Select a Project" no topo
2. Clique em "NEW PROJECT"
3. Digite um nome para seu projeto (ex: "Openline Maps")
4. Clique em "CREATE"

### Passo 3: Ativar APIs Necessárias
1. Aguarde o projeto ser criado
2. No menu lateral, clique em "APIs & Services"
3. Clique em "Library"
4. Procure por cada uma destas APIs e ative-as:
   - **Maps JavaScript API**
   - **Directions API**
   - **Places API**
   - **Geocoding API**

Para cada API:
- Clique no nome da API
- Clique em "ENABLE"

### Passo 4: Criar Credenciais (API Key)
1. No menu lateral, clique em "Credentials"
2. Clique em "CREATE CREDENTIALS"
3. Selecione "API Key"
4. Uma janela popup com sua chave irá aparecer
5. Copie a chave (você pode clicar no ícone de cópia)

### Passo 5: Restringir a Chave (Recomendado)
1. Clique na API Key que foi criada
2. Em "Application restrictions", selecione "HTTP referrers (web sites)"
3. Adicione seus domínios (ex: `localhost:*`, seu domínio de produção)
4. Em "API restrictions", selecione as APIs que você habilitou:
   - Maps JavaScript API
   - Directions API
   - Places API
   - Geocoding API
5. Clique em "SAVE"

## 🛠️ Implementação no Seu Projeto

### Arquivo Modificado
- `/pages/Motorista/dashboard-motorista.html` - Adicionado container do mapa, modal de cálculo de rotas e seção de informações

### Novos Arquivos Criados
1. `/CSS/google-maps.css` - Estilos para o mapa e componentes relacionados
2. `/js/google-maps.js` - Toda a lógica de funcionalidade do Google Maps

### Modificar a Chave da API

**No arquivo: `/pages/Motorista/dashboard-motorista.html`**

Procure pela linha:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&libraries=places,directions&language=pt-BR"></script>
```

Substitua `YOUR_API_KEY_HERE` pela sua chave de API obtida no Google Cloud Console:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDSEJ5V_K5X4X4X4X4X4X4X4X4&libraries=places,directions&language=pt-BR"></script>
```

## 🎯 Funcionalidades Implementadas

### 1. Mapa Interativo
- Mapa centralizado em São Paulo (padrão)
- Zoom ajustável
- Múltiplos estilos de visualização (Mapa, Satélite, Híbrido, Terreno)
- Controle de tela cheia
- Vista de rua disponível

### 2. Detecção de Localização
- Pede permissão ao usuário para acessar sua localização GPS
- Mostra marcador azul da localização atual
- Atualiza automaticamente o campo de origem

### 3. Cálculo de Rotas
- Modal para inserir origem e destino
- Autocomplete para sugestões de endereços
- Botão "Usar minha localização"
- Suporte a 4 modos de viagem

### 4. Informações da Rota
- Distância total em km
- Tempo estimado de viagem
- Instruções passo a passo numeradas
- Distância e tempo para cada passo
- Localização atual em tempo real

### 5. Marcadores
- Marcador de localização do usuário (roxo)
- Info windows com detalhes
- Rota destacada em roxo no mapa

## 📱 Responsividade

O mapa se adapta automaticamente para:
- **Desktop**: 500px de altura
- **Tablet**: 350px de altura
- **Mobile**: 250px de altura

## 🚀 Como Usar

1. Acesse a página do Dashboard do Motorista
2. Você verá um mapa grande mostrando a área ao redor de São Paulo
3. O mapa detectará sua localização (se você permitir)
4. Clique em "Calcular Rota" para abrir o modal
5. Digite ou selecione um endereço de partida
6. Digite ou selecione um endereço de destino
7. Escolha o modo de viagem
8. Clique em "Calcular Rota"
9. O mapa mostrará a rota em roxo, e você verá:
   - Distância total
   - Tempo estimado
   - Instruções passo a passo

## 💡 Funcionalidades Extras

### Autocomplete
Tanto o campo de origem quanto o de destino têm autocomplete habilitado. Conforme você digita, sugestões de endereços aparecerão (restrito a Brasil).

### Usar Localização Atual
Há um link "Usar minha localização" abaixo do campo de origem que:
- Detecta sua localização GPS
- Converte as coordenadas em um endereço legível
- Preenche automaticamente o campo

### Múltiplos Modos de Viagem
```
- DRIVING: Rota de carro (recomendado)
- TRANSIT: Transporte público
- WALKING: A pé
- BICYCLING: Bicicleta
```

## ⚠️ Problemas Comuns e Soluções

### "Mapa em branco"
- Verifique se sua API Key está correta
- Verifique se as APIs estão habilitadas no Google Cloud Console
- Verifique se há restrições de domínio na sua chave

### "Erro de permissão de localização"
- Trata-se de um aviso normal do navegador
- O usuário precisa permitir acesso à localização
- O mapa funcionará mesmo sem permitir (usando localização padrão)

### "Autocomplete não funciona"
- Certifique-se de que a API Places está habilitada
- Verifique as restrições de chave na API

### Rotas não aparecem
- Verifique se os endereços estão corretos
- Certifique-se de que a Directions API está habilitada
- Tente endereços brasileiros (a busca está restrita ao Brasil)

## 📊 Estrutura do Código

### Funções Principais (google-maps.js)

```javascript
initMap()                    // Inicializa o mapa
getUserLocation()            // Obtém localização do usuário
calculateRoute()             // Calcula rota entre dois pontos
updateRouteInfo()            // Atualiza informações na sidebar
updateDirectionsSteps()      // Mostra instruções passo a passo
setupAutocomplete()          // Configura autocomplete
useCurrentLocation()         // Usa localização atual como origem
clearRoute()                 // Limpa a rota do mapa
getCustomMapStyle()          // Estilo customizado do mapa
```

## 🎨 Personalização

### Cores do Mapa
Para mudar as cores da rota, edite em `google-maps.js`:

```javascript
polylineOptions: {
    strokeColor: '#5a34a1',      // Cor da linha (roxo)
    strokeOpacity: 0.8,           // Opacidade
    strokeWeight: 4,              // Espessura
}
```

### Zoom Padrão
Para mudar o zoom inicial, edite em `google-maps.js`:

```javascript
zoom: 15,  // Mude este valor (1-21)
```

### Localização Padrão
Para mudar a localização padrão (atualmente São Paulo):

```javascript
currentLocation = { 
    lat: -23.5505,    // Latitude
    lng: -46.6333     // Longitude
};
```

## 🔒 Segurança

- Não compartilhe sua API Key no GitHub ou repositórios públicos
- Use as restrições de domínio para limitar o uso da chave
- Considere usar variáveis de ambiente para a chave em produção

## 📞 Suporte

Para mais informações sobre a Google Maps API:
- [Google Maps Documentation](https://developers.google.com/maps/documentation)
- [Directions API](https://developers.google.com/maps/documentation/directions)
- [Places API](https://developers.google.com/maps/documentation/places)
