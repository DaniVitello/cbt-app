import type { Metadata } from "next";
import { LandingView } from "./LandingView";
import "./landing.css";

export const metadata: Metadata = {
  title: "CTB — Cognitive Behavioral Therapy Exercises",
};

export default function LandingPage() {
  return <LandingView />;
}
