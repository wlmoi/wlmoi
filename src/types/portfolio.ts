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
  discipline?: 'Hardware & AI' | 'Software & automation' | 'Design verification' | 'DSP' | 'IoT & embedded' | 'Data analytics'
  metrics?: [string, string][]
  resources?: { title: string; href: string; format: string }[]
  images?: { src: string; alt: string; caption: string }[]
}

export type Experience = {
  title: string
  organization: string
  dates: string
  location?: string
  summary: string
  bullets?: string[]
}

export type Recognition = {
  title: string
  issuer?: string
  year?: string
  detail?: string
}

export type Credential = {
  title: string
  issuer: string
  date?: string
  credentialId?: string
  expiry?: string
  category?: 'Engineering' | 'Software & data' | 'Communication & leadership' | 'Competitions'
}
