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
  whatsapp: string | null;
  cidade: string | null;
  estado: string | null;
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarClientes() {
      const { data, error } = await supabase
        .from("clientes")
        .select("id, nome, telefone, whatsapp, cidade, estado")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setClientes(data);
      }

      setLoading(false);
    }

    carregarClientes();
  }, []);

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/logo.png"
            alt="Logo S.R Motor Teck"
            style={{ height: "54px", width: "auto" }}
          />
          <div>
            <h1 style={styles.title}>Clientes</h1>
            <p style={styles.subtitle}>S.R Motor Teck Auto Center</p>
          </div>
        </div>

        <a href="/" style={styles.secondaryButton as React.CSSProperties}>
          Voltar ao painel
        </a>
      </header>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Lista de Clientes</h2>
          <button style={styles.primaryButton}>Novo Cliente</button>
        </div>

        {loading ? (
          <p style={styles.mutedText}>Carregando clientes...</p>
        ) : clientes.length === 0 ? (
          <p style={styles.mutedText}>Nenhum cliente cadastrado.</p>
        ) : (
          <div style={styles.list}>
            {clientes.map((cliente) => (
              <div key={cliente.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <strong style={styles.cardTitle}>{cliente.nome}</strong>
                </div>

                <div style={styles.cardInfo}>
                  <span>Telefone: {cliente.telefone || "Não informado"}</span>
                  <span>WhatsApp: {cliente.whatsapp || "Não informado"}</span>
                  <span>
                    Cidade: {cliente.cidade || "-"} / {cliente.estado || "-"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0f0f10",
    color: "#ffffff",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    borderBottom: "1px solid #2a2a2d",
    paddingBottom: "16px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    color: "#ff3b30",
  },
  subtitle: {
    margin: "6px 0 0 0",
    color: "#c7c7c7",
  },
  section: {
    background: "#17181b",
    border: "1px solid #2a2a2d",
    borderRadius: "14px",
    padding: "18px",
    marginBottom: "24px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  sectionTitle: {
    margin: 0,
    color: "#ffffff",
  },
  primaryButton: {
    background: "#ff3b30",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    background: "#26282c",
    color: "#fff",
    border: "1px solid #3a3d42",
    borderRadius: "10px",
    padding: "10px 16px",
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
  },
  mutedText: {
    color: "#c7c7c7",
  },
  list: {
    display: "grid",
    gap: "14px",
  },
  card: {
    background: "#111214",
    border: "1px solid #2a2a2d",
    borderRadius: "12px",
    padding: "16px",
  },
  cardTop: {
    marginBottom: "10px",
  },
  cardTitle: {
    fontSize: "18px",
    color: "#ffffff",
  },
  cardInfo: {
    display: "grid",
    gap: "6px",
    color: "#d6d6d6",
    fontSize: "14px",
  },
};
