import { PrismaClient } from "../apps/web/lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "Person", description: "Default category for person" },
    { name: "Event", description: "Default category for event" },
    { name: "Organization", description: "Default category for organization" },
    { name: "Location", description: "Default category for location" },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { name: c.name },
      update: {}, // 已存在则不更新
      create: c,
    });
  }

  console.log("✅ Categories seeded");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
