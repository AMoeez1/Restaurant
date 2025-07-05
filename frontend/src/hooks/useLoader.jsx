import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { GiForkKnifeSpoon } from "react-icons/gi";

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 48,
      color: "#f59e0b",
      animationDuration: "1.5s",
      animationTimingFunction: "ease-in-out",
    }}
    spin
  />
);

const StylishLoader = ({ tip = "Loading dishes..." }) => (
//   <div
//     style={{
//       position: "fixed",
//       top: 0,
//       left: 0,
//       width: "100vw",
//       height: "100vh",
//       backgroundColor: "rgba(255, 255, 255, 0.85)",
//       display: "flex",
//       flexDirection: "column",
//       justifyContent: "center",
//       alignItems: "center",
//       zIndex: 9999,
//     }}
//   >
//     <Spin indicator={antIcon} tip={tip} size="large" />
//     <p style={{ marginTop: 20, fontSize: 18, color: "#a16207" /* darker yellow */ }}>
//       Please wait...
//     </p>
//   </div>
<div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50 select-none">
      <style>{`
        @keyframes swing {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
      `}</style>

      <GiForkKnifeSpoon
        size={80}
        className="text-yellow-500 animate-[swing_2s_ease-in-out_infinite]"
        aria-hidden="true"
      />

      <p className="mt-6 text-lg font-semibold text-yellow-600 animate-pulse">
        Preparing your delicious dishes...
      </p>
    </div>
);

export default StylishLoader;
