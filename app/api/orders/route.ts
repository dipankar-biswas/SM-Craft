// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createOrderQuery, getAllOrders } from "@/queries/orders";

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { customerName, customerAddress, customerPhone, items, subtotal, total } = body;
    
    if (!customerName || !customerAddress || !customerPhone) {
      return NextResponse.json(
        { error: "Name, address, and phone are required" },
        { status: 400 }
      );
    }
    
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "At least one item is required" },
        { status: 400 }
      );
    }
    
    if (!subtotal || !total) {
      return NextResponse.json(
        { error: "Subtotal and total are required" },
        { status: 400 }
      );
    }
    
    const orderData = {
      customerName,
      customerAddress,
      customerPhone,
      items,
      subtotal,
      deliveryCharge: body.deliveryCharge || 0,
      total,
      paymentMethod: body.paymentMethod || "cash_on_delivery",
      specialInstructions: body.specialInstructions || null,
    };
    
    const order = await createOrderQuery(orderData);
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Order created successfully",
        order 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create order" },
      { status: 500 }
    );
  }
}

// GET - Get all orders (admin only)
export async function GET(request: NextRequest) {
  try {
    
    const searchParams = request.nextUrl.searchParams;
    const phone = searchParams.get("phone");
    
    let orders;
    if (phone) {
      // Get orders by phone number
      const { getOrdersByPhone } = await import("@/queries/orders");
      orders = await getOrdersByPhone(phone);
    } else {
      // Get all orders (admin)
      orders = await getAllOrders();
    }
    
    return NextResponse.json(
      { success: true, orders },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch orders" },
      { status: 500 }
    );
  }
}