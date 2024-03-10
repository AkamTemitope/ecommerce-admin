"use client";

import { useParams } from "next/navigation";

import { OrderColumn } from "./columns";
import Link from "next/link";

interface CellActionProps {
  data: OrderColumn;
}
export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const params = useParams();

  return (
    <Link
      href={`/${params.storeId}/orders/${data.id}`}
      className="h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md bg-primary text-primary-foreground hover:bg-primary/80"
    >
      View
    </Link>
  );
};
