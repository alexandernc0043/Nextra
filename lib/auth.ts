import { auth } from '@clerk/nextjs/server'

type SessionClaims = Record<string, unknown> | null | undefined

type ParsedListOptions = {
  toLowerCase?: boolean
}

export async function getAuthContext() {
  const { userId, sessionClaims } = await auth()
  const isAdmin = isAdminUser(userId, sessionClaims)
  return {
    userId,
    sessionClaims,
    isAdmin,
    canModerateIntros: canModerateIntrosUser(sessionClaims, isAdmin),
  }
}

export function isAdminUser(userId: string | null | undefined, sessionClaims: SessionClaims) {
  const adminIds = parseList(process.env.CLERK_ADMIN_USER_IDS, { toLowerCase: false })
  if (userId && adminIds.includes(userId)) {
    return true
  }

  const adminEmails = parseList(process.env.CLERK_ADMIN_EMAILS, { toLowerCase: true })
  if (adminEmails.length > 0) {
    const emails = gatherEmails(sessionClaims)
    if (emails.some((email) => adminEmails.includes(email))) {
      return true
    }
  }

  const roles = gatherRoles(sessionClaims)
  if (roles.includes('teacher_s_assistant')) {
    return true
  }

  const adminRoles = parseList(process.env.CLERK_ADMIN_ROLES, { toLowerCase: true })
  if (adminRoles.length > 0) {
    if (roles.some((role) => adminRoles.includes(role))) {
      return true
    }
  }

  return false
}

function gatherEmails(sessionClaims: SessionClaims) {
  const emails = new Set<string>()
  if (!sessionClaims || typeof sessionClaims !== 'object') {
    return []
  }

  const claims = sessionClaims as Record<string, unknown>
  const push = (value: unknown) => {
    if (typeof value === 'string' && value.trim()) {
      emails.add(value.trim().toLowerCase())
    }
  }

  push(claims.email)
  push(claims.primary_email)

  const emailAddresses = claims.email_addresses
  if (Array.isArray(emailAddresses)) {
    emailAddresses.forEach(push)
  }

  const metadata = claims.metadata
  if (metadata && typeof metadata === 'object') {
    const meta = metadata as Record<string, unknown>
    push(meta.email)
    const emailsFromMeta = meta.emails
    if (Array.isArray(emailsFromMeta)) {
      emailsFromMeta.forEach(push)
    }
  }

  const publicMetadata = claims.publicMetadata
  if (publicMetadata && typeof publicMetadata === 'object') {
    const pub = publicMetadata as Record<string, unknown>
    push(pub.email)
    const emailsFromPublic = pub.emails
    if (Array.isArray(emailsFromPublic)) {
      emailsFromPublic.forEach(push)
    }
  }

  return Array.from(emails)
}

function gatherRoles(sessionClaims: SessionClaims) {
  const roles = new Set<string>()
  if (!sessionClaims || typeof sessionClaims !== 'object') {
    return []
  }

  const claims = sessionClaims as Record<string, unknown>
  const push = (value: unknown) => {
    if (typeof value === 'string' && value.trim()) {
      roles.add(value.trim().toLowerCase())
    } else if (Array.isArray(value)) {
      value.forEach(push)
    }
  }

  const metadata = claims.metadata
  if (metadata && typeof metadata === 'object') {
    const meta = metadata as Record<string, unknown>
    push(meta.role)
    push(meta.roles)
  }

  const publicMetadata = claims.publicMetadata
  if (publicMetadata && typeof publicMetadata === 'object') {
    const pub = publicMetadata as Record<string, unknown>
    push(pub.role)
    push(pub.roles)
  }

  push(claims.org_roles)
  push(claims.roles)

  return Array.from(roles)
}

type OrgMembership = {
  orgId: string
  roles: string[]
}

function gatherOrgMemberships(sessionClaims: SessionClaims): OrgMembership[] {
  if (!sessionClaims || typeof sessionClaims !== 'object') {
    return []
  }

  const claims = sessionClaims as Record<string, unknown>
  const map = new Map<string, Set<string>>()

  const normalizeId = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
  const pushRole = (set: Set<string>, value: unknown) => {
    if (typeof value === 'string') {
      const role = value.trim().toLowerCase()
      if (role) {
        set.add(role)
      }
    } else if (Array.isArray(value)) {
      value.forEach((entry) => pushRole(set, entry))
    }
  }
  const addMembership = (orgIdValue: unknown, roleValue: unknown) => {
    const orgId = normalizeId(orgIdValue)
    if (!orgId) {
      return
    }
    const current = map.get(orgId) ?? new Set<string>()
    pushRole(current, roleValue)
    if (current.size > 0) {
      map.set(orgId, current)
    }
  }

  addMembership(claims.org_id, claims.org_role)
  addMembership(claims.org_id, claims.org_roles)

  const possibleLists = [
    claims.orgs,
    claims.organizations,
    claims.organization_memberships,
    claims.orgMemberships,
    claims.memberships,
  ]

  possibleLists.forEach((list) => {
    if (!Array.isArray(list)) {
      return
    }
    list.forEach((entry) => {
      if (!entry || typeof entry !== 'object') {
        return
      }
      const obj = entry as Record<string, unknown>
      const orgIdValue =
        obj.id ??
        obj.organizationId ??
        obj.organization_id ??
        obj.orgId ??
        obj.org_id
      const roleValue = obj.role ?? obj.roles ?? obj.orgRole ?? obj.org_role
      addMembership(orgIdValue, roleValue)
    })
  })

  const memberships: OrgMembership[] = []
  for (const [orgId, roles] of map) {
    if (roles.size > 0) {
      memberships.push({ orgId, roles: Array.from(roles) })
    }
  }
  return memberships
}

function canModerateIntrosUser(sessionClaims: SessionClaims, isAdmin: boolean) {
  if (isAdmin) {
    return true
  }

  const allowedOrgIds = Array.from(
    new Set([
      ...parseList(process.env.CLERK_INTRO_MODERATOR_ORG_IDS),
      ...parseList(process.env.CLERK_INTRO_MODERATOR_ORG_ID),
    ])
  )
  if (allowedOrgIds.length === 0) {
    return false
  }
  const allowedRoles = Array.from(
    new Set([
      ...parseList(process.env.CLERK_INTRO_MODERATOR_ROLES, { toLowerCase: true }),
      ...parseList(process.env.CLERK_INTRO_MODERATOR_ROLE, { toLowerCase: true }),
    ])
  )
  if (allowedRoles.length === 0) {
    return false
  }

  const memberships = gatherOrgMemberships(sessionClaims)
  return memberships.some(
    (membership) =>
      allowedOrgIds.includes(membership.orgId) &&
      membership.roles.some((role) => allowedRoles.includes(role))
  )
}

function parseList(value: string | undefined | null, options: ParsedListOptions = {}) {
  if (!value) {
    return []
  }
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => (options.toLowerCase ? part.toLowerCase() : part))
}
