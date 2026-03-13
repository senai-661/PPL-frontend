import React, { useEffect, useState } from 'react';
import MotoristaRequest from '../../fetch/MotoristaRequest';
import { MotoristaDTO } from '../../interface/MotoristaDTO';

const TabelaMotoristas: React.FC = () => {
	const [motoristas, setMotoristas] = useState<MotoristaDTO[]>([]);
	const [loading, setLoading] = useState(true);
	const [erro, setErro] = useState<string | null>(null);

	useEffect(() => {
		const fetchMotoristas = async () => {
			setLoading(true);
			setErro(null);
			const lista = await MotoristaRequest.listarMotoristas();
			if (lista) {
				setMotoristas(lista);
			} else {
				setErro('Erro ao buscar motoristas');
			}
			setLoading(false);
		};
		fetchMotoristas();
	}, []);

	if (loading) return <div>Carregando motoristas...</div>;
	if (erro) return <div>{erro}</div>;

	return (
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Nome</th>
					<th>Sobrenome</th>
					<th>CPF</th>
					<th>CNH</th>
					<th>Email</th>
					<th>Celular</th>
				</tr>
			</thead>
			<tbody>
				{motoristas.map((m) => (
					<tr key={m.idMotorista}>
						<td>{m.idMotorista}</td>
						<td>{m.nomeMotorista}</td>
						<td>{m.sobrenomeMotorista}</td>
						<td>{m.cpf}</td>
						<td>{m.cnh}</td>
						<td>{m.email}</td>
						<td>{m.celular}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default TabelaMotoristas;
