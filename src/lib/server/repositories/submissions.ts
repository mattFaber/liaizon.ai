import { FieldValue } from '@google-cloud/firestore'
import { firestore } from '$lib/server/firestore'

export interface SubmissionInput {
  fullName: string
  email: string
  phone?: string
  role: string
  contactMethod: string
  notes?: string
  priority?: string
  agreeToTerms: boolean
}

const COLLECTION_NAME = 'submissions_v1'

export async function createSubmission (input: SubmissionInput) {
  const payload = {
    ...input,
    createdAt: FieldValue.serverTimestamp()
  }

  const ref = await firestore.collection(COLLECTION_NAME).add(payload)
  return ref.id
}
