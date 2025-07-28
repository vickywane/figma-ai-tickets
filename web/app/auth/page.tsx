import { FiAlertTriangle } from "react-icons/fi";

export default async function Page() {
  return (
    <div className=" bg-slate-100 items-center flex flex-col justify-center min-h-screen">
      <div className="shadow-lg h-64 p-8 flex items-center bg-white rounded-lg w-[400px]">
        <div>
          <div className="flex flex-col items-center justify-center  gap-2">
            <FiAlertTriangle className="text-3xl text-gray-600" />

            <h1 className="text-xl font-semibold text-center">Unauthorised</h1>
          </div>

          <p className="text-center mt-2 text-sm">
            Open Figma plugin to manage integrations with your ticket boards.
          </p>
        </div>
      </div>
    </div>
  );
}
