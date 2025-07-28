import { FiPlus } from "react-icons/fi";

export const EmptyIntegration = () => (
  <div className="flex justify-center">
    <div>
      <div className="flex justify-center">
        <span className="flex items-center rounded-full w-9 h-9 justify-center bg-gray-200 m-2">
          <FiPlus className="text-xl" />
        </span>
      </div>

      <p className="text-xs text-gray-500 text-center">
        No task board connected to your account! <br /> Add integration to
        connect a task board.
      </p>
    </div>
  </div>
);
