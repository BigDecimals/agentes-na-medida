import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCodexEvents } from '../scripts/codex-receipt.mjs';
// Synthetic protocol fixtures. These are not real benchmark measurements.
const event = object => JSON.stringify(object);
test('keeps provider usage, sums completed turns and only exposes structured final IDs', () => {
  const receipt = parseCodexEvents([
    event({type:'turn.started'}),
    event({type:'item.completed', item:{type:'command_execution', command:'private command', aggregated_output:'private output'}}),
    event({type:'item.completed', item:{type:'agent_message',text:'{"orderIds":[1004,1002,1009,1007,1001]}'}}),
    event({type:'turn.completed',usage:{input_tokens:100,cached_input_tokens:25,output_tokens:20}}),
    event({type:'turn.started'}),
    event({type:'item.completed', item:{type:'agent_message',text:'{"orderIds":[1004,1002,1009,1007,1001]}'}}),
    event({type:'turn.completed',usage:{input_tokens:50,cached_input_tokens:0,output_tokens:10}})
  ]);
  assert.equal(receipt.correct,true);
  assert.equal(receipt.inputTokens,150);
  assert.equal(receipt.cachedInputTokens,25);
  assert.equal(receipt.outputTokens,30);
  assert.equal(receipt.completedTurns,2);
  assert.equal(receipt.commandCalls,1);
  assert.equal(JSON.stringify(receipt).includes('private'),false);
});
test('missing usage remains unknown; failed attempts are not free successes', () => {
  const receipt = parseCodexEvents([event({type:'turn.failed',error:{message:'private error'}})]);
  assert.equal(receipt.inputTokens,null);
  assert.equal(receipt.correct,false);
  assert.equal(receipt.protocolComplete,false);
});
test('rejects wrong answer and malformed usage', () => {
  assert.equal(parseCodexEvents([event({type:'item.completed',item:{type:'agent_message',text:'{"orderIds":[1003]}'}})]).correct,false);
  assert.throws(() => parseCodexEvents([event({type:'turn.completed',usage:{input_tokens:-1}})]),/Invalid/);
});
