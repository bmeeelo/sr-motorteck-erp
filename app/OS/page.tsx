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

type Peca = {
  id: string;
  descricao: string;
  preco_venda: number;
};

export default function Page() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [veiculoId, setVeiculoId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valorServico, setValorServico] = useState("");
  const [pecaId, setPecaId] = useState("");

  async function carregarDados() {
    const { data: clientesData } = await supabase.from("clientes").select("*");
    const { data: veiculosData } = await supabase.from("veiculos").select("*");
    const { data: pecasData } = await supabase.from("pecas").select("*");

    setClientes(clientesData || []);
    setVeiculos(veiculosData || []);
    setPecas(pecasData || []);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const veiculosDoCliente = veiculos.filter(
    (v) => v.cliente_id === clienteId
  );

  const pecaSelecionada = pecas.find((p) => p.id === pecaId);

  const valorServicoNum = Number(valorServico) || 0;
  const valorPeca = pecaSelecionada?.preco_venda || 0;
  const valorTotal = valorServicoNum + valorPeca;

  async function salvarOS() {
    if (!clienteId || !veiculoId || !descricao.trim()) {
      alert("Preencha os campos");
      return;
    }

    const { error } = await supabase.from("ordens_servico").insert([
      {
        cliente_id: clienteId,
        veiculo_id: veiculoId,
        servicos_realizados: descricao,
        total_geral: valorTotal,
        status: "em_andamento",
      },
    ]);

    if (error) {
      alert("Erro ao salvar OS");
      return;
    }

    alert("OS criada!");
    setDescricao("");
    setValorServico("");
    setPecaId("");
  }

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Ordem de Serviço</h1>

      <div style={styles.form}>
        <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
          <option value="">Cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>

        <select value={veiculoId} onChange={(e) => setVeiculoId(e.target.value)}>
          <option value="">Veículo</option>
          {veiculosDoCliente.map((v) => (
            <option key={v.id} value={v.id}>
              {v.modelo} - {v.placa}
            </option>
          ))}
        </select>

        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <input
          placeholder="Valor serviço"
          value={valorServico}
          onChange={(e) => setValorServico(e.target.value)}
        />

        <select value={pecaId} onChange={(e) => setPecaId(e.target.value)}>
          <option value="">Selecionar peça</option>
          {pecas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.descricao} - R$ {p.preco_venda}
            </option>
          ))}
        </select>

        {/* 💰 VALORES SEPARADOS */}
        <div style={styles.resumo}>
          <div>Serviço: R$ {valorServicoNum.toFixed(2)}</div>
          <div>Peça: R$ {valorPeca.toFixed(2)}</div>
          <div style={styles.total}>
            Total: R$ {valorTotal.toFixed(2)}
          </div>
        </div>

        <button onClick={salvarOS}>Criar OS</button>
      </div>
    </main>
  );
}

const styles = {
  page: {
    padding: "20px",
    background: "#0f0f10",
    color: "white",
    minHeight: "100vh",
  },
  title: {
    marginBottom: "20px",
    color: "#ff3b30",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    maxWidth: "500px",
  },
  resumo: {
    marginTop: "10px",
    padding: "10px",
    border: "1px solid #333",
    borderRadius: "8px",
    background: "#111214",
  },
  total: {
    marginTop: "6px",
    color: "#00ff88",
    fontWeight: "bold",
  },
};
