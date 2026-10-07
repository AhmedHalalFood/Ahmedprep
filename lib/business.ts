export const SITE_URL = "https://ahmedprep.com"

export const BUSINESS = {
  name: "AhmedPrep",
  phoneDisplay: "(347) 479-5020",
  phoneHref: "tel:3474795020",
  smsHref: "sms:+13474795020",
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
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`AhmedPrep ${ADDRESS_FULL}`)}`
export const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS_FULL)}&output=embed`

export const STATS = [
  { value: "2,500+", label: "Students Mentored" },
  { value: "96%", label: "Admission Rate" },
  { value: "150+ Points", label: "Average Improvement" },
  { value: "12+ Years", label: "of Excellence" },
] as const

/** Edit this text to add methodology or supporting details for the statistics above. */
export const STATS_DISCLAIMER =
  "Statistics as reported by AhmedPrep. Average improvement refers to SAT score points. Individual results vary and are not guaranteed."

export const NOT_AFFILIATED_NOTE =
  "AhmedPrep is an independent test preparation provider and is not affiliated with the NYC Department of Education, the College Board, or any Specialized High School."
