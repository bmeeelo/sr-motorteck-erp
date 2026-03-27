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
  emitir_nfe: boolean;
};

export default function Page() {
  const [ordens, setOrdens] = useState<OS[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    const { data } = await supabase
      .from("ordens_servico")
      .select("*");

    setOrdens(data || []);
    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  const comNfe = ordens.filter((o) => o.emitir_nfe);
  const semNfe = ordens.filter((o) => !o.emitir_nfe);

  const totalComNfe = comNfe.reduce(
    (acc, o) => acc + Number(o.total_geral || 0),
    0
  );

  const totalSemNfe = semNfe.reduce(
    (acc, o) => acc + Number(o.total_geral || 0),
    0
  );

  const totalGeral = totalComNfe + totalSemNfe;

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Financeiro / NF-e</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <div style={styles.card}>
            <h2>Total Geral</h2>
            <p>R$ {totalGeral.toFixed(2)}</p>
          </div>

          <div style={styles.card}>
            <h2>Com NF-e</h2>
            <p>Qtd: {comNfe.length}</p>
            <p>R$ {totalComNfe.toFixed(2)}</p>
          </div>

          <div style={styles.card}>
            <h2>Sem NF-e</h2>
            <p>Qtd: {semNfe.length}</p>
            <p>R$ {totalSemNfe.toFixed(2)}</p>
          </div>
        </>
      )}
    </main>
  );
}

const styles = {
  page: {
    padding: "20px",
    background: "#ffffff",
    color: "#000",
    minHeight: "100vh",
  },
  title: {
    marginBottom: "20px",
    color: "#c40000",
  },
  card: {
    border: "1px solid #ccc",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "10px",
    background: "#f5f5f5",
  },
};
