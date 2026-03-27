"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Page() {
  const [emitirNfe, setEmitirNfe] = useState(false);

  async function salvarOS() {
    await supabase.from("ordens_servico").insert([
      {
        emitir_nfe: emitirNfe,
      },
    ]);

    alert("OS salva!");
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Ordem de Serviço</h1>

      <label>
        <input
          type="checkbox"
          checked={emitirNfe}
          onChange={(e) => setEmitirNfe(e.target.checked)}
        />
        Emitir NF-e
      </label>

      <button onClick={salvarOS}>Salvar OS</button>
    </main>
  );
}
