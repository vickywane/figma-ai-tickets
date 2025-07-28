export const SuccessBanner = ({ type }: { type: string }) => (
  <div className="flex items-center bg-[#28a745] py-4 px-6">
    <p className="font-sans text-[13px] text-white">
      {type} has now been added to your account. <br /> Head over to your figma
      designs to export your first ticket!
    </p>
  </div>
);
