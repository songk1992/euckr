import { ksx1001UnicodeSet } from "./data/ksx1001UnicodeSet.js";
import { nonKorKsx1001UnicodeSet } from "./data/nonKorKsx1001UnicodeSet.js";
import { euckrTable } from "./data/euckrTable.js";

// Build once at module init
const unicodeToEuckr = new Map(
  Object.entries(euckrTable).map(([key, value]) => [value, parseInt(key)])
);

function encodeToEuckr(str) {
  const bytes = [];
  for (const ch of str) {
    const code = ch.charCodeAt(0);
    if (code <= 0x7f) {
      bytes.push(code);
    } else {
      const euckr = unicodeToEuckr.get(ch);
      if (!euckr)
        throw new Error(`Character "${ch}" not found in EUC-KR table`);
      bytes.push((euckr >> 8) & 0xff, euckr & 0xff);
    }
  }
  return new Uint8Array(bytes);
}

function decodeEuckrBytes(byteArray) {
  let result = "";
  for (let i = 0; i < byteArray.length; i++) {
    const b1 = byteArray[i];
    if (b1 <= 0x7f) {
      result += String.fromCharCode(b1);
    } else {
      const b2 = byteArray[++i];
      const key = (b1 << 8) | b2;
      result += euckrTable[key] || "�";
    }
  }
  return result;
}

/**
 * Check if a character is representable in EUC-KR.
 * Note: this version assumes ASCII + basic Hangul coverage.
 * @param {string} str
 * @returns {boolean}
 */
function isEuckr(str) {
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];

    // ASCII
    if (ch.charCodeAt(0) <= 0x7f) continue;

    // Check string Sets
    if (ksx1001UnicodeSet.has(ch)) continue;
    if (nonKorKsx1001UnicodeSet.has(ch)) continue;

    return false;
  }
  return true;
}

/**
 * Estimate EUC-KR byte length of a string
 * @param {string} str
 * @returns {number}
 */
function getEuckrByteLength(str) {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    const code = ch.charCodeAt(0);
    if (code <= 0x7f) {
      len += 1; // ASCII
    } else if (ksx1001UnicodeSet.has(ch)) {
      len += 2; // KS X 1001
    } else if (nonKorKsx1001UnicodeSet.has(ch)) {
      len += 2; // Other EUC-KR
    } else {
      throw new Error(
        `Character "${ch}" (U+${code
          .toString(16)
          .toUpperCase()}) not supported in EUC-KR`
      );
    }
  }
  return len;
}

export { isEuckr, getEuckrByteLength, decodeEuckrBytes, encodeToEuckr };
