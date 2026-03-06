import { MobileLayout } from "@/components/MobileLayout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <MobileLayout>{children}</MobileLayout>;
}
