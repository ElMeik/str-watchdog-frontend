export default function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'h-4 w-4', md: 'h-7 w-7', lg: 'h-12 w-12' }[size]
  return (
    <div
      className={`${s} animate-spin rounded-full border-2 border-[#2d3447] border-t-blue-500`}
      role="status"
      aria-label="Lädt…"
    />
  )
}
