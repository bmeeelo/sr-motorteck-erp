export default function HomePage() {
  const empresa = {
    nome: "S.R Motor Teck Auto Center",
    cnpj: "07.545.615/0001-42",
    whatsapp: "(11) 97970-7454",
    endereco: "Estrada João Ducim, 660 - Jardim Oriental - Santo André/SP - CEP 09185-000",
  };

  const indicadores = [
    { titulo: "OS em andamento", valor: "12" },
    { titulo: "OS finalizadas hoje", valor: "5" },
    { titulo: "Faturamento do dia", valor: "R$ 2.850,00" },
    { titulo: "NF-e pendentes", valor: "3" },
  ];

  const ordens = [
    {
      numero: "OS-1021",
      cliente: "João Silva",
      veiculo: "Onix 2018 1.4",
      status: "Em andamento",
      valor: "R$ 420,00",
    },
    {
      numero: "OS-1022",
      cliente: "Carlos Souza",
      veiculo: "HB20 2020 1.0",
      status: "Aguardando peça",
      valor: "R$ 680,00",
    },
    {
      numero: "OS-1023",
      cliente: "Marcos Lima",
      veiculo: "Gol 2017 1.6",
      status: "Finalizado",
      valor: "R$ 350,00",
    },
  ];

  const financeiro = [
    { titulo: "Entradas do mês", valor: "R$ 38.400,00" },
    { titulo: "Saídas do mês", valor: "R$ 17.250,00" },
    { titulo: "A receber", valor: "R$ 6.820,00" },
    { titulo: "Resultado parcial", valor: "R$ 21.150,00" },
  ];

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>{empresa.nome}</h1>
          <p style={styles.subtitle}>ERP Oficina • Painel Inicial</p>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.badge}>Admin</span>
        </div>
      </header>

      <section style={styles.companyBox}>
        <p style={styles.companyText}><strong>CNPJ:</strong> {empresa.cnpj}</p>
        <p style={styles.companyText}><strong>WhatsApp:</strong> {empresa.whatsapp}</p>
        <p style={styles.companyText}><strong>Endereço:</strong> {empresa.endereco}</p>
      </section>

      <section style={styles.grid}>
        {indicadores.map((item) => (
          <div key={item.titulo} style={styles.card}>
            <p style={styles.cardLabel}>{item.titulo}</p>
            <h2 style={styles.cardValue}>{item.valor}</h2>
          </div>
        ))}
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Ordens de Serviço</h2>
          <button style={styles.primaryButton}>Nova OS</button>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Número</th>
                <th style={styles.th}>Cliente</th>
                <th style={styles.th}>Veículo</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {ordens.map((ordem) => (
                <tr key={ordem.numero}>
                  <td style={styles.td}>{ordem.numero}</td>
                  <td style={styles.td}>{ordem.cliente}</td>
                  <td style={styles.td}>{ordem.veiculo}</td>
                  <td style={styles.td}>{ordem.status}</td>
                  <td style={styles.td}>{ordem.valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Resumo Financeiro</h2>
          <button style={styles.secondaryButton}>Ver DRE</button>
        </div>

        <div style={styles.grid}>
          {financeiro.map((item) => (
            <div key={item.titulo} style={styles.card}>
              <p style={styles.cardLabel}>{item.titulo}</p>
              <h2 style={styles.cardValue}>{item.valor}</h2>
            </div>
          ))}
        </div>
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
  headerRight: {
    display: "flex",
    alignItems: "center",
  },
  badge: {
    background: "#ff3b30",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "999px",
    fontWeight: 700,
  },
  companyBox: {
    background: "#17181b",
    border: "1px solid #2a2a2d",
    borderRadius: "14px",
    padding: "18px",
    marginBottom: "24px",
  },
  companyText: {
    margin: "6px 0",
    color: "#e8e8e8",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  card: {
    background: "#17181b",
    border: "1px solid #2a2a2d",
    borderRadius: "14px",
    padding: "18px",
  },
  cardLabel: {
    margin: 0,
    color: "#c7c7c7",
    fontSize: "14px",
  },
  cardValue: {
    margin: "10px 0 0 0",
    fontSize: "24px",
    color: "#ffffff",
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
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    borderBottom: "1px solid #2a2a2d",
    color: "#c7c7c7",
    fontSize: "14px",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #232428",
    color: "#ffffff",
    fontSize: "14px",
  },
};
