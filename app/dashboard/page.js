import { Col, Flex, Grid, Title } from "@tremor/react";

import RequestCountCards from "./components/RequestCountCards.component";
import ProgressGraph from "./components/ProgressGraph.component";
import LatestPendingRequestsTable from "./components/LatestPendingRequestsTable.component";
import LateUpdatesTable from "./components/LateUpdatesTable.component";
import RequestsCountChart from "./components/RequestsCountChart.component";
import getSession from "@/supabase/getSession";
import { Suspense } from "react";
import { LoadingCard } from "./loading";
import RequestFilters from "./components/RequestFilters.component";

const DashboardPage = async ({ searchParams }) => {
  const { supabase } = await getSession();
  
  return (
    <>
      <Flex>
        <Title>Dashboard</Title>
      </Flex>
      <RequestFilters searchParams={searchParams} />
      <Suspense fallback={<LoadingCard />}>
        <StatisticsBody supabase={supabase} searchParams={searchParams} />
      </Suspense>
      <Suspense fallback={<LoadingCard />}>
        <LatestPendingRequestsTable supabase={supabase} searchParams={searchParams}/>
      </Suspense>
      <Suspense fallback={<LoadingCard />}>
        <LateUpdatesTable supabase={supabase} searchParams={searchParams}/>
      </Suspense>
    </>
  );
};

const StatisticsBody = async ({ supabase, searchParams }) => {

  let respondGroups = []

  if(searchParams.group){
    let respondGroupData = await supabase
    .from("respond_group_members")
    .select("respond_group")
    .eq("group", searchParams.group);
    respondGroups = respondGroupData.data
  }

  const buildQuery = (params) => {
    
    let query = supabase
    .from("requests")
    .select("*", { count: "exact", head: true })
  
    if (searchParams.campus) {
      query.eq("campus", searchParams.campus);
    }
    
    if (searchParams.group) {
      if (respondGroups.length > 0) {
        query = query.or(
          `to.in.(${respondGroups
            .map(({ respond_group }) => respond_group)
            .join(",")})`
        );
      }
    }
  
    if (searchParams.date_range) {
      const { from, to } = JSON.parse(searchParams.date_range);
  
      if (from) {
        let fromDate = new Date(from);
        fromDate.setDate(fromDate.getDate() - 1);
        query.gte("created_at", fromDate.toISOString());
      }
  
      if (to) {
        let toDate = new Date(to);
        toDate.setDate(toDate.getDate() + 1);
        query.lte("created_at", toDate.toISOString());
      }
    }
  
    if (searchParams.status) {
      if (searchParams.status == "pending") {
        query.eq("completed", false).eq("rejected", false);
      }
      if (searchParams.status == "completed") {
        query.eq("completed", true).eq("rejected", false);
      }
      if (searchParams.status == "rejected") {
        query.eq("completed", false).eq("rejected", true);
      }
    }
  
    if (searchParams.priority) {
      query.eq("priority", searchParams.priority);
    }
  
    if (searchParams.created_by) {
      query.eq("from", searchParams.created_by);
    }
  
    if(params) {
      const {
        completed,
        rejected
      } = params
      query.eq("completed", completed)
      query.eq("rejected", rejected);  
    }

    return query
  }

  const { count: totalRequestCount } = await buildQuery()

  const { count: totalPendingCount } = await buildQuery({
    completed: false,
    rejected: false
  })

  const { count: totalRejectedCount } = await buildQuery({
    completed: false,
    rejected: true
  })

  const { count: totalCompletedCount } = await await buildQuery({
    completed: true,
    rejected: false
  })

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
          <ProgressGraph searchParams={searchParams} />
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
