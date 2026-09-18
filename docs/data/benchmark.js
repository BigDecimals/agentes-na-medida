// Generated from reviewed provider usage receipts; not simulated.
window.BENCHMARK = Object.freeze({
  "status": "measured",
  "campaign": "measured-v1",
  "runCount": 12,
  "correct": 12,
  "scope": "isolated bounded Responses harness using Hermes authentication; excludes parent and setup",
  "claims": {
    "universalSavings": false,
    "generalModelRanking": false
  },
  "groups": [
    {
      "model": "gpt-5.6-luna",
      "arm": "generic",
      "n": 3,
      "correct": 3,
      "medianTotalTokens": 1782,
      "minTotalTokens": 1781,
      "maxTotalTokens": 1791,
      "medianInputTokens": 1679,
      "medianOutputTokens": 105,
      "medianElapsedMs": 19956,
      "sumInputTokens": 5035,
      "sumOutputTokens": 319,
      "sumCachedInputTokens": 0
    },
    {
      "model": "gpt-5.6-luna",
      "arm": "skill",
      "n": 3,
      "correct": 3,
      "medianTotalTokens": 1978,
      "minTotalTokens": 1936,
      "maxTotalTokens": 1978,
      "medianInputTokens": 1902,
      "medianOutputTokens": 76,
      "medianElapsedMs": 11913,
      "sumInputTokens": 5678,
      "sumOutputTokens": 214,
      "sumCachedInputTokens": 0
    },
    {
      "model": "gpt-5.6-luna",
      "arm": "tool",
      "n": 3,
      "correct": 3,
      "medianTotalTokens": 929,
      "minTotalTokens": 923,
      "maxTotalTokens": 929,
      "medianInputTokens": 862,
      "medianOutputTokens": 67,
      "medianElapsedMs": 12035,
      "sumInputTokens": 2583,
      "sumOutputTokens": 198,
      "sumCachedInputTokens": 0
    },
    {
      "model": "gpt-6-astra",
      "arm": "tool",
      "n": 3,
      "correct": 3,
      "medianTotalTokens": 891,
      "minTotalTokens": 891,
      "maxTotalTokens": 891,
      "medianInputTokens": 843,
      "medianOutputTokens": 48,
      "medianElapsedMs": 12160,
      "sumInputTokens": 2529,
      "sumOutputTokens": 144,
      "sumCachedInputTokens": 0
    }
  ]
});
