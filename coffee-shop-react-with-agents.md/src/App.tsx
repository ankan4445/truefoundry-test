import { useMemo, useState } from 'react'
import { blends, type Blend } from './data/blends'
import BlendCard from './components/BlendCard'
import CartDrawer from './components/CartDrawer'
import Checkout, { type Order } from './components/Checkout'
import CoffeeFilterIcon from './components/CoffeeFilterIcon'
import type { CartLine } from './types'

type Filter = 'all' | 'south-indian' | 'international'

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All blends' },
  { id: 'south-indian', label: 'South Indian' },
  { id: 'international', label: 'International' },
]

export default function App() {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [lines, setLines] = useState<CartLine[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return blends
      .filter((b) => (filter === 'all' ? true : b.region === filter))
      .filter(
        (b) =>
          !q ||
          b.name.toLowerCase().includes(q) ||
          b.origin.toLowerCase().includes(q) ||
          b.notes.some((n) => n.toLowerCase().includes(q)),
      )
      // South Indian blends always surface first.
      .sort((a, b) => Number(b.region === 'south-indian') - Number(a.region === 'south-indian'))
  }, [filter, query])

  const count = lines.reduce((n, l) => n + l.qty, 0)
  const subtotal = lines.reduce((n, l) => n + l.blend.price * l.qty, 0)

  function add(blend: Blend) {
    setLines((prev) => {
      const existing = prev.find((l) => l.blend.id === blend.id)
      if (existing) {
        return prev.map((l) => (l.blend.id === blend.id ? { ...l, qty: l.qty + 1 } : l))
      }
      return [...prev, { blend, qty: 1 }]
    })
    setCartOpen(true)
  }

  function setQty(id: string, qty: number) {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.blend.id !== id)
        : prev.map((l) => (l.blend.id === id ? { ...l, qty } : l)),
    )
  }

  function placeOrder(placed: Order) {
    setOrder(placed)
    setLines([])
    setCheckingOut(false)
    setCartOpen(false)
  }

  const southIndian = visible.filter((b) => b.region === 'south-indian')
  const international = visible.filter((b) => b.region === 'international')

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">
            <CoffeeFilterIcon />
          </span>
          <div>
            <h1>Filter &amp; Fable</h1>
            <p>Slow-roasted beans, brewed by the degree.</p>
          </div>
        </div>
        <button className="cart-button" onClick={() => setCartOpen(true)}>
          Cart
          {count > 0 && <span className="badge">{count}</span>}
        </button>
      </header>

      <section className="hero">
        <p className="eyebrow">Fresh from the Western Ghats</p>
        <h2>South Indian filter coffee, front and centre.</h2>
        <p className="hero-copy">
          Decoction-ready dark roasts from Kumbakonam to Coorg, plus the world&apos;s
          great single origins — ground to order the day they ship.
        </p>
      </section>

      <div className="controls">
        <div className="chips">
          {filters.map((f) => (
            <button
              key={f.id}
              className={`chip${filter === f.id ? ' chip-active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          className="search"
          type="search"
          placeholder="Search a blend, origin or tasting note…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <main>
        {southIndian.length > 0 && (
          <section className="catalog-section">
            <div className="section-head">
              <h3>South Indian favourites</h3>
              <span className="section-tag">Our pride</span>
            </div>
            <div className="grid">
              {southIndian.map((b) => (
                <BlendCard key={b.id} blend={b} onAdd={add} />
              ))}
            </div>
          </section>
        )}

        {international.length > 0 && (
          <section className="catalog-section">
            <div className="section-head">
              <h3>From around the world</h3>
            </div>
            <div className="grid">
              {international.map((b) => (
                <BlendCard key={b.id} blend={b} onAdd={add} />
              ))}
            </div>
          </section>
        )}

        {visible.length === 0 && (
          <p className="empty">No blends match “{query}”. Try another note or origin.</p>
        )}
      </main>

      <footer className="footer">
        Prices in ₹ per 250g. Demo store — no real payments are taken.
      </footer>

      <CartDrawer
        open={cartOpen}
        lines={lines}
        subtotal={subtotal}
        onClose={() => setCartOpen(false)}
        onSetQty={setQty}
        onCheckout={() => setCheckingOut(true)}
      />

      {checkingOut && (
        <Checkout
          lines={lines}
          subtotal={subtotal}
          onCancel={() => setCheckingOut(false)}
          onPlaced={placeOrder}
        />
      )}

      {order && (
        <div className="modal-backdrop" onClick={() => setOrder(null)}>
          <div className="modal receipt" onClick={(e) => e.stopPropagation()}>
            <span className="receipt-mark">✅</span>
            <h3>Order {order.id} confirmed</h3>
            <p>
              Thanks {order.name}! {order.items} bag{order.items === 1 ? '' : 's'} roasting
              now — ₹{order.total.toLocaleString('en-IN')} charged to your imaginary card.
            </p>
            <button className="primary" onClick={() => setOrder(null)}>
              Brew something else
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
