import React, { useEffect, useState } from 'react';
import CarroRequest from '../../fetch/CarroRequest';
import { VeiculoDTO } from '../../interface/VeiculoDTO';

const TabelaCarros: React.FC = () => {
	const [carros, setCarros] = useState<VeiculoDTO[]>([]);
	const [loading, setLoading] = useState(true);
	const [erro, setErro] = useState<string | null>(null);

	useEffect(() => {
		const fetchCarros = async () => {
			setLoading(true);
			setErro(null);
			const lista = await CarroRequest.listarCarros();
			if (lista) {
				setCarros(Array.isArray(lista) ? lista : [lista]);
			} else {
				setErro('Erro ao buscar carros');
			}
			setLoading(false);
		};
		fetchCarros();
	}, []);

	if (loading) return <div>Carregando carros...</div>;
	if (erro) return <div>{erro}</div>;

	return (
		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Placa</th>
					<th>Tipo</th>
					<th>Modelo</th>
					<th>ID Motorista</th>
				</tr>
			</thead>
			<tbody>
				{carros.map((c) => (
					<tr key={c.idVeiculo}>
						<td>{c.idVeiculo}</td>
						<td>{c.placa}</td>
						<td>{c.tipoVeiculo}</td>
						<td>{c.modeloVeiculo}</td>
						<td>{c.idMotorista}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default TabelaCarros;
