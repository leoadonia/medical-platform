import { AgeDistribution } from "./_components/AgeDistribution";
import { GrowthDistribution } from "./_components/GrowthDistribution";

const DataPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <AgeDistribution />
      <GrowthDistribution />
    </div>
  );
};

export default DataPage;
