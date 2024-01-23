import { Title } from "@tremor/react";

const DashboardUnauthorizedPage = async () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-center">
          <div>
            <Title>Unauthorized</Title>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUnauthorizedPage;
