export function FormFieldError({ message }: { message?: string }) {
  if (!message) return null

  return <p className="text-xs font-medium text-destructive">{message}</p>
}
