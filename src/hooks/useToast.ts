// Re-exporta o hook do context centralizado.
// Todos os componentes que importam de 'hooks/useToast' continuam funcionando sem alteração.
export { useToast } from '../context/ToastContext';