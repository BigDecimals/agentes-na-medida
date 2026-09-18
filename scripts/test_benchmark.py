"""Synthetic validation fixtures, never published as measured model runs."""
import unittest
from benchmark_core import usage_counts, command_for, collect_response
from benchmark_trial import run_trial
import json

class EvidenceTests(unittest.TestCase):
    def test_provider_usage_is_not_guessed(self):
        got = usage_counts({'input_tokens':120,'output_tokens':30,
            'input_tokens_details':{'cached_tokens':20},
            'output_tokens_details':{'reasoning_tokens':10}})
        self.assertEqual(got, {'inputTokens':120,'outputTokens':30,'cachedInputTokens':20,'reasoningTokens':10})
        for bad in ({}, {'input_tokens':True,'output_tokens':1},
                    {'input_tokens':1,'output_tokens':1,'input_tokens_details':{'cached_tokens':2}}):
            with self.assertRaises(ValueError): usage_counts(bad)

    def test_only_narrow_validated_host_commands(self):
        self.assertEqual(command_for('generic','orders',{'operation':'list'}),['list'])
        self.assertEqual(command_for('tool','orders',{'status':'AWAITING_SHIPMENT','limit':5}),
                         ['search','--status','AWAITING_SHIPMENT','--limit','5'])
        for arm,name,args in [('generic','orders',{'operation':'rm'}),
                              ('tool','orders',{'status':'AWAITING_SHIPMENT','limit':True}),
                              ('tool','orders',{'status':'SHIPPED','limit':11}),
                              ('tool','orders',{'status':'SHIPPED','limit':1,'sql':'select 1'}),
                              ('tool','terminal',{})]:
            with self.assertRaises(ValueError): command_for(arm,name,args)

    def test_real_loop_counts_requests_and_requires_host_data(self):
        usage={'input_tokens':120,'output_tokens':30,'input_tokens_details':{'cached_tokens':0},'output_tokens_details':{'reasoning_tokens':10}}
        answer={'type':'message','content':[{'type':'output_text','text':'{"orderIds":[1004,1002,1009,1007,1001]}'}]}
        calls=[]
        def request(payload):
            calls.append(payload)
            output=[{'type':'function_call','name':'orders','call_id':'synthetic','arguments':'{"status":"AWAITING_SHIPMENT","limit":5}'}] if len(calls)==1 else [answer]
            return {'status':'completed','model':'synthetic-model','usage':usage,'output':output}
        trial=run_trial(request, lambda cmd:[{'id':1004}], model='synthetic-model',arm='tool',prompt='test',skill_text='test')
        self.assertTrue(trial.get('correct'))
        self.assertEqual(trial['inputTokens'],240)
        self.assertEqual(trial['apiCalls'],2)
        self.assertEqual(trial['toolCalls'],1)
        self.assertEqual(len(calls[0]['input']),1)
        no_tool=run_trial(lambda p:{'status':'completed','model':'synthetic-model','usage':usage,'output':[answer]},lambda c:[],model='synthetic-model',arm='tool',prompt='test',skill_text='test')
        self.assertFalse(no_tool['correct'])

    def test_terminal_usage_and_streamed_output_are_both_preserved(self):
        tool={'type':'function_call','name':'orders','arguments':'{}','call_id':'synthetic'}
        events=[{'type':'response.output_item.done','output_index':0,'item':tool},
                {'type':'response.completed','response':{'status':'completed','usage':{'input_tokens':1},'output':[]}}]
        response=collect_response(events)
        self.assertEqual(response.get('output'),[tool])
        self.assertEqual(response['usage'],{'input_tokens':1})
        with self.assertRaises(ValueError): collect_response(events[:1])

if __name__ == '__main__': unittest.main()
