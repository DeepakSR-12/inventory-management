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
} from "@chakra-ui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Navigate, createFileRoute } from "@tanstack/react-router";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { PurchasesService } from "../../client";
import Navbar from "../../components/Common/Navbar";
import useAuth from "../../hooks/useAuth";

export const Route = createFileRoute("/_layout/purchases")({
  component: Purchases,
});

function PurchasesTableBody() {
  const { data: purchases } = useSuspenseQuery({
    queryKey: ["purchases"],
    queryFn: () => PurchasesService.readPurchases({}),
  });

  return (
    <Tbody>
      {purchases.data.sort((a, b) => a.id - b.id).map((purchase) => (
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
                <Td colSpan={4}>Something went wrong: {error.message}</Td>
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
            <PurchasesTableBody />
          </Suspense>
        </ErrorBoundary>
      </Table>
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
