import { getServicePage } from "@/data/servicePages";
import { ServicePage, serviceMetadata } from "@/components/service/ServicePage";

const PAGE = getServicePage("sites-para-arquitetura");

export const metadata = serviceMetadata(PAGE);

export default function Page() {
  return <ServicePage page={PAGE} />;
}
