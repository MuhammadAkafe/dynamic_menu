import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { Category, CategoryName } from '../../../types';

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
    const validCategories: CategoryName[] = ['Grill', 'Salads', 'Drinks'];
    if (!validCategories.includes(categoryName as CategoryName)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    const menuItem = await prisma.menuItem.update({
      where: { id },
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

