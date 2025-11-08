import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@restaurant.com' },
    update: {},
    create: {
      email: 'admin@restaurant.com',
      password: hashedPassword,
    },
  });

  console.log('Created admin user:', admin.email);

  // Create sample menu items
  const menuItems = [
    {
      name: 'Grilled Chicken',
      description: 'Tender grilled chicken breast with herbs',
      price: 15.99,
      category: 'Grill',
    },
    {
      name: 'Grilled Salmon',
      description: 'Fresh salmon with lemon and herbs',
      price: 18.99,
      category: 'Grill',
    },
    {
      name: 'Beef Steak',
      description: 'Juicy ribeye steak cooked to perfection',
      price: 24.99,
      category: 'Grill',
    },
    {
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with Caesar dressing',
      price: 8.99,
      category: 'Salads',
    },
    {
      name: 'Greek Salad',
      description: 'Mixed greens with feta cheese and olives',
      price: 9.99,
      category: 'Salads',
    },
    {
      name: 'Garden Salad',
      description: 'Fresh seasonal vegetables with vinaigrette',
      price: 7.99,
      category: 'Salads',
    },
    {
      name: 'Coca Cola',
      description: 'Refreshing cola drink',
      price: 2.99,
      category: 'Drinks',
    },
    {
      name: 'Orange Juice',
      description: 'Freshly squeezed orange juice',
      price: 3.99,
      category: 'Drinks',
    },
    {
      name: 'Coffee',
      description: 'Hot brewed coffee',
      price: 2.49,
      category: 'Drinks',
    },
  ];

  // Clear existing menu items and create new ones
  await prisma.menuItem.deleteMany({});
  await prisma.menuItem.createMany({
    data: menuItems,
  });

  console.log(`Created ${menuItems.length} menu items`);
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

