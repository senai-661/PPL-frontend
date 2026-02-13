const serverURL = `http://localhost:1285/api/motoristas`;

/**
@returns
 */

async function listarMotoristas() {
  const respostaAPI = await fetch(`${serverURL}`);

  if (!respostaAPI.ok) {
    console.error(
      "Erro na requisição: ",
      respostaAPI.status,
      await respostaAPI.text()
    );

    return;
  }

  const jsonMotoristas = await respostaAPI.json();

  return jsonMotoristas;
}

async function montarTabelaMotoristas() {
  const listaDeMotoristas = await listarMotoristas();

  const tbody = document.querySelector("tbody");

  tbody.innerHTML = "";

  listaDeMotoristas.forEach((motorista) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
            <td>${motorista.idMotorista}</td>
            <td>${motorista.cnh}</td>
            <td>${motorista.nomeMotorista} </td>
            <td>${motorista.sobrenomeMotorista}</td>
            <td>${motorista.dataNascimento}</td>
            <td>${motorista.celular}</td>
            <td>${motorista.endereco}</td>
            <td>${motorista.antecedentesCriminais}</td>
            <td>
            </td>
        `;

    tbody.appendChild(tr);

    tr.querySelector(".btn-delete").addEventListener("click", () =>
      alert("deletar")
    );
    tr.querySelector(".btn-edit").addEventListener("click", () =>
      alert("editar")
    );
  });
}