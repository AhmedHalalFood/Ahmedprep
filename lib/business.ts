export const BUSINESS = {
  name: "AhmedPrep",
  phoneDisplay: "(347) 479-5020",
  phoneHref: "tel:3474795020",
  phoneE164: "+1-347-479-5020",
  email: "Tariq@ahmedprep.com",
  address: {
    street: "20-65 47th Street",
    city: "Astoria",
    region: "NY",
    postalCode: "11105",
    country: "US",
  },
} as const

export const ADDRESS_LINE_1 = BUSINESS.address.street
export const ADDRESS_LINE_2 = `${BUSINESS.address.city}, ${BUSINESS.address.region} ${BUSINESS.address.postalCode}`
export const ADDRESS_FULL = `${ADDRESS_LINE_1} ${ADDRESS_LINE_2}`
