import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET - Fetch all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            menuItems: true,
          },
        },
      },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create a new category
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body. Please provide valid JSON.' },
        { status: 400 }
      );
    }

    const { name, nameInArabic } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Check if category with same name already exists
    let existingCategory;
    try {
      existingCategory = await prisma.category.findUnique({
        where: { name: name.trim() },
      });
    } catch (dbError: any) {
      console.error('Database query error (findUnique):', dbError);
      throw dbError; // Re-throw to be caught by outer catch
    }

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      );
    }

    // Create the category
    let category;
    try {
      category = await prisma.category.create({
        data: {
          name: name.trim(),
          nameInArabic: nameInArabic?.trim() || null,
        },
      });
    } catch (createError: any) {
      console.error('Database create error:', createError);
      throw createError; // Re-throw to be caught by outer catch
    }

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    console.error('Error details:', {
      code: error?.code,
      message: error?.message,
      meta: error?.meta,
      name: error?.name,
    });
    
    // Provide more detailed error messages
    let errorMessage = 'Failed to create category';
    let statusCode = 500;
    
    // Handle Prisma-specific errors
    if (error?.code === 'P2002') {
      errorMessage = 'A category with this name already exists';
      statusCode = 400;
    } else if (error?.code === 'P1001') {
      errorMessage = 'Cannot reach database server. Please check your database connection.';
    } else if (error?.code === 'P1000') {
      errorMessage = 'Database authentication failed. Please check your database credentials.';
    } else if (error?.code === 'P1017') {
      errorMessage = 'Database server closed the connection. Please try again.';
    } else if (error?.code === 'P2025') {
      errorMessage = 'Record not found';
      statusCode = 404;
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    // Log full error in production for debugging (Vercel logs)
    if (process.env.NODE_ENV === 'production') {
      console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        errorCode: error?.code || 'UNKNOWN_ERROR',
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: statusCode }
    );
  }
}

