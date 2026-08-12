const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
}

function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`${variants[variant] || variants.primary} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
