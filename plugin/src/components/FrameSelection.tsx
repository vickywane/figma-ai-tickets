export const FrameSelection = ({ name }) => (
  <div>
    <p className="font-vietnam text-black text-sm  mb-4">
      Select a design frame
    </p>

    {name && (
      <div className="border border-2 border-dashed rounded-lg">
        <p className="text-sm p-4 text-center">
          <code className="font-semibold">{name}</code>
        </p>
      </div>
    )}
  </div>
);
