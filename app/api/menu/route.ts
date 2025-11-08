import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { Category, CategoryName } from '../../types';
import { categories as categoriesArray } from '../../category';

// Convert categories array to Record for quick lookup
const categories: Record<CategoryName, Category> = categoriesArray.reduce((acc, category) => {
  acc[category.name] = category;
  return acc;
}, {} as Record<CategoryName, Category>);

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
    type PrismaMenuItem = {
      id: string;
      name: string;
      description: string;
      price: number;
      category: string;
      createdAt: Date;
      updatedAt: Date;
    };

    type FormattedMenuItem = Omit<PrismaMenuItem, 'category'> & {
      category: Category;
    };

    const formattedItems: FormattedMenuItem[] = menuItems
      .map((item: PrismaMenuItem) => {
        const categoryObj = categories[item.category as CategoryName];
        if (!categoryObj) {
          // Skip items with invalid categories or log a warning
          console.warn(`Invalid category found: ${item.category} for item ${item.id}`);
          return null;
        }
        return {
          ...item,
          category: categoryObj,
        };
      })
      .filter((item: FormattedMenuItem | null): item is FormattedMenuItem => item !== null);

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
    const validCategoryNames = categoriesArray.map(c => c.name);
    if (!validCategoryNames.includes(categoryName as CategoryName)) {
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
        category: categoryName as CategoryName,
      },
    });

    // Get the category object - we know it exists because we validated it
    const categoryObj = categories[categoryName as CategoryName];
    if (!categoryObj) {
      // This should never happen due to validation, but handle it safely
      return NextResponse.json(
        { error: 'Category lookup failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...menuItem,
      category: categoryObj,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}

