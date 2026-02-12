export type MultiRiskAddon = {
  id: number
  code: string
  description: string
  name: string
  taxons: Taxon[]
  price: number
  prices: Price[]
  ceilings_params: CeilingParams
}

type Taxon = {
  id: number
  name: string
  pretty_name: string
  parent_id: number
  taxonomy_id: number
}

type Price = {
  id: number
  price: string
  currency: "EUR"
  country_iso: string | null
  addon_id: number
  deleted_at: string | null
  created_at: string
  updated_at: string
  variant_id: number | null
}

type CeilingParams = {
  preselected: number
}

export type AddonReworked = {
  id: number | null
  code: number | null
  selectedMaximal: number
  price:  number
}
