export type Cohort = {
  id: string
  program: "SHSAT" | "Digital SAT"
  label: string
  days: string
  time: string
  dates: string
  sessions: number
  hours: number
}
export type Term = {
  id: "winter" | "spring" | "summer"
  name: string
  cohorts: readonly Cohort[]
  tuition: { regular: number; early: number; founding: number }
  deadlines: readonly { group: string; founding: string; early: string }[]
}
export const TERMS_2027: readonly Term[] = [
  {
    id: "winter", name: "Winter 2027",
    tuition: { regular: 1440, early: 1296, founding: 1080 },
    deadlines: [
      { group: "Weekend SHSAT and Digital SAT", founding: "November 28, 2026", early: "December 12, 2026" },
      { group: "Weekday SHSAT", founding: "November 30, 2026", early: "December 14, 2026" },
      { group: "Weekday Digital SAT", founding: "December 1, 2026", early: "December 15, 2026" },
    ],
    cohorts: [
      { id: "winter-shsat-weekday", program: "SHSAT", label: "Weekday", days: "Monday and Wednesday", time: "5:30–8:30 PM", dates: "January 11 – March 31", sessions: 24, hours: 72 },
      { id: "winter-dsat-weekday", program: "Digital SAT", label: "Weekday", days: "Tuesday and Thursday", time: "5:30–8:30 PM", dates: "January 12 – April 1", sessions: 24, hours: 72 },
      { id: "winter-shsat-weekend", program: "SHSAT", label: "Weekend", days: "Saturday and Sunday", time: "10 AM–1 PM", dates: "January 9 – March 28", sessions: 24, hours: 72 },
      { id: "winter-dsat-weekend", program: "Digital SAT", label: "Weekend", days: "Saturday and Sunday", time: "2–5 PM", dates: "January 9 – March 28", sessions: 24, hours: 72 },
    ],
  },
  {
    id: "spring", name: "Spring 2027",
    tuition: { regular: 1440, early: 1296, founding: 1080 },
    deadlines: [
      { group: "Weekend SHSAT and Digital SAT", founding: "February 20, 2027", early: "March 6, 2027" },
      { group: "Weekday SHSAT", founding: "February 22, 2027", early: "March 8, 2027" },
      { group: "Weekday Digital SAT", founding: "February 23, 2027", early: "March 9, 2027" },
    ],
    cohorts: [
      { id: "spring-shsat-weekday", program: "SHSAT", label: "Weekday", days: "Monday and Wednesday", time: "5:30–8:30 PM", dates: "April 5 – June 23", sessions: 24, hours: 72 },
      { id: "spring-dsat-weekday", program: "Digital SAT", label: "Weekday", days: "Tuesday and Thursday", time: "5:30–8:30 PM", dates: "April 6 – June 24", sessions: 24, hours: 72 },
      { id: "spring-shsat-weekend", program: "SHSAT", label: "Weekend", days: "Saturday and Sunday", time: "10 AM–1 PM", dates: "April 3 – June 20", sessions: 24, hours: 72 },
      { id: "spring-dsat-weekend", program: "Digital SAT", label: "Weekend", days: "Saturday and Sunday", time: "2–5 PM", dates: "April 3 – June 20", sessions: 24, hours: 72 },
    ],
  },
  {
    id: "summer", name: "Summer 2027",
    tuition: { regular: 0, early: 0, founding: 0 },
    deadlines: [
      { group: "Weekend SHSAT and Digital SAT", founding: "May 22, 2027", early: "June 5, 2027" },
      { group: "Weekday Intensive SHSAT and Digital SAT", founding: "May 25, 2027", early: "June 8, 2027" },
    ],
    cohorts: [
      { id: "summer-shsat-intensive", program: "SHSAT", label: "Weekday Intensive", days: "Monday–Thursday", time: "10 AM–1 PM", dates: "July 6 – August 26; final session August 29", sessions: 32, hours: 96 },
      { id: "summer-dsat-intensive", program: "Digital SAT", label: "Weekday Intensive", days: "Monday–Thursday", time: "2–5 PM", dates: "July 6 – August 26; final session August 29", sessions: 32, hours: 96 },
      { id: "summer-shsat-weekend", program: "SHSAT", label: "Weekend", days: "Saturday and Sunday", time: "10 AM–1 PM", dates: "July 3 – August 22; July 4 closure made up August 28", sessions: 16, hours: 48 },
      { id: "summer-dsat-weekend", program: "Digital SAT", label: "Weekend", days: "Saturday and Sunday", time: "2–5 PM", dates: "July 3 – August 22; July 4 closure made up August 28", sessions: 16, hours: 48 },
    ],
  },
] as const
export const priceFor = (cohort: Cohort) => cohort.hours === 96
  ? { regular: 1920, early: 1728, founding: 1440 }
  : cohort.hours === 48
    ? { regular: 960, early: 864, founding: 720 }
    : { regular: 1440, early: 1296, founding: 1080 }
