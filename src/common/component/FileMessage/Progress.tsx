import { FC } from "react";
interface Props {
  value: number;
  width?: string;
}

const Progress: FC<Props> = ({ value, width = "100%" }) => {
  return (
    <div className="bg-[#ecfdff] rounded h-2 overflow-hidden" style={{ width }}>
      <div className="h-2 bg-[#088ab2] rounded transition-all" style={{ width: `${value}%` }}></div>
    </div>
  );
};

export default Progress;
