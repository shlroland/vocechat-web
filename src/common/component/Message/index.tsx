import React, { useRef, useState, useEffect, FC } from "react";
import dayjs from "dayjs";

import useInView from "./useInView";
import Tippy from "@tippyjs/react";
import Reaction from "./Reaction";
import Reply from "./Reply";
import Profile from "../Profile";
import Avatar from "../Avatar";
import StyledWrapper from "./styled";
import Commands from "./Commands";
import EditMessage from "./EditMessage";
import renderContent from "./renderContent";
import Tooltip from "../Tooltip";
import ContextMenu from "./ContextMenu";
import useContextMenu from "../../hook/useContextMenu";
import usePinMessage from "../../hook/usePinMessage";
import { useAppSelector } from "../../../app/store";
import ExpireTimer from "./ExpireTimer";

interface IProps {
  readOnly?: boolean;
  contextId: number;
  context?: "user" | "channel";
  read?: boolean;
  mid: number;
  updateReadIndex?: (param: any) => void;
}
const Message: FC<IProps> = ({
  readOnly = false,
  contextId,
  mid,
  context = "user",
  updateReadIndex,
  read = true
}) => {
  const { visible: contextMenuVisible, handleContextMenuEvent, hideContextMenu } = useContextMenu();
  const inviewRef = useInView();
  const [edit, setEdit] = useState(false);
  const avatarRef = useRef(null);
  const { getPinInfo } = usePinMessage(context == "channel" ? contextId : 0);
  const { message, reactionMessageData, usersData } = useAppSelector((store) => {
    return {
      reactionMessageData: store.reactionMessage,
      message: store.message[mid],
      usersData: store.users.byId
    };
  });

  const toggleEditMessage = () => {
    setEdit((prev) => !prev);
  };

  useEffect(() => {
    if (!read) {
      // 标记已读
      const data =
        context == "user"
          ? { users: [{ uid: +contextId, mid }] }
          : { groups: [{ gid: +contextId, mid }] };
      if (updateReadIndex) {
        updateReadIndex(data);
      }
    }
  }, [mid, read]);

  const {
    reply_mid,
    from_uid: fromUid,
    created_at: time,
    sending = false,
    content,
    thumbnail,
    download,
    content_type = "text/plain",
    edited,
    properties,
    expires_in = 0
  } = message;


  const reactions = reactionMessageData[mid];
  const currUser = usersData[fromUid || 0];
  // if (!message) return null;
  let timePrefix = null;
  const dayjsTime = dayjs(time);
  timePrefix = dayjsTime.isToday() ? "Today" : dayjsTime.isYesterday() ? "Yesterday" : null;

  const pinInfo = getPinInfo(mid);
  // return null;
  const _key = properties?.local_id || mid;
  const showExpire = (expires_in ?? 0) > 0;
  return (
    <StyledWrapper
      key={_key}
      onContextMenu={readOnly ? undefined : handleContextMenuEvent}
      data-msg-mid={mid}
      ref={inviewRef}
      className={`message ${readOnly ? "readonly" : ""} ${showExpire ? "auto_delete" : ""} ${pinInfo ? "pinned" : ""} ${contextMenuVisible ? "contextVisible" : ""
        } `}
    >
      <Tippy
        key={_key}
        popperOptions={{ strategy: "fixed" }}
        disabled={readOnly}
        interactive
        placement="right"
        trigger="click"
        content={<Profile uid={fromUid || 0} type="card" cid={context == "user" ? 0 : contextId} />}
      >
        <div className="avatar" data-uid={fromUid} ref={avatarRef}>
          <Avatar width={40} height={40} src={currUser?.avatar} name={currUser?.name} />
        </div>
      </Tippy>
      <ContextMenu
        editMessage={toggleEditMessage}
        context={context}
        contextId={contextId}
        mid={mid}
        visible={contextMenuVisible}
        hide={hideContextMenu}
      >
        <div
          className="details"
          data-pin-tip={`pinned by ${pinInfo?.created_by ? usersData[pinInfo.created_by]?.name : ""
            }`}
        >
          <div className="up">
            <span className="name">{currUser?.name || "Deleted User"}</span>
            <Tooltip
              delay={200}
              disabled={!timePrefix || readOnly}
              placement="top"
              tip={dayjsTime.format("YYYY-MM-DD h:mm:ss A")}
            >
              <i className="time">
                {timePrefix
                  ? `${timePrefix} ${dayjsTime.format("h:mm A")}`
                  : dayjsTime.format("YYYY-MM-DD h:mm:ss A")}
              </i>
            </Tooltip>
          </div>
          <div className={`down ${sending ? "sending" : ""}`}>
            {reply_mid && <Reply key={reply_mid} mid={reply_mid} />}
            {edit ? (
              <EditMessage mid={mid} cancelEdit={toggleEditMessage} />
            ) : (
              renderContent({
                context,
                to: contextId,
                from_uid: fromUid,
                created_at: time,
                content_type,
                properties,
                content,
                thumbnail,
                download,
                edited
              })
            )}
            {reactions && <Reaction mid={mid} reactions={reactions} readOnly={readOnly} />}
          </div>
        </div>
      </ContextMenu>

      {showExpire && (
        <ExpireTimer
          mid={message.mid}
          context={context}
          contextId={contextId}
          expiresIn={expires_in ?? 0}
          createAt={time ?? 0}
        />
      )}
      {!edit && !readOnly && (
        <Commands
          context={context}
          contextId={contextId}
          mid={mid}
          toggleEditMessage={toggleEditMessage}
        />
      )}
    </StyledWrapper>
  );
};
export default React.memo(Message, (prevs, nexts) => {
  return prevs.mid == nexts.mid;
});
