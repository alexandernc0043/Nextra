import { MongoClient, Db } from 'mongodb'

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

const uri = process.env.MONGODB_URI || ''
const dbNameFromEnv = process.env.MONGODB_DB

if (!uri) {
  // Intentionally do not throw here to keep the build from failing
  console.warn('[mongo] MONGODB_URI is not set. API routes depending on MongoDB will fail at runtime.')
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise!
} else {
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise
  const dbName = dbNameFromEnv || (client.options?.dbName as string) || 'nextra'
  const db = client.db(dbName)
  await ensureIndexes(db)
  return db
}

async function ensureIndexes(db: Db) {
  const col = db.collection('intros')
  await col.createIndex({ slug: 1 }, { unique: true })
}

