import FabToolFrame, { PAGEPILOT_TOOLS_BASE_URL } from "@/components/FabToolFrame";

export default function ProductDemosToolRoute() {
  return <FabToolFrame tool="demo" baseUrl={PAGEPILOT_TOOLS_BASE_URL} />;
}
