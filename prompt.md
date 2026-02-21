Fix two issues in src/lib/detectLocale.ts:

1. Default country should be US (not BR) when timezone is not recognized
2. Default language should be EN (not pt-BR) when navigator.language does not start with "pt"

Also verify: timezone America/Edmonton should map to CA. Make sure the detection is actually running on first visit and the results are being applied correctly. If localStorage already has a saved value from testing, it won't re-detect. Clear localStorage logic: only use saved value if it exists, otherwise detect fresh.