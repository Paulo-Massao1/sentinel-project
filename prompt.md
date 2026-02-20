Fix the IDENTIFY page. Three issues:

1. SEVERITY CLASSIFICATION — The current signs.json marks too many signs as "severe". Fix based on these clinical criteria:

SEVERE (direct indicators of abuse):
- Physical: unexplained fractures, object-shaped marks (belt/wire), burns in patterns
- Sexual: difficulty walking/sitting, stained/torn underwear, STDs or pregnancy under 14, age-inappropriate sexual knowledge
- Neglect: malnutrition, untreated serious medical issues

MODERATE (strong warning signs, need context):
- Physical: unexplained bruises, injuries at different healing stages, flinches at touch
- Emotional: extreme behavior swings, acts adult-like or regresses to baby
- Sexual: fear of specific person/place, sexualized drawings/play, recurring nightmares
- Neglect: poor hygiene, weather-inappropriate clothing, constant hunger

MILD (concerning if combined with others):
- Physical: always on alert, fear of going home, inconsistent stories about injuries
- Emotional: speech/sleep disturbances, physical complaints without medical cause, low self-esteem, disproportionate fear of mistakes
- Neglect: frequent school absences, takes on adult responsibilities, sleeps in class

2. CONCERN LEVEL LOGIC — Update the calculation:
- Emergency: 2+ severe signs checked, OR any severe sexual sign checked → "Call now"
- High: 1 severe + 2 moderate, OR 4+ moderate signs, OR signs across 3+ categories → "See reporting guide"
- Medium: 3+ signs of any severity, OR 2+ moderate signs → "Record what you observed" + monitor
- Low: 1-2 mild/moderate signs → "Record what you observed" + keep observing

3. DESKTOP LAYOUT — On larger screens, the category selector area has too much empty space before a category is clicked. Add a short instructional message or illustration placeholder below the buttons so the page doesn't feel empty on desktop. On mobile it's fine as-is.

Update signs.json, Identify.tsx, and any i18n keys as needed.