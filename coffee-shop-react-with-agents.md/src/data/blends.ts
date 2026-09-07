export type Blend = {
  id: string
  name: string
  origin: string
  region: 'south-indian' | 'international'
  roast: 'Light' | 'Medium' | 'Medium-Dark' | 'Dark'
  notes: string[]
  description: string
  price: number
  emoji: string
}

export const blends: Blend[] = [
  {
    id: 'kumbakonam-degree',
    name: 'Kumbakonam Degree Coffee',
    origin: 'Kumbakonam, Tamil Nadu',
    region: 'south-indian',
    roast: 'Dark',
    notes: ['Chicory', 'Jaggery', 'Malt'],
    description:
      'The classic 80:20 filter blend brewed by the degree — thick decoction, hot milk, endless tumbler-davara pulls.',
    price: 349,
    emoji: '☕',
  },
  {
    id: 'mysore-nuggets',
    name: 'Mysore Nuggets Extra Bold',
    origin: 'Chikmagalur, Karnataka',
    region: 'south-indian',
    roast: 'Medium',
    notes: ['Cocoa', 'Spice', 'Toasted nut'],
    description:
      'India\u2019s flagship washed Arabica. Big, glossy beans with a syrupy body and a long chocolate finish.',
    price: 699,
    emoji: '🫘',
  },
  {
    id: 'monsooned-malabar',
    name: 'Monsooned Malabar AA',
    origin: 'Malabar Coast, Kerala',
    region: 'south-indian',
    roast: 'Medium-Dark',
    notes: ['Musk', 'Tobacco', 'Cream'],
    description:
      'Beans matured in monsoon winds until they swell pale gold — almost zero acidity, huge lingering body.',
    price: 749,
    emoji: '🌧️',
  },
  {
    id: 'araku-valley',
    name: 'Araku Valley Organic',
    origin: 'Araku Valley, Andhra Pradesh',
    region: 'south-indian',
    roast: 'Light',
    notes: ['Jasmine', 'Citrus', 'Honey'],
    description:
      'Tribal-farmed, biodynamic and shade grown at 1,100m. Delicate, floral and startlingly clean.',
    price: 899,
    emoji: '🌸',
  },
  {
    id: 'coorg-estate',
    name: 'Coorg Estate Robusta Kaapi Royale',
    origin: 'Kodagu, Karnataka',
    region: 'south-indian',
    roast: 'Dark',
    notes: ['Dark chocolate', 'Pepper', 'Caramel'],
    description:
      'Heavyweight washed Robusta built for espresso — thunderous crema and a punchy caffeine kick.',
    price: 549,
    emoji: '👑',
  },
  {
    id: 'nilgiri-blue',
    name: 'Nilgiri Blue Mountain',
    origin: 'Nilgiris, Tamil Nadu',
    region: 'south-indian',
    roast: 'Medium',
    notes: ['Blue fruit', 'Vanilla', 'Herbs'],
    description:
      'Grown between tea gardens and eucalyptus. Bright, fruity and gently aromatic in the cup.',
    price: 629,
    emoji: '🏔️',
  },
  {
    id: 'ethiopia-yirgacheffe',
    name: 'Ethiopia Yirgacheffe',
    origin: 'Yirgacheffe, Ethiopia',
    region: 'international',
    roast: 'Light',
    notes: ['Bergamot', 'Peach', 'Black tea'],
    description:
      'The birthplace blend — floral, tea-like and famously perfumed with a crisp citric snap.',
    price: 1049,
    emoji: '🍑',
  },
  {
    id: 'colombia-supremo',
    name: 'Colombia Supremo',
    origin: 'Huila, Colombia',
    region: 'international',
    roast: 'Medium',
    notes: ['Red apple', 'Caramel', 'Almond'],
    description:
      'The dependable all-rounder. Balanced sweetness, medium body, plays nicely with milk.',
    price: 849,
    emoji: '🍎',
  },
  {
    id: 'jamaica-blue-mountain',
    name: 'Jamaica Blue Mountain',
    origin: 'Blue Mountains, Jamaica',
    region: 'international',
    roast: 'Medium',
    notes: ['Butter', 'Hazelnut', 'Mild cocoa'],
    description:
      'Rare, mellow and famously smooth — soft acidity with a velvety, sweet-nutty finish.',
    price: 2499,
    emoji: '💎',
  },
  {
    id: 'sumatra-mandheling',
    name: 'Sumatra Mandheling',
    origin: 'Sumatra, Indonesia',
    region: 'international',
    roast: 'Dark',
    notes: ['Earth', 'Cedar', 'Molasses'],
    description:
      'Wet-hulled and unapologetically earthy. Low acid, syrupy and rumbling with dark sweetness.',
    price: 899,
    emoji: '🌿',
  },
  {
    id: 'brazil-santos',
    name: 'Brazil Santos',
    origin: 'Minas Gerais, Brazil',
    region: 'international',
    roast: 'Medium-Dark',
    notes: ['Peanut', 'Milk chocolate', 'Toffee'],
    description:
      'The espresso base of choice — nutty, sweet and low-acid, with a thick, forgiving crema.',
    price: 749,
    emoji: '🥜',
  },
  {
    id: 'guatemala-antigua',
    name: 'Guatemala Antigua',
    origin: 'Antigua, Guatemala',
    region: 'international',
    roast: 'Medium',
    notes: ['Cocoa nib', 'Orange', 'Smoke'],
    description:
      'Volcanic-soil complexity — cocoa-rich with a bright citrus lift and a whisper of woodsmoke.',
    price: 949,
    emoji: '🌋',
  },
]
