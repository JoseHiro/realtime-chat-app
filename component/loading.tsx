// AI-style loading animation component
// import { Bot } from "lucide-react";

export const LoadingMessage = () => (
  // <div className="flex gap-4 justify-start">
  //   <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse">
  //     <Bot className="w-5 h-5 text-white" />
  //   </div>

  //   <div className="max-w-md lg:max-w-2xl">
  //     <div className="bg-white text-gray-900 border border-gray-200 p-6 rounded-2xl shadow-sm relative overflow-hidden">
  //       {/* Scanning line effect */}
  //       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/50 to-transparent w-full h-full animate-pulse"></div>

  //       {/* Neural network style animation */}
  //       <div className="relative">
  //         <div className="flex items-center justify-between mb-6">
  //           <div className="flex items-center gap-3">
  //             <div className="relative">
  //               <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
  //               <div className="absolute inset-0 w-3 h-3 bg-emerald-600 rounded-full"></div>
  //             </div>
  //             <span className="text-emerald-600 text-sm font-semibold tracking-wide">
  //               Thinking about your response
  //             </span>
  //           </div>
  //         </div>

  //         {/* AI processing visualization */}
  //         <div className="space-y-3">
  //           {[
  //             { width: "85%", delay: "0ms" },
  //             { width: "92%", delay: "200ms" },
  //             { width: "78%", delay: "400ms" },
  //             { width: "95%", delay: "600ms" },
  //           ].map((line, i) => (
  //             <div key={i} className="relative">
  //               <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
  //                 <div
  //                   className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 rounded-full animate-pulse"
  //                   style={{
  //                     width: line.width,
  //                     animationDelay: line.delay,
  //                     animationDuration: "1.5s",
  //                   }}
  //                 ></div>
  //               </div>
  //             </div>
  //           ))}
  //         </div>

  //         {/* Floating particles */}
  //         <div className="absolute inset-0 pointer-events-none">
  //           {Array.from({ length: 8 }).map((_, i) => (
  //             <div
  //               key={i}
  //               className="absolute w-1 h-1 bg-emerald-400 rounded-full opacity-60"
  //               style={{
  //                 left: `${20 + i * 10}%`,
  //                 top: `${30 + (i % 3) * 20}%`,
  //                 animation: `float 3s ease-in-out infinite`,
  //                 animationDelay: `${i * 0.3}s`,
  //               }}
  //             ></div>
  //           ))}
  //         </div>

  //         <div className="mt-4 text-center">
  //           <span className="text-gray-500 text-xs font-medium">
  //             Generating intelligent response...
  //           </span>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // </div>
  <div className="flex items-center space-x-2 text-gray-400 animate-fade-in">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
      <div
        className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
        style={{ animationDelay: "0.1s" }}
      ></div>
      <div
        className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></div>
    </div>
    <span className="text-xs">AI is thinking...</span>
  </div>
);
