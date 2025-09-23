import { PrismaClient } from '../lib/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  const categories = [
    { name: 'Person' },
    { name: 'Event' },
    { name: 'Organization' },
    { name: 'Location' },
  ]

  for (const c of categories) {
    await prisma.category.upsert({
      where: { name: c.name },
      update: {}, // 已存在则不更新
      create: c,
    })
  }

  console.log('✅ Categories seeded')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
