import { useState } from "react";
import Markdown from "../components/markdown";
import { TbEdit, TbEditOff } from "react-icons/tb";

type TaskBreakdownProps = {
  details: any;
};

const TaskBreakdown = ({ details }: TaskBreakdownProps) => {
  const [editState, setEdit] = useState({
    isEditingTitle: false,
    isEditingContent: false,
  });

  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleEditState = (field: "isEditingTitle" | "isEditingContent") => {
    setEdit((state) => ({
      ...state,
      [field]: !state[field],
    }));
  }; 

  const handleDropdownSelect = (item) => {
    setSelectedIntegration(item);
    setIsDropdownOpen(false);
  };
 
  return (
    <div className="grid gap-2">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between border-b h-9">
          <label className="text-xs font-semibold"> Ticket Title </label>
 
          <div
            onClick={() => toggleEditState("isEditingTitle")}
            className="hover:cursor-pointer"
          >
            {editState.isEditingTitle ? (
              <div className="flex text-xs gap-1.5 items-center">
                <TbEdit className="text-sm text-gray-500" />
                <p>Edit</p>
              </div>
            ) : (
              <div className="flex text-xs gap-1.5 items-center">
                <TbEditOff className="text-sm text-gray-500" />
                <p>Edit</p>
              </div>
            )}
          </div>
        </div>

        {editState.isEditingTitle ? (
          <input
            placeholder="Ticket title"
            value={details.title}
            className="border-b bg-zinc-100 py-1 px-1 w-full text-[13px] outline-none"
            // onChange={(e) =>
            //   setDetailsData((prev) => ({
            //     ...prev,
            //     title: e.target.value,
            //   }))
            // }
          />
        ) : (
          <p className="text-[13px]">{details.title}</p>
        )}
      </div>

      <div className="gap-1 overflow-auto">
        <div className="flex items-center justify-between mb-1 border-b h-9">
          <label className="text-xs font-semibold">Ticket Content</label>

          <div
            onClick={() => toggleEditState("isEditingContent")}
            className="hover:cursor-pointer"
          >
            {editState.isEditingContent ? (
              <div className="flex text-xs gap-1.5 items-center">
                <TbEdit className="text-sm text-gray-500" />
                <p>Edit</p>
              </div>
            ) : (
              <div className="flex text-xs gap-1.5 items-center">
                <TbEditOff className="text-sm text-gray-500" />
                <p>Edit</p>
              </div>
            )}
          </div>
        </div>

        {editState.isEditingContent ? (
          <textarea
            placeholder="Ticket content"
            value={details.message}
            className="border-b bg-zinc-100 py-1 px-1 w-full text-XS outline-none h-32 resize-none"
            // onChange={(e) =>
            //   setDetailsData((prev) => ({
            //     ...prev,
            //     message: e.target.value,
            //   }))
            // }
          />
        ) : (
          <Markdown
            className={"text-XS max-h-32 truncate"}
            content={details.message}
          />
        )}
      </div>

      {details?.boardList && (
        <div className="grid gap-2">
          <p className="text-xs font-semibold">Board</p>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-zinc-100 outline-none px-2 py-2 text-left border-b border-gray-300 flex items-center justify-between"
            >
              <span className={"text-gray-900 text-xs"}>
                {selectedIntegration ? selectedIntegration.name : details?.boardList[0]?.name}
              </span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isDropdownOpen ? "transform rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute w-full mt-1 bg-white border border-gray-300 max-h-60 overflow-auto">
                {details.boardList.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleDropdownSelect(item)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-xs"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBreakdown;
