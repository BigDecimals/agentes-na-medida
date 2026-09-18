#!/usr/bin/env python3
"""Export sanitized complete campaign receipts; recompute all displayed statistics."""
import argparse
import json
import statistics
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
KEYS=set('requestedModel servedModels arm reasoningEffort apiCalls toolCalls workflowComplete usageComplete correct orderIds error elapsedMs maxReportedInputTokens perCallUsage toolEvents inputTokens outputTokens cachedInputTokens reasoningTokens schemaVersion campaign trial recordedAt provider harness scope harnessSha256 jarSha256 embeddedSeedSha256 sourcesUnchanged openaiSdkVersion'.split())

def summarize(runs):
    groups=[]
    for model,arm in sorted({(r['requestedModel'],r['arm']) for r in runs}):
        subset=[r for r in runs if (r['requestedModel'],r['arm'])==(model,arm)]
        totals=[r['inputTokens']+r['outputTokens'] for r in subset]
        groups.append({'model':model,'arm':arm,'n':len(subset),'correct':sum(r['correct'] for r in subset),
                       'medianTotalTokens':statistics.median(totals),'minTotalTokens':min(totals),'maxTotalTokens':max(totals),
                       'medianInputTokens':statistics.median(r['inputTokens'] for r in subset),
                       'medianOutputTokens':statistics.median(r['outputTokens'] for r in subset),
                       'medianElapsedMs':statistics.median(r['elapsedMs'] for r in subset),
                       'sumInputTokens':sum(r['inputTokens'] for r in subset),'sumOutputTokens':sum(r['outputTokens'] for r in subset),
                       'sumCachedInputTokens':sum(r['cachedInputTokens'] for r in subset)})
    return groups

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--input',type=Path,default=ROOT/'.runs/hermes-benchmark')
    p.add_argument('--campaign',default='measured-v1')
    args=p.parse_args()
    all_runs=[json.loads(path.read_text()) for path in args.input.glob('*.json')]
    runs=sorted((r for r in all_runs if r.get('campaign')==args.campaign),key=lambda r:r['recordedAt'])
    expected={(model,arm,n) for model,arms in [('gpt-5.6-luna',['generic','tool','skill']),('gpt-6-astra',['tool'])] for arm in arms for n in range(1,4)}
    if len(runs)!=12 or {(r['requestedModel'],r['arm'],r['trial']) for r in runs}!=expected:
        raise ValueError('Require the exact complete campaign, including failures')
    for r in runs:
        if not r['usageComplete'] or not r['sourcesUnchanged'] or r['servedModels']!=[r['requestedModel']]:
            raise ValueError('Incomplete or mismatched evidence')
        if r['apiCalls']!=len(r['perCallUsage']) or r['toolCalls']!=len(r['toolEvents']):
            raise ValueError('Invalid event counts')
        for key in ('inputTokens','outputTokens','cachedInputTokens','reasoningTokens'):
            if type(r[key]) is not int or r[key]<0 or sum(c[key] for c in r['perCallUsage'])!=r[key]:
                raise ValueError('Usage mismatch')
        if r['correct'] and (r['orderIds']!=[1004,1002,1009,1007,1001] or not r['workflowComplete']):
            raise ValueError('Incorrect answer')
    for key in ('harnessSha256','jarSha256','embeddedSeedSha256','reasoningEffort'):
        if len({r[key] for r in runs})!=1: raise ValueError('Mixed campaign conditions')
    public=[{k:r[k] for k in sorted(KEYS)} for r in runs]
    setup=[{k:r[k] for k in sorted(KEYS)} for r in all_runs if r.get('campaign')=='smoke']
    summary=summarize(public)
    result=ROOT/'benchmarks/results'
    result.mkdir(parents=True,exist_ok=True)
    def save(path,data): path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    save(result/'runs.json',public)
    save(result/'setup-receipts.json',sorted(setup,key=lambda r:r['recordedAt']))
    save(result/'summary.json',summary)
    status={'status':'measured','campaign':args.campaign,'runCount':len(runs),'correct':sum(r['correct'] for r in runs),
            'scope':'isolated bounded Responses harness using Hermes authentication; excludes parent and setup',
            'claims':{'universalSavings':False,'generalModelRanking':False}}
    save(result/'status.json',status)
    view={**status,'groups':summary}
    (ROOT/'docs/data/benchmark.js').write_text('// Generated from reviewed provider usage receipts; not simulated.\nwindow.BENCHMARK = Object.freeze('+json.dumps(view,ensure_ascii=False,indent=2)+');\n')
    print(json.dumps(view,ensure_ascii=False))

if __name__=='__main__': main()
