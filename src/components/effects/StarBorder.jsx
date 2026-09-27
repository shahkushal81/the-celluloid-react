export default function StarBorder({ children, as: As = "button", className = "", ...rest }) {
  return (
    <As className={`star-border ${className}`} {...rest}>
      {children}
    </As>
  );
}