export type Capability = {
  id: string
  number: string
  title: string
  summary: string
  tools: string[]
  methods: string[]
}

export type Project = {
  id: string
  eyebrow: string
  title: string
  context: string
  role: string
  stack: string[]
  challenge: string
  outcome: string
  status?: 'ongoing' | 'selected'
  href?: string
}

export type Experience = {
  title: string
  organization: string
  dates: string
  location?: string
  summary: string
}

export type Recognition = {
  title: string
  issuer?: string
  year?: string
  detail?: string
}
