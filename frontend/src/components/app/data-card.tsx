// /* eslint-disable @typescript-eslint/no-unused-vars */
// // import React from "react";
// // import RadialProgress from "../ui/radial-progress";

// // interface DataCardProps {
// //   title: string;
// //   percentage: number;
// //   color: string;
// // }

// // const DataCard: React.FC<DataCardProps> = ({ title, percentage, color }) => {
// //   return (
// //     <div
// //       className={`max-w-sm p-6 bg-["${color}"] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300`}
// //     >
// //       <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
// //       <div className="flex items-center justify-between">
// //         <RadialProgress percentage={percentage} color={color} />
// //         <div className="ml-6">
// //           <span className="text-4xl font-bold text-gray-800">
// //             {percentage}%
// //           </span>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default DataCard;

// import React from "react";
// import RadialProgress from "../ui/radial-progress";
// import { twMerge } from "tailwind-merge";

// interface DataCardProps {
//   title: string;
//   percentage: number;
//   color: string;
//   patternColor?: string;
// }

// const DataCard: React.FC<DataCardProps> = ({
//   title,
//   percentage,
//   color,
//   patternColor,
// }) => {
//   const dimmedColor = patternColor; // 80 hex value to make it dimmer

//   return (
//     <div
//       className={twMerge(
//         "relative p-6 rounded-3xl rou shadow-md hover:shadow-lg transition-shadow duration-300 max-w-sm w-full h-48 z-0",
//         `bg-["${color}"]`
//       )}
//       style={{ backgroundColor: color }}
//     >
//       <div
//         className="absolute  top-0 left-5 w-12 h-12"
//         style={{ backgroundColor: dimmedColor }}
//       ></div>
//       <div
//         className="absolute  bottom-0 right-5 w-12 h-12"
//         style={{ backgroundColor: dimmedColor }}
//       ></div>
//       <div className="relative z-20 text-black">
//         <h3 className="text-xl font-semibold mb-4">{title}</h3>
//         <div className="flex items-center justify-between">
//           <RadialProgress percentage={percentage} color="#fff" />
//           <div className="ml-6">
//             <span className="text-4xl font-bold">{percentage}%</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataCard;

import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface DataCardProps {
  title: string;
  percentage: number;
  color: string;
  patternColor?: string;
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  percentage,
  color,
  patternColor,
}) => {
  const dimmedColor = patternColor; // 80 hex value to make it dimmer

  return (
    // <div
    //   className="
    //     relative p-6 rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300  min-w-xs  min-h-14 z-0"
    //   style={{ backgroundColor: color }}
    // >
    //   <div
    //     className="absolute  top-0 left-5 w-12 h-12"
    //     style={{ backgroundColor: dimmedColor }}
    //   ></div>
    //   <div
    //     className="absolute  bottom-0 right-5 w-12 h-12"
    //     style={{ backgroundColor: dimmedColor }}
    //   ></div>
    //   <div className="relative z-20 text-black">
    //     <h3 className="text-xl font-semibold mb-4">{title}</h3>
    //     <div className="flex items-center justify-between">
    //       <div className="">
    //         <span className="text-2xl font-bold">{percentage}%</span>
    //       </div>
    //       {/* <RadialProgress percentage={percentage} color="#fff" /> */}
    //       <div className="w-14 h-14">
    //         <CircularProgressbar value={percentage} text={`${percentage}%`} />
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div
      className="relative p-6 rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300 min-w-xs min-h-14 z-0"
      style={{ backgroundColor: color }}
    >
      <div
        className="absolute top-0 left-5 w-12 h-12"
        style={{ backgroundColor: dimmedColor }}
      ></div>
      <div
        className="absolute bottom-0 right-5 w-12 h-12"
        style={{ backgroundColor: dimmedColor }}
      ></div>
      <div className="relative z-20 text-black">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold">{percentage}%</span>
          </div>
          <div className="w-14 h-14">
            <CircularProgressbar value={percentage} text={`${percentage}%`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCard;
