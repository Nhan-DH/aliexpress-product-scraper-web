export const COUNTRY_OPTIONS = [
  { name: 'Canada', code: 'CA' },
  { name: 'United States', code: 'US' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'Australia', code: 'AU' },
  { name: 'Vietnam', code: 'VN' },
  { name: 'Japan', code: 'JP' },
  { name: 'Germany', code: 'DE' },
  { name: 'France', code: 'FR' },
]

function CountrySelector({ value, onChange, disabled }) {
  return (
    <label className="country-selector">
      <span>Ship to</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled}>
        <option value="">Select destination</option>
        {COUNTRY_OPTIONS.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
    </label>
  )
}

export default CountrySelector
