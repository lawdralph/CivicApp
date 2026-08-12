function Select({ label, id, options, error, ...props }) {
  return (
    <div>
      {label ? (
        <label htmlFor={id} className="label">
          {label}
        </label>
      ) : null}
      <select id={id} className="input" aria-invalid={Boolean(error)} {...props}>
        <option value="">Select a category</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  )
}

export default Select
