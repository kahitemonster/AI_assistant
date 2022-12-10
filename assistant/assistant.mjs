import {
  APP_DEBUG,
} from '../config/index.mjs';
import {
  PARTICIPANT_AI,
  PARTICIPANT_HUMAN,
  FINISH_REASON_STOP,
  complete,
} from '../services/openai.mjs';
import {
  EVENT_TYPE_MESSAGE,
  MESSAGE_TYPE_TEXT,
  reply,
} from '../services/line.mjs';
import Storage from './storage.mjs';

class Assistant {
  storage = new Storage();

  handleEvents(events = []) {
    return Promise.all(events.map((event) => this.handleEvent(event)));
  }

  async handleEvent({
    replyToken,
    type,
    source,
    message,
  }) {
    if (type !== EVENT_TYPE_MESSAGE) return null;
    const prompt = this.storage.getPrompt(source.userId);
    prompt.write(`${PARTICIPANT_HUMAN}: ${message.text}？`);
    const { text } = await this.chat({ prompt: prompt.toString() });
    prompt.write(`${PARTICIPANT_AI}: ${text}`);
    this.storage.setPrompt(source.userId, prompt);
    const messages = [{ type: MESSAGE_TYPE_TEXT, text }];
    const res = { replyToken, messages };
    return APP_DEBUG ? res : reply(res);
  }

  async chat({
    prompt,
    text = '',
  }) {
    const { data } = await complete({ prompt });
    const [choice] = data.choices;
    prompt += choice.text.trim();
    text += choice.text.replace(PARTICIPANT_AI, '').replace(':', '').replace('：', '').trim();
    const res = { prompt, text };
    return choice.finish_reason === FINISH_REASON_STOP ? res : this.chat(res);
  }

  debug() {
    if (APP_DEBUG) console.info(this.storage.toString());
  }
}

export default Assistant;
