import { useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Box, Container, Heading, SimpleGrid } from "@chakra-ui/react";
import Chart from "chart.js/auto";
import { StoreItemsByIdPublic, WarehouseItemsByIdPublic } from "../../client";

const Value = ({
  storeItems,
  warehouseItems,
}: {
  storeItems: StoreItemsByIdPublic[];
  warehouseItems: WarehouseItemsByIdPublic[];
}) => {
  const chartRefs = {
    wholesalePerItemPerStore: useRef<HTMLCanvasElement | null>(null),
    wholesalePerItemPerWarehouse: useRef<HTMLCanvasElement | null>(null),
    retailPerItemPerStore: useRef<HTMLCanvasElement | null>(null),
    retailPerItemPerWarehouse: useRef<HTMLCanvasElement | null>(null),
  };

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

  const wholesalePerItemPerStore = storeItems.reduce((acc, item) => {
    const { store_id, item_id, item_name, warehouse_price, quantity } = item;

    // @ts-ignore
    if (!acc[store_id]) {
      // @ts-ignore
      acc[store_id] = {};
    }

    // @ts-ignore
    if (!acc[store_id][item_id]) {
      // @ts-ignore
      acc[store_id][item_id] = { name: item_name, value: 0 };
    }

    // @ts-ignore
    acc[store_id][item_id].value += warehouse_price! * quantity;
    return acc;
  }, {});

  const wholesalePerItemPerWarehouse = warehouseItems.reduce((acc, item) => {
    const { warehouse_id, item_id, item_name, warehouse_price, quantity } =
      item;

    // @ts-ignore
    if (!acc[warehouse_id]) {
      // @ts-ignore
      acc[warehouse_id] = {};
    }

    // @ts-ignore
    if (!acc[warehouse_id][item_id]) {
      // @ts-ignore
      acc[warehouse_id][item_id] = { name: item_name, value: 0 };
    }

    // @ts-ignore
    acc[warehouse_id][item_id].value += warehouse_price * quantity;
    return acc;
  }, {});

  const retailPerItemPerStore = storeItems.reduce((acc, item) => {
    const { store_id, item_id, item_name, retail_price, quantity } = item;

    // @ts-ignore
    if (!acc[store_id]) {
      // @ts-ignore
      acc[store_id] = {};
    }

    // @ts-ignore
    if (!acc[store_id][item_id]) {
      // @ts-ignore
      acc[store_id][item_id] = { name: item_name, value: 0 };
    }

    // @ts-ignore
    acc[store_id][item_id].value += retail_price! * quantity;
    return acc;
  }, {});

  const retailPerItemPerWarehouse = warehouseItems.reduce((acc, item) => {
    const { warehouse_id, item_id, item_name, retail_price, quantity } = item;

    // @ts-ignore
    if (!acc[warehouse_id]) {
      // @ts-ignore
      acc[warehouse_id] = {};
    }

    // @ts-ignore
    if (!acc[warehouse_id][item_id]) {
      // @ts-ignore
      acc[warehouse_id][item_id] = { name: item_name, value: 0 };
    }

    // @ts-ignore
    acc[warehouse_id][item_id].value += retail_price * quantity;
    return acc;
  }, {});

  const wholesalePerItemPerStoreData = {
    labels: Object.keys(wholesalePerItemPerStore).map(
      (storeId) => `Store ${storeId}`
    ),
    datasets: Object.keys(wholesalePerItemPerStore).flatMap(
      (storeId, index) => {
        // @ts-ignore
        const storeItems = wholesalePerItemPerStore[storeId];
        return Object.keys(storeItems).map((itemId) => ({
          label: `${storeItems[itemId].name} (Store ${storeId})`,
          backgroundColor: predefinedColors[index % predefinedColors.length],
          borderColor: predefinedColors[index % predefinedColors.length],
          borderWidth: 1,
          data: [storeItems[itemId].value],
        }));
      }
    ),
  };

  const wholesalePerItemPerWarehouseData = {
    labels: Object.keys(wholesalePerItemPerWarehouse).map(
      (warehouseId) => `Warehouse ${warehouseId}`
    ),
    datasets: Object.keys(wholesalePerItemPerWarehouse).flatMap(
      (warehouseId, index) => {
        // @ts-ignore
        const warehouseItems = wholesalePerItemPerWarehouse[warehouseId];
        return Object.keys(warehouseItems).map((itemId) => ({
          label: `${warehouseItems[itemId].name} (Warehouse ${warehouseId})`,
          backgroundColor: predefinedColors[index % predefinedColors.length],
          borderColor: predefinedColors[index % predefinedColors.length],
          borderWidth: 1,
          data: [warehouseItems[itemId].value],
        }));
      }
    ),
  };

  const retailPerItemPerStoreData = {
    labels: Object.keys(retailPerItemPerStore).map(
      (storeId) => `Store ${storeId}`
    ),
    datasets: Object.keys(retailPerItemPerStore).flatMap((storeId, index) => {
      // @ts-ignore
      const storeItems = retailPerItemPerStore[storeId];
      return Object.keys(storeItems).map((itemId) => ({
        label: `${storeItems[itemId].name} (Store ${storeId})`,
        backgroundColor: predefinedColors[index % predefinedColors.length],
        borderColor: predefinedColors[index % predefinedColors.length],
        borderWidth: 1,
        data: [storeItems[itemId].value],
      }));
    }),
  };

  const retailPerItemPerWarehouseData = {
    labels: Object.keys(retailPerItemPerWarehouse).map(
      (warehouseId) => `Warehouse ${warehouseId}`
    ),
    datasets: Object.keys(retailPerItemPerWarehouse).flatMap(
      (warehouseId, index) => {
        // @ts-ignore
        const warehouseItems = retailPerItemPerWarehouse[warehouseId];
        return Object.keys(warehouseItems).map((itemId) => ({
          label: `${warehouseItems[itemId].name} (Warehouse ${warehouseId})`,
          backgroundColor: predefinedColors[index % predefinedColors.length],
          borderColor: predefinedColors[index % predefinedColors.length],
          borderWidth: 1,
          data: [warehouseItems[itemId].value],
        }));
      }
    ),
  };

  return (
    <Container maxW="full" my={20}>
      <SimpleGrid columns={2} spacing={8}>
        <Box border="1px solid #ccc" borderRadius="8px" padding="16px">
          <Heading size="lg">Wholesale Value per Item per Store</Heading>
          <Bar
            data={wholesalePerItemPerStoreData}
            // @ts-ignore
            ref={chartRefs.wholesalePerItemPerStore}
          />
        </Box>

        <Box border="1px solid #ccc" borderRadius="8px" padding="16px">
          <Heading size="lg">Wholesale Value per Item per Warehouse</Heading>
          <Bar
            data={wholesalePerItemPerWarehouseData}
            // @ts-ignore
            ref={chartRefs.wholesalePerItemPerWarehouse}
          />
        </Box>

        <Box border="1px solid #ccc" borderRadius="8px" padding="16px">
          <Heading size="lg">Retail Value per Item per Store</Heading>
          <Bar
            data={retailPerItemPerStoreData}
            // @ts-ignore
            ref={chartRefs.retailPerItemPerStore}
          />
        </Box>

        <Box border="1px solid #ccc" borderRadius="8px" padding="16px">
          <Heading size="lg">Retail Value per Item per Warehouse</Heading>
          <Bar
            data={retailPerItemPerWarehouseData}
            // @ts-ignore
            ref={chartRefs.retailPerItemPerWarehouse}
          />
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default Value;
