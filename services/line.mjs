import axios from 'axios';
import {
  LINE_API_KEY,
} from '../config/index.mjs';

export const EVENT_TYPE_MESSAGE = 'message';
export const MESSAGE_TYPE_TEXT = 'text';

const instance = axios.create({
  baseURL: 'https://api.line.me',
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${LINE_API_KEY}`,
  },
});

/**
 * @param {string} replyToken
 * @param {Array<Object>} messages
 * @param {string} messages[].type
 * @param {string} messages[].text
 */
export const reply = ({
  replyToken,
  messages,
}) => instance.post('/v2/bot/message/reply', {
  replyToken,
  messages,
});

export default null;
