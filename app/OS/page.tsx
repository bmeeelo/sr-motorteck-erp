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

export default function Page() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [veiculoId, setVeiculoId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valorServico, setValorServico] = useState("");
  const [pecaId, setPecaId] = useState("");
  const [emitirNfe, setEmitirNfe] = useState(false);

  async function carregarDados() {
    const { data: clientesData } = await supabase.from("clientes").select("*");
    const { data: veiculosData } = await supabase.from("veiculos").select("*");
    const { data: pecasData } = await supabase.from("pecas").select("*");

    setClientes(clientesData || []);
    setVeiculos(veiculosData || []);
    setPecas(pecasData || []);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const veiculosDoCliente = veiculos.filter((v) => v.cliente_id === clienteId);
  const clienteSelecionado = clientes.find((c) => c.id === clienteId) || null;
  const veiculoSelecionado = veiculos.find((v) => v.id === veiculoId) || null;
  const pecaSelecionada = pecas.find((p) => p.id === pecaId) || null;

  const valorServicoNum = Number(valorServico) || 0;
  const valorPeca = pecaSelecionada?.preco_venda || 0;
  const valorTotal = useMemo(() => valorServicoNum + valorPeca, [valorServicoNum, valorPeca]);

  async function salvarOS() {
    if (!clienteId || !veiculoId || !descricao.trim()) {
      alert("Preencha cliente, veículo e descrição.");
      return;
    }

    const { error } = await supabase.from("ordens_servico").insert([
      {
        cliente_id: clienteId,
        veiculo_id: veiculoId,
        servicos_realizados: descricao.trim(),
        total_geral: valorTotal,
        status: "em_andamento",
        emitir_nfe: emitirNfe,
      },
    ]);

    if (error) {
      alert("Erro ao salvar OS");
      return;
    }

    alert("OS criada com sucesso!");
  }

  function imprimirOS() {
    window.print();
  }

  return (
    <>
      <style>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }

          .no-print {
            display: none !important;
          }

          .print-area {
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .print-card {
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
          }

          .print-text-black {
            color: #000000 !important;
          }
        }
      `}</style>

      <main style={styles.page}>
        <div className="no-print" style={styles.formWrap}>
          <h1 style={styles.title}>Ordem de Serviço</h1>

          <div style={styles.form}>
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
        </div>

        <section className="print-area" style={styles.printWrap}>
          <div className="print-card" style={styles.printCard}>
            <div style={styles.printHeader}>
              <div style={styles.logoRow}>
                <img src="/logo.png" alt="Logo S.R Motor Teck" style={styles.logo} />
                <div>
                  <h2 className="print-text-black" style={styles.printTitle}>
                    S.R Motor Teck Auto Center
                  </h2>
                  <div className="print-text-black" style={styles.printInfo}>
                    CNPJ: 07.545.615/0001-42
                  </div>
                  <div className="print-text-black" style={styles.printInfo}>
                    Estrada João Ducim, 660 - Jardim Oriental - Santo André/SP - CEP 09185-000
                  </div>
                  <div className="print-text-black" style={styles.printInfo}>
                    WhatsApp: (11) 97970-7454
                  </div>
                </div>
              </div>

              <div style={styles.docBox}>
                <div className="print-text-black" style={styles.docLabel}>ORDEM DE SERVIÇO</div>
                <div className="print-text-black" style={styles.docDate}>
                  Data: {new Date().toLocaleDateString("pt-BR")}
                </div>
              </div>
            </div>

            <div style={styles.section}>
              <h3 className="print-text-black" style={styles.sectionTitle}>Cliente</h3>
              <div className="print-text-black">Nome: {clienteSelecionado?.nome || "-"}</div>
              <div className="print-text-black">Telefone: {clienteSelecionado?.telefone || "-"}</div>
            </div>

            <div style={styles.section}>
              <h3 className="print-text-black" style={styles.sectionTitle}>Veículo</h3>
              <div className="print-text-black">Modelo: {veiculoSelecionado?.modelo || "-"}</div>
              <div className="print-text-black">Placa: {veiculoSelecionado?.placa || "-"}</div>
            </div>

            <div style={styles.section}>
              <h3 className="print-text-black" style={styles.sectionTitle}>Serviços e Peças</h3>

              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Descrição</th>
                    <th style={styles.th}>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={styles.td}>{descricao || "-"}</td>
                    <td style={styles.td}>R$ {valorServicoNum.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>{pecaSelecionada?.descricao || "-"}</td>
                    <td style={styles.td}>R$ {valorPeca.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={styles.totalBox}>
              <div className="print-text-black">Emitir NF-e: {emitirNfe ? "Sim" : "Não"}</div>
              <div className="print-text-black" style={styles.totalPrint}>
                Total: R$ {valorTotal.toFixed(2)}
              </div>
            </div>

            <div style={styles.signRow}>
              <div style={styles.signBox}>
                <div style={styles.signLine} />
                <div className="print-text-black">Assinatura do Cliente</div>
              </div>
              <div style={styles.signBox}>
                <div style={styles.signLine} />
                <div className="print-text-black">Assinatura da Oficina</div>
              </div>
            </div>
          </div>
        </section>
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
  formWrap: {
    marginBottom: "30px",
  },
  title: {
    marginBottom: "20px",
    color: "#c40000",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "520px",
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
  printWrap: {
    display: "block",
  },
  printCard: {
    background: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "24px",
  },
  printHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "24px",
    flexWrap: "wrap",
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
  printInfo: {
    marginTop: "4px",
    fontSize: "14px",
  },
  docBox: {
    minWidth: "220px",
    textAlign: "right",
  },
  docLabel: {
    fontWeight: 700,
    fontSize: "18px",
  },
  docDate: {
    marginTop: "8px",
    fontSize: "14px",
  },
  section: {
    marginBottom: "20px",
  },
  sectionTitle: {
    marginBottom: "8px",
    color: "#000",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    border: "1px solid #ccc",
    padding: "10px",
    textAlign: "left",
    background: "#f1f1f1",
  },
  td: {
    border: "1px solid #ccc",
    padding: "10px",
  },
  totalBox: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
  },
  totalPrint: {
    fontWeight: 700,
    fontSize: "20px",
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
