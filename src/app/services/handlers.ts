import toast from "react-hot-toast";
import { batch } from "react-redux";
import { ContentTypes } from "../config";
import { addChannelMsg, removeChannelMsg } from "../slices/message.channel";
import { addUserMsg, removeUserMsg } from "../slices/message.user";
import { addMessage, removeMessage } from "../slices/message";
// import { ContentType } from "../../types/message";

export const onMessageSendStarted = async (
  {
    ignoreLocal = false,
    id,
    content,
    type = "text",
    from_uid,
    reply_mid = null,
    properties = { local_id: +new Date(), content_type: "" }
  },
  { dispatch, queryFulfilled },
  from = "channel"
) => {
  // 忽略archive类型的消息
  if (type == "archive") return;
  // id: who send to ,from_uid: who sent
  // console.log("handlers data", content, type, properties, ignoreLocal, id);
  const isMedia = properties.content_type ? ["image", "video", "audio"].includes(properties.content_type.split('/')[0]) : false;
  // const isImage = properties.content_type?.startsWith("image");
  const ts = properties.local_id || +new Date();
  const tmpMsg = {
    content: isMedia ? content.path : content,
    content_type: ContentTypes[type],
    created_at: ts,
    properties,
    from_uid,
    reply_mid,
    sending: true
  };
  const addContextMessage = from == "channel" ? addChannelMsg : addUserMsg;
  const removeContextMessage = from == "channel" ? removeChannelMsg : removeUserMsg;
  if (!ignoreLocal) {
    batch(() => {
      dispatch(addMessage({ mid: ts, ...tmpMsg }));
      dispatch(addContextMessage({ id, mid: ts }));
    });
  }

  try {
    const { data: server_mid } = await queryFulfilled;
    // console.log("message server mid", server_mid);
    batch(() => {
      dispatch(removeContextMessage({ id, mid: ts }));
      dispatch(addMessage({ mid: server_mid, ...tmpMsg, sending: false }));
      dispatch(addContextMessage({ id, mid: server_mid }));
    });
    setTimeout(() => {
      dispatch(removeMessage(ts));
    }, 300);
    // dispatch(removePendingMessage({ id, mid:ts, type: from }));
  } catch {
    toast.error("Send Message Failed");
    dispatch(removeContextMessage({ id, mid: ts }));
    dispatch(removeMessage(ts));
    // patchResult.undo();
  }
};
