"""Pure validation for publication-safe benchmark evidence."""
def usage_counts(usage):
    def count(value):
        if type(value) is not int or value < 0:
            raise ValueError('Missing or invalid provider usage')
        return value
    result = {'inputTokens':count(usage.get('input_tokens')),
              'outputTokens':count(usage.get('output_tokens')),
              'cachedInputTokens':count(usage.get('input_tokens_details',{}).get('cached_tokens')),
              'reasoningTokens':count(usage.get('output_tokens_details',{}).get('reasoning_tokens'))}
    if result['cachedInputTokens'] > result['inputTokens'] or result['reasoningTokens'] > result['outputTokens']:
        raise ValueError('Invalid usage subset')
    return result

def collect_response(events):
    items, completed = {}, None
    for event in events:
        kind = event.get('type')
        if kind == 'response.output_item.done':
            items[event['output_index']] = event['item']
        elif kind == 'response.completed':
            completed = dict(event['response'])
        elif kind in ('error','response.failed','response.incomplete'):
            raise ValueError('Provider response failed')
    if completed is None:
        raise ValueError('Missing provider completion')
    if not completed.get('output'):
        completed['output'] = [items[i] for i in sorted(items)]
    return completed

STATUSES = ['AWAITING_SHIPMENT', 'SHIPPED', 'CANCELLED', 'PENDING_PAYMENT']

def command_for(arm, name, args):
    if name != 'orders' or not isinstance(args, dict):
        raise ValueError('Unsupported tool')
    if arm == 'generic' and set(args) == {'operation'} and args['operation'] in ('schema', 'list'):
        return [args['operation']]
    if arm in ('tool', 'skill') and set(args) == {'status', 'limit'}:
        if args['status'] in STATUSES and type(args['limit']) is int and 1 <= args['limit'] <= 10:
            return ['search', '--status', args['status'], '--limit', str(args['limit'])]
    raise ValueError('Invalid arguments')
