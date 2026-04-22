import { json } from '@sveltejs/kit'
import { createSubmission, type SubmissionInput } from '$lib/server/repositories/submissions'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeText (value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function validateSubmission (payload: unknown): {
  valid: boolean
  errors: string[]
  data?: SubmissionInput
} {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Invalid request payload.'] }
  }

  const body = payload as Record<string, unknown>
  const fullName = normalizeText(body.fullName)
  const email = normalizeText(body.email).toLowerCase()
  const phone = normalizeText(body.phone)
  const role = normalizeText(body.role)
  const contactMethod = normalizeText(body.contactMethod)
  const notes = normalizeText(body.notes)
  const priority = normalizeText(body.priority)
  const agreeToTerms = body.agreeToTerms === true

  const errors: string[] = []

  if (!fullName || fullName.length > 120)
    errors.push('Full name is required and must be under 120 characters.')
  if (!email || !EMAIL_PATTERN.test(email)) errors.push('A valid email is required.')
  if (!role || role.length > 80) errors.push('Role is required and must be under 80 characters.')
  if (!contactMethod || contactMethod.length > 40)
    errors.push('Contact method is required and must be under 40 characters.')
  if (phone.length > 40) errors.push('Phone must be under 40 characters.')
  if (notes.length > 2_000) errors.push('Project notes must be under 2000 characters.')
  if (priority.length > 40) errors.push('Priority must be under 40 characters.')
  if (!agreeToTerms) errors.push('You must agree to the terms.')

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    errors,
    data: {
      fullName,
      email,
      phone: phone || undefined,
      role,
      contactMethod,
      notes: notes || undefined,
      priority: priority || undefined,
      agreeToTerms
    }
  }
}

export async function POST ({ request }) {
  const payload = await request.json().catch(() => null)
  const result = validateSubmission(payload)

  if (!result.valid || !result.data) {
    return json({ ok: false, errors: result.errors }, { status: 400 })
  }

  try {
    const id = await createSubmission(result.data)
    return json({ ok: true, id }, { status: 201 })
  } catch (error) {
    console.error('Failed to write submission:', error)
    return json({ ok: false, errors: ['Unable to save submission right now.'] }, { status: 500 })
  }
}
