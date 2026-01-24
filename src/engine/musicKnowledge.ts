/**
 * Music Knowledge Module
 * Genre-specific patterns, chord progressions, and scales for AI context
 */

export const MUSIC_KNOWLEDGE = {
    // Common chord progressions by genre (Actual note voicings for AI)
    progressions: {
        edm: {
            emotional: [['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['C4', 'E4', 'G4'], ['G3', 'B3', 'D4']],
            uplifting: [['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'], ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4']],
            dark: [['A3', 'C4', 'E4'], ['D3', 'F3', 'A3'], ['E3', 'G#3', 'B3'], ['A3', 'C4', 'E4']],
            epic: [['C3', 'Eb3', 'G3'], ['Ab3', 'C4', 'Eb4'], ['Eb3', 'G3', 'Bb3'], ['Bb2', 'D3', 'F3']],
            festival: [['F3', 'A3', 'C4'], ['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'], ['A3', 'C4', 'E4']], // Martin Garrix style
        },
        synthwave: {
            classic: [['D3', 'F3', 'A3'], ['Bb2', 'D3', 'F3'], ['C3', 'E3', 'G3'], ['A2', 'C3', 'E3']],
            dark: [['A2', 'C3', 'E3'], ['G2', 'B2', 'D3'], ['F2', 'A2', 'C3'], ['E2', 'G#2', 'B2']],
            driving: [['E3', 'G3', 'B3'], ['C3', 'E3', 'G3'], ['G3', 'B3', 'D4'], ['D3', 'F#3', 'A3']],
            nightcall: [['C3', 'E3', 'G3'], ['E3', 'G#3', 'B3'], ['A2', 'C3', 'E3'], ['F2', 'A2', 'C3']], // Kavinsky vibe
        },
        lofi: {
            chill: [['C4', 'E4', 'G4', 'B4'], ['A3', 'C4', 'E4', 'G4'], ['D4', 'F4', 'A4', 'C5'], ['G3', 'B3', 'D4', 'F4']],
            sad: [['A3', 'C4', 'E4', 'G4', 'B4'], ['F3', 'A3', 'C4', 'E4'], ['C4', 'E4', 'G4', 'B4'], ['E3', 'G3', 'B3', 'D4']],
            nostalgic: [['D4', 'F4', 'A4', 'C5'], ['G3', 'B3', 'D4', 'F4'], ['C4', 'E4', 'G4', 'B4'], ['A3', 'C4', 'E4', 'G4']],
            jazzy: [['D3', 'F3', 'A3', 'C4'], ['G2', 'B2', 'D3', 'F3'], ['C3', 'E3', 'G3', 'B3'], ['A2', 'C3', 'E3', 'G3']], // ii-V-I-vi
        },
        trap: {
            dark: [['F3', 'Ab3', 'C4'], ['Db3', 'F3', 'Ab3'], ['Ab3', 'C4', 'Eb4'], ['Eb3', 'G3', 'Bb3']],
            melodic: [['A3', 'C4', 'E4'], ['E3', 'G3', 'B3'], ['F3', 'A3', 'C4'], ['C4', 'E4', 'G4']],
            aggressive: [['C3', 'Eb3', 'G3'], ['G2', 'Bb2', 'D3'], ['Ab2', 'C3', 'Eb3'], ['Bb2', 'D3', 'F3']],
            drill: [['C3', 'Eb3', 'G3'], ['C#3', 'E3', 'G#3'], ['C3', 'Eb3', 'G3'], ['Bb2', 'D3', 'F3']], // Sliding semitones
        },
        house: {
            deep: [['C3', 'Eb3', 'G3', 'Bb3'], ['F3', 'Ab3', 'C4', 'Eb4'], ['Bb2', 'D3', 'F3', 'Ab3'], ['Eb3', 'G3', 'Bb3', 'D4']],
            funky: [['A3', 'C4', 'E4', 'G4'], ['D3', 'F#3', 'A3', 'C4'], ['G3', 'B3', 'D4', 'F#4'], ['C4', 'E4', 'G4', 'B4']],
            progressive: [['B2', 'D3', 'F#3'], ['G2', 'B2', 'D3'], ['D3', 'F#3', 'A3'], ['A2', 'C#3', 'E3']],
            piano: [['F3', 'A3', 'C4', 'E4'], ['G3', 'B3', 'D4', 'F4'], ['E3', 'G3', 'B3', 'D4'], ['A3', 'C4', 'E4', 'G4']],
        },
        cinematic: {
            western: [['D3', 'F3', 'A3'], ['A2', 'C3', 'E3'], ['C3', 'E3', 'G3'], ['G2', 'B2', 'D3']],
            epic: [['C3', 'Eb3', 'G3'], ['F3', 'Ab3', 'C4'], ['Ab2', 'C3', 'Eb3'], ['Eb3', 'G3', 'Bb3']],
            mysterious: [['A2', 'C3', 'E3'], ['B2', 'D3', 'F3'], ['C3', 'E3', 'G3'], ['D3', 'F3', 'A3']],
            interstellar: [['C3', 'E3', 'G3'], ['A2', 'C3', 'E3'], ['F2', 'A2', 'C3'], ['G2', 'B2', 'D3']], // Slow build
        },
        anime: {
            emotional: [['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['C4', 'E4', 'G4'], ['G3', 'B3', 'D4']],
            sad: [['A3', 'C4', 'E4'], ['E3', 'G3', 'B3'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4']],
            battle: [['E3', 'G3', 'B3'], ['C3', 'E3', 'G3'], ['D3', 'F#3', 'A3'], ['B2', 'D3', 'F#3']],
            opening: [['C4', 'E4', 'G4'], ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4']],
            jrock: [['A3', 'C4', 'E4'], ['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'], ['F3', 'A3', 'C4']],
            sliceOfLife: [['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['E3', 'G3', 'B3', 'D4'], ['A3', 'C4', 'E4']], // Standard upbeat J-Pop/Jazz
            villain: [['C3', 'Eb3', 'F#3'], ['B2', 'D3', 'F3'], ['Bb2', 'Db3', 'E3'], ['A2', 'C3', 'Eb3']], // Diminished tension
        },
        eurobeat: {
            classic: [['D3', 'F3', 'A3'], ['Bb2', 'D3', 'F3'], ['C3', 'E3', 'G3'], ['A2', 'C3', 'E3']], // Dave Rodgers style
            intense: [['F3', 'A3', 'C4'], ['C4', 'E4', 'G4'], ['D3', 'F3', 'A3'], ['Bb2', 'D3', 'F3']],
        },
        pop: {
            radio: [['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'], ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4']], // I-V-vi-IV
            ballad: [['C4', 'E4', 'G4'], ['E3', 'G3', 'B3'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4']], // I-iii-IV-V
        },
        rock: {
            punk: [['E3', 'G#3', 'B3'], ['A3', 'C#4', 'E4'], ['B3', 'D#4', 'F#4'], ['E3', 'G#3', 'B3']], // Power chords
            emo: [['C3', 'E3', 'G3'], ['G2', 'B2', 'D3'], ['A2', 'C3', 'E3'], ['F2', 'A2', 'C3']], // Emotional midwest
            metal: [['E2', 'G2', 'B2'], ['F2', 'A2', 'C3'], ['E2', 'G2', 'B2'], ['G2', 'Bb2', 'D3']], // Phrygian riffs
        },
        orchestral: {
            heroic: [['E3', 'G#3', 'B3'], ['A3', 'C4', 'E4'], ['C4', 'E4', 'G4'], ['D4', 'F#4', 'A4']],
            tragic: [['D3', 'F3', 'A3'], ['A2', 'C#3', 'E3'], ['Bb2', 'D3', 'F3'], ['G2', 'Bb2', 'D3']], // Minor with tension
        }
    },

    // Scales for each genre (as note arrays, usually starting C for reference, but keys vary)
    scales: {
        major: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],         // Happy, standard
        minor: ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'],      // Natural minor (Sad)
        harmonic_minor: ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'B'], // Classical, Latin, Dark
        dorian: ['C', 'D', 'Eb', 'F', 'G', 'A', 'Bb'],      // Jazz, Funk, Daft Punk
        phrygian: ['C', 'Db', 'Eb', 'F', 'G', 'Ab', 'Bb'],  // Spanish, Hip Hop, Dark Trap
        lydian: ['C', 'D', 'E', 'F#', 'G', 'A', 'B'],       // Dreamy, Sci-Fi, Film Score
        mixolydian: ['C', 'D', 'E', 'F', 'G', 'A', 'Bb'],   // Blues, Rock, House
        pentatonic_major: ['C', 'D', 'E', 'G', 'A'],        // Country, Pop
        pentatonic_minor: ['C', 'Eb', 'F', 'G', 'Bb'],      // Blues, Rock Riffs
        blues: ['C', 'Eb', 'F', 'F#', 'G', 'Bb'],           // Blues Licks
        whole_tone: ['C', 'D', 'E', 'F#', 'G#', 'A#'],      // Dream sequences, unsettled
        hirajoshi: ['C', 'D', 'Eb', 'G', 'Ab'],             // Japanese flavour (Anime)
        arabic: ['C', 'Db', 'E', 'F', 'G', 'Ab', 'B'],      // Double Harmonic Major
    },

    // BPM ranges by genre
    tempos: {
        lofi: { min: 70, max: 90, typical: 80 },
        trap: { min: 60, max: 85, typical: 70 }, // Half-time feel usually 140/70
        house: { min: 115, max: 130, typical: 124 },
        techno: { min: 125, max: 145, typical: 130 },
        trance: { min: 128, max: 140, typical: 138 },
        synthwave: { min: 90, max: 120, typical: 110 },
        dubstep: { min: 140, max: 150, typical: 140 },     // Half-time 70
        drum_and_bass: { min: 165, max: 185, typical: 174 },
        anime_emotional: { min: 70, max: 100, typical: 85 },
        anime_battle: { min: 150, max: 190, typical: 170 },
        anime_opening: { min: 140, max: 180, typical: 165 },
        rock: { min: 110, max: 150, typical: 120 },
        hiphop: { min: 80, max: 100, typical: 90 },
    },

    // Arpeggio patterns (16th note positions in a bar or intervals)
    arpeggioPatterns: {
        strangerThings: [0, 4, 8, 12, 2, 6, 10, 14],        // Pulsing 8ths
        upDown: [0, 2, 4, 6, 8, 10, 12, 14, 12, 10, 8, 6, 4, 2], // Classic up-down
        random: 'use Math.random() for variation',
        staccato: [0, 4, 8, 12],                           // Quarter note hits
        offbeat: [2, 6, 10, 14],                           // Reggae/Ska/House chords
        gallop: [0, 2, 3, 4, 6, 7, 8, 10, 11, 12, 14, 15], // Iron Maiden style
        euclidean332: [0, 3, 6],                           // Tresillo (3 - 3 - 2)
        spider: [0, 4, 2, 6, 8, 12, 10, 14],               // Guitar fingerpicking style
    },

    // Drum patterns (beat positions in 16 steps)
    drumPatterns: {
        fourOnFloor: {
            kick: [0, 4, 8, 12],
            hihat: [2, 6, 10, 14],                           // Offbeat
            snare: [4, 12],                                  // 2 and 4
        },
        trap: {
            kick: [0, 10],                                   // Sparse kick
            hihat: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], // Rolls needed
            snare: [4, 12],
            clap: [4, 12],
        },
        breakbeat: {
            kick: [0, 6, 10],
            snare: [4, 12],
            hihat: [0, 2, 4, 6, 8, 10, 12, 14],
        },
        lofi: {
            kick: [0, 10],                                   // Lazy, swung
            snare: [4, 12],
            hihat: [2, 6, 10, 14],
        },
        reggaeton: {
            kick: [0, 4, 8, 12],
            snare: [3, 6, 11, 14], // Dembow rhythm
            hihat: [0, 2, 4, 6, 8, 10, 12, 14],
        },
        rock: {
            kick: [0, 5, 10],
            snare: [4, 12],
            hihat: [0, 2, 4, 6, 8, 10, 12, 14], // 8ths
        },
        dnb: {
            kick: [0, 10], // Amen-ish
            snare: [4, 12], // 2 and 4 at 170+ bpm
            hihat: [0, 2, 3, 4, 6, 8, 10, 11, 12, 14],
        }
    },

    // Specific song reference sounds (described, not copied)
    references: {
        strangerThings: {
            description: 'Dark, pulsing C major arpeggio at 100 BPM, layered with atmospheric pad',
            key: 'C major / A minor',
            bpm: 100,
            instruments: ['arp (pulse wave)', 'pad (triangle)', 'bass (sawtooth)'],
            pattern: '8th note arpeggios, repeating root-third-fifth pattern',
        },
        mandalorian: {
            description: 'Sparse western theme with bass recorder/flute and ethnic drums',
            key: 'D minor',
            bpm: 80,
            instruments: ['pluck (recorder-like)', 'strings', 'tom', 'pad'],
            pattern: 'Melodic phrases with space, emphasis on minor 2nd intervals',
        },
        alanWalker: {
            description: 'Emotional melodic EDM with "Faded" style progression',
            key: 'A minor',
            bpm: 90,
            progression: ['Am', 'F', 'C', 'G'],
            instruments: ['pad (ethereal)', 'lead (supersaw)', 'arp (plucky)'],
        },
        bladeRunner: {
            description: 'Vangelis-style ambient synth with brass-like leads',
            key: 'C# minor',
            bpm: 70,
            instruments: ['pad (slow attack)', 'lead (brass-like)', 'fm (bells)'],
        },
        daftPunk: {
            description: 'French House/Disco with filter house loops and vocoder vibes',
            key: 'B minor',
            bpm: 120,
            instruments: ['bass (funky)', 'kick (thumping)', 'filter effects'],
            pattern: 'Sampled loops, filter cutoffs opening and closing',
        },
        hansZimmer: {
            description: 'Interstellar-style pipe organ or massive string swells',
            key: 'A minor',
            bpm: 60,
            instruments: ['start simple', 'build to massive string/pad stack', 'arp (slow constant)', 'clock ticking percussion'],
        },
        animeOst: {
            description: 'Emotional anime soundtrack with piano-like leads and orchestral strings',
            key: 'A minor / C major',
            bpm: 85,
            progression: ['Am', 'F', 'C', 'G'],
            instruments: ['lead (piano-like triangle)', 'strings (lush)', 'pluck (harp)', 'pad (atmospheric)'],
        },
        animeBattle: {
            description: 'Intense anime battle music with driving rhythm and powerful strings',
            key: 'E minor',
            bpm: 160,
            progression: ['Em', 'C', 'D', 'Bm'],
            instruments: ['lead (supersaw)', 'strings (fast attack)', 'kick (punchy)', 'bass (aggressive)'],
        },
        ghibli: {
            description: 'Joe Hisaishi style, nostalgic, piano-led waltzes or pastoral themes',
            key: 'Bb major',
            bpm: 100,
            instruments: ['lead (piano/pluck)', 'strings (legato)', 'woodwinds (fm)', 'chimes'],
        },
        nujabes: {
            description: 'Jazz-hop/Lofi with piano samples and breakbeats',
            key: 'F major',
            bpm: 90,
            instruments: ['kick (dusty)', 'snare (tight)', 'hihat (swung)', 'lead (piano)', 'sax (fm/lead)'],
        },
        attackOnTitan: {
            description: 'Epic orchestral with choir feel, intense and dramatic',
            key: 'D minor',
            bpm: 170,
            progression: ['Dm', 'Bb', 'C', 'Am'],
            instruments: ['strings (epic)', 'lead (brass-like)', 'kick', 'snare'],
        }
    }
};

// Helper to get genre-specific context for AI
export function getGenreContext(genre: string): string {
    const lower = genre.toLowerCase();

    let context = '';

    // Add tempo info
    for (const [name, tempo] of Object.entries(MUSIC_KNOWLEDGE.tempos)) {
        if (lower.includes(name)) {
            context += `BPM should be around ${tempo.typical} (range: ${tempo.min}-${tempo.max}). `;
            break;
        }
    }

    // Add progression suggestions
    for (const [name, progs] of Object.entries(MUSIC_KNOWLEDGE.progressions)) {
        if (lower.includes(name)) {
            const progEntries = Object.values(progs) as string[][][];
            if (progEntries.length > 0 && Array.isArray(progEntries[0])) {
                context += `Use chord progressions like: ${progEntries[0].join(' -> ')}. `;
            }
            break;
        }
    }

    // Add reference info
    for (const [name, ref] of Object.entries(MUSIC_KNOWLEDGE.references)) {
        if (lower.includes(name.toLowerCase()) || lower.includes(name.replace(/([A-Z])/g, ' $1').toLowerCase())) {
            context += `${ref.description}. Key: ${ref.key}, BPM: ${ref.bpm}. `;
            if ('progression' in ref) {
                context += `Progression: ${ref.progression.join(' -> ')}. `;
            }
            break;
        }
    }

    return context;
}
