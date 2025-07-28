import {
  DISABLE_GENERATE_TASK,
  GENERATE_TASK_DETAILS,
  CLOSE_PLUGIN,
  SET_TASK_DETAILS,
  CREATE_USER_ACCOUNT,
  SET_USER_DETAILS,
  SET_USER_AUTH,
  USER_AUTH_CREDS,
  SET_USER_CLIENT_AUTH,
  LOGOUT_USER,
  CREATE_TASK,
  COMPLETE_CREATE_TASK,
} from "./consts/messages";
import { fetchClient } from "./utils/fetch";

figma.showUI(__html__, {
  height: 400,
  width: 400,
});

figma.on("run", async () => {
  const storeData = await figma.clientStorage.getAsync(USER_AUTH_CREDS);

  if (storeData) {
    const { access_token, refresh_token } = JSON.parse(storeData);

    figma.ui.postMessage({
      type: SET_USER_CLIENT_AUTH,
      data: {
        access_token,
        refresh_token,
      },
    });
  }
});

figma.on("selectionchange", () => {
  const selection = figma.currentPage.selection;

  return figma.ui.postMessage({
    type: DISABLE_GENERATE_TASK,
    isValid: selection.length >= 1 && selection[0].type === "FRAME",
    name: selection.length >= 1 && selection[0]?.name,
  });
});

figma.ui.onmessage = async (msg) => {
  if (msg.type === GENERATE_TASK_DETAILS) {
    const selection = figma.currentPage.selection;

    if (selection.length !== 1 || selection[0].type !== "FRAME") {
      figma.notify("Please select a frame.");
      return; 
    }
 
    const frame = selection[0] as FrameNode;
 
    try { 
      const frameData = await frame.exportAsync({ format: "PNG" });
      const base64 = figma.base64Encode(frameData);
      const image = `data:image/png;base64,${base64}`;

      const request = await fetchClient("/generate-task", {
        data: { 
          image,
          user: msg.user,
        },
        method: "POST",
      });

      figma.notify("Task breakdown of your figma has been generated");
 
      return figma.ui.postMessage({
        type: SET_TASK_DETAILS,
        data: request?.data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  if (msg.type === SET_USER_AUTH) {
    try {
      await figma.clientStorage.setAsync(
        USER_AUTH_CREDS,
        JSON.stringify({
          access_token: msg.data.access_token,
          refresh_token: msg.data.refresh_token,
        })
      );
    } catch (error) {
      console.error("Error setting user auth:", error);
    }
  } 

  if (msg.type === CREATE_TASK) {
    try {
      const request = await fetchClient("/create-task", {
        data: msg.data,
        method: "POST",
      });

      figma.notify("Task has been created.");

      return figma.ui.postMessage({
        type: COMPLETE_CREATE_TASK,
        data: request?.data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  if (msg.type === CREATE_USER_ACCOUNT) {
    try {
      const request = await fetchClient("/create-user", {
        data: msg.data,
        method: "POST",
      });

      return figma.ui.postMessage({
        type: SET_USER_DETAILS,
        data: request?.data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  if (msg.type === CLOSE_PLUGIN) {
    figma.closePlugin();
  }

  if (msg.type === LOGOUT_USER) {
    try {
      await figma.clientStorage.deleteAsync(USER_AUTH_CREDS);
    } catch (error) {
      console.error("Error setting user auth:", error);
    }
  }
};
