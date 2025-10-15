"use client";

import Link from "next/link";
import { TableRow } from "./table";
import { ReactNode } from "react";

interface ClickableTableRowProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function ClickableTableRow({ href, children, className = "" }: ClickableTableRowProps) {
  return (
    <Link href={href} className="contents">
      <TableRow className={`cursor-pointer hover:bg-muted/50 ${className}`}>
        {children}
      </TableRow>
    </Link>
  );
}