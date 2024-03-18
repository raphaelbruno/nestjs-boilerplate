import { PrismaClient } from '@prisma/client';
import rbacSeeder from './seed/rbac';

const prisma = new PrismaClient();

async function main() {
  const rbacSeeded = await rbacSeeder(prisma);
  console.log(`- Seed: RBAC ${rbacSeeded ? 'completed' : 'already seeded'}`);
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
