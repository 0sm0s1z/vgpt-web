import Link from "next/link";
import { api } from "~/utils/api";

export default function Report() {
  return (
    <div>
      <h1>Loading</h1>
      <div className="w-[200px]flex max-w-xs flex-col gap-4 overflow-hidden overflow-ellipsis rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
        <h3 className="text-2xl font-bold">Report</h3>
        <div className="text-lg">asdfasdf</div>
      </div>
      <div className="w-[200px]flex max-w-xs flex-col gap-4 overflow-hidden overflow-ellipsis rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
        <h3 className="text-2xl font-bold">Report</h3>
        <div className="text-lg">asdfasdf</div>
      </div>
    </div>
  );
}
