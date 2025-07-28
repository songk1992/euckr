import {
  encodeToEuckr,
  decodeEuckrBytes,
  isEuckr,
  getEuckrByteLength,
} from "../src/index.ts";

// Assertion helpers
function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    console.error(`❌ ${message}\n   Expected: ${expected}\n   Got: ${actual}`);
  } else {
    console.log(`✅ ${message}`);
  }
}

function assertArrayEqual(
  actual: Uint8Array,
  expected: number[],
  message: string
): void {
  const isEqual =
    actual.length === expected.length &&
    actual.every((v, i) => v === expected[i]);
  if (!isEqual) {
    console.error(
      `❌ ${message}\n   Expected: [${expected}]\n   Got: [${Array.from(
        actual
      )}]`
    );
  } else {
    console.log(`✅ ${message}`);
  }
}

// ==============================
// 🧪 TEST CASES
// ==============================

// Test 1: ASCII round-trip
(() => {
  const input = "Hello!";
  const encoded = encodeToEuckr(input);
  const decoded = decodeEuckrBytes(encoded);
  assertEqual(decoded, input, "ASCII round-trip encode/decode");
})();

// Test 2: Hangul round-trip
(() => {
  const input = "가각간";
  const encoded = encodeToEuckr(input);
  const decoded = decodeEuckrBytes(encoded);
  assertEqual(decoded, input, "Hangul round-trip encode/decode");
})();

// Test 3: Mixed ASCII + Hangul
(() => {
  const input = "ABC강DEF";
  const encoded = encodeToEuckr(input);
  const decoded = decodeEuckrBytes(encoded);
  assertEqual(decoded, input, "Mixed ASCII + Hangul round-trip");
})();

// Test 4: isEuckr true
(() => {
  const input = "Hello가각라";
  const result = isEuckr(input);
  assertEqual(result, true, "isEuckr returns true for EUC-KR string");
})();

// Test 5: isEuckr false (emoji)
(() => {
  const input = "Hello😊";
  const result = isEuckr(input);
  assertEqual(result, false, "isEuckr returns false for emoji");
})();

// Test 6: Byte length calculation
(() => {
  const input = "A가B각";
  const expectedLength = 6; // A=1, 가=2, B=1, 각=2
  const result = getEuckrByteLength(input);
  assertEqual(result, expectedLength, "getEuckrByteLength works correctly");
})();

// Test 7: Unsupported character throws error
(() => {
  const input = "😊";
  try {
    encodeToEuckr(input);
    console.error("❌ Expected error for unsupported character");
  } catch {
    console.log("✅ Throws error for unsupported character");
  }
})();
