import toast, { Toast } from "react-hot-toast";
import React from "react";

export const confirmAction = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    toast(
      (t: Toast) =>
        React.createElement(
          "div",
          { className: "flex flex-col gap-2" },
          React.createElement("span", null, message),
          React.createElement(
            "div",
            { className: "flex gap-2 justify-end" },
            React.createElement(
              "button",
              {
                className: "px-3 py-1 bg-gray-200 rounded",
                onClick: () => {
                  toast.dismiss(t.id);
                  resolve(false);
                },
              },
              "Huỷ"
            ),
            React.createElement(
              "button",
              {
                className: "px-3 py-1 bg-blue-500 text-white rounded",
                onClick: () => {
                  toast.dismiss(t.id);
                  resolve(true);
                },
              },
              "OK"
            )
          )
        ),
      { duration: Infinity }
    );
  });
};