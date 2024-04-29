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
  import { StoresService } from "../../client";
  import ActionsMenu from "../../components/Common/ActionsMenu";
  import Navbar from "../../components/Common/Navbar";
import useAuth from "../../hooks/useAuth";
  
  export const Route = createFileRoute("/_layout/stores")({
    component: Stores,
  });
  
  function StoresTableBody() {
    const { data: stores } = useSuspenseQuery({
      queryKey: ["stores"],
      queryFn: () => StoresService.readStores({}),
    });
  
    return (
      <Tbody>
        {stores.data.map((store) => (
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
    return (
      <TableContainer>
        <Table size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Location</Th>
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
              <StoresTableBody />
            </Suspense>
          </ErrorBoundary>
        </Table>
      </TableContainer>
    );
  }
  
  function Stores() {
    const { user } = useAuth();

  if (!user?.is_superuser) {
    return <Navigate to="/" replace />
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