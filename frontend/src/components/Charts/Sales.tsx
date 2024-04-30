import { useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { Box, Container, Heading, SimpleGrid } from "@chakra-ui/react";
import { PurchasePublic } from "../../client";
import Chart from "chart.js/auto";

const Charts = ({ data }: { data: PurchasePublic[] }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = Chart.getChart(chartRef.current.id);
      if (chartInstance) {
        chartInstance.destroy();
      }
    }
  }, [data]);

  const storeData = data.reduce((acc, curr) => {
    const { store_id, warehouse_price, retail_price, quantity } = curr;

    const revenue = retail_price! * quantity;
    const profit = revenue - warehouse_price! * quantity;

    // @ts-ignore
    if (!acc[store_id]) {
      // @ts-ignore
      acc[store_id] = { revenue: 0, profit: 0 };
    }

    // @ts-ignore
    acc[store_id].revenue += revenue;
    // @ts-ignore
    acc[store_id].profit += profit;

    return acc;
  }, {});

  const storeIds = Object.keys(storeData);

  const revenueData = {
    labels: storeIds,
    datasets: [
      {
        label: "Revenue",
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        // @ts-ignore
        data: storeIds.map((id) => storeData[id].revenue),
      },
    ],
  };

  const profitData = {
    labels: storeIds,
    datasets: [
      {
        label: "Profit",
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        // @ts-ignore
        data: storeIds.map((id) => storeData[id].profit),
      },
    ],
  };

  return (
    <Container maxW="full" mb={20}>
      <SimpleGrid columns={2} spacing={8}>
        <Box border="1px solid #ccc" borderRadius="8px" padding="16px">
          <Heading size="lg">Revenue per Store</Heading>
          {/* @ts-ignore */}
          <Bar data={revenueData} ref={chartRef} />
        </Box>

        <Box border="1px solid #ccc" borderRadius="8px" padding="16px">
          <Heading>Profit per Store</Heading>
          {/* @ts-ignore */}
          <Bar data={profitData} ref={chartRef} />
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default Charts;
