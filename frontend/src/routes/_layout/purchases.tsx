import {
  Container,
  Flex,
  Heading,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  HStack,
  Text,
} from "@chakra-ui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Navigate, createFileRoute } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { PurchasesService } from "../../client";
import useAuth from "../../hooks/useAuth";

export const Route = createFileRoute("/_layout/purchases")({
  component: Purchases,
});

function PurchasesTableBody({
  currentPage,
  itemsPerPage,
}: {
  currentPage: number;
  itemsPerPage: number;
}) {
  const { data: purchases } = useSuspenseQuery({
    queryKey: ["purchases"],
    queryFn: () => PurchasesService.readPurchases({}),
  });

  // Calculating the slice of purchases to display
  const sortedPurchases = purchases.data.sort((a, b) => b.id - a.id);
  const paginatedPurchases = sortedPurchases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Tbody>
      {paginatedPurchases.map((purchase) => (
        <Tr key={purchase.id}>
          <Td>{purchase.id}</Td>
          <Td color={!purchase.item_name ? "ui.dim" : "inherit"}>
            {purchase.item_name || "N/A"}
          </Td>
          <Td>{purchase.quantity}</Td>
          <Td>{purchase.retail_price}</Td>
          <Td>{purchase.date.toString()}</Td>
        </Tr>
      ))}
    </Tbody>
  );
}

function PurchasesTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => prev - 1);

  return (
    <TableContainer>
      <Table size={{ base: "sm", md: "md" }}>
        <Thead>
          <Tr>
            <Th>Purchase ID</Th>
            <Th>Item</Th>
            <Th>Quantity</Th>
            <Th>Price Sold</Th>
            <Th>Date</Th>
          </Tr>
        </Thead>
        <ErrorBoundary
          fallbackRender={({ error }) => (
            <Tbody>
              <Tr>
                <Td colSpan={5}>Something went wrong: {error.message}</Td>
              </Tr>
            </Tbody>
          )}
        >
          <Suspense
            fallback={
              <Tbody>
                {new Array(6).fill(null).map((_, index) => (
                  <Tr key={index}>
                    {new Array(5).fill(null).map((_, index) => (
                      <Td key={index}>
                        <Flex>
                          <Skeleton height="20px" width="20px" />
                        </Flex>
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            }
          >
            <PurchasesTableBody
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
          </Suspense>
        </ErrorBoundary>
      </Table>

      {/* Pagination Controls */}
      <HStack justifyContent="center" mt={10}>
        <Button onClick={prevPage} isDisabled={currentPage <= 1}>
          Previous
        </Button>
        <Text>Page {currentPage}</Text>
        <Button onClick={nextPage}>Next</Button>
      </HStack>
    </TableContainer>
  );
}

function Purchases() {
  const { user } = useAuth();

  if (!user?.is_superuser) {
    return <Navigate to="/" replace />;
  } else {
    return (
      <Container maxW="full">
        <Heading size="lg" mb={20} textAlign="center" pt={12}>
          Purchases
        </Heading>
        <PurchasesTable />
      </Container>
    );
  }
}
