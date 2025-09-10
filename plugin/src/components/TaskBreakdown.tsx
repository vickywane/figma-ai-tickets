import { useState } from "react";
import Markdown from "../components/markdown";
import { FiCopy, FiShare } from "react-icons/fi";

type TaskBreakdownProps = {
  details: any;
};

const TaskBreakdown = ({ details }: TaskBreakdownProps) => {
  const copyToClipboard = async (text: string) => {
    try {
      parent.postMessage(
        {
          pluginMessage: {
            type: "COPY_TO_CLIPBOARD",
            data: {
              text,
            },
          },
        },
        "*"
      );
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between border-b border-gray-400 h-9">
          <label className="text-sm"> Name </label>

          <div
            className="hover:cursor-pointer"
            onClick={() => copyToClipboard(details.title)}
          >
            <div className="flex text-xs gap-1.5 items-center border border-gray-400 rounded-full px-2 py-1">
              <div>
                <p className="text-xs border-gray-400">Copy</p>
              </div>

              <FiCopy className="text-xs text-gray-500" />
            </div>
          </div>
        </div>

        <p className="text-sm">{details.title}</p>
      </div>

      <div className="gap-2">
        <div className="flex items-center justify-between mb-1 border-b border-gray-400 h-9">
          <label className="text-sm">Content</label>

          <div
            className="hover:cursor-pointer"
            onClick={() => copyToClipboard(details.message)}
          >
            <div className="flex text-xs gap-1.5 items-center border border-gray-400 rounded-full px-2 py-1">
              <div>
                <p className="text-xs">Copy</p>
              </div>

              <FiCopy className="text-xs text-gray-500" />
            </div>
          </div>
        </div>

        <div className="overflow-auto max-h-48">
          <Markdown className={"text-xs"} content={details.message} />
        </div>
      </div>
    </div>
  );
};

export default TaskBreakdown;
