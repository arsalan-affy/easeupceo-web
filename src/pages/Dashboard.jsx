import React from "react";
import HeaderTitle from "./common-components/HeaderTitle";

export default function Dashboard() {
  return (
    <>
      <HeaderTitle title="Dashboard" />

      <div className="grid grid-cols-3 gap-6">{/* cards */}</div>
    </>
  );
}
