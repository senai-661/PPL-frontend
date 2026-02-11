# 🗺️ Página Mapa em Tempo Real - Motorista

## 📱 Visão Geral

Implementei uma página de mapa em tempo real estilo **Uber** para o motorista, com interface intuitiva e funcionalidades completas de navegação e gerenciamento de corridas.

## 🎯 Endereço da Página

**URL:** `/pages/Motorista/mapa-motorista.html`

**Acesso rápido:** Dashboard → "Mapa em Tempo Real"

## ✨ Funcionalidades

### 🗺️ Mapa Interativo
- ✅ Mapa em tempo real com múltiplos tipos (Estrada, Satélite, Híbrido)
- ✅ Botão para alternar tipos de visualização
- ✅ Zoom, pan e navegação completa
- ✅ Localização automática do GPS
- ✅ Botão "Minha Localização" para centralizar mapa

### 🚗 Corridas Disponíveis
- ✅ Sidebar esquerdo com lista de corridas
- ✅ Cards com tempo de espera, preço e passageiro
- ✅ Rating do passageiro
- ✅ Botão "Aceitar" para cada corrida
- ✅ Atualizar corridas em tempo real

### 📊 Informações Laterais (Sidebar direito)
- ✅ Toggle Online/Offline
- ✅ Estatísticas rápidas (Corridas, Nota, Ganhos)
- ✅ Ações rápidas (Calcular Rota, Tipo Mapa, Localização, Config)
- ✅ Ganhos do dia com detalhes
- ✅ Configurações (Notificações, Som, Modo Escuro)

### 🧭 Barra Superior
- ✅ Localização atual atualizada
- ✅ Relógio em tempo real
- ✅ Design minimalista e não intrusivo

## 🎨 Design

### Layout
```
┌─────────────────────────────────────────┐
│         Navbar (Openline)               │
├─────────────────────────────────────────┤
│ Sidebar │          MAPA          │ Sidebar │
│ Esquerdo│     (Principal)        │ Direito │
│ (Rides) │                        │ (Status)│
│         │                        │         │
│         │  [Localização]         │         │
│         │     [Horário]          │         │
│         │                        │         │
└─────────────────────────────────────────┘
```

### Cores e Estilos
- **Cor Primária:** Roxo (#5a34a1)
- **Fundo:** Branco limpo
- **Sombras:** Suaves e modernas
- **Animações:** Suaves e responsivas

## 📱 Responsividade

| Breakpoint | Comportamento |
|-----------|--------------|
| **Desktop** | Sidebars fixos, mapa central |
| **Tablet (1024px)** | Sidebars reduzidos |
| **Mobile (768px)** | Sidebar esquerdo flutuante inferior |
| **Mobile Small (480px)** | Interface compacta, altura reduzida |

## 🔑 API Google Maps

A página utiliza as mesmas APIs do Google Maps:

```javascript
// Scripts necessários:
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&libraries=places,directions&language=pt-BR"></script>
<script src="../../js/google-maps.js"></script>
<script src="../../js/mapa-motorista.js"></script>
```

**Lembre-se:** Substitua `YOUR_API_KEY_HERE` por sua chave real!

## 🎯 Funcionalidades por Seção

### Sidebar Esquerdo (Corridas)
```javascript
acceptRide(rideId)      // Aceitar uma corrida
selectRide(rideId)      // Selecionar/destacar uma corrida
refreshRides()          // Atualizar lista de corridas
```

### Sidebar Direito (Status)
```javascript
toggleOnlineStatus()    // Ativar/desativar modo online
toggleMapType()         // Alternar tipo de mapa
centerMap()            // Centralizar no GPS
openSettings()         // Abrir configurações
```

### Modal de Rotas
```javascript
calculateRouteFromModal()  // Calcular rota
useCurrentLocationModal()  // Usar GPS como origem
```

## 📁 Arquivos Criados/Modificados

```
✓ pages/Motorista/mapa-motorista.html (novo)
✓ CSS/mapa-motorista.css (novo)
✓ js/mapa-motorista.js (novo)
✓ pages/Motorista/dashboard-motorista.html (link adicionado)
```

## 🚀 Como Usar

### 1. Acessar a Página
- Abra o Dashboard do Motorista
- Clique em "Mapa em Tempo Real" (Ações Rápidas)
- Ou acesse diretamente: `/pages/Motorista/mapa-motorista.html`

### 2. Permitir Localização
- O navegador pedirá permissão para acessar sua localização
- Clique em "Permitir" para ver seu marcador no mapa

### 3. Ver Corridas Disponíveis
- As corridas aparecem no sidebar esquerdo
- Clique em uma corrida para selecioná-la
- Clique em "Aceitar" para pegar a corrida

### 4. Calcular Rotas
- Clique em "Calcular Rota" (botão no sidebar direito)
- Digite origem e destino
- Selecione modo de viagem
- Clique em "Calcular Rota"

### 5. Gerenciar Status
- Use o toggle Online/Offline para mudar disponibilidade
- Veja seus ganhos do dia
- Configure notificações e preferências

## ⌨️ Atalhos de Teclado / Botões

| Botão | Função |
|-------|--------|
| 🔄 (Refresh) | Atualizar corridas |
| 🗺️ (Tipo Mapa) | Alternar Estrada/Satélite/Híbrido |
| 📍 (Localização) | Centralizar no GPS |
| ⚙️ (Config) | Abrir configurações |
| 🛣️ (Calcular Rota) | Abrir modal de rotas |

## 💡 Dicas Úteis

1. **Localização em Tempo Real:** Clique no botão 📍 sempre que precisar se recentrar
2. **Tipos de Mapa:** Use o satélite para ver a área com mais detalhes
3. **Modo Offline:** Mude seu status para Offline quando terminar de trabalhar
4. **Notificações:** Ative sons para não perder novas corridas
5. **Ganhos:** Veja quanto ganhou hoje em tempo real

## 🔧 Customização

### Mudar Cores
Edite `/CSS/mapa-motorista.css`:
```css
/* Cor primária */
--primary: #5a34a1;
```

### Mudar Localização Padrão
Edite `/js/mapa-motorista.js`:
```javascript
center: { lat: -23.5505, lng: -46.6333 } // São Paulo
```

### Adicionar Mais Corridas
Duplique um `.ride-card` no HTML e adicione os dados

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| Mapa em branco | Verifique API Key |
| Localização não funciona | Verifique permissões do navegador |
| Autocomplete não aparece | Certifique-se API Places está habilitada |
| Mapas não carregam tipo | Verifique Maps JavaScript API |

## 📞 Suporte

Para mais informações sobre integração:
- Consulte `GOOGLE_MAPS_SETUP.md`
- Verifique `GOOGLE_MAPS_QUICKSTART.md`
- Veja documentação Google Maps: https://developers.google.com/maps

---

**Pronto para usar! 🚀 Aproveite o mapa em tempo real no estilo Uber!**
