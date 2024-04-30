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
import { WarehousesService } from "../../client";
import ActionsMenu from "../../components/Common/ActionsMenu";
import Navbar from "../../components/Common/Navbar";
import useAuth from "../../hooks/useAuth";

export const Route = createFileRoute("/_layout/warehouses")({
  component: Warehouses,
});

function WarehousesTableBody({
  currentPage,
  itemsPerPage,
}: {
  currentPage: number;
  itemsPerPage: number;
}) {
  const { data: warehouses } = useSuspenseQuery({
    queryKey: ["warehouses"],
    queryFn: () => WarehousesService.readWarehouses({}),
  });

  const sortedWarehouses = warehouses.data.sort((a, b) => a.id - b.id);
  const paginatedWarehouses = sortedWarehouses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Tbody>
      {paginatedWarehouses.map((warehouse) => (
        <Tr key={warehouse.id}>
          <Td>{warehouse.id}</Td>
          <Td color={!warehouse.name ? "ui.dim" : "inherit"}>
            {warehouse.name || "N/A"}
          </Td>
          <Td>{warehouse.location}</Td>
          <Td>
            <ActionsMenu type={"Warehouse"} value={warehouse} />
          </Td>
        </Tr>
      ))}
    </Tbody>
  );
}

function WarehousesTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => prev - 1);

  return (
    <TableContainer>
      <Table size={{ base: "sm", md: "md" }}>
        <Thead>
          <Tr>
            <Th width="25%">ID</Th>
            <Th width="35%">Name</Th>
            <Th width="35%">Location</Th>
            <Th>Actions</Th>
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
                {new Array(5).fill(null).map((_, index) => (
                  <Tr key={index}>
                    {new Array(4).fill(null).map((_, index) => (
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
            <WarehousesTableBody
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
          </Suspense>
        </ErrorBoundary>
      </Table>

      {/* Pagination controls */}
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

function Warehouses() {
  const { user } = useAuth();

  if (!user?.is_superuser) {
    return <Navigate to="/" replace />;
  } else {
    return (
      <Container maxW="full">
        <Heading size="lg" textAlign="center" pt={12}>
          Warehouses Management
        </Heading>
        <Flex justifyContent={"flex-end"}>
          <Navbar type={"Warehouse"} />
        </Flex>
        <WarehousesTable />
      </Container>
    );
  }
}
