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
  placa: string | null;
  modelo: string;
  marca: string | null;
  cliente_id: string;
};

export default function Page() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);

  const [clienteId, setClienteId] = useState("");
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [marca, setMarca] = useState("");

  async function carregarDados() {
    const { data: clientesData } = await supabase
      .from("clientes")
      .select("id, nome")
      .order("nome", { ascending: true });

    const { data: veiculosData } = await supabase
      .from("veiculos")
      .select("id, placa, modelo, marca, cliente_id")
      .order("created_at", { ascending: false });

    setClientes(clientesData || []);
    setVeiculos(veiculosData || []);
    setLoading(false);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function salvarVeiculo() {
    if (!clienteId || !modelo.trim()) {
      alert("Selecione o cliente e informe o modelo");
      return;
    }

    const { error } = await supabase.from("veiculos").insert([
      {
        cliente_id: clienteId,
        placa: placa.trim() || null,
        modelo: modelo.trim(),
        marca: marca.trim() || null,
      },
    ]);

    if (error) {
      alert("Erro ao salvar veículo");
      return;
    }

    alert("Veículo salvo com sucesso!");
    setClienteId("");
    setPlaca("");
    setModelo("");
    setMarca("");
    carregarDados();
  }

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Veículos</h1>

      <div style={styles.formBox}>
        <h2 style={styles.subtitle}>Novo Veículo</h2>

        <select
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          style={styles.input}
        >
          <option value="">Selecione o cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </option>
          ))}
        </select>

        <input
          placeholder="Placa"
          value={placa}
          onChange={(e) => setPlaca(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Modelo"
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Marca"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          style={styles.input}
        />

        <button onClick={salvarVeiculo} style={styles.button}>
          Salvar Veículo
        </button>
      </div>

      {loading ? (
        <p style={styles.text}>Carregando...</p>
      ) : veiculos.length === 0 ? (
        <p style={styles.text}>Nenhum veículo encontrado.</p>
      ) : (
        veiculos.map((veiculo) => (
          <div key={veiculo.id} style={styles.card}>
            <strong>{veiculo.modelo}</strong>
            <div>Marca: {veiculo.marca || "Não informada"}</div>
            <div>Placa: {veiculo.placa || "Sem placa"}</div>
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
    maxWidth: "400px",
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
