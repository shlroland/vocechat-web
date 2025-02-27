import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import  { ContentTypes } from "../config";
import { normalizeFileMessage } from "../../common/utils";
import { ContentType } from "../../types/message";
export interface MessagePayload {
  mid: number;
  from_uid?: number;
  read?: boolean;
  created_at?: number;
  sending?: boolean;
  content_type: ContentType;
  content: string;
  expires_in?: number | null;
  properties?: {
    local_id?: number;
    content_type: string;
    size: number;
  };
  file_path?: string;
  download?: string;
  thumbnail?: string;
  edited?: boolean | number;
  reply_mid?: number;
}
export interface State {
  [key: number]: MessagePayload;
  replying: {
    [key: string | number]: number;
  };
}

const initialState: State = {
  replying: {}
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    resetMessage() {
      return initialState;
    },
    fillMessage(state, action) {
      return Object.assign({ ...initialState }, action.payload);
    },
    updateMessage(state, action: PayloadAction<{ mid: number;[key: string | number]: any }>) {
      const { mid, ...rest } = action.payload;
      state[mid] = { ...state[mid], ...rest };
    },
    addMessage(state, action: PayloadAction<MessagePayload>) {
      const data = action.payload;
      const { mid, sending } = data;
      // console.log("tfile", sending, content, content_type);

      // 如果是正发送，并且已存在，则不覆盖
      if (sending && state[mid]) return;
      // 文件类消息的处理
      const normalized = normalizeFileMessage(data);
      if (normalized) {
        state[mid] = { ...state[mid], ...data, ...normalized };
      } else {
        state[mid] = { ...state[mid], ...data };
      }
    },
    removeMessage(state, action: PayloadAction<number | number[]>) {
      const mids = Array.isArray(action.payload) ? action.payload : [action.payload];
      mids.forEach((id: number) => {
        delete state[id];
      });
    },
    addReplyingMessage(state, action: PayloadAction<{ key: string | number; mid: number }>) {
      const { key, mid } = action.payload;
      // console.log("to ", key, mid);
      state.replying[key] = mid;
    },
    removeReplyingMessage(state, action: PayloadAction<string | number>) {
      const key = action.payload;
      if (state.replying[key]) {
        delete state.replying[key];
      }
    }
  }
});

export const {
  resetMessage,
  fillMessage,
  updateMessage,
  addMessage,
  removeMessage,
  addReplyingMessage,
  removeReplyingMessage
} = messageSlice.actions;

export default messageSlice.reducer;
