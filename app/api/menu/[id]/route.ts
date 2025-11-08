import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { Category, CategoryName } from '../../../types';
import { categories as categoriesArray } from '../../../category';

// Convert categories array to Record for quick lookup
const categories: Record<CategoryName, Category> = categoriesArray.reduce((acc, category) => {
  acc[category.name] = category;
  return acc;
}, {} as Record<CategoryName, Category>);

// PUT - Update a menu item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const menuItem = await prisma.menuItem.update({
      where: { id },
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
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating menu item:', error);
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a menu item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.menuItem.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Menu item deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting menu item:', error);
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
}

