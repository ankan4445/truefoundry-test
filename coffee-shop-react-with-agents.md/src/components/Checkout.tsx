import { useState, type FormEvent } from 'react'
import type { CartLine } from '../types'

export type Order = {
  id: string
  name: string
  items: number
  total: number
}

type Props = {
  lines: CartLine[]
  subtotal: number
  onCancel: () => void
  onPlaced: (order: Order) => void
}

const SHIPPING = 79

export default function Checkout({ lines, subtotal, onCancel, onPlaced }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [card, setCard] = useState('')
  const [placing, setPlacing] = useState(false)

  const total = subtotal + SHIPPING
  const items = lines.reduce((n, l) => n + l.qty, 0)

  function submit(e: FormEvent) {
    e.preventDefault()
    setPlacing(true)
    // Fake payment — nothing leaves the browser.
    window.setTimeout(() => {
      onPlaced({
        id: `FF-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
        name: name.trim() || 'friend',
        items,
        total,
      })
    }, 900)
  }

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Checkout</h3>
        <p className="fineprint">Demo only — do not enter a real card number.</p>

        <form className="form" onSubmit={submit}>
          <label>
            Full name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Delivery address
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </label>
          <label>
            Card number
            <input
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
              value={card}
              onChange={(e) => setCard(e.target.value)}
              required
            />
          </label>

          <div className="summary">
            <div className="row">
              <span>
                {items} item{items === 1 ? '' : 's'}
              </span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="row">
              <span>Shipping</span>
              <span>₹{SHIPPING}</span>
            </div>
            <div className="row total">
              <span>Total</span>
              <strong>₹{total.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <div className="actions">
            <button type="button" className="ghost wide" onClick={onCancel}>
              Back
            </button>
            <button type="submit" className="primary wide" disabled={placing}>
              {placing ? 'Placing order…' : `Pay ₹${total.toLocaleString('en-IN')}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
