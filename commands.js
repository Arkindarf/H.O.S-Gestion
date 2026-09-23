import 'dotenv/config';
import {InstallGlobalCommands } from './utils.js';

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const SPECIAL_COMMAND = {
  name: 'special',
  description: 'Elle arrivera',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const ALL_COMMANDS = [];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
