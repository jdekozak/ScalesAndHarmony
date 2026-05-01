export const NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Tuning of the bass (E A D G) from highest string visually to lowest, but string 1 is G, 4 is E.
// Strings are usually 4:E, 3:A, 2:D, 1:G.
// Let's use standard E1, A1, D2, G2 for a bass, but we just need the note index.
// E = 4, A = 9, D = 2, G = 7
export const TUNING = [
    { name: 'G', startIndex: 7 }, // String 1 (highest pitch, visually top or bottom depending on layout, usually top for tabs)
    { name: 'D', startIndex: 2 }, // String 2
    { name: 'A', startIndex: 9 }, // String 3
    { name: 'E', startIndex: 4 }  // String 4 (lowest pitch)
];

export const SCALES = {
    "Major": {
        intervals: [0, 2, 4, 5, 7, 9, 11],
        modes: ["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"],
        flatRoots: ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb']
    },
    "Minor": {
        intervals: [0, 2, 3, 5, 7, 8, 10],
        modes: ["Aeolian", "Locrian", "Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian"],
        flatRoots: ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'G', 'D']
    },
    "Harmonic Minor": {
        intervals: [0, 2, 3, 5, 7, 8, 11],
        modes: ["Harmonic Minor", "Locrian ♮6", "Ionian #5", "Dorian #4", "Phrygian Dominant", "Lydian #2", "Ultralocrian"],
        flatRoots: ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'G', 'D']
    },
    "Melodic Minor": {
        intervals: [0, 2, 3, 5, 7, 9, 11],
        modes: ["Melodic Minor", "Dorian b2", "Lydian Augmented", "Lydian Dominant", "Mixolydian b6", "Locrian #2", "Altered Scale"],
        flatRoots: ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'G', 'D']
    },
    "Pentatonic Major": {
        intervals: [0, 2, 4, 7, 9],
        modes: ["Major Pentatonic", "Suspended Pentatonic", "Man Gong", "Ritsusen", "Minor Pentatonic"],
        flatRoots: ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb']
    },
    "Pentatonic Minor": {
        intervals: [0, 3, 5, 7, 10],
        modes: ["Minor Pentatonic", "Major Pentatonic", "Suspended Pentatonic", "Man Gong", "Ritsusen"],
        flatRoots: ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'G', 'D']
    },
    "Blues": {
        intervals: [0, 3, 5, 6, 7, 10],
        modes: ["Blues", "Mode 2", "Mode 3", "Mode 4", "Mode 5", "Mode 6"],
        flatRoots: ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'G', 'D']
    }
};

export const MODE_COLORS = [
    "#ef476f", // Red
    "#f78c6b", // Orange
    "#ffd166", // Yellow
    "#06d6a0", // Green
    "#118ab2", // Blue
    "#073b4c", // Dark Blue
    "#9d4edd", // Purple
];

export function shouldUseFlats(root, scaleName) {
    const scale = SCALES[scaleName];
    if (scale && scale.flatRoots.includes(root)) {
        return true;
    }
    // Handle enharmonics strictly if needed, but this simple check works for most
    if (root.includes('b')) return true;
    if (root === 'F') return true; 
    return false;
}

export function getScaleNotes(root, scaleName) {
    const isFlat = shouldUseFlats(root, scaleName);
    const notesArray = isFlat ? NOTES_FLAT : NOTES_SHARP;
    
    let rootIndex = notesArray.indexOf(root);
    if (rootIndex === -1) {
        // Fallback if not found (e.g. user selected C# but array has Db)
        const altArray = isFlat ? NOTES_SHARP : NOTES_FLAT;
        rootIndex = altArray.indexOf(root);
    }
    
    const scaleInfo = SCALES[scaleName];
    const notes = [];
    
    scaleInfo.intervals.forEach((interval, i) => {
        const noteIndex = (rootIndex + interval) % 12;
        notes.push({
            name: notesArray[noteIndex],
            index: noteIndex,
            degree: i + 1,
            modeName: scaleInfo.modes[i] || `Degree ${i+1}`,
            color: MODE_COLORS[i % MODE_COLORS.length]
        });
    });
    
    return notes;
}
