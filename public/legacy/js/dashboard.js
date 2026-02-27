/* Dashboard JavaScript */

// Inicialização do Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
    setupEventListeners();
    loadUserPreferences();
});

function initDashboard() {
    // Adicionar listeners aos botões
    const acceptButtons = document.querySelectorAll('.btn-success');
    acceptButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Corrida aceita com sucesso!', 'success');
            this.disabled = true;
            this.textContent = 'Aceita';
            this.style.backgroundColor = '#ccc';
            this.style.cursor = 'not-allowed';
        });
    });

    // Toggle de status online/offline
    const toggleCheckbox = document.querySelector('.toggle-checkbox');
    if (toggleCheckbox) {
        toggleCheckbox.addEventListener('change', function() {
            const statusText = document.querySelector('.status-text');
            if (this.checked) {
                statusText.textContent = 'Online';
                showNotification('Você está online!', 'success');
            } else {
                statusText.textContent = 'Offline';
                showNotification('Você está offline!', 'warning');
            }
        });
    }

    // Animação de cards ao carregar
    animateCardsOnLoad();
}

function setupEventListeners() {
    // Listeners para botões de ação
    const actionButtons = document.querySelectorAll('.trip-action .btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.classList.contains('btn-outline-danger')) {
                showNotification('Cancelamento solicitado', 'warning');
            }
        });
    });

    // Listeners para help cards
    const helpLinks = document.querySelectorAll('.help-link');
    helpLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = '#4a2681';
        });
        link.addEventListener('mouseleave', function() {
            this.style.color = 'var(--primary)';
        });
    });
}

function animateCardsOnLoad() {
    const cards = document.querySelectorAll('.stat-card, .dashboard-card, .help-card, .user-info-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 80);
    });
}

function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        min-width: 300px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        border-radius: 10px;
        border: none;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        padding: 18px;
        border-left: 4px solid;
    `;
    
    if (type === 'success') {
        notification.style.borderLeftColor = '#00b200';
        notification.style.backgroundColor = 'rgba(0, 178, 0, 0.1)';
        notification.style.color = '#00a000';
        notification.innerHTML = '<i class="fas fa-check-circle me-2"></i>' + message;
    } else if (type === 'warning') {
        notification.style.borderLeftColor = '#ff9500';
        notification.style.backgroundColor = 'rgba(255, 149, 0, 0.1)';
        notification.style.color = '#ff7c00';
        notification.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i>' + message;
    } else {
        notification.style.borderLeftColor = '#2196F3';
        notification.style.backgroundColor = 'rgba(33, 150, 243, 0.1)';
        notification.style.color = '#1976D2';
        notification.innerHTML = '<i class="fas fa-info-circle me-2"></i>' + message;
    }
    
    document.body.appendChild(notification);
    
    // Remover após 4 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

function loadUserPreferences() {
    // Carregar preferências do usuário do localStorage
    const userPreferences = localStorage.getItem('userPreferences');
    if (userPreferences) {
        const prefs = JSON.parse(userPreferences);
        // Aplicar preferências salvas
    }
}

function saveUserPreferences() {
    const prefs = {
        theme: document.body.dataset.theme || 'light',
        notifications: document.body.dataset.notifications !== 'false'
    };
    localStorage.setItem('userPreferences', JSON.stringify(prefs));
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Simulação de dados em tempo real (opcional)
function updateStats() {
    // Implementar atualização em tempo real com WebSocket ou AJAX
    console.log('Atualizando estatísticas...');
}

// Atualizar stats a cada 30 segundos
setInterval(updateStats, 30000);

// Auto salvar preferências ao sair
window.addEventListener('beforeunload', saveUserPreferences);

// Monitorar conexão de rede
window.addEventListener('online', function() {
    showNotification('Conexão restaurada!', 'success');
});

window.addEventListener('offline', function() {
    showNotification('Você está offline. Algumas funcionalidades podem estar limitadas.', 'warning');
});
