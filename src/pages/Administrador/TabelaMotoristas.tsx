import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';

type DriverRecord = Record<string, unknown>;

const DRIVER_ENDPOINT = 'http://localhost:1285/api/motoristas';

const extractDrivers = (payload: unknown): DriverRecord[] | null => {
  if (Array.isArray(payload)) {
    return payload as DriverRecord[];
  }

  if (payload && typeof payload === 'object') {
    const objectPayload = payload as Record<string, unknown>;
    const candidates = [
      objectPayload.motoristas,
      objectPayload.data,
      objectPayload.results,
    ];
    const arrayCandidate = candidates.find((value) => Array.isArray(value));

    if (arrayCandidate) {
      return arrayCandidate as DriverRecord[];
    }
  }

  return null;
};

const getDriverValue = (driver: DriverRecord, keys: string[], fallback = '-') => {
  for (const key of keys) {
    const value = driver[key];
    if (value !== null && value !== undefined) {
      const normalized = String(value).trim();
      if (normalized !== '') {
        return normalized;
      }
    }
  }

  return fallback;
};

const normalizeBackgroundCheck = (value: string) => {
  const normalized = value.toLowerCase();
  if (normalized === 'true' || normalized === '1' || normalized === 'sim') return 'Sim';
  if (normalized === 'false' || normalized === '0' || normalized === 'nao') return 'Nao';
  return value;
};

export function DriversTable() {
  const [motoristas, setMotoristas] = useState<DriverRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchDrivers = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await axios.get(DRIVER_ENDPOINT);
        const drivers = extractDrivers(response.data);

        if (isMounted) {
          if (drivers !== null) {
            setMotoristas(drivers);
            setIsLoading(false);
            return;
          }

          setMotoristas([]);
          setErrorMessage('Resposta invalida da API de motoristas.');
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setMotoristas([]);
          setErrorMessage('Nao foi possivel carregar os motoristas. Verifique se a API esta rodando.');
          setIsLoading(false);
        }
      }
    };

    void fetchDrivers();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredDrivers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
      return motoristas;
    }

    return motoristas.filter((driver) => {
      const searchableFields = [
        getDriverValue(driver, ['id_motorista', 'id', 'motorista_id'], ''),
        getDriverValue(driver, ['nome_motorista', 'nome', 'name'], ''),
        getDriverValue(driver, ['sobrenome_motorista', 'sobrenome', 'lastname'], ''),
        getDriverValue(driver, ['cpf'], ''),
        getDriverValue(driver, ['cnh', 'numero_cnh'], ''),
        getDriverValue(driver, ['email_motorista', 'email'], ''),
        getDriverValue(driver, ['celular_motorista', 'celular', 'telefone', 'phone'], ''),
      ];

      return searchableFields.some((field) => field.toLowerCase().includes(normalizedSearch));
    });
  }, [motoristas, searchTerm]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative flex-1 max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
          <input
            type="text"
            placeholder="Buscar motorista..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a34a1]"
          />
        </div>

        {isLoading && <p className="text-gray-600">Carregando motoristas...</p>}
        {!isLoading && errorMessage && <p className="text-red-600">{errorMessage}</p>}

        {!isLoading && !errorMessage && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">ID</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Nome</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Sobrenome</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">CPF</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">CNH</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">E-mail</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Celular</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Antecedentes</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Especializacao</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDrivers.map((driver, index) => {
                  const id = getDriverValue(driver, ['id_motorista', 'id', 'motorista_id'], String(index + 1));
                  const nome = getDriverValue(driver, ['nome_motorista', 'nome', 'name']);
                  const sobrenome = getDriverValue(driver, ['sobrenome_motorista', 'sobrenome', 'lastname']);
                  const cpf = getDriverValue(driver, ['cpf']);
                  const cnh = getDriverValue(driver, ['cnh', 'numero_cnh']);
                  const email = getDriverValue(driver, ['email_motorista', 'email']);
                  const celular = getDriverValue(driver, ['celular_motorista', 'celular', 'telefone', 'phone']);
                  const antecedentes = normalizeBackgroundCheck(
                    getDriverValue(driver, ['antecedentes_criminais', 'antecedentesCriminais', 'antecedentes'])
                  );
                  const especializacao = getDriverValue(
                    driver,
                    ['especializacao', 'especialidade', 'categoria_cnh', 'categoria']
                  );

                  return (
                    <tr key={`${id}-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sobrenome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cpf}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cnh}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{celular}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{antecedentes}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{especializacao}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!filteredDrivers.length && (
              <p className="text-center text-gray-500 py-6">Nenhum motorista encontrado.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default DriversTable;
