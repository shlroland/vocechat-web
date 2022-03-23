import { useState, useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useDispatch, useSelector } from "react-redux";
import { useKey } from "rooks";

import { removeReplyingMessage } from "../../../app/slices/message";
import { useSendChannelMsgMutation } from "../../../app/services/channel";
import { useSendMsgMutation } from "../../../app/services/contact";
import { useReplyMessageMutation } from "../../../app/services/message";
import StyledSend from "./styled";
import useFiles from "./useFiles";
import UploadModal from "./UploadModal";
import Replying from "./Replying";
import Toolbar from "./Toolbar";
import EmojiPicker from "./EmojiPicker";
import RichInput from "../RichInput";
const Types = {
  channel: "#",
  user: "@",
};
export default function Send({
  name,
  type = "channel",
  // 发给谁，或者是channel，或者是user
  id = "",
  dragFiles = [],
}) {
  const [contentType, setContentType] = useState("text");
  const [replyMessage] = useReplyMessageMutation();
  const { files, setFiles, resetFiles } = useFiles([]);
  // const [shift, setShift] = useState(false);
  // const [enter, setEnter] = useState(false);
  const [editor, setEditor] = useState(null);
  const [markdown, setMarkdown] = useState("");
  const [msg, setMsg] = useState("");
  const dispatch = useDispatch();
  // 谁发的
  const { from_uid, replying_mid = null } = useSelector((store) => {
    return {
      from_uid: store.authData.uid,
      replying_mid: store.message.replying[id],
    };
  });
  useEffect(() => {
    if (dragFiles.length) {
      setFiles((prev) => [...prev, ...dragFiles]);
    }
  }, [dragFiles]);

  const [sendMsg, { isLoading: userSending }] = useSendMsgMutation();
  const [
    sendChannelMsg,
    { isLoading: channelSending },
  ] = useSendChannelMsgMutation();
  const sendMessage = type == "channel" ? sendChannelMsg : sendMsg;
  const sendingMessage = userSending || channelSending;
  const insertEmoji = (emoji) => {
    console.log("insert emoji", emoji, editor);
    editor.insertText(emoji);
  };
  const handleUpload = (evt) => {
    setFiles([...evt.target.files]);
  };
  const handleSendMessage = () => {
    if (!msg || !id || sendingMessage) return;
    console.log("send message", msg);
    const content_type = msg ? "text" : "markdown";
    const content = msg ? msg : markdown;
    console.log("current message", markdown, msg);
    if (replying_mid) {
      console.log("replying", replying_mid);
      replyMessage({
        id,
        reply_mid: replying_mid,
        type: content_type,
        content,
        context: type,
        from_uid,
      });
      dispatch(removeReplyingMessage(id));
    } else {
      sendMessage({
        id,
        type: content_type,
        content,
        from_uid,
        properties: { local_id: new Date().getTime() },
      });
    }
    setMsg("");
  };

  return (
    <>
      <StyledSend className={`send ${replying_mid ? "reply" : ""} ${type}`}>
        {replying_mid && <Replying mid={replying_mid} id={id} />}
        <EmojiPicker selectEmoji={insertEmoji} />
        <RichInput
          setEditor={setEditor}
          placeholder={`Send to ${Types[type]}${name} `}
          sendMessage={handleSendMessage}
          updateMarkdown={setMarkdown}
          updatePureText={setMsg}
        />
        <Toolbar
          contentType={contentType}
          updateContentType={setContentType}
          handleUpload={handleUpload}
        />
      </StyledSend>
      {files.length !== 0 && (
        <UploadModal
          type={type}
          files={files}
          sendTo={id}
          closeModal={resetFiles}
        />
      )}
    </>
  );
}
