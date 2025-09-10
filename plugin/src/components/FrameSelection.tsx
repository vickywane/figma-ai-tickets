export const FrameSelection = ({ name } : { name: string }) => (
  <div className="border border-2 w-full flex items-center py-4 px-2 border-dashed rounded-lg border-gray-300">
    {name ? (
      <p className="font-semibold w-full text-roboto text-center text-gray-800">{name}</p>
    ) : (
      <p className="text-sm text-gray-500 text-center">
        Select a design frame to preview before generating details from it.
      </p>
    )}
  </div>
);
