"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Peca = {
  id: string;
  descricao: string;
  custo: number;
  margem_lucro: number;
  preco_venda: number;
  aplicacao_veiculo: string | null;
  aplicacao_ano: string | null;
  aplicacao_motor: string | null;
  quantidade_estoque: number;
};

export default function Page() {
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [loading, setLoading] = useState(true);

  const [descricao, setDescricao] = useState("");
  const [custo, setCusto] = useState("");
  const [margem, setMargem] = useState("40");
  const [veiculo, setVeiculo] = useState("");
  const [ano, setAno] = useState("");
  const [motor, setMotor] = useState("");
  const [estoque, setEstoque] = useState("");

  async function carregarPecas() {
    const { data } = await supabase
      .from("pecas")
      .select(
        "id, descricao, custo, margem_lucro, preco_venda, aplicacao_veiculo, aplicacao_ano, aplicacao_motor, quantidade_estoque"
      )
      .order("created_at", { ascending: false });

    setPecas(data || []);
    setLoading(false);
  }

  useEffect(() => {
    carregarPecas();
  }, []);

  async function salvarPeca() {
    if (!descricao.trim() || !custo.trim()) {
      alert("Informe pelo menos descrição e custo");
      return;
    }

    const { error } = await supabase.from("pecas").insert([
      {
        descricao: descricao.trim(),
        custo: Number(custo) || 0,
        margem_lucro: Number(margem) || 40,
        aplicacao_veiculo: veiculo.trim() || null,
        aplicacao_ano: ano.trim() || null,
        aplicacao_motor: motor.trim() || null,
        quantidade_estoque: Number(estoque) || 0,
      },
    ]);

    if (error) {
      alert("Erro ao salvar peça");
      return;
    }

    alert("Peça salva com sucesso!");
    setDescricao("");
    setCusto("");
    setMargem("40");
    setVeiculo("");
    setAno("");
    setMotor("");
    setEstoque("");
    carregarPecas();
  }

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Peças</h1>

      <div style={styles.formBox}>
        <h2 style={styles.subtitle}>Nova Peça</h2>

        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Custo"
          value={custo}
          onChange={(e) => setCusto(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Margem de lucro (%)"
          value={margem}
          onChange={(e) => setMargem(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Veículo"
          value={veiculo}
          onChange={(e) => setVeiculo(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Ano"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Motor"
          value={motor}
          onChange={(e) => setMotor(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Quantidade em estoque"
          value={estoque}
          onChange={(e) => setEstoque(e.target.value)}
          style={styles.input}
        />

        <button onClick={salvarPeca} style={styles.button}>
          Salvar Peça
        </button>
      </div>

      {loading ? (
        <p style={styles.text}>Carregando...</p>
      ) : pecas.length === 0 ? (
        <p style={styles.text}>Nenhuma peça cadastrada.</p>
      ) : (
        pecas.map((peca) => (
          <div key={peca.id} style={styles.card}>
            <strong>{peca.descricao}</strong>
            <div>Custo: R$ {Number(peca.custo || 0).toFixed(2)}</div>
            <div>Margem: {Number(peca.margem_lucro || 0).toFixed(2)}%</div>
            <div>Venda: R$ {Number(peca.preco_venda || 0).toFixed(2)}</div>
            <div>
              Aplicação: {peca.aplicacao_veiculo || "-"} / {peca.aplicacao_ano || "-"} / {peca.aplicacao_motor || "-"}
            </div>
            <div>Estoque: {Number(peca.quantidade_estoque || 0)}</div>
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
