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
  placa: string;
  modelo: string;
  marca: string;
  cliente_id: string;
  clientes?: Cliente;
};

export default function VeiculosPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculos, setVeiculos] = useState
