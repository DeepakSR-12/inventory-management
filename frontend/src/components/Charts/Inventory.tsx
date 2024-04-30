import { useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Box, Container, Heading, SimpleGrid } from "@chakra-ui/react";
import Chart from "chart.js/auto";
import { StoreItemsByIdPublic, WarehouseItemsByIdPublic } from "../../client";

const Inventory = ({
  storeItems,
  warehouseItems,
}: {
  storeItems: StoreItemsByIdPublic[];
  warehouseItems: WarehouseItemsByIdPublic[];
}) => {
  const chartRefs = {
    unitsPerItem: useRef<HTMLCanvasElement | null>(null),
    unitsPerItemPerStore: useRef<HTMLCanvasElement | null>(null),
    unitsPerItemPerWarehouse: useRef<HTMLCanvasElement | null>(null),
  };

  // 10 predefined colors
  const predefinedColors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#FF4B8B",
    "#A1C181",
    "#F1C40F",
    "#7F8C8D",
  ];

  useEffect(() => {
    Object.values(chartRefs).forEach((ref) => {
      if (ref.current) {
        const chartInstance = Chart.getChart(ref.current.id);
        if (chartInstance) chartInstance.destroy();
      }
    });
  }, [storeItems, warehouseItems]);

  const unitsPerItem = storeItems.concat(warehouseItems).reduce((acc, item) => {
    const { item_id, item_name, quantity } = item;

    // @ts-ignore
    if (!acc[item_id]) {
      // @ts-ignore
      acc[item_id] = { name: item_name, quantity: 0 };
    }
    // @ts-ignore
    acc[item_id].quantity += quantity;
    return acc;
  }, {});

  const unitsPerItemPerStore = storeItems.reduce((acc, item) => {
    const { store_id, item_id, item_name, quantity } = item;

    // @ts-ignore
    if (!acc[store_id]) {
      // @ts-ignore
      acc[store_id] = {};
    }

    // @ts-ignore
    if (!acc[store_id][item_id]) {
      // @ts-ignore
      acc[store_id][item_id] = { name: item_name, quantity: 0 };
    }
    // @ts-ignore
    acc[store_id][item_id].quantity += quantity;
    return acc;
  }, {});

  const unitsPerItemPerWarehouse = warehouseItems.reduce((acc, item) => {
    const { warehouse_id, item_id, item_name, quantity } = item;
    // @ts-ignore
    if (!acc[warehouse_id]) {
      // @ts-ignore
      acc[warehouse_id] = {};
    }
    // @ts-ignore
    if (!acc[warehouse_id][item_id]) {
      // @ts-ignore
      acc[warehouse_id][item_id] = { name: item_name, quantity: 0 };
    }
    // @ts-ignore
    acc[warehouse_id][item_id].quantity += quantity;
    return acc;
  }, {});

  const storeColors = Object.keys(unitsPerItemPerStore).reduce(
    (acc, storeId) => {
      // @ts-ignore
      acc[storeId] =
        predefinedColors[parseInt(storeId) % predefinedColors.length];
      return acc;
    },
    {}
  );

  const warehouseColors = Object.keys(unitsPerItemPerWarehouse).reduce(
    (acc, warehouseId) => {
      // @ts-ignore
      acc[warehouseId] =
        predefinedColors[parseInt(warehouseId) % predefinedColors.length];
      return acc;
    },
    {}
  );

  const unitsPerItemData = {
    // @ts-ignore
    labels: Object.values(unitsPerItem).map((item) => item?.name),
    datasets: [
      {
        label: "Units",
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        // @ts-ignore
        data: Object.values(unitsPerItem).map((item) => item.quantity),
      },
    ],
  };

  const unitsPerItemPerStoreData = {
    labels: Object.keys(unitsPerItemPerStore).map(
      (storeId) => `Store ${storeId}`
    ),
    datasets: Object.keys(unitsPerItemPerStore).flatMap((storeId, _) => {
      // @ts-ignore
      const storeItems = unitsPerItemPerStore[storeId];
      return Object.keys(storeItems).map((itemId) => ({
        label: `${storeItems[itemId].name} (Store ${storeId})`,
        // @ts-ignore
        backgroundColor: storeColors[storeId],
        // @ts-ignore
        borderColor: storeColors[storeId],
        borderWidth: 1,
        data: [storeItems[itemId].quantity],
      }));
    }),
  };

  const unitsPerItemPerWarehouseData = {
    labels: Object.keys(unitsPerItemPerWarehouse).map(
      (warehouseId) => `Warehouse ${warehouseId}`
    ),
    datasets: Object.keys(unitsPerItemPerWarehouse).flatMap(
      (warehouseId, _) => {
        // @ts-ignore
        const warehouseItems = unitsPerItemPerWarehouse[warehouseId];
        return Object.keys(warehouseItems).map((itemId) => ({
          label: `${warehouseItems[itemId].name} (Warehouse ${warehouseId})`,
          // @ts-ignore
          backgroundColor: warehouseColors[warehouseId],
          // @ts-ignore
          borderColor: warehouseColors[warehouseId],
          borderWidth: 1,
          data: [warehouseItems[itemId].quantity],
        }));
      }
    ),
  };

  return (
    <Container maxW="full">
      <SimpleGrid columns={1} spacing={8} mb={20} alignItems={"center"}>
        <Box maxW="49%" border="1px solid #ccc" borderRadius="8px" padding="16px">
          <Heading size="lg">Units per Item</Heading>
          {/* @ts-ignore */}
          <Bar data={unitsPerItemData} ref={chartRefs.unitsPerItem} />
        </Box>
      </SimpleGrid>
      <SimpleGrid columns={2} spacing={8}>
        <Box border="1px solid #ccc" borderRadius="8px" padding="16px">
          <Heading size="lg">Units per Item per Store</Heading>
          <Bar
            data={unitsPerItemPerStoreData}
            // @ts-ignore
            ref={chartRefs.unitsPerItemPerStore}
          />
        </Box>

        <Box border="1px solid #ccc" borderRadius="8px" padding="16px">
          <Heading size="lg">Units per Item per Warehouse</Heading>
          <Bar
            data={unitsPerItemPerWarehouseData}
            // @ts-ignore
            ref={chartRefs.unitsPerItemPerWarehouse}
          />
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default Inventory;
