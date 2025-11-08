import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { Category, CategoryName } from '../../types';

// GET - Fetch all menu items
export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
    });

    // Convert category strings to Category objects
    const categories: Record<CategoryName, Category> = {
      Grill: { id: 1, name: 'Grill' },
      Salads: { id: 2, name: 'Salads' },
      Drinks: { id: 3, name: 'Drinks' },
    };

    const formattedItems = menuItems.map((item) => ({
      ...item,
      category: categories[item.category as CategoryName] || { id: 0, name: item.category as CategoryName },
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
    const { name, description, price, category } = await request.json();

    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Extract category name if it's a Category object, otherwise use it as is
    const categoryName: string = typeof category === 'object' && category !== null && 'name' in category
      ? category.name
      : category;

    // Validate category
    const validCategories: CategoryName[] = ['Grill', 'Salads', 'Drinks'];
    if (!validCategories.includes(categoryName as CategoryName)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        category: categoryName,
      },
    });

    // Convert back to Category object for response
    const categories: Record<CategoryName, Category> = {
      Grill: { id: 1, name: 'Grill' },
      Salads: { id: 2, name: 'Salads' },
      Drinks: { id: 3, name: 'Drinks' },
    };

    return NextResponse.json({
      ...menuItem,
      category: categories[categoryName as CategoryName],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}

