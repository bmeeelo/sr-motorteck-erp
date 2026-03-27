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
  telefone: string | null;
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  async function carregarClientes() {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setClientes(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  async function salvarCliente() {
    if (!nome.trim()) {
      alert("Digite o nome do cliente");
      return;
    }

    const { error } = await supabase.from("clientes").insert([
      {
        nome: nome.trim(),
        telefone: telefone.trim() || null,
      },
    ]);

    if (error) {
      alert("Erro ao salvar cliente");
      return;
    }

    alert("Cliente salvo com sucesso!");
    setNome("");
    setTelefone("");
    carregarClientes();
  }

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Clientes</h1>

      <div style={styles.formBox}>
        <h2 style={styles.subtitle}>Novo Cliente</h2>

        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          style={styles.input}
        />

        <button onClick={salvarCliente} style={styles.button}>
          Salvar Cliente
        </button>
      </div>

      {loading ? (
        <p style={styles.text}>Carregando...</p>
      ) : clientes.length === 0 ? (
        <p style={styles.text}>Nenhum cliente encontrado.</p>
      ) : (
        clientes.map((cliente) => (
          <div key={cliente.id} style={styles.card}>
            <strong>{cliente.nome}</strong>
            <div>{cliente.telefone || "Sem telefone"}</div>
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
