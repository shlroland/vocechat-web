import BASE_URL, { FILE_IMAGE_SIZE, ContentTypes, KEY_TOKEN, KEY_REFRESH_TOKEN, KEY_EXPIRE } from "../app/config";
import IconPdf from "../assets/icons/file.pdf.svg";
import IconAudio from "../assets/icons/file.audio.svg";
import IconVideo from "../assets/icons/file.video.svg";
import IconUnknown from "../assets/icons/file.unknown.svg";
import IconDoc from "../assets/icons/file.doc.svg";
import IconCode from "../assets/icons/file.code.svg";
import IconImage from "../assets/icons/file.image.svg";
import { Archive, ArchiveMessage } from "../types/resource";
import { MessagePayload } from "../app/slices/message";

export const getLocalAuthData = () => {
  return {
    token: localStorage.getItem(KEY_TOKEN) || "",
    refreshToken: localStorage.getItem(KEY_REFRESH_TOKEN) || "",
    expireTime: Number(localStorage.getItem(KEY_EXPIRE) || +new Date())
  };
};
export const isImage = (file_type = "", size = 0) => {
  return file_type.startsWith("image") && size <= FILE_IMAGE_SIZE;
};

export const isTreatAsImage = (file: File) => {
  const { type, size } = file;
  if (type.startsWith("image")) {
    return size < 1024 * 1024; // 10MB
  }
  return false;
};

export function getDefaultSize(size?: { width: number; height: number }, min = 480) {
  if (!size) return { width: 0, height: 0 };
  const { width: oWidth, height: oHeight } = size;
  if (oWidth == oHeight) {
    const tmp = min > oWidth ? oWidth : min;
    return { width: tmp, height: tmp };
  }
  const isVertical = oWidth <= oHeight;
  let dWidth = 0;
  let dHeight = 0;
  if (isVertical) {
    dHeight = oHeight >= min ? min : oHeight;
    dWidth = (oWidth / oHeight) * dHeight;
  } else {
    dWidth = oWidth >= min ? min : oWidth;
    dHeight = (oHeight / oWidth) * dWidth;
  }
  return { width: dWidth, height: dHeight };
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
export const getImageSize = (url: string) => {
  const size = { width: 0, height: 0 };
  if (!url) return size;
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      size.width = img.width;
      size.height = img.height;
      resolve(size);
    };
    img.onerror = () => {
      resolve(size);
    };
  });
};
export const getInitials = (name: string, length: number = 4) => {
  const arr = name
    .split(
      // eslint-disable-next-line no-misleading-character-class
      /[\u0009\u000a\u000b\u000c\u000d\u0020\u0085\u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u200c\u200d\u2028\u2029\u202f\u205f\u2060\u3000\ufeff]/
    )
    .filter((n) => !!n);
  const initialArr = arr.map((t) => [...t][0]);
  initialArr.length = length;
  return initialArr.join("").toUpperCase();
};
export const getInitialsAvatar = ({
  initials = "UK",
  initial_size = 0,
  size = 200,
  foreground = "#fff",
  background = "#4c99e9",
  weight = 400,
  fontFamily = "'Lato', 'Lato-Regular', 'Helvetica Neue'"
}) => {
  const canvas = document.createElement("canvas");
  const width = size;
  const height = size;
  const devicePixelRatio = Math.max(window.devicePixelRatio, 1);
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  context.scale(devicePixelRatio, devicePixelRatio);
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = background;
  context.fill();
  // 多于两个字符，自动缩放
  const subtract =
    initials.length > 3 ? 50 : initials.length > 2 ? 40 : initials.length == 2 ? 30 : 0;
  context.font = `${weight} ${((initial_size || height) - subtract) / 2}px ${fontFamily}`;
  context.textAlign = "center";

  context.textBaseline = "middle";
  context.fillStyle = foreground;
  context.fillText(initials, width / 2, height / 2);

  /* istanbul ignore next */
  return canvas.toDataURL("image/png");
};
/**
 * @param {File|Blob} - file to slice
 * @param {Number} - chunksAmount
 * @return {Array} - an array of Blobs
 **/
export function sliceFile(file: File | null, chunksAmount: number) {
  if (!file) return null;
  let byteIndex = 0;
  let chunks = [];

  for (let i = 0; i < chunksAmount; i += 1) {
    let byteEnd = Math.ceil((file.size / chunksAmount) * (i + 1));
    chunks.push(file.slice(byteIndex, byteEnd));
    byteIndex += byteEnd - byteIndex;
  }

  return chunks;
}
export const getFileIcon = (type: string, name = "") => {
  let icon = null;

  const checks = {
    image: /^image/gi,
    audio: /^audio/gi,
    video: /^video/gi,
    code: /(json|javascript|java|rb|c|php|xml|css|html)$/gi,
    doc: /^text/gi,
    pdf: /\/pdf$/gi
  };
  const _arr = name.split(".");
  const _type = type || _arr[_arr.length - 1];
  switch (true) {
    case checks.image.test(_type):
      {
        icon = <IconImage className="icon" />;
      }
      break;
    case checks.pdf.test(_type):
      icon = <IconPdf className="icon" />;
      break;
    case checks.code.test(_type):
      icon = <IconCode className="icon" />;
      break;
    case checks.doc.test(_type):
      icon = <IconDoc className="icon" />;
      break;
    case checks.audio.test(_type):
      icon = <IconAudio className="icon" />;
      break;
    case checks.video.test(_type):
      icon = <IconVideo className="icon" />;
      break;

    default:
      icon = <IconUnknown className="icon" />;
      break;
  }
  return icon;
};
export const normalizeFileMessage = (data: MessagePayload) => {
  const { properties, content, sending = false, content_type } = data;
  const isFile = content_type == ContentTypes.file;
  const isPic = isImage(properties?.content_type, properties?.size);
  let res: null | { file_path?: string, content?: string, download?: string, thumbnail: string } = null;
  if (isFile) {
    if (!sending) {
      res = {
        file_path: content,
        content: `${BASE_URL}/resource/file?file_path=${encodeURIComponent(
          content
        )}`,
        download: `${BASE_URL}/resource/file?file_path=${encodeURIComponent(
          content
        )}&download=true`,
        thumbnail: isPic
          ? `${BASE_URL}/resource/file?file_path=${encodeURIComponent(
            content
          )}&thumbnail=true`
          : ""
      };
    } else if (isPic) {
      res = { thumbnail: content };
    }
  }
  return res;
};
export const normalizeArchiveData = (
  data: Archive | null,
  filePath: string | null,
  uid?: number
) => {
  if (!data || !filePath) return [];
  const { messages, users } = data;
  const getUrls = (
    uid: number | undefined,
    {
      content,
      content_type,
      file_id,
      thumbnail_id,
      filePath,
      avatar
    }: Partial<ArchiveMessage> & {
      filePath: string;
      avatar?: number | string;
    }
  ) => {
    // uid存在，则favorite，否则archive
    const prefix = uid
      ? `${BASE_URL}/favorite/attachment/${uid}/${filePath}/`
      : `${BASE_URL}/resource/archive/attachment?file_path=${filePath}&attachment_id=`;
    return {
      transformedContent: content_type == ContentTypes.file ? `${prefix}${file_id}` : content,
      thumbnail: content_type == ContentTypes.file ? `${prefix}${thumbnail_id}` : "",
      download:
        content_type == ContentTypes.file
          ? `${prefix}${file_id}${uid ? "?" : "&"}download=true`
          : "",
      avatarUrl: avatar !== null ? `${prefix}${avatar}` : ""
    };
  };
  return messages.map(
    ({ source, mid, content, file_id, thumbnail_id, content_type, properties, from_user }) => {
      let user = users[from_user] ?? {};
      const { transformedContent, thumbnail, download, avatarUrl } = getUrls(uid, {
        content,
        content_type,
        filePath,
        file_id,
        thumbnail_id,
        avatar: user.avatar
      });
      return {
        source,
        from_mid: mid,
        user: { ...user, avatar: avatarUrl },
        content: transformedContent,
        content_type,
        properties,
        download,
        thumbnail
      };
    }
  );
};
// https://github.com/gabe0x02/version_compare/blob/20d79649da39febc883350f441ee0bd6f1a6b1e6/version_compare.js
export const compareVersion = (v1: string, v2: string, options?: { lexicographical: boolean, zeroExtend: boolean }) => {
  //remove anything after - 1.1.2-3-a4agbr-dirty
  function cropDash(s: string) {
    let idx = s.indexOf('-');
    if (idx !== -1) {
      s = s.substring(0, idx);
    }
    return s;
  }
  v1 = cropDash(v1);
  v2 = cropDash(v2);
  let lexicographical = options && options.lexicographical,
    zeroExtend = options && options.zeroExtend,
    v1parts = v1.split('.'),
    v2parts = v2.split('.');
  function isValidPart(x) {
    return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
  }

  if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
    return NaN;
  }

  if (zeroExtend) {
    while (v1parts.length < v2parts.length) v1parts.push("0");
    while (v2parts.length < v1parts.length) v2parts.push("0");
  }

  if (!lexicographical) {
    v1parts = v1parts.map(Number);
    v2parts = v2parts.map(Number);
  }

  for (var i = 0; i < v1parts.length; ++i) {
    if (v2parts.length == i) {
      return 1;
    }

    if (v1parts[i] == v2parts[i]) {
      continue;
    }
    else if (v1parts[i] > v2parts[i]) {
      return 1;
    }
    else {
      return -1;
    }
  }

  if (v1parts.length != v2parts.length) {
    return -1;
  }

  return 0;
};