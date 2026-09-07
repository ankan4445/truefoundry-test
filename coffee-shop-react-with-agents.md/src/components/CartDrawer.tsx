import type { CartLine } from '../types'

type Props = {
  open: boolean
  lines: CartLine[]
  subtotal: number
  onClose: () => void
  onSetQty: (id: string, qty: number) => void
  onCheckout: () => void
}

export default function CartDrawer({
  open,
  lines,
  subtotal,
  onClose,
  onSetQty,
  onCheckout,
}: Props) {
  return (
    <aside className={`drawer${open ? ' drawer-open' : ''}`} aria-hidden={!open}>
      <div className="drawer-head">
        <h3>Your cart</h3>
        <button className="ghost" onClick={onClose} aria-label="Close cart">
          ✕
        </button>
      </div>

      {lines.length === 0 ? (
        <p className="empty">Nothing brewing yet. Add a blend to get started.</p>
      ) : (
        <ul className="lines">
          {lines.map(({ blend, qty }) => (
            <li key={blend.id} className="line">
              <span className="line-art" aria-hidden="true">
                {blend.emoji}
              </span>
              <div className="line-body">
                <strong>{blend.name}</strong>
                <span className="origin">{blend.origin}</span>
                <div className="qty">
                  <button onClick={() => onSetQty(blend.id, qty - 1)} aria-label="Decrease">
                    −
                  </button>
                  <span>{qty}</span>
                  <button onClick={() => onSetQty(blend.id, qty + 1)} aria-label="Increase">
                    +
                  </button>
                  <button className="link" onClick={() => onSetQty(blend.id, 0)}>
                    Remove
                  </button>
                </div>
              </div>
              <span className="price">₹{(blend.price * qty).toLocaleString('en-IN')}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="drawer-foot">
        <div className="row">
          <span>Subtotal</span>
          <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
        </div>
        <p className="fineprint">Shipping and taxes calculated at checkout.</p>
        <button className="primary wide" disabled={lines.length === 0} onClick={onCheckout}>
          Checkout
        </button>
      </div>
    </aside>
  )
}
