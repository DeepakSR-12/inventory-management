import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import {
  PurchasesService,
  StoreItemsByIdService,
  WarehouseItemsByIdService,
  type UserPublic,
} from "../../client";
import Charts from "../../components/Charts/Sales";
import Inventory from "../../components/Charts/Inventory";
import Value from "../../components/Charts/Value";

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
});

function Dashboard() {
  const queryClient = useQueryClient();

  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);

  const { data: purchases, isFetching: isFetchingPurchases } = useQuery({
    queryKey: ["purchases"],
    queryFn: () => PurchasesService.readPurchases({}),
  });

  const { data: warehouseItems, isFetching: isFetchingWarehouseItems } =
    useQuery({
      queryKey: ["warehouseItems"],
      queryFn: () => WarehouseItemsByIdService.readWarehouseItems({}),
    });

  const { data: storeItems, isFetching: isFetchingStoreItems } = useQuery({
    queryKey: ["storeItems"],
    queryFn: () => StoreItemsByIdService.readStoreItems({}),
  });

  return (
    <>
      {!!purchases?.data?.length &&
      !!warehouseItems?.data?.length &&
      !!storeItems?.data?.length &&
      !isFetchingPurchases &&
      !isFetchingWarehouseItems &&
      !isFetchingStoreItems ? (
        <Container maxW="full">
          <Flex direction={"column"} gap={30}>
            <Box pt={12} m={4}>
              <Text fontSize="xl">
                Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
              </Text>
              <Text>Welcome back, nice to see you again!</Text>
            </Box>
            <Heading size="2xl" textAlign="center">
              Dashboard
            </Heading>
            <Box m={4}>
              <Charts data={purchases?.data} />
              <Inventory
                warehouseItems={warehouseItems?.data}
                storeItems={storeItems?.data}
              />
              <Value
                warehouseItems={warehouseItems?.data}
                storeItems={storeItems?.data}
              />
            </Box>
          </Flex>
        </Container>
      ) : null}
    </>
  );
}
