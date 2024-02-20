import {
  Card,
  Flex,
  Grid,
  Metric,
  ProgressBar,
  Text,
} from "@tremor/react";

const RequestCountCards = async ({
  totalRequestCount,
  totalPendingCount,
  totalCompletedCount,
  totalRejectedCount,
}) => {
  return (
    <>
      <Grid className="mt-6 gap-6" numItems={1} numItemsMd={2} numItemsLg={3}>
        <Card>
          <Flex alignItems="start">
            <div className="truncate">
              <Text>Total Requests</Text>
              <Metric className="truncate">{totalRequestCount}</Metric>
            </div>
          </Flex>
          <Flex className="mt-4 space-x-2">
            <Text className="truncate">{`${(
              (totalPendingCount / totalRequestCount) *
              100
            ).toFixed(0)}% pending`}</Text>
            <Text className="truncate">
              {totalPendingCount}/{totalRequestCount}
            </Text>
          </Flex>
          <ProgressBar
            value={(totalPendingCount / totalRequestCount) * 100}
            className="mt-2"
          />
        </Card>
        <Card>
          <Flex alignItems="start">
            <div className="truncate">
              <Text>Completed Requests</Text>
              <Metric className="truncate">{totalCompletedCount}</Metric>
            </div>
          </Flex>
          <Flex className="mt-4 space-x-2">
            <Text className="truncate">{`${(
              (totalCompletedCount / totalRequestCount) *
              100
            ).toFixed(0)}% completed`}</Text>
            <Text className="truncate">
              {totalCompletedCount}/{totalRequestCount}
            </Text>
          </Flex>
          <ProgressBar
            value={(totalCompletedCount / totalRequestCount) * 100}
            className="mt-2"
            color="green"
          />
        </Card>
        <Card>
          <Flex alignItems="start">
            <div className="truncate">
              <Text>Rejected Requests</Text>
              <Metric className="truncate">{totalRejectedCount}</Metric>
            </div>
          </Flex>
          <Flex className="mt-4 space-x-2">
            <Text className="truncate">{`${(
              (totalRejectedCount / totalRequestCount) *
              100
            ).toFixed(0)}% rejected`}</Text>
            <Text className="truncate">
              {totalRejectedCount}/{totalRequestCount}
            </Text>
          </Flex>
          <ProgressBar
            value={(totalRejectedCount / totalRequestCount) * 100}
            className="mt-2"
            color="red"
          />
        </Card>
      </Grid>
    </>
  );
};

export default RequestCountCards;
