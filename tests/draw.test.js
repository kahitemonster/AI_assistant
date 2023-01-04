import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import { handleEvents, getPrompt, removePrompt } from '../app/index.js';
import { COMMAND_SYS_DRAW } from '../constants/command.js';
import {
  createEvents, TIMEOUT, MOCK_USER_01, MOCK_TEXT_OK,
} from './utils.js';

beforeEach(() => {
  //
});

afterEach(() => {
  removePrompt(MOCK_USER_01);
});

test('COMMAND_SYS_DRAW', async () => {
  const events = [
    ...createEvents([`${COMMAND_SYS_DRAW.text}人工智慧`]),
  ];
  let results;
  try {
    results = await handleEvents(events);
  } catch (err) {
    console.error(err);
  }
  expect(getPrompt(MOCK_USER_01).sentences.length).toEqual(3);
  const replies = results.map(({ messages }) => messages.map(({ originalContentUrl }) => originalContentUrl));
  expect(replies).toEqual(
    [
      [MOCK_TEXT_OK],
    ],
  );
}, TIMEOUT);
