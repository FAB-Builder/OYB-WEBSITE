import FabToolFrame, { PAGEPILOT_TOOLS_BASE_URL } from "@/components/FabToolFrame";

export default function RecordedWebinarsToolRoute() {
  return <FabToolFrame tool="webinar" baseUrl={PAGEPILOT_TOOLS_BASE_URL} />;
}
