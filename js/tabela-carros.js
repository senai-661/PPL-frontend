const serverURL = `http://localhost:1285/api/veiculos`;

async function listarCarros() {
	const respostaAPI = await fetch(`${serverURL}`);

	if (!respostaAPI.ok) {
		console.error(
			"Erro na requisição: ",
			respostaAPI.status,
			await respostaAPI.text()
		);
		return;
	}

	const jsonCarros = await respostaAPI.json();
	return jsonCarros;
}

async function montarTabelaCarros() {
	const listaDeCarros = await listarCarros();
	const tbody = document.querySelector("tbody");
	tbody.innerHTML = "";
	listaDeCarros.forEach((carro) => {
		const tr = document.createElement("tr");
		tr.innerHTML = `
			<td>${carro.id_veiculo}</td>
			<td>${carro.id_motorista}</td>
			<td>${carro.placa}</td>
			<td>${carro.tipo_veiculo}</td>
			<td>${carro.modelo_veiculo}</td>
			<td>${carro.data_aquisicao ? carro.data_aquisicao : ''}</td>
		`;
		tbody.appendChild(tr);
		// Adicione eventos aos botões se necessário
	});
}

// Chame montarTabelaCarros ao carregar a página
document.addEventListener("DOMContentLoaded", montarTabelaCarros);
