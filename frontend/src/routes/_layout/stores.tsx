import {
  Container,
  Flex,
  Heading,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,  
  Tr,
  Button,
  HStack,
  Text,
  Thead,
  Th,
} from "@chakra-ui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Navigate, createFileRoute } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { StoresService } from "../../client";
import ActionsMenu from "../../components/Common/ActionsMenu";
import Navbar from "../../components/Common/Navbar";
import useAuth from "../../hooks/useAuth";

export const Route = createFileRoute("/_layout/stores")({
  component: Stores,
});

function StoresTableBody({ currentPage, itemsPerPage }:{
  currentPage: number;
  itemsPerPage: number;
}) {
  const { data: stores } = useSuspenseQuery({
    queryKey: ["stores"],
    queryFn: () => StoresService.readStores({}),
  });

  const sortedStores = stores.data.sort((a, b) => a.id - b.id);
  const paginatedStores = sortedStores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Tbody>
      {paginatedStores.map((store) => (
        <Tr key={store.id}>
          <Td>{store.id}</Td>
          <Td color={!store.name ? "ui.dim" : "inherit"}>
            {store.name || "N/A"}
          </Td>
          <Td>{store.location}</Td>
          <Td>
            <ActionsMenu type={"Store"} value={store} />
          </Td>
        </Tr>
      ))}
    </Tbody>
  );
}

function StoresTable() {
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
            <StoresTableBody
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

function Stores() {
  const { user } = useAuth();

  if (!user?.is_superuser) {
    return <Navigate to="/" replace />;
  } else {
    return (
      <Container maxW="full">
        <Heading size="lg" textAlign="center" pt={12}>
          Stores Management
        </Heading>
        <Flex justifyContent={"flex-end"}>
          <Navbar type={"Store"} />
        </Flex>
        <StoresTable />
      </Container>
    );
  }
}
