// Função para formatar data ISO para DD-MM-YYYY
function formatarData(data) {
  // Se for uma string com hora (ISO), pega só a data
  if (typeof data === "string" && data.includes("T")) {
    data = data.split("T")[0];
  }

  // Cria Date a partir da string YYYY-MM-DD ou de objeto Date
  const date = data instanceof Date ? data : new Date(data + "T00:00:00Z");

  // Usa toLocaleDateString para obter formato localizado e substitui '/' por '-'
  // 'pt-BR' produz 'DD/MM/YYYY' — trocamos para 'DD-MM-YYYY'
  const local = date.toLocaleDateString("pt-BR");
  return local.replace(/\//g, "-");
}