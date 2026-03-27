"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type OS = {
  id: string;
  total_geral: number | null;
  status: string;
  created_at: string;
};

export default function Page() {
  const [ordens, setOrdens] = useState<OS[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregarDados() {
    const { data } = await supabase
      .from("ordens_servico")
      .select("id, total_geral, status, created_at");

    setOrdens(data || []);
    setLoading(false);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const totalGeral = ordens.reduce(
    (acc, os) => acc + Number(os.total_geral || 0),
    0
  );

  const finalizadas = ordens.filter((os) => os.status === "finalizado");
  const totalFinalizado = finalizadas.reduce(
    (acc, os) => acc + Number(os.total_geral || 0),
    0
  );

  const emAndamento = ordens.filter((os) => os.status === "em_andamento");

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Financeiro</h1>

      {loading ? (
        <p style={styles.text}>Carregando...</p>
      ) : (
        <>
          <div style={styles.card}>
            <h2>Faturamento Total</h2>
            <p>R$ {totalGeral.toFixed(2)}</p>
          </div>

          <div style={styles.card}>
            <h2>Faturado (Finalizado)</h2>
            <p>R$ {totalFinalizado.toFixed(2)}</p>
          </div>

          <div style={styles.card}>
            <h2>Ordens em Andamento</h2>
            <p>{emAndamento.length}</p>
          </div>

          <div style={styles.card}>
            <h2>Total de OS</h2>
            <p>{ordens.length}</p>
          </div>
        </>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: "20px",
    background: "#0f0f10",
    color: "white",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginBottom: "20px",
    color: "#ff3b30",
  },
  text: {
    color: "#c7c7c7",
  },
  card: {
    border: "1px solid #2a2a2d",
    padding: "16px",
    marginBottom: "12px",
    borderRadius: "10px",
    background: "#111214",
  },
};
