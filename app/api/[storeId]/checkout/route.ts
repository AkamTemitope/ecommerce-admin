import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { cartItems } = await req.json();

  if (!cartItems || cartItems.length === 0) {
    return new NextResponse("Product are required in cart", { status: 400 });
  }

  const productIds = cartItems.map((cartItem: any) => cartItem.productId);

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const cart = cartItems.map((cartItem: any) => {
    const product = products.find(
      (product) => product.id === cartItem.productId
    );
    if (!product) {
      throw new Error("Product not found");
    }
    return {
      product: product,
      quantity: cartItem.quantity,
    };
  });

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  cart.forEach((item: any) => {
    lineItems.push({
      quantity: item.quantity,
      price_data: {
        currency: "USD",
        product_data: {
          name: item.product.name,
        },
        unit_amount: Math.round(item.product.price.toNumber() * 100),
      },
    });
  });

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        createMany: {
          data: cart.map((item: any) => ({
            productId: item.product.id,
            quantity: item.quantity.toString(),
          })),
        },
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}
