import prismadb from "@/lib/prismadb";

import { OrderContent } from "./components/OrderContent";

const OrderPage = async ({
  params,
}: {
  params: { orderId: string; storeId: string };
}) => {
  const order = await prismadb.order.findUnique({
    where: {
      id: params.orderId,
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    return <h3>Order not found</h3>;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <OrderContent order={order} />
      </div>
    </div>
  );
};

export default OrderPage;
