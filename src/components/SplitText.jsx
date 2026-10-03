/** Splits text into masked words (or chars) for GSAP reveals. Screen readers get the plain string. */
export default function SplitText({ text, by = 'word', className = '', charClass = '' }) {
  const parts = by === 'char' ? Array.from(text) : text.split(' ')
  return (
    <span aria-label={text} role="text" className={className}>
      {parts.map((p, i) => (
        <span key={i} aria-hidden="true" className="mask">
          <span data-split className={`inline-block ${charClass}`}>
            {p === ' ' ? ' ' : p}
            {by === 'word' && i < parts.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </span>
  )
}
