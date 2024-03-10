"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Order, OrderItem, Product, Image as ImageType } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/AlertModal";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";
import { formatter } from "@/lib/utils";

interface OrderContentProps {
  order: Order & {
    orderItems: Array<
      OrderItem & { product: Product & { images: ImageType[] } }
    >;
  };
}

export const OrderContent: React.FC<OrderContentProps> = ({ order }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = "Order details";
  const description = "Details of the order";
  const total = formatter.format(
    order.orderItems.reduce((total, item) => {
      return total + Number(item.product.price) * Number(item.quantity);
    }, 0)
  );

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/orders/${params.orderId}`);
      router.refresh();
      router.push(`/${params.storeId}/orders`);
      toast.success("Order deleted.");
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        <div className="flex flex-col justify-center gap-2 sm:flex-row">
          <Button
            disabled={loading}
            variant="secondary"
            size="sm"
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-5">
        <h3>Phone: {order.phone}</h3>
        <h3>Address: {order.address}</h3>
        <h3>
          Paid:
          {order.isPaid ? (
            <span className="px-2 py-1 ml-4 font-bold text-white rounded-md bg-success">
              TRUE
            </span>
          ) : (
            <span className="px-2 py-1 ml-4 font-bold text-white rounded-md bg-destructive">
              FALSE
            </span>
          )}
        </h3>
        <h3>
          Order Total: <b>{total}</b>
        </h3>
        <p className="text-sm">
          Created at:{" "}
          <span className="text-gray-400">
            {format(order.createdAt, "MMMM do, yyyy")}
          </span>
        </p>
        <h3 className="text-lg font-bold text-center">Products</h3>
        <div className="grid gap-5 pt-4 border-t-2 md:grid-cols-2 lg:grid-cols-3">
          {order.orderItems.map((item: any) => (
            <Card key={item.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>{item.product.name}</CardTitle>
                <CardDescription>
                  <div className="flex flex-col">
                    <h3>Quantity: {item.quantity}</h3>
                    <h3>Price per pair: ${Number(item.product.price)}</h3>
                    <h3>
                      Total: $
                      {Number(item.product.price) * Number(item.quantity)}
                    </h3>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src={item.product.images[0].url}
                  className="object-contain"
                  alt="product image"
                  width={500}
                  height={500}
                />
              </CardContent>
              <CardFooter>
                <Link
                  href={`/${params.storeId}/products/${item.product.id}`}
                  className="h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  View Product
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};
