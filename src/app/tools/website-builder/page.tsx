import FabToolFrame, { PAGEPILOT_TOOLS_BASE_URL } from "@/components/FabToolFrame";

export default function WebsiteBuilderToolRoute() {
  return <FabToolFrame tool="websites" baseUrl={PAGEPILOT_TOOLS_BASE_URL} />;
}
