import { headers } from "next/headers";
import ClientLayoutWrapper from "./ClientLayoutWrapper";
import { getMaster } from "@/actions/school";
export const dynamic = "force-dynamic";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const masterData = await getMaster();

  return (
    <ClientLayoutWrapper initialData={masterData}>
      {children}
    </ClientLayoutWrapper>
  );
  // return
}
