"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Cliente = {
  id: string;
  nome: string;
};

type Veiculo = {
  id: string;
  modelo: string;
  placa: string | null;
  cliente_id: string;
};

type OrdemServico = {
  id: string;
  servicos_realizados: string | null;
  total_geral: number | null;
  status: string;
  cliente_id: string;
  veiculo_id: string;
};

export default function Page() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [loading, setLoading] = useState(true);

  const [clienteId, setClienteId] = useState("");
  const [veiculoId, setVeiculoId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [status, setStatus] = useState("em_andamento");

  async function carregarDados() {
    const { data: clientesData } = await supabase
      .from("clientes")
      .select("id, nome")
      .order("nome", { ascending: true });

    const { data: veiculosData } = await supabase
      .from("veiculos")
      .select("id, modelo, placa, cliente_id")
      .order("created_at", { ascending: false });

    const { data: ordensData } = await supabase
      .from("ordens_servico")
      .select("id, servicos_realizados, total_geral, status, cliente_id, veiculo_id")
      .order("created_at", { ascending: false });

    setClientes(clientesData || []);
    setVeiculos(veiculosData || []);
    setOrdens(ordensData || []);
    setLoading(false);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const veiculosDoCliente = veiculos.filter(
    (veiculo) => veiculo.cliente_id === clienteId
  );

  async function salvarOS() {
    if (!clienteId || !veiculoId || !descricao.trim()) {
      alert("Selecione cliente, veículo e informe o serviço");
      return;
    }

    const { error } = await supabase.from("ordens_servico").insert([
      {
        cliente_id: clienteId,
        veiculo_id: veiculoId,
        servicos_realizados: descricao.trim(),
        total_geral: Number(valor) || 0,
        status,
      },
    ]);

    if (error) {
      alert("Erro ao salvar ordem de serviço");
      return;
    }

    alert("Ordem de serviço salva com sucesso!");
    setClienteId("");
    setVeiculoId("");
    setDescricao("");
    setValor("");
    setStatus("em_andamento");
    carregarDados();
  }

  function nomeCliente(id: string) {
    return clientes.find((c) => c.id === id)?.nome || "Cliente não encontrado";
  }

  function nomeVeiculo(id: string) {
    const veiculo = veiculos.find((v) => v.id === id);
    if (!veiculo) return "Veículo não encontrado";
    return `${veiculo.modelo}${veiculo.placa ? " - " + veiculo.placa : ""}`;
  }

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Ordens de Serviço</h1>

      <div style={styles.formBox}>
        <h2 style={styles.subtitle}>Nova Ordem de Serviço</h2>

        <select
          value={clienteId}
          onChange={(e) => {
            setClienteId(e.target.value);
            setVeiculoId("");
          }}
          style={styles.input}
        >
          <option value="">Selecione o cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </option>
          ))}
        </select>

        <select
          value={veiculoId}
          onChange={(e) => setVeiculoId(e.target.value)}
          style={styles.input}
        >
          <option value="">Selecione o veículo</option>
          {veiculosDoCliente.map((veiculo) => (
            <option key={veiculo.id} value={veiculo.id}>
              {veiculo.modelo} {veiculo.placa ? `- ${veiculo.placa}` : ""}
            </option>
          ))}
        </select>

        <input
          placeholder="Descrição do serviço"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Valor total"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          style={styles.input}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={styles.input}
        >
          <option value="em_andamento">Em andamento</option>
          <option value="aguardando_peca">Aguardando peça</option>
          <option value="finalizado">Finalizado</option>
          <option value="entregue">Entregue</option>
        </select>

        <button onClick={salvarOS} style={styles.button}>
          Salvar Ordem de Serviço
        </button>
      </div>

      {loading ? (
        <p style={styles.text}>Carregando...</p>
      ) : ordens.length === 0 ? (
        <p style={styles.text}>Nenhuma ordem de serviço encontrada.</p>
      ) : (
        ordens.map((ordem) => (
          <div key={ordem.id} style={styles.card}>
            <strong>{ordem.servicos_realizados || "Sem descrição"}</strong>
            <div>Cliente: {nomeCliente(ordem.cliente_id)}</div>
            <div>Veículo: {nomeVeiculo(ordem.veiculo_id)}</div>
            <div>Valor: R$ {Number(ordem.total_geral || 0).toFixed(2)}</div>
            <div>Status: {ordem.status}</div>
          </div>
        ))
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: "20px",
    color: "white",
    background: "#0f0f10",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginBottom: "20px",
    color: "#ff3b30",
  },
  subtitle: {
    marginBottom: "12px",
  },
  text: {
    color: "#c7c7c7",
  },
  formBox: {
    border: "1px solid #2a2a2d",
    padding: "16px",
    marginBottom: "20px",
    borderRadius: "10px",
    background: "#111214",
  },
  input: {
    display: "block",
    width: "100%",
    maxWidth: "460px",
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#1a1b1e",
    color: "white",
  },
  button: {
    background: "#ff3b30",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 700,
  },
  card: {
    border: "1px solid #2a2a2d",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "10px",
    background: "#111214",
  },
};
