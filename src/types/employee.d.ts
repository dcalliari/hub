interface Employee {
  id: number
  companyDocument: string
  name: string
  document: string
  birthDate: string
  phone: string
  hasCard: boolean
  deliveryAddress: {
    street: string
    number: string
    complement: string
    district: string
    city: string
    zipCode: string
    state: string
  }
}