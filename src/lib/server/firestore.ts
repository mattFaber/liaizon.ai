import { Firestore } from '@google-cloud/firestore'
import { env } from '$env/dynamic/private'

declare global {
  var __liaizonFirestore: Firestore | undefined
}

const projectId = env.GOOGLE_CLOUD_PROJECT ?? env.GCLOUD_PROJECT
const databaseId = env.FIRESTORE_DATABASE_ID ?? '(default)'

function createFirestoreClient () {
  return new Firestore({
    projectId,
    databaseId
  })
}

export const firestore = globalThis.__liaizonFirestore ?? createFirestoreClient()

if (env.NODE_ENV !== 'production') {
  globalThis.__liaizonFirestore = firestore
}
