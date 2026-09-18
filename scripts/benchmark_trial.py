"""Bounded Responses tool loop. No agent memory, filesystem tool, shell, or delegation."""
import copy
import json
import time
from benchmark_core import STATUSES, command_for, usage_counts

EXPECTED = [1004, 1002, 1009, 1007, 1001]
SYSTEM = ('Resolva o pedido consultando as ferramentas disponíveis. Dados sintéticos. '
          'Retorne somente JSON {"orderIds":[...]}. Valores monetários são strings decimais. '
          'Não invente dados. Não há acesso a arquivos, shell ou outros agentes.')

def tools_for(arm):
    if arm == 'generic':
        properties = {'operation': {'type':'string','enum':['schema','list']}}
        description = 'Consulta somente leitura: schema descreve as colunas; list retorna todos os pedidos sintéticos. Filtre e ordene conforme o pedido.'
    else:
        properties = {'status':{'type':'string','enum':STATUSES},'limit':{'type':'integer','minimum':1,'maximum':10}}
        description = 'Busca somente leitura por status. Retorna até limit pedidos, ordenados por total DESC e id DESC.'
    tools = [{'type':'function','name':'orders','description':description,'strict':True,
              'parameters':{'type':'object','properties':properties,'required':list(properties),'additionalProperties':False}}]
    if arm == 'skill':
        tools.append({'type':'function','name':'load_skill','description':'Carrega a skill consultar-pedidos: procedimento para consultar pedidos aguardando envio.',
                      'strict':True,'parameters':{'type':'object','properties':{},'required':[],'additionalProperties':False}})
    return tools

def run_trial(request, execute, *, model, arm, prompt, skill_text, effort='low', max_turns=6):
    if arm not in ('generic','tool','skill'):
        raise ValueError('Invalid arm')
    messages = [{'role':'user','content':prompt}]
    instructions = SYSTEM + (' Use a skill consultar-pedidos antes de consultar os pedidos.' if arm=='skill' else '')
    per_call, tool_events, served = [], [], []
    answer = None
    started = time.monotonic()
    attempted = 0
    completed = False
    error = None
    try:
        for _ in range(max_turns):
            attempted += 1
            response = request({'model':model,'instructions':instructions,'input':copy.deepcopy(messages),
                                'tools':tools_for(arm),'parallel_tool_calls':False,'reasoning':{'effort':effort},
                                'store':False,'include':['reasoning.encrypted_content']})
            if response.get('status') != 'completed':
                raise ValueError('Incomplete response')
            per_call.append(usage_counts(response.get('usage') or {}))
            served.append(response.get('model'))
            output = response.get('output',[])
            if any(item.get('type') not in ('message','reasoning','function_call') for item in output):
                raise ValueError('Unsupported output')
            messages.extend(output)
            calls = [item for item in output if item.get('type') == 'function_call']
            if not calls:
                text = ''.join(c.get('text','') for item in output if item.get('type')=='message'
                               for c in item.get('content',[]) if c.get('type')=='output_text')
                parsed = json.loads(text)
                if (isinstance(parsed,dict) and set(parsed)=={'orderIds'} and isinstance(parsed['orderIds'],list)
                        and len(parsed['orderIds'])<=10 and all(type(i) is int for i in parsed['orderIds'])):
                    answer = parsed['orderIds']
                completed = True
                break
            if len(calls) != 1 or len(tool_events) >= max_turns:
                raise ValueError('Tool budget exceeded')
            call = calls[0]
            args = json.loads(call['arguments'])
            if arm=='skill' and call['name']=='load_skill' and args=={}:
                value = skill_text
                evidence = {'name':'load_skill','resultRows':None}
            else:
                cmd = command_for(arm,call['name'],args)
                value = execute(cmd)
                if not isinstance(value,list):
                    raise ValueError('Invalid host result')
                evidence = {'name':'orders','arguments':args,'resultRows':len(value)}
            rendered = json.dumps(value,ensure_ascii=False,separators=(',',':'))
            evidence['resultBytes'] = len(rendered.encode())
            tool_events.append(evidence)
            messages.append({'type':'function_call_output','call_id':call['call_id'],'output':rendered})
    except Exception as exc:
        # No raw exceptions: SDK errors can contain endpoint/account details.
        error = type(exc).__name__
    usage_complete = attempted == len(per_call)
    totals = {key:sum(x[key] for x in per_call) if usage_complete else None
              for key in ('inputTokens','outputTokens','cachedInputTokens','reasoningTokens')}
    consulted = any(e['name']=='orders' for e in tool_events)
    used_skill = any(e['name']=='load_skill' for e in tool_events)
    return {'requestedModel':model,'servedModels':sorted(set(m for m in served if m)),
            'arm':arm,'reasoningEffort':effort,'apiCalls':attempted,'toolCalls':len(tool_events),
            'workflowComplete':completed,'usageComplete':usage_complete,
            'correct':completed and consulted and (arm!='skill' or used_skill) and answer==EXPECTED,
            'orderIds':answer,'error':error,'elapsedMs':round((time.monotonic()-started)*1000),
            'maxReportedInputTokens':max((x['inputTokens'] for x in per_call),default=None),
            'perCallUsage':per_call,'toolEvents':tool_events,**totals}
