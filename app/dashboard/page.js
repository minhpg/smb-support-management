import { Col, Flex, Grid, Title } from "@tremor/react";

import RequestCountCards from "./components/RequestCountCards.component";
import ProgressGraph from "./components/ProgressGraph.component";
import LatestPendingRequestsTable from "./components/LatestPendingRequestsTable.component";
import LateUpdatesTable from "./components/LateUpdatesTable.component";
import RequestsCountChart from "./components/RequestsCountChart.component";
import getSession from "@/supabase/getSession";
import { Suspense } from "react";
import { LoadingCard } from "./loading";

const DashboardPage = async () => {
  const { supabase } = await getSession();
  return (
    <>
      <Flex>
        <Title>Dashboard</Title>
      </Flex>
      <Suspense fallback={<LoadingCard />}>
        <StatisticsBody supabase={supabase} />
      </Suspense>
      <Suspense fallback={<LoadingCard />}>
        <LatestPendingRequestsTable supabase={supabase} />
      </Suspense>
      <Suspense fallback={<LoadingCard />}>
        <LateUpdatesTable supabase={supabase} />
      </Suspense>
    </>
  );
};

const StatisticsBody = async ({ supabase }) => {
  const { count: totalRequestCount } = await supabase
    .from("requests")
    .select("*", { count: "exact", head: true });

  const { count: totalPendingCount } = await supabase
    .from("requests")
    .select("*", { count: "exact", head: true })
    .eq("completed", false)
    .eq("rejected", false);

  const { count: totalRejectedCount } = await supabase
    .from("requests")
    .select("*", { count: "exact", head: true })
    .eq("rejected", true);

  const { count: totalCompletedCount } = await supabase
    .from("requests")
    .select("*", { count: "exact", head: true })
    .eq("completed", true);

  const colors = ["blue", "red", "green"];

  const categories = ["Pending", "Rejected", "Completed"];

  const data = [
    {
      state: "Pending",
      total: totalPendingCount,
    },
    {
      state: "Rejected",
      total: totalRejectedCount,
    },
    {
      state: "Completed",
      total: totalCompletedCount,
    },
  ];

  const cardsData = {
    totalCompletedCount,
    totalRejectedCount,
    totalPendingCount,
    totalRequestCount,
  };

  return (
    <>
      <RequestCountCards {...cardsData} />
      <Grid className="gap-3 mt-6" numItems={1} numItemsLg={2}>
        <Col>
          <ProgressGraph />
        </Col>
        <Col>
          <RequestsCountChart
            data={data}
            categories={categories}
            colors={colors}
          />
        </Col>
      </Grid>
    </>
  );
};

export default DashboardPage;
