"use client";
import { useState } from "react";
import { getTaskBreakdown } from "../actions/task";
import { Spinner } from "./Spinner";
import cn from "classnames";
import ReactMarkdown from "react-markdown";

export default function GenerateDetails() {
  const [details, setDetails] = useState(null);
  const [isLoading, setLoader] = useState(false);
  const [image, setImage] = useState<null | File>(null);

  const handleSubmit = async () => {
    if (!image) return;

    setLoader(true);
    const { data, error } = await getTaskBreakdown({ image });

    if (error) {
      console.error("Error generating task details:", error);
      return;
    }

    setDetails(data);
    setLoader(false);
  };

  return (
    <div className="mt-12">
      <p>Select A Task Image</p>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e?.target?.files && e?.target?.files[0])}
        className="border mt-2 rounded"
      />

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        {isLoading && <Spinner />}

        <span className={cn(isLoading ? "opacity-0" : "opacity-100")}>
          Generate Details
        </span>
      </button>

      {details && (
        <div className="mt-4 border border-rounded p-4">
          <div>
            <p className="text-xl">Title</p>
            <p>{details.title}</p>
          </div>

          <div>
            <p className="text-xl mt-4">Content</p>
            <ReactMarkdown children={details.message} />
          </div>
        </div>
      )}
    </div>
  );
}
