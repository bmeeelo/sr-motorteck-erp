<section style={styles.section}>
  <div style={styles.sectionHeader}>
    <h2 style={styles.sectionTitle}>Clientes Recentes</h2>
  </div>

  <div style={{ marginTop: "10px" }}>
    {clientes.length === 0 ? (
      <div style={{ color: "#c7c7c7" }}>Nenhum cliente encontrado.</div>
    ) : (
      clientes.map((cliente) => (
        <div
          key={cliente.id}
          style={{
            marginBottom: "10px",
            padding: "12px",
            border: "1px solid #2a2a2d",
            borderRadius: "10px",
            background: "#111214",
          }}
        >
          <strong>{cliente.nome}</strong>
          <div style={{ color: "#c7c7c7", marginTop: "4px" }}>
            {cliente.telefone || "Sem telefone"}
          </div>
        </div>
      ))
    )}
  </div>
</section>
