"use client";

import { getCurrentTimestampTZ } from "@/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AreaChart, Card, Title } from "@tremor/react";
import { useEffect, useState } from "react";

const ProgressGraph = () => {
  const supabase = createClientComponentClient();
  const [data, setData] = useState(null);
  const [aggreatedData, setAggregatedData] = useState([]);

  useEffect(() => {
    const fetchGraphData = async () => {
      const currentTime = getCurrentTimestampTZ();
      let d = new Date();
      d.setDate(d.getDate() - 30);
      const timestampDeductedWeek = new Date(
        d + 1000 * 60 * -new Date().getTimezoneOffset()
      )
        .toISOString()
        .replace("T", " ")
        .replace("Z", "");
      const { data: requestsData } = await supabase
        .from("requests")
        .select("completed, rejected, created_at, resolved_at")
        .lte("created_at", currentTime)
        .gte("created_at", timestampDeductedWeek)
        .order("created_at", {
          ascending: true,
        });

      let aggregatedDate = requestsData.map((request) => {
        const dateString = request.resolved_at || request.created_at;
        const date = new Date(dateString).toDateString();
        return {
          ...request,
          date,
        };
      });
      setData(aggregatedDate);
    };
    fetchGraphData();
  }, [supabase]);

  const groupByDate = (objects) => {
    console.log(objects);
    return objects.reduce((grouped, object) => {
      const { date } = object;

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(object);

      return grouped;
    }, {});
  };

  useEffect(() => {
    if (data) {
      const aggregatedComplete = groupByDate(data);

      const aggregatedDataset = [];
      for (const [key, value] of Object.entries(aggregatedComplete)) {
        const completedCount = value.filter((item) => item.completed).length;
        const rejectedCount = value.filter((item) => item.rejected).length;
        const pendingCount = value.filter(
          (item) => !item.completed && !item.rejected
        ).length;
        aggregatedDataset.push({
          date: key,
          Completed: completedCount,
          Rejected: rejectedCount,
          Pending: pendingCount,
        });
      }

      setAggregatedData(aggregatedDataset);
    }
  }, [data]);

  console.log(aggreatedData);

  const graphProps = {
    data: aggreatedData,
    index: "date",
    yAxisWidth: 65,
    categories: ["Completed", "Rejected", "Pending"],
    colors: ["green", "red", "blue"],
    allowDecimals: false,
  };

  return (
    <Card className="mt-6">
      <Title>Weekly progress</Title>
      <AreaChart className="mt-6" {...graphProps} />
    </Card>
  );
};

export default ProgressGraph;
