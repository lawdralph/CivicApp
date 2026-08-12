function Textarea({ label, id, error, ...props }) {
  return (
    <div>
      {label ? (
        <label htmlFor={id} className="label">
          {label}
        </label>
      ) : null}
      <textarea id={id} className="input min-h-32 resize-y" aria-invalid={Boolean(error)} {...props} />
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  )
}

export default Textarea
