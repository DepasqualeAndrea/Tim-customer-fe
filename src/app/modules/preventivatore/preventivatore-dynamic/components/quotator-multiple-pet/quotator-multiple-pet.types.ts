export type PetsIndexer = [PetsCollection]

export type PetsCollection = {
  dogs: PetRace[],
  cats: PetRace[]
}

export type PetKind = keyof PetsCollection;

export type PetRace = {
  id: number
  breed: string
  helvetia_code: string
  kind: PetKindCode
}

type PetKindCode = Cat | Dog
type Dog = '1'
type Cat = '2'

export type PetKindLabel = 'Cane' | 'Gatto'
export type RequestPetKind = 'dog' | 'cat'

export type PaymentPeriodCode = 'Y' | 'M'
export type PaymentPeriod = 'yearly' | 'monthly'