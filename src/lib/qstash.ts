import { Client } from "@upstash/qstash"

const client = new Client({
  token: process.env.QSTASH_TOKEN,
})

await client.publish({
  url: "https://example.com",
  headers: {
    "Content-Type": "application/json",
  },
})