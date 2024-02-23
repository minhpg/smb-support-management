"use client";

import { getCurrentTimestampTZ } from "@/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AreaChart, Card, Title } from "@tremor/react";
import { useEffect, useState } from "react";

const ProgressGraph = ({ searchParams }) => {
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

      let query = supabase
        .from("requests")
        .select("completed, rejected, created_at, resolved_at")
        .lte("created_at", currentTime)
        .gte("created_at", timestampDeductedWeek)
        .order("created_at", {
          ascending: true,
        });

      if (searchParams.campus) {
        query.eq("campus", searchParams.campus);
      }

      if (searchParams.group) {
        let respondGroupData = await supabase
          .from("respond_group_members")
          .select("respond_group")
          .eq("group", searchParams.group);

        const respondGroups = respondGroupData.data;

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
      const { data: requestsData } = await query;

      let aggregatedDate = requestsData.map((request) => {
        const dateString = request.resolved_at || request.created_at;
        const dateObj = new Date(dateString);
        const date = dateObj.toDateString();
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
          ts: parseInt((new Date(key).getTime() / 1000).toFixed(0)),
          Completed: completedCount,
          Rejected: rejectedCount,
          Pending: pendingCount,
        });
      }
      const sortedDataset = aggregatedDataset.sort((a, b) => a.ts - b.ts);
      setAggregatedData(sortedDataset);
    }
  }, [data]);

  const graphProps = {
    data: aggreatedData,
    index: "date",
    yAxisWidth: 65,
    categories: ["Completed", "Rejected", "Pending"],
    colors: ["green", "red", "blue"],
    allowDecimals: false,
  };

  return (
    <Card>
      <Title>Weekly progress</Title>
      <AreaChart className="mt-6" {...graphProps} />
    </Card>
  );
};

export default ProgressGraph;
