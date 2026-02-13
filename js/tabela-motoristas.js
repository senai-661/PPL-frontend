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
            <td>${motorista.id_motorista}</td>
            <td>${motorista.cnh}</td>
            <td>${motorista.nome_motorista} </td>
            <td>${motorista.sobrenome_motorista}</td>
            <td>${motorista.data_nascimento}</td>
            <td>${motorista.celular}</td>
            <td>${motorista.endereco}</td>
            <td>${motorista.antecedentes_criminais}</td>
            <td>
                <img src='/assets/delete_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png' alt='remover' class='btn-delete'/>
                <img src='/assets/edit_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.png' alt='editar' class='btn-edit'/>
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