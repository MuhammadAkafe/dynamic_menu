import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { Category } from '../../types';

// GET - Fetch all menu items
export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      include: {
        category: true,
      },
      orderBy: [
        { category: { name: 'asc' } },
        { name: 'asc' },
      ],
    });

    const formattedItems = menuItems.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      category: {
        id: item.category.id,
        name: item.category.name,
        nameInArabic: item.category.nameInArabic,
      } as Category,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return NextResponse.json(formattedItems, { status: 200 });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

// POST - Create a new menu item
export async function POST(request: NextRequest) {
  try {
    const { name, description, price, category, imageUrl } = await request.json();

    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Extract category ID if it's a Category object, otherwise use it as is
    const categoryId: string = typeof category === 'object' && category !== null && 'id' in category
      ? category.id
      : category;

    // Validate category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Validate and parse price
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name: String(name).trim(),
        description: String(description).trim(),
        price: parsedPrice,
        categoryId: categoryId,
        imageUrl: imageUrl ? String(imageUrl).trim() : null,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      id: menuItem.id,
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      imageUrl: menuItem.imageUrl,
      category: {
        id: menuItem.category.id,
        name: menuItem.category.name,
        nameInArabic: menuItem.category.nameInArabic,
      } as Category,
      createdAt: menuItem.createdAt,
      updatedAt: menuItem.updatedAt,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}

