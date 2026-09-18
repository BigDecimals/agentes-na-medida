import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCodexEvents } from '../scripts/codex-receipt.mjs';
const answer = {type:'item.completed',item:{type:'agent_message',text:'{"orderIds":[1004,1002,1009,1007,1001]}'}};
const complete = {type:'turn.completed',usage:{input_tokens:100,cached_input_tokens:0,output_tokens:10}};
const turn = [{type:'turn.started'}, answer, complete];
const parse = events => parseCodexEvents(events.map(JSON.stringify));
test('unfinished subsequent turn cannot reuse an earlier correct answer', () => {
  assert.equal(parse([...turn,{type:'turn.started'}]).protocolComplete,false);
});
test('unsupported delegation is rejected even with a completed correct parent answer', () => {
  assert.equal(parse([{type:'turn.started'}, {type:'item.completed',item:{type:'collab_agent_tool_call',tool:'spawn_agent'}}, answer, complete]).correct,false);
});
test('final answer must belong to final completed turn', () => {
  assert.equal(parse([...turn,{type:'turn.started'},complete]).correct,false);
});
test('unknown events and items fail closed', () => {
  assert.equal(parse([...turn,{type:'future.event'}]).correct,false);
  assert.equal(parse([{type:'turn.started'},{type:'item.completed',item:{type:'future_item'}},answer,complete]).correct,false);
});
test('answer or completion outside active turn is invalid', () => {
  assert.equal(parse([answer,complete]).correct,false);
});
