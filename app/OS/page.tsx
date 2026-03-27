"use client";

import { useEffect, useMemo, useState } from "react";
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

type Veiculo = {
  id: string;
  modelo: string;
  placa: string | null;
  cliente_id: string;
};

type Peca = {
  id: string;
  descricao: string;
  preco_venda: number;
};

type OrdemServico = {
  id: string;
  cliente_id: string;
  veiculo_id: string;
  servicos_realizados: string | null;
  total_geral: number | null;
  status: string;
  emitir_nfe: boolean | null;
  created_at?: string;
};

export default function Page() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [osSelecionada, setOsSelecionada] = useState<OrdemServico | null>(null);

  const [clienteId, setClienteId] = useState("");
  const [veiculoId, setVeiculoId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valorServico, setValorServico] = useState("");
  const [pecaId, setPecaId] = useState("");
  const [emitirNfe, setEmitirNfe] = useState(false);

  async function carregarDados() {
    const { data: clientesData } = await supabase
      .from("clientes")
      .select("*")
      .order("nome", { ascending: true });

    const { data: veiculosData } = await supabase
      .from("veiculos")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: pecasData } = await supabase
      .from("pecas")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: ordensData } = await supabase
      .from("ordens_servico")
      .select("*")
      .order("created_at", { ascending: false });

    setClientes(clientesData || []);
    setVeiculos(veiculosData || []);
    setPecas(pecasData || []);
    setOrdens(ordensData || []);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const veiculosDoCliente = veiculos.filter((v) => v.cliente_id === clienteId);
  const pecaSelecionada = pecas.find((p) => p.id === pecaId) || null;

  const valorServicoNum = Number(valorServico) || 0;
  const valorPeca = pecaSelecionada?.preco_venda || 0;
  const valorTotal = useMemo(() => valorServicoNum + valorPeca, [valorServicoNum, valorPeca]);

  function nomeCliente(id: string) {
    return clientes.find((c) => c.id === id)?.nome || "-";
  }

  function telefoneCliente(id: string) {
    return clientes.find((c) => c.id === id)?.telefone || "-";
  }

  function nomeVeiculo(id: string) {
    const v = veiculos.find((item) => item.id === id);
    if (!v) return "-";
    return `${v.modelo}${v.placa ? " - " + v.placa : ""}`;
  }

  async function salvarOS() {
    if (!clienteId || !veiculoId || !descricao.trim()) {
      alert("Preencha cliente, veículo e descrição.");
      return;
    }

    const { data, error } = await supabase
      .from("ordens_servico")
      .insert([
        {
          cliente_id: clienteId,
          veiculo_id: veiculoId,
          servicos_realizados: descricao.trim(),
          total_geral: valorTotal,
          status: "em_andamento",
          emitir_nfe: emitirNfe,
        },
      ])
      .select();

    if (error) {
      alert("Erro ao salvar OS");
      return;
    }

    alert("OS criada com sucesso!");

    setDescricao("");
    setValorServico("");
    setPecaId("");
    setEmitirNfe(false);

    await carregarDados();

    if (data && data.length > 0) {
      setOsSelecionada(data[0]);
    }
  }

  function imprimirOS() {
    if (!osSelecionada) {
      alert("Selecione uma OS na lista abaixo para imprimir.");
      return;
    }
    window.print();
  }

  return (
    <>
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }

          body {
            background: #ffffff !important;
            color: #000000 !important;
          }

          .print-area {
            display: block !important;
          }
        }
      `}</style>

      <main style={styles.page}>
        <div className="no-print">
          <h1 style={styles.title}>Ordem de Serviço</h1>

          <div style={styles.formCard}>
            <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} style={styles.input}>
              <option value="">Cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>

            <select value={veiculoId} onChange={(e) => setVeiculoId(e.target.value)} style={styles.input}>
              <option value="">Veículo</option>
              {veiculosDoCliente.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.modelo} {v.placa ? `- ${v.placa}` : ""}
                </option>
              ))}
            </select>

            <input
              placeholder="Descrição do serviço"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              style={styles.input}
            />

            <input
              placeholder="Valor do serviço"
              value={valorServico}
              onChange={(e) => setValorServico(e.target.value)}
              style={styles.input}
            />

            <select value={pecaId} onChange={(e) => setPecaId(e.target.value)} style={styles.input}>
              <option value="">Selecionar peça</option>
              {pecas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.descricao} - R$ {Number(p.preco_venda || 0).toFixed(2)}
                </option>
              ))}
            </select>

            <div style={styles.resumo}>
              <div>Serviço: R$ {valorServicoNum.toFixed(2)}</div>
              <div>Peça: R$ {valorPeca.toFixed(2)}</div>
              <div style={styles.total}>Total: R$ {valorTotal.toFixed(2)}</div>
            </div>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={emitirNfe}
                onChange={(e) => setEmitirNfe(e.target.checked)}
              />
              Emitir NF-e
            </label>

            <div style={styles.buttonRow}>
              <button onClick={salvarOS} style={styles.primaryButton}>
                Salvar OS
              </button>
              <button onClick={imprimirOS} style={styles.secondaryButton}>
                Imprimir / PDF
              </button>
            </div>
          </div>

          <div style={styles.listCard}>
            <h2 style={styles.sectionTitle}>Ordens Salvas</h2>

            {ordens.length === 0 ? (
              <p>Nenhuma OS encontrada.</p>
            ) : (
              ordens.map((os) => (
                <div
                  key={os.id}
                  style={{
                    ...styles.osItem,
                    border:
                      osSelecionada?.id === os.id
                        ? "2px solid #c40000"
                        : "1px solid #ddd",
                  }}
                >
                  <div>
                    <strong>{os.servicos_realizados || "Sem descrição"}</strong>
                    <div>Cliente: {nomeCliente(os.cliente_id)}</div>
                    <div>Veículo: {nomeVeiculo(os.veiculo_id)}</div>
                    <div>Total: R$ {Number(os.total_geral || 0).toFixed(2)}</div>
                    <div>NF-e: {os.emitir_nfe ? "Sim" : "Não"}</div>
                  </div>

                  <button
                    onClick={() => setOsSelecionada(os)}
                    style={styles.smallButton}
                  >
                    Selecionar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {osSelecionada && (
          <section className="print-area" style={styles.printCard}>
            <div style={styles.printHeader}>
              <div style={styles.logoRow}>
                <img src="/logo.png" alt="Logo S.R Motor Teck" style={styles.logo} />
                <div>
                  <h2 style={styles.printTitle}>S.R Motor Teck Auto Center</h2>
                  <div>CNPJ: 07.545.615/0001-42</div>
                  <div>Estrada João Ducim, 660 - Jardim Oriental - Santo André/SP</div>
                  <div>WhatsApp: (11) 97970-7454</div>
                </div>
              </div>
              <div style={styles.docBox}>
                <div style={styles.docLabel}>ORDEM DE SERVIÇO</div>
                <div>Data: {new Date().toLocaleDateString("pt-BR")}</div>
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Cliente</h3>
              <div>Nome: {nomeCliente(osSelecionada.cliente_id)}</div>
              <div>Telefone: {telefoneCliente(osSelecionada.cliente_id)}</div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Veículo</h3>
              <div>{nomeVeiculo(osSelecionada.veiculo_id)}</div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Serviço</h3>
              <div>{osSelecionada.servicos_realizados || "-"}</div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Resumo</h3>
              <div>NF-e: {osSelecionada.emitir_nfe ? "Sim" : "Não"}</div>
              <div style={styles.totalPrint}>
                Total: R$ {Number(osSelecionada.total_geral || 0).toFixed(2)}
              </div>
            </div>

            <div style={styles.signRow}>
              <div style={styles.signBox}>
                <div style={styles.signLine} />
                <div>Assinatura do Cliente</div>
              </div>
              <div style={styles.signBox}>
                <div style={styles.signLine} />
                <div>Assinatura da Oficina</div>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    background: "#ffffff",
    color: "#000000",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginBottom: "20px",
    color: "#c40000",
  },
  formCard: {
    maxWidth: "560px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "24px",
    padding: "16px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "#fff",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    background: "#fff",
    color: "#000",
  },
  resumo: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#f7f7f7",
  },
  total: {
    marginTop: "6px",
    fontWeight: "bold",
    color: "#008000",
  },
  checkboxRow: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  primaryButton: {
    background: "#c40000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    background: "#222",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  listCard: {
    marginTop: "24px",
    padding: "16px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "#fff",
  },
  osItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "10px",
    background: "#fafafa",
  },
  smallButton: {
    background: "#c40000",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 12px",
    fontWeight: 700,
    cursor: "pointer",
  },
  printCard: {
    marginTop: "28px",
    padding: "24px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "#ffffff",
  },
  printHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  logoRow: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
  },
  logo: {
    height: "56px",
    width: "auto",
  },
  printTitle: {
    margin: 0,
    fontSize: "22px",
  },
  docBox: {
    textAlign: "right",
    minWidth: "220px",
  },
  docLabel: {
    fontWeight: 700,
    fontSize: "18px",
  },
  section: {
    marginBottom: "20px",
  },
  sectionTitle: {
    marginBottom: "8px",
    color: "#000",
  },
  totalPrint: {
    fontWeight: 700,
    fontSize: "20px",
    marginTop: "8px",
  },
  signRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "30px",
    marginTop: "50px",
    flexWrap: "wrap",
  },
  signBox: {
    flex: 1,
    minWidth: "220px",
    textAlign: "center",
  },
  signLine: {
    borderTop: "1px solid #000",
    marginBottom: "8px",
    height: "1px",
  },
};
