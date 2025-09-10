"use client";
import { FiTrello, FiPlus, FiChevronDown } from "react-icons/fi";
import { useEffect, useState } from "react";
import { SiJira, SiAsana, SiGithub } from "react-icons/si";
import { CgMonday } from "react-icons/cg";
import { AiOutlineDisconnect } from "react-icons/ai";
import { toast } from "react-toastify";
import { SiLinear } from "react-icons/si";

import {
  getTrelloBoards,
  removeUserIntegration,
  updateIntegrationBoard,
} from "../../actions/integrations";
import { type JwtPayload } from "@supabase/supabase-js";

type Props = {
  name: any;
  integration?: any;
  redirectURL?: any;
  disabled?: boolean;
  user: JwtPayload;
};

type Board = {
  name: string;
  id: string;
};

const IntegrationElementList = {
  Trello: <FiTrello className="text-base text-[#d6d6d6]" />,
  Jira: <SiJira className="text-base text-[#d6d6d6]" />,
  Linear: <SiLinear className="text-base text-[#d6d6d6]" />,
  Asana: <SiAsana className="text-base text-[#d6d6d6]" />,
  "Github Boards": <SiGithub className="text-base text-[#d6d6d6]" />,
  Monday: <CgMonday className="text-base text-[#d6d6d6]" />,
};

export default function Integration({
  name,
  disabled = false,
  integration,
  redirectURL,
}: Props) {
  const [allBoards, setAllBoards] = useState<Board[]>([]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  const removeIntegration = async (integration: string) => {
    await removeUserIntegration(integration);
  };

  useEffect(() => {
    if (!integration?.tokens) {
      return;
    }

    const getAllBoards = async () => {
      const boards = await getTrelloBoards(integration?.tokens);
      const userBoard = boards.find((board) => board.id === integration?.board);
      setSelectedBoard(userBoard);
      setAllBoards(boards);
    };

    getAllBoards();
  }, [integration?.tokens, integration?.board]);

  const handleBoardChange = async ({ id, name }: Board) => {
    toast(`${name} has been set as default board.`);

    await updateIntegrationBoard(id, integration?.id, name);
  };

  return (
    <div>
      <div className="flex justify-between ">
        <div className="flex gap-2 items-center">
          {IntegrationElementList[name]}

          <p className="font-sans text-sm">{name}</p>
        </div>

        {disabled ? (
          <button
            disabled
            className="font-sans bg-[#d6d6d6] flex gap-1 items-center text-xs text-white px-2 py-1 rounded"
          >
            Coming Soon
          </button>
        ) : (
          <div className="flex items-center gap-1">
            {integration ? (
              <button
                onClick={() => removeIntegration(integration?.id)}
                className="flex items-center text-xs gap-1 text-white hover:cursor-pointer hover:bg-[#B91C1C] bg-[#FF3B30]  rounded px-1 py-1"
              >
                <AiOutlineDisconnect />
                Disconnect
              </button>
            ) : (
              <button
                disabled={!redirectURL}
                className="flex gap-1 items-center font-sans bg-blue-500 text-xs text-white px-2 py-1 rounded"
              >
                <a className="flex gap-1 items-center" href={redirectURL}>
                  <FiPlus /> Add Integration
                </a>
              </button>
            )}
          </div>
        )}
      </div>

      {integration && (
        <div className="mt-2">
          <div className="mb-2">
            <p className="text-sm text-gray-600 mb-2">Target Board</p>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <span className="text-gray-700">
                {selectedBoard?.name || "Select a board"}
              </span>
              <FiChevronDown
                className={`text-gray-400 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                <div className="py-1 max-h-48 overflow-y-auto">
                  {allBoards.map((board) => (
                    <button
                      key={board.id}
                      onClick={() => {
                        setSelectedBoard(board);

                        handleBoardChange({
                          name: board.name,
                          id: board.id,
                        });

                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:bg-blue-50"
                    >
                      {board.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
