function Specifications({ specifications }) {
  if (!specifications || specifications.length === 0) {
    return null
  }

  return (
    <div className="card">
      <h2>Specifications</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {specifications.map((spec, i) => {
            const key = spec.key || spec.name || spec.attrName || Object.keys(spec)[0] || ''
            const value = spec.value || spec.attrValue || Object.values(spec)[1] || ''
            return (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fafafa' : 'white' }}>
                <td style={{ padding: '0.5rem 0.75rem', fontWeight: '600', color: '#555', width: '40%', borderBottom: '1px solid #eee' }}>
                  {key}
                </td>
                <td style={{ padding: '0.5rem 0.75rem', color: '#333', borderBottom: '1px solid #eee' }}>
                  {Array.isArray(value) ? value.join(', ') : String(value)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Specifications
