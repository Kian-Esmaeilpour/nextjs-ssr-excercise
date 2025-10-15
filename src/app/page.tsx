import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AccidentStat } from "@/types/accident-stat";
import Link from "next/link";
import { paginateByCurrentPage } from "../utils/paginate-by-current-page";

export default async function page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const params = await searchParams;
  const currentPage = params?.page ? parseInt(params?.page) : 1;

  // json-server doesn't add a pagination decorator for you, so here you go

  const TOTAL_LENGTH = 50626;
  const LIMIT = 15;
  const response = await fetch(
    `http://localhost:3030/accidents-stat?_page=${currentPage}&_limit=${LIMIT}`
  );

  const accidents = (await response.json()) as AccidentStat[];
  const pageNumbers = Array.from(
    { length: TOTAL_LENGTH / LIMIT },
    (_, i) => i + 1
  );
  const { isFirstPage, isLastPage, paginationNumbers } = paginateByCurrentPage(
    currentPage,
    pageNumbers
  );

  const firstPage = pageNumbers[0];
  const lastPage = pageNumbers[pageNumbers.length - 1];

  return (
    <main>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Location (Borough)</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Serverity</TableHead>
            <TableHead>Casualties Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accidents?.map((accident) => (
            <TableRow
              key={accident.id}
              className="cursor-pointer hover:bg-muted/50"
            >
              <TableCell>
                <Link
                  key={accident.id}
                  href={`/${accident.id}`}
                  prefetch={true}
                >
                  {accident.id}
                </Link>
              </TableCell>
              <TableCell>
                {accident.location} ({accident.borough})
              </TableCell>
              <TableCell>{accident.date}</TableCell>
              <TableCell>{accident.severity}</TableCell>
              <TableCell>{accident.casualties.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p>Page 1 of 3375</p>
      <Pagination>
        <PaginationContent>
          {!isFirstPage && (
            <PaginationItem>
              <PaginationPrevious
                href={`?page=${currentPage - 1}`}
                prefetch={true}
              />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink aria-disabled>{currentPage}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href={`?page=${currentPage + 1}`} prefetch={true}>
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href={`?page=${currentPage + 2}`} prefetch={true}>
              {currentPage + 2}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          {!isLastPage && (
            <PaginationItem>
              <PaginationNext
                href={`?page=${currentPage + 1}`}
                prefetch={true}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </main>
  );
}
