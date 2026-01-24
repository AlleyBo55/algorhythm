
/**
 * TidalCycles-inspired Rhythm Parser for RhythmCode
 * Allows expressing beats as space-separated strings with subdivisions in []
 * 
 * Example: "k s [k k] s" 
 * - Step 1: k (0.0)
 * - Step 2: s (0.25)
 * - Step 3: [k k] -> k (0.5), k (0.625)
 * - Step 4: s (0.75)
 */

export interface RhythmEvent {
    time: number; // 0.0 to 1.0 (relative to cycle)
    value: string;
    duration: number; // Duration of this specific step in the cycle
}

export class PatternParser {
    /**
     * Parse a Tidal-like pattern string into a sequence of events
     * @param pattern e.g. "k s [k k] s"
     * @returns Array of events with relative timing (0-1)
     */
    static parse(pattern: string): RhythmEvent[] {
        const events: RhythmEvent[] = [];
        const tokens = this.tokenize(pattern);
        const stepSize = 1 / tokens.length;

        tokens.forEach((token, index) => {
            const startTime = index * stepSize;

            // Handle subdivision [a b c]
            if (token.startsWith('[') && token.endsWith(']')) {
                const innerContent = token.slice(1, -1);
                // Recursively parse the inner content
                const subEvents = this.parse(innerContent);

                // Map sub-events to the current step's timeframe
                subEvents.forEach(sub => {
                    events.push({
                        time: startTime + (sub.time * stepSize),
                        value: sub.value,
                        duration: sub.duration * stepSize
                    });
                });
            } else {
                // Handle single item (or rest)
                if (token !== '~' && token !== '-') { // ~ and - are rests
                    events.push({
                        time: startTime,
                        value: token,
                        duration: stepSize
                    });
                }
            }
        });

        return events;
    }

    /**
     * Split string into tokens, respecting brackets for subdivision
     * "k s [k k] s" -> ["k", "s", "[k k]", "s"]
     */
    private static tokenize(str: string): string[] {
        const tokens: string[] = [];
        let current = '';
        let depth = 0;

        for (let i = 0; i < str.length; i++) {
            const char = str[i];

            if (char === '[') {
                depth++;
                current += char;
            } else if (char === ']') {
                depth--;
                current += char;
            } else if (char === ' ' && depth === 0) {
                if (current.trim()) tokens.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        if (current.trim()) tokens.push(current.trim());

        return tokens;
    }
}
