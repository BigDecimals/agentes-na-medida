#!/usr/bin/env python3
"""Measure a narrow harness using installed Hermes OAuth; never copy or export credentials."""
import argparse
import hashlib
import importlib.metadata
import json
import logging
import re
import signal
import subprocess
import time
import uuid
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from benchmark_trial import run_trial
from benchmark_core import collect_response

ROOT = Path(__file__).resolve().parents[1]

def digest(data):
    return hashlib.sha256(data).hexdigest()

def execute(command):
    result = subprocess.run([str(ROOT/'scripts/java-lab.sh'),*command],cwd=ROOT,
                            capture_output=True,text=True,timeout=45,check=True)
    if len(result.stdout)>100000:
        raise ValueError('Host output too large')
    return json.loads(result.stdout)

def fingerprint():
    files = ['scripts/benchmark_core.py','scripts/benchmark_trial.py','scripts/record-hermes.py',
             'scripts/java-lab.sh','prompts/orders.pt-BR.txt','.agents/skills/consultar-pedidos/SKILL.md']
    return digest(b''.join(name.encode()+b'\0'+(ROOT/name).read_bytes()+b'\0' for name in files))

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--model',required=True)
    parser.add_argument('--arm',choices=['generic','tool','skill'],required=True)
    parser.add_argument('--effort',choices=['low','medium','high'],default='low')
    parser.add_argument('--campaign',default='initial')
    parser.add_argument('--trial',type=int,default=1)
    args = parser.parse_args()
    if not re.fullmatch(r'[A-Za-z0-9._-]{1,80}',args.model) or not re.fullmatch(r'[A-Za-z0-9_-]{1,40}',args.campaign) or not 1<=args.trial<=100:
        parser.error('Invalid model/campaign/trial')
    logging.disable(logging.CRITICAL)
    from hermes_cli.runtime_provider import resolve_runtime_provider
    from agent.codex_headers import apply_required_codex_headers
    from openai import OpenAI
    jar = ROOT/'examples/order-service/target/order-service.jar'
    jar_hash = digest(jar.read_bytes())
    with zipfile.ZipFile(jar) as archive:
        embedded_seed = archive.read('BOOT-INF/classes/data.sql')
    if embedded_seed != (ROOT/'examples/order-service/src/main/resources/data.sql').read_bytes():
        raise ValueError('JAR seed differs from source; rebuild before measurement')
    before = fingerprint()
    runtime = resolve_runtime_provider(requested='openai-codex',target_model=args.model)
    if runtime['provider']!='openai-codex':
        raise ValueError('Unexpected provider; no fallback permitted')
    options = dict(api_key=runtime['api_key'],base_url=runtime['base_url'],timeout=90,max_retries=0)
    apply_required_codex_headers(options,access_token=runtime['api_key'],base_url=runtime['base_url'])
    def alarm(*_):
        raise TimeoutError('Trial deadline')
    signal.signal(signal.SIGALRM,alarm)
    with OpenAI(**options) as client:
        def request(payload):
            with client.responses.create(**payload,stream=True) as stream:
                return collect_response(event.model_dump(exclude_none=True) for event in stream)
        signal.alarm(240)
        try:
            receipt = run_trial(request,execute,model=args.model,arm=args.arm,effort=args.effort,
                prompt=(ROOT/'prompts/orders.pt-BR.txt').read_text(),
                skill_text=(ROOT/'.agents/skills/consultar-pedidos/SKILL.md').read_text())
        finally:
            signal.alarm(0)
    unchanged = before==fingerprint() and jar_hash==digest(jar.read_bytes())
    receipt.update(schemaVersion=1,campaign=args.campaign,trial=args.trial,
        recordedAt=datetime.now(timezone.utc).isoformat(),provider='openai-codex',
        harness='bounded Responses loop with Hermes credential resolution; not Codex CLI or full Hermes agent',
        scope='all model requests in this isolated trial; excludes parent conversation and setup probes',
        harnessSha256=before,jarSha256=jar_hash,embeddedSeedSha256=digest(embedded_seed),
        sourcesUnchanged=unchanged,openaiSdkVersion=importlib.metadata.version('openai'))
    if not unchanged:
        receipt['correct']=False
        receipt['error']='SourceChanged'
    output = ROOT/'.runs/hermes-benchmark'
    output.mkdir(parents=True,exist_ok=True,mode=0o700)
    old = sorted((p for p in output.glob('*.json') if re.fullmatch(r'[0-9a-f-]{36}\.json',p.name)),key=lambda p:p.stat().st_mtime,reverse=True)
    for path in old[39:]: path.unlink()
    path=output/f'{uuid.uuid4()}.json'
    path.write_text(json.dumps(receipt,indent=2)+'\n')
    path.chmod(0o600)
    print(json.dumps({'receipt':str(path.relative_to(ROOT)),**{key:receipt[key] for key in
        ['requestedModel','servedModels','arm','correct','apiCalls','inputTokens','outputTokens','error']}}))
    return 0 if receipt['correct'] else 1

if __name__=='__main__':
    raise SystemExit(main())
