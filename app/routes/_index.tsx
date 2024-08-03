import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import Headers from "~/components/headers";
// import { Link } from "@remix-run/react";
// import Button from "app/components/button";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <>
      <div className="w-[90%]">
        <Headers />
        <Outlet />
      </div>
    </>
  );
}
