import {
  Badge,
  Box,
  Container,
  Flex,
  Heading,
  SkeletonText,
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
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Navigate, createFileRoute } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { type UserPublic, UsersService } from "../../client";
import ActionsMenu from "../../components/Common/ActionsMenu";
import Navbar from "../../components/Common/Navbar";
import useAuth from "../../hooks/useAuth";
import { ErrorBoundary } from "react-error-boundary";

export const Route = createFileRoute("/_layout/users")({
  component: Users,
});

function MembersTableBody({
  currentPage,
  itemsPerPage,
}: {
  currentPage: number;
  itemsPerPage: number;
}) {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);

  const { data: users } = useSuspenseQuery({
    queryKey: ["users"],
    queryFn: () => UsersService.readUsers({}),
  });

  // Sorting and paginating users
  const sortedUsers = users.data.sort((a, b) => a.id - b.id);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Tbody>
      {paginatedUsers.map((user) => (
        <Tr key={user.id}>
          <Td color={!user.full_name ? "ui.dim" : "inherit"}>
            {user.full_name || "N/A"}
            {currentUser?.id === user.id && (
              <Badge ml="1" colorScheme="teal">
                You
              </Badge>
            )}
          </Td>
          <Td>{user.email}</Td>
          <Td>{user.is_superuser ? "Superuser" : "User"}</Td>
          <Td>
            <Flex gap={2}>
              <Box
                w="2"
                h="2"
                borderRadius="50%"
                bg={user.is_active ? "ui.success" : "ui.danger"}
                alignSelf="center"
              />
              {user.is_active ? "Active" : "Inactive"}
            </Flex>
          </Td>
          <Td>
            <ActionsMenu
              type="User"
              value={user}
              disabled={currentUser?.id === user.id ? true : false}
            />
          </Td>
        </Tr>
      ))}
    </Tbody>
  );
}

const MembersBodySkeleton = () => {
  return (
    <Tbody>
      <Tr>
        {new Array(5).fill(null).map((_, index) => (
          <Td key={index}>
            <SkeletonText noOfLines={1} paddingBlock="16px" />
          </Td>
        ))}
      </Tr>
    </Tbody>
  );
};

function Users() {
  const { user } = useAuth();

  if (!user?.is_superuser) {
    return <Navigate to="/" replace />;
  } else {
    const [currentPage, setCurrentPage] = useState(1);    
    const itemsPerPage = 10;

    const nextPage = () => setCurrentPage((prev) => prev + 1);
    const prevPage = () => setCurrentPage((prev) => prev - 1);

    return (
      <Container maxW="full">
        <Heading size="lg" textAlign="center" pt={12}>
          User Management
        </Heading>
        <Flex justifyContent={"flex-end"}>
          <Navbar type={"User"} />
        </Flex>
        <TableContainer>
          <Table fontSize="md" size={{ base: "sm", md: "md" }}>
            <Thead>
              <Tr>
                <Th width="20%">Full name</Th>
                <Th width="20%">Email</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
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
              <Suspense fallback={<MembersBodySkeleton />}>
                <MembersTableBody
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
            <Button
              onClick={nextPage}              
            >
              Next
            </Button>
          </HStack>
        </TableContainer>
      </Container>
    );
  }
}
