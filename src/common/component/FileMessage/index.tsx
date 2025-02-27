import { FC, useEffect, useState } from "react";
import dayjs from "dayjs";
import Styled from "./styled";
import ImageMessage from "./ImageMessage";
import useRemoveLocalMessage from "../../hook/useRemoveLocalMessage";
import useUploadFile from "../../hook/useUploadFile";
import useSendMessage from "../../hook/useSendMessage";
import Progress from "./Progress";
import { getFileIcon, formatBytes, isImage, getImageSize } from "../../utils";
import { useAppSelector } from "../../../app/store";
import IconDownload from "../../../assets/icons/download.svg";
import IconClose from "../../../assets/icons/close.circle.svg";
import VideoMessage from "./VideoMessage";
import AudioMessage from "./AudioMessage";

const isLocalFile = (content: string) => {
  return content.startsWith("blob:");
};

interface Props {
  context: "user" | "channel";
  to: number;
  created_at: number;
  from_uid: number;
  content: string;
  download: string;
  thumbnail: string;
  properties: {
    local_id: number;
    name: string;
    size: number;
    content_type: string;
  };
}

const FileMessage: FC<Props> = ({
  context,
  to,
  created_at,
  from_uid,
  content = "",
  download = "",
  thumbnail = "",
  properties = { local_id: 0, name: "", size: 0, content_type: "" }
}) => {
  const [imageSize, setImageSize] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const removeLocalMessage = useRemoveLocalMessage({ context, id: to });
  const {
    sendMessage,
    isSuccess: sendMessageSuccess,
    isSending
  } = useSendMessage({
    context,
    from: from_uid,
    to
  });
  const { stopUploading, data, uploadFile, progress, isSuccess: uploadSuccess } = useUploadFile();
  const fromUser = useAppSelector((store) => store.users.byId[from_uid]);
  const { size = 0, name, content_type } = properties ?? {};
  useEffect(() => {
    const handleUpSend = async ({
      url,
      name,
      type
    }: {
      url: string;
      name: string;
      type: string;
    }) => {
      try {
        setUploadingFile(true);
        if (type.startsWith("image")) {
          const size = await getImageSize(url);
          setImageSize(size);
        }
        let file = await fetch(url)
          .then((r) => r.blob())
          .then((blobFile) => new File([blobFile], name, { type }));

        await uploadFile(file);
        setUploadingFile(false);
      } catch (error) {
        setUploadingFile(false);
        console.error("fetch local file error", error);
      }
    };
    // local file
    if (isLocalFile(content)) {
      handleUpSend({ url: content, name, type: content_type });
    }
  }, [content, name, content_type]);
  useEffect(() => {
    const props = properties ?? {};
    const propsV2 = imageSize ? { ...props, ...imageSize } : props;
    // 本地文件 并且上传成功
    if (uploadSuccess && isLocalFile(content)) {
      // 把已经上传的东西当做消息发出去
      const { path } = data;
      sendMessage({
        ignoreLocal: true,
        type: "file",
        content: { path },
        properties: propsV2
      });
    }
  }, [uploadSuccess, data, properties, content]);
  useEffect(() => {
    if (sendMessageSuccess) {
      //  回收本地资源
      URL.revokeObjectURL(content);
    }
  }, [sendMessageSuccess, content]);
  const handleCancel = () => {
    stopUploading();
    URL.revokeObjectURL(content);
    removeLocalMessage(properties.local_id);
  };
  if (!properties) return null;
  const icon = getFileIcon(content_type, name);

  if (!content || !name) return null;

  const sending = uploadingFile || isSending;
  // image
  if (isImage(content_type, size))
    return (
      <ImageMessage
        key={properties?.local_id}
        uploading={sending}
        progress={progress}
        properties={{ ...imageSize, ...properties }}
        content={content}
        download={download}
        thumbnail={thumbnail}
      />
    );
  // video
  if (content_type.startsWith("video") && !sending)
    return (
      <VideoMessage
        size={size}
        url={content}
        name={name}
        download={download}
      />
    );
  // audio
  if (content_type.startsWith("audio") && !sending)
    return (
      <AudioMessage
        size={size}
        url={content}
        name={name}
        download={download}
      />
    );
  return (
    <Styled className={`file_message ${sending ? "sending" : ""}`}>
      <div className="basic">
        {icon}
        <div className="info">
          <span className="name">{name}</span>
          <span className="details">
            {sending ? (
              <Progress value={progress} width={"80%"} />
            ) : (
              <>
                <i className="size">{formatBytes(size)}</i>
                <i className="time">{dayjs(created_at).fromNow()}</i>
                {fromUser && (
                  <i className="from">
                    by <strong>{fromUser.name}</strong>
                  </i>
                )}
              </>
            )}
          </span>
        </div>
        {sending ? (
          <IconClose className="cancel" onClick={handleCancel} />
        ) : (
          <a className="download" download={name} href={`${content}&download=true`}>
            <IconDownload />
          </a>
        )}
      </div>
    </Styled>
  );
};

export default FileMessage;
