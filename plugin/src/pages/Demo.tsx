import { useState } from "react";
import {
  COMPLETE_CREATE_TASK,
  DISABLE_GENERATE_TASK,
  GENERATE_TASK_DETAILS,
  SET_TASK_DETAILS,
} from "../consts/messages";
import { Spinner } from "../components/spinner";
import useUserStore from "../stores/user";
import { FrameSelection } from "../components/FrameSelection";
import { RiResetLeftFill } from "react-icons/ri";
import { FullExperience } from "../components/CTA/FullExperience";
import { useNavigate } from "react-router-dom";

type FrameState = {
  isValid: boolean;
  name: string;
};

const initialFrameState = {
  isValid: true,
  name: "",
};

const Index = () => {
  const [selectedFrame, setSelectedFrame] =
    useState<FrameState>(initialFrameState);
  const [isLoading, setLoader] = useState(false);
  const [detailsData, setDetailsData] = useState(null);

  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  onmessage = (event) => {
    const msg = event.data.pluginMessage;

    if (msg.type === DISABLE_GENERATE_TASK) {
      return setSelectedFrame({
        name: msg.name,
        isValid: !msg.isValid,
      });
    }

    if (msg.type === SET_TASK_DETAILS) {
      navigate("/details", {
        state: msg.data,
      });

      setLoader(false);
    }

    if (msg.type === COMPLETE_CREATE_TASK) {
      setSelectedFrame(initialFrameState);
      setDetailsData(null);
      setLoader(false);
    }
  };

  const emitGenerateTaskDetails = () => {
    setLoader(true);
    parent.postMessage(
      {
        pluginMessage: {
          type: GENERATE_TASK_DETAILS,
          integration: "Linear",
          user: user?.id,
        },
      },
      "*"
    );
  };

  const handleReset = () => {
    setDetailsData(null);
    setLoader(false);
    setSelectedFrame(initialFrameState);
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="justify-between py-1 w-full">
        <div className="mt-2 mx-4 grid gap-1">
          <h1 className="text-base capitalize font-roboto font-semibold">
            Quick Demo
          </h1>

          <p className="text-sm text-gray-800 font-roboto">
            FigTicket saves the countless hours spent creating and writing
            details for your design tasks.
          </p>
        </div>

        <div className="h-[1px] w-full bg-gray-200 my-8" />

        <div className="mx-4">
          <div className="mb-2">
            <h1 className="text-sm capitalize font-roboto">
              Generate Ticket Details
            </h1>
          </div>

          <FrameSelection name={selectedFrame.name} />

          {!selectedFrame.isValid && (
            <div className="mt-4 flex gap-2 w-full">
              <button
                disabled={isLoading || selectedFrame.isValid}
                onClick={emitGenerateTaskDetails}
                className="hover:cursor-pointer text-white flex items-center gap-2 justify-center w-full bg-blue-700 disabled:bg-gray-400 hover:bg-blue-800 font-normal font-vietnam text-xs px-1 py-2 mb-2"
              >
                {isLoading ? "Generating" : "Generate"} Details
                {isLoading && <Spinner />}
              </button>

              <div>
                <button
                  disabled={isLoading}
                  onClick={handleReset}
                  className="text-gray-800 flex items-center justify-center border border-gray-800 rounded-full w-8 min-w-8 h-8 hover:cursor-pointer"
                >
                  <RiResetLeftFill className="text-base" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <FullExperience />
    </div>
  );
};

export default Index;
