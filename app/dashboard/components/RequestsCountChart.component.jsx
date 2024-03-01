"use client";

import { Card, DonutChart, Legend, Title } from "@tremor/react";

const RequestsCountChart = ({ data, colors, categories }) => {
  return (
    <Card className="h-full">
      <Title>Requests</Title>
      <div className="mt-6">
        <DonutChart
          data={data}
          category="total"
          index="state"
          // valueFormatter={valueFormatter}
          colors={colors}
          className="w-full mt-6 h-64"
        />
      </div>
    </Card>
  );
};

export default RequestsCountChart;
