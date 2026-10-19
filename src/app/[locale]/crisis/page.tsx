import type { Metadata } from "next";
import { CrisisView } from "./CrisisView";

export const metadata: Metadata = {
  title: "Crisis Support",
};

export default function CrisisPage() {
  return <CrisisView />;
}
