import { useEffect, useState } from "react";
import {
  COMPLETE_CREATE_TASK,
  CREATE_TASK,
  DISABLE_GENERATE_TASK,
  GENERATE_TASK_DETAILS,
  SET_TASK_DETAILS,
} from "../consts/messages";
import { Spinner } from "../components/spinner";
import useUserStore from "../stores/user";
import Header from "../components/header";
import { createSupbaseClient, getUserIntegrations } from "../clients/supabase";
import TaskBreakdown from "../components/TaskBreakdown";
import { FrameSelection } from "../components/FrameSelection";
import { EmptyIntegration } from "../components/EmptyIntegration";

type FrameState = {
  isValid: boolean; 
  name: string;
};
 
const MOCK = { 
  message:
    '### Description\nImplement the \'Life As A Human\' design section as shown in the provided image. The design features a split layout with an image on the left and text content on the right.\n\n### Acceptance Criteria\n- The left side of the layout should display an image of a bridge in a forest setting.\n- The right side should contain the following text elements:\n - Title: "Life As A Human" with special characters "<" and ">" on either side.\n - Description: "I work as a Frontend Engineer and also an advocate for Cloud Engineering through written articles on Cloud Services as a Technical Author."\n- Ensure the text is styled to match the design, with the title in bold and larger font size.\n- The layout should be responsive and maintain the split design on various screen sizes.\n\n### More Information\n- Consider using CSS Flexbox or Grid for the layout to ensure responsiveness.\n- Pay attention to the typography and spacing to match the design closely.\n- Ensure the image is optimized for web use to maintain performance.',
  title: "Implement 'Life As A Human' Design Section",
};
 
const initialFrameState = {
  isValid: true,
  name: "",
};

const Home = () => {
  const [selectedFrame, setSelectedFrame] =
    useState<FrameState>(initialFrameState);
  const [isLoading, setLoader] = useState(false);
  const [detailsData, setDetailsData] = useState(null);

  const user = useUserStore((state) => state.user);

  const [userIntegrations, setUserIntegration] = useState(null); 
  const supabase = createSupbaseClient();

  onmessage = (event) => {
    const msg = event.data.pluginMessage;

    if (msg.type === DISABLE_GENERATE_TASK) {
      return setSelectedFrame({
        name: msg.name,
        isValid: !msg.isValid,
      });
    }

    if (msg.type === SET_TASK_DETAILS) {
      setDetailsData(msg.data);
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
      { pluginMessage: { type: GENERATE_TASK_DETAILS, user: user.id } },
      "*"
    );
  };

  const emitCreateTask = () => {
    setLoader(true);
    parent.postMessage(
      {
        pluginMessage: {
          type: CREATE_TASK,
          data: {
            ...detailsData,
            columnId: detailsData?.boardList[0]?.id,
            user: user.id,
          },
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

  useEffect(() => {
    if (user) {
      const getIntegrations = async () => {
        const integrations = await getUserIntegrations(user.id);
        setUserIntegration(integrations);
      };

      getIntegrations();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const realtimeChannel = supabase
      .channel("public:integrations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "integrations"
        },
        (payload) => {
          if (payload.eventType === "INSERT" && payload.new) {
            setUserIntegration((prev) => [...prev, payload.new as any]);
          }

          if (payload.eventType === "DELETE" && payload.old) {
            const filteredIntegrations = userIntegrations.filter(
              (item) => item.id !== payload.old.id
            );

            setUserIntegration(filteredIntegrations);
          }
        }
      )
      .subscribe((status, error) => {
        console.log(`Subscription status: ${status}`);

        if (error) {
          console.error("Subscription error:", error);
        }
      });

    return () => {
      supabase.removeChannel(realtimeChannel);
    };
  }, [supabase, user]);

  return (
    <div className="h-full w-full flex flex-col justify-start items-center">
      <Header integrations={userIntegrations} />

      {userIntegrations && userIntegrations.length <= 0 ? (
        <div className="flex items-center h-full ">
          <EmptyIntegration />
        </div>
      ) : (
        <div className="justify-between px-4 py-1 w-full">
          {detailsData ? (
            <TaskBreakdown details={detailsData} />
          ) : (
            <FrameSelection name={selectedFrame.name} />
          )}

          <div className="mt-4 flex gap-2 w-full ">
            {detailsData ? (
              <button
                disabled={isLoading || selectedFrame.isValid}
                onClick={emitCreateTask}
                className="text-white col-span-2 flex items-center gap-2 justify-center w-full bg-blue-700 disabled:bg-gray-400 hover:bg-blue-800 font-normal rounded text-xs px-1 py-2 mb-2"
              >
                {isLoading ? "Creating" : "Create"} Task
                {isLoading && <Spinner />}
              </button>
            ) : (
              <button
                disabled={isLoading || selectedFrame.isValid}
                onClick={emitGenerateTaskDetails}
                className="text-white flex items-center gap-2 justify-center w-full bg-blue-700 disabled:bg-gray-400 hover:bg-blue-800 font-normal rounded text-xs px-1 py-2 mb-2"
              >
                {isLoading ? "Generating" : "Generate"} Details
                {isLoading && <Spinner />}
              </button>
            )}

            <button
              disabled={isLoading}
              onClick={handleReset}
              className="text-white col-span-2 flex items-center gap-2 justify-center w-full bg-blue-700 disabled:bg-gray-400 hover:bg-blue-800 font-normal rounded text-xs px-1 py-2 mb-2"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
