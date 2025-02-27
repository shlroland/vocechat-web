import clearTable from "./clear.handler";
interface Params {
  payload: any;
  data: any;
  operation: string;
}
export default async function handler({ operation, data = {}, payload }: Params) {
  const table = window.CACHE["footprint"];
  if (operation.startsWith("reset")) {
    clearTable("footprint");
    return;
  }
  switch (operation) {
    case "updateUsersVersion":
      {
        const usersVersion = payload;
        await table?.setItem("usersVersion", usersVersion);
      }
      break;
    case "updateAfterMid":
      {
        const afterMid = payload;
        await table?.setItem("afterMid", afterMid);
      }
      break;
    case "updateMute":
      {
        await table?.setItem("muteUsers", data.muteUsers || {});
        await table?.setItem("muteChannels", data.muteChannels || {});
      }
      break;
    case "updateReadChannels":
      {
        await table?.setItem("readChannels", data.readChannels);
      }
      break;
    case "updateReadUsers":
      {
        await table?.setItem("readUsers", data.readUsers);
      }
      break;
    case "updateAutoDeleteSetting":
      {
        await table?.setItem("autoDeleteMsgUsers", data.autoDeleteMsgUsers || []);
        await table?.setItem("autoDeleteMsgChannels", data.autoDeleteMsgChannels || []);
      }
      break;
    default:
      break;
  }
}
