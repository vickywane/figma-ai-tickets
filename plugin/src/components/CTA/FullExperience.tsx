import { Link } from "react-router-dom";
import { GoArrowRight } from "react-icons/go";

export const FullExperience = () => {
  return (
    <Link to={"/authenticate"}>
      <div className="p-3 bg-blue-700 grid gap-1 w-full hover:cursor-pointer">
        <div className="flex items-center gap-1 flex-row">
          <div>
            <p className="text-white tracking-widest text-sm font-roboto ">
              TRY FULL EXPERIENCE
            </p>
          </div>

          <div>
            <GoArrowRight className="text-white text-xl" />
          </div>
        </div>

        <p className="text-white tracking-wide text-xs font-roboto ">
          One-click action to your Linear, Jira, Trello and Asana boards!
        </p>
      </div>
    </Link>
  );
};