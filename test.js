import {
  encodeToEuckr,
  decodeEuckrBytes,
  isEuckr,
  getEuckrByteLength,
} from "./index.js";

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    console.error(`❌ ${message}\n   Expected: ${expected}\n   Got: ${actual}`);
  } else {
    console.log(`✅ ${message}`);
  }
}

function assertArrayEqual(actual, expected, message) {
  const isEqual =
    actual.length === expected.length &&
    actual.every((v, i) => v === expected[i]);
  if (!isEqual) {
    console.error(`❌ ${message}\n   Expected: ${expected}\n   Got: ${actual}`);
  } else {
    console.log(`✅ ${message}`);
  }
}

// ========== TEST CASES ==========

// Test 1: ASCII
(() => {
  const input = "Hello!";
  const encoded = encodeToEuckr(input);
  const decoded = decodeEuckrBytes(encoded);
  assertEqual(decoded, input, "ASCII encode/decode round-trip");
})();

// Test 2: Hangul
(() => {
  const input = "가각간";
  const encoded = encodeToEuckr(input);
  const decoded = decodeEuckrBytes(encoded);
  assertEqual(decoded, input, "Hangul encode/decode round-trip");
})();

// Test 3: Mixed ASCII + Hangul
(() => {
  const input = "ABC강DEF";
  const encoded = encodeToEuckr(input);
  const decoded = decodeEuckrBytes(encoded);
  assertEqual(decoded, input, "Mixed ASCII + Hangul round-trip");
})();

// Test 4: isEuckr valid
(() => {
  const input = "Hello가각라";
  const result = isEuckr(input);
  assertEqual(
    result,
    true,
    "isEuckr should return true for valid EUC-KR string"
  );
})();

// Test 5: isEuckr false
(() => {
  const input = "Hello😊";
  const result = isEuckr(input);
  assertEqual(
    result,
    false,
    "isEuckr should return false for unsupported emoji"
  );
})();

// Test 6: Byte length estimation
(() => {
  const input = "A가B각";
  const result = getEuckrByteLength(input); // A=1, 가=2, B=1, 각=2 → 6
  assertEqual(result, 6, "EUC-KR byte length estimation");
})();

// Test 7: Error for unsupported character
(() => {
  const input = "😊";
  try {
    encodeToEuckr(input);
    console.error("❌ Expected error for unsupported character");
  } catch (e) {
    console.log("✅ Throws error for unsupported character");
  }
})();
