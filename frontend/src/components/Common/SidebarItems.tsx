import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  FiBriefcase,
  FiHome,
  FiSettings,
  FiUsers,
  FiShoppingBag,
  FiShoppingCart,
} from "react-icons/fi";

import type { UserPublic } from "../../client";

const items = [{ icon: FiHome, title: "Dashboard", path: "/" }];

interface SidebarItemsProps {
  onClose?: () => void;
}

const SidebarItems = ({ onClose }: SidebarItemsProps) => {
  const queryClient = useQueryClient();
  const textColor = useColorModeValue("ui.main", "ui.light");
  const bgActive = useColorModeValue("#E2E8F0", "#4A5568");
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);

  let finalItems = currentUser?.is_superuser
    ? [
        ...items,
        { icon: FiBriefcase, title: "Items", path: "/items" },
        { icon: FiHome, title: "Warehouses", path: "/warehouses" },
        { icon: FiShoppingBag, title: "Stores", path: "/stores" },
        { icon: FiUsers, title: "Users", path: "/users" },
      ]
    : items;

  finalItems = [
    ...finalItems,
    { icon: FiShoppingCart, title: "Purchases", path: "/purchases" },
    { icon: FiSettings, title: "User Settings", path: "/settings" },
  ];

  const listItems = finalItems.map(({ icon, title, path }) => (
    <Flex
      as={Link}
      to={path}
      w="100%"
      p={2}
      key={title}
      activeProps={{
        style: {
          background: bgActive,
          borderRadius: "12px",
        },
      }}
      color={textColor}
      onClick={onClose}
    >
      <Icon as={icon} alignSelf="center" />
      <Text ml={2}>{title}</Text>
    </Flex>
  ));

  return (
    <>
      <Box>{listItems}</Box>
    </>
  );
};

export default SidebarItems;
