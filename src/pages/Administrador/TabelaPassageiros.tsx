import React, { useEffect, useState } from 'react';
import PassageiroRequest from '../../fetch/PassageiroRequest';
import { PassageiroDTO } from '../../interface/PassageiroDTO';

const TabelaPassageiros: React.FC = () => {
	const [passageiros, setPassageiros] = useState<PassageiroDTO[]>([]);
	const [loading, setLoading] = useState(true);
	const [erro, setErro] = useState<string | null>(null);

	useEffect(() => {
		const fetchPassageiros = async () => {
			setLoading(true);
			setErro(null);
			const lista = await PassageiroRequest.listarPassageiros();
			if (lista) {
				setPassageiros(lista);
			} else {
				setErro('Erro ao buscar passageiros');
			}
			setLoading(false);
		};
		fetchPassageiros();
	}, []);

	if (loading) return <div>Carregando passageiros...</div>;
	if (erro) return <div>{erro}</div>;

	return (
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Nome</th>
					<th>Sobrenome</th>
					<th>CPF</th>
					<th>Email</th>
					<th>Celular</th>
				</tr>
			</thead>
			<tbody>
				{passageiros.map((p) => (
					<tr key={p.idPassageiro}>
						<td>{p.idPassageiro}</td>
						<td>{p.nomePassageiro}</td>
						<td>{p.sobrenomePassageiro}</td>
						<td>{p.cpf}</td>
						<td>{p.email}</td>
						<td>{p.celular}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default TabelaPassageiros;
