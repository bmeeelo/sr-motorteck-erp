"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Cliente = { id: string; nome: string };
type Veiculo = { id: string; modelo: string; placa: string | null; cliente_id: string };
type Peca = { id: string; descricao: string; preco_venda: number };

type ItemPeca = {
  pecaId: string;
  descricao: string;
  preco: number;
  quantidade: number;
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
  const [quantidade, setQuantidade] = useState(1);
  const [itens, setItens] = useState<ItemPeca[]>([]);

  async function carregar() {
    const { data: c } = await supabase.from("clientes").select("*");
    const { data: v } = await supabase.from("veiculos").select("*");
    const { data: p } = await supabase.from("pecas").select("*");

    setClientes(c || []);
    setVeiculos(v || []);
    setPecas(p || []);
  }

  useEffect(() => {
    carregar();
  }, []);

  const veiculosCliente = veiculos.filter(v => v.cliente_id === clienteId);
  const pecaSelecionada = pecas.find(p => p.id === pecaId);

  function adicionarPeca() {
    if (!pecaSelecionada) return;

    setItens([
      ...itens,
      {
        pecaId: pecaSelecionada.id,
        descricao: pecaSelecionada.descricao,
        preco: pecaSelecionada.preco_venda,
        quantidade: quantidade,
      },
    ]);
  }

  function removerItem(index: number) {
    const novos = [...itens];
    novos.splice(index, 1);
    setItens(novos);
  }

  const totalPecas = useMemo(
    () => itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0),
    [itens]
  );

  const totalServico = Number(valorServico) || 0;
  const totalGeral = totalServico + totalPecas;

  async function salvarOS() {
    await supabase.from("ordens_servico").insert([
      {
        cliente_id: clienteId,
        veiculo_id: veiculoId,
        servicos_realizados: descricao,
        total_geral: totalGeral,
      },
    ]);

    alert("OS criada!");
  }

  function imprimir() {
    window.print();
  }

  function nomeCliente(id: string) {
    return clientes.find(c => c.id === id)?.nome || "";
  }

  function nomeVeiculo(id: string) {
    const v = veiculos.find(v => v.id === id);
    return v ? `${v.modelo} ${v.placa || ""}` : "";
  }

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none }
        }
      `}</style>

      <main style={styles.page}>
        <div className="no-print">

          <h1>Ordem de Serviço</h1>

          <select onChange={e => setClienteId(e.target.value)}>
            <option>Cliente</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>

          <select onChange={e => setVeiculoId(e.target.value)}>
            <option>Veículo</option>
            {veiculosCliente.map(v => (
              <option key={v.id} value={v.id}>{v.modelo}</option>
            ))}
          </select>

          <input placeholder="Serviço" onChange={e => setDescricao(e.target.value)} />
          <input placeholder="Valor serviço" onChange={e => setValorServico(e.target.value)} />

          <h3>Adicionar Peças</h3>

          <select onChange={e => setPecaId(e.target.value)}>
            <option>Peça</option>
            {pecas.map(p => (
              <option key={p.id} value={p.id}>{p.descricao}</option>
            ))}
          </select>

          <input
            type="number"
            value={quantidade}
            onChange={e => setQuantidade(Number(e.target.value))}
          />

          <button onClick={adicionarPeca}>Adicionar Peça</button>

          <h3>Itens</h3>

          {itens.map((item, i) => (
            <div key={i}>
              {item.descricao} | Qtd: {item.quantidade} | R$ {item.preco * item.quantidade}
              <button onClick={() => removerItem(i)}>X</button>
            </div>
          ))}

          <h3>Total Peças: R$ {totalPecas}</h3>
          <h3>Total Serviço: R$ {totalServico}</h3>
          <h2>Total Geral: R$ {totalGeral}</h2>

          <button onClick={salvarOS}>Salvar OS</button>
          <button onClick={imprimir}>Imprimir</button>
        </div>

        <div style={styles.print}>
          <h2>ORDEM DE SERVIÇO</h2>

          <p>Cliente: {nomeCliente(clienteId)}</p>
          <p>Veículo: {nomeVeiculo(veiculoId)}</p>
          <p>Serviço: {descricao}</p>

          <h3>Peças</h3>
          {itens.map((item, i) => (
            <div key={i}>
              {item.descricao} - {item.quantidade}x - R$ {item.preco * item.quantidade}
            </div>
          ))}

          <h2>Total: R$ {totalGeral}</h2>
        </div>

      </main>
    </>
  );
}

const styles = {
  page: { padding: 20, background: "#fff", color: "#000" },
  print: { marginTop: 40 }
};
