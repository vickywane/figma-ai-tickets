import { RiResetLeftFill } from "react-icons/ri";
import { FullExperience } from "../components/CTA/FullExperience";
import TaskBreakdown from "../components/TaskBreakdown";
import { Link, useLocation } from "react-router-dom";
import { GoLinkExternal } from "react-icons/go";

const Details = () => {
  const location = useLocation();
  const details = location.state || {};

  const handleCreateTask = () => {
    const urlParams = new URLSearchParams();

    urlParams.append("title", details.title);
    urlParams.append("description", details.message);

    window.open(`https://linear.new?${urlParams.toString()}`, "_blank");
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="justify-between py-1 w-full">
        <div className="mt-4 mx-4">
          <div className="mb-2">
            <h1 className="text-sm capitalize font-roboto">
              Generated Details
            </h1>
          </div>

          <TaskBreakdown details={details} />

          <div className="mt-4 flex justify-between gap-2 w-full">
            <div
              onClick={handleCreateTask}
              className="flex hover:cursor-pointer flex-row items-center gap-1"
            >
              <p className="text-xs hover:underline text-gray-600">
                Create Issue In Linear With Link
              </p>

              <GoLinkExternal className="text-xs text-gray-600" />
            </div>

            <Link to={"/"}>
              <div className="flex items-center justify-center border border-gray-500 hover:border-gray-800 rounded-full w-6 min-w-6 h-6 hover:cursor-pointer">
                <RiResetLeftFill className="text-xs" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <FullExperience />
    </div>
  );
};

export default Details;
