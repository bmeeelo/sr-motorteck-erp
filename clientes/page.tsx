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

  useEffect(() => {
    async function carregarClientes() {
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .limit(20);

      if (!error && data) {
        setClientes(data);
      }

      setLoading(false);
    }

    carregarClientes();
  }, []);

  return (
    <main style={{ padding: "20px", color: "white" }}>
      <h1>Clientes</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : clientes.length === 0 ? (
        <p>Nenhum cliente encontrado.</p>
      ) : (
        clientes.map((cliente) => (
          <div
            key={cliente.id}
            style={{
              border: "1px solid #333",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <strong>{cliente.nome}</strong>
            <div>{cliente.telefone || "Sem telefone"}</div>
          </div>
        ))
      )}
    </main>
  );
}
