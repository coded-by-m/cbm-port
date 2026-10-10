import { getServicePage } from "@/data/servicePages";
import { ServicePage, serviceMetadata } from "@/components/service/ServicePage";

const PAGE = getServicePage("site-institucional");

export const metadata = serviceMetadata(PAGE);

export default function Page() {
  return <ServicePage page={PAGE} />;
}
