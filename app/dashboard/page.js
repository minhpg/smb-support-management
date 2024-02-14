import { Flex, Title } from "@tremor/react";

import RequestCountCards from "./components/RequestCountCards.component";
import ProgressGraph from "./components/ProgressGraph.component";
import LatestPendingRequestsTable from "./components/LatestPendingRequestsTable.component";
import LateUpdatesTable from './components/LateUpdatesTable.component'

const DashboardPage = async () => {
  return (
    <>
      <Flex>
        <Title>Dashboard</Title>
      </Flex>
      <RequestCountCards />
      <ProgressGraph />
      <LatestPendingRequestsTable />
      <LateUpdatesTable />
    </>
  );
};

export default DashboardPage;
