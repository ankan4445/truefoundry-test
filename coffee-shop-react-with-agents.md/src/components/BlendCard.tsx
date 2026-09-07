import type { Blend } from '../data/blends'

type Props = {
  blend: Blend
  onAdd: (blend: Blend) => void
}

export default function BlendCard({ blend, onAdd }: Props) {
  return (
    <article className="card">
      <div className="card-art" aria-hidden="true">
        {blend.emoji}
      </div>
      <div className="card-body">
        <div className="card-head">
          <h4>{blend.name}</h4>
          {blend.region === 'south-indian' && <span className="pill">South Indian</span>}
        </div>
        <p className="origin">
          {blend.origin} · {blend.roast} roast
        </p>
        <p className="desc">{blend.description}</p>
        <ul className="notes">
          {blend.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
      <div className="card-foot">
        <span className="price">₹{blend.price.toLocaleString('en-IN')}</span>
        <button className="primary" onClick={() => onAdd(blend)}>
          Add to cart
        </button>
      </div>
    </article>
  )
}
