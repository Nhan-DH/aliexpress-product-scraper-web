function Specifications({ specifications }) {
  if (!specifications || specifications.length === 0) {
    return null
  }

  return (
    <div className="card">
      <h2>Specifications</h2>
      <div className="table-wrap">
        <table className="data-table specs-table">
          <tbody>
            {specifications.map((spec, i) => {
              const key = spec.key || spec.name || spec.attrName || Object.keys(spec)[0] || ''
              const value = spec.value || spec.attrValue || Object.values(spec)[1] || ''
              return (
                <tr key={`${key}-${i}`}>
                  <th>{key}</th>
                  <td>{Array.isArray(value) ? value.join(', ') : String(value)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Specifications
