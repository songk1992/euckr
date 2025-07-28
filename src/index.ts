// Import from JSON
import euckrTableJson from "./data/euckrTable.json";
import ksx1001Json from "./data/ksx1001UnicodeSet.json";
import nonKorKsx1001Json from "./data/nonKorKsx1001UnicodeSet.json";

// Construct runtime structures
const euckrTable: Record<number, string> = {};
for (const [key, val] of Object.entries(euckrTableJson)) {
  euckrTable[parseInt(key)] = val;
}

const ksx1001UnicodeSet = new Set<string>(ksx1001Json);
const nonKorKsx1001UnicodeSet = new Set<string>(nonKorKsx1001Json);

// Map Unicode character to EUC-KR code
const unicodeToEuckr = new Map<string, number>(
  Object.entries(euckrTable).map(([key, value]) => [value, parseInt(key)])
);

/**
 * Encode a string to EUC-KR byte array
 */
function encodeToEuckr(str: string): Uint8Array {
  const bytes: number[] = [];
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

/**
 * Decode EUC-KR byte array to string
 */
function decodeEuckrBytes(byteArray: Uint8Array | number[]): string {
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
 * Check if a string is valid EUC-KR encodable
 */
function isEuckr(str: string): boolean {
  for (const ch of str) {
    const code = ch.charCodeAt(0);
    if (code <= 0x7f) continue;
    if (ksx1001UnicodeSet.has(ch)) continue;
    if (nonKorKsx1001UnicodeSet.has(ch)) continue;
    return false;
  }
  return true;
}

/**
 * Get total EUC-KR byte length of string
 */
function getEuckrByteLength(str: string): number {
  let len = 0;
  for (const ch of str) {
    const code = ch.charCodeAt(0);
    if (code <= 0x7f) {
      len += 1;
    } else if (ksx1001UnicodeSet.has(ch) || nonKorKsx1001UnicodeSet.has(ch)) {
      len += 2;
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
