const serverURL = `http://localhost:1285/api/passageiros`;

async function listarPassageiros() {
	const respostaAPI = await fetch(`${serverURL}`);

	if (!respostaAPI.ok) {
		console.error(
			"Erro na requisição: ",
			respostaAPI.status,
			await respostaAPI.text()
		);
		return;
	}

	const jsonPassageiros = await respostaAPI.json();
	return jsonPassageiros;
}

async function montarTabelaPassageiros() {
	const listaDePassageiros = await listarPassageiros();
	const tbody = document.querySelector("tbody");
	tbody.innerHTML = "";
	listaDePassageiros.forEach((passageiro) => {
		const tr = document.createElement("tr");
		tr.innerHTML = `
			<td>${passageiro.idPassageiro}</td>
			<td>${passageiro.cpf}</td>
			<td>${passageiro.nompassageiro}</td>
			<td>${passageiro.sobrenomePassageiro}</td>
			<td>${passageiro.dataNascimento}</td>
			<td>${passageiro.endereco}</td>
			<td>${passageiro.email}</td>
			<td>${passageiro.celular}</td>
			<td></td>
		`;
		tbody.appendChild(tr);
		// Adicione eventos aos botões se necessário
	});
}

// Chame montarTabelaPassageiros ao carregar a página
document.addEventListener("DOMContentLoaded", montarTabelaPassageiros);
