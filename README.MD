# 🇰🇷 EUC-KR Encoding Utility

EUC-KR 문자 인코딩 및 디코딩을 위한 자바스크립트 라이브러리입니다.  
Korean character encoding made easy using EUC-KR based on KS X 1001.

---

## 📦 주요 기능 | Features

- ✅ EUC-KR에서 표현 가능한 문자 판별  
  (Check if a character is supported in EUC-KR)

- 🔡 문자열을 EUC-KR 바이트로 인코딩  
  (Encode strings to EUC-KR byte sequences)

- 🧾 바이트 배열을 문자열로 디코딩  
  (Decode EUC-KR bytes to strings)

- 📏 문자열의 EUC-KR 바이트 길이 계산  
  (Get byte length in EUC-KR)

- 🔍 KS X 1001, KS X 1003 기반 완전 지원  
  (Full support for KS X 1001 table)

---

## 📦 설치 | Installation

```bash
npm install euckr
```

---

## 🛠️ 사용법 | Usage

```js
import {
  isEuckr,
  encodeToEuckr,
  decodeFromEuckr,
  getEuckrByteLength,
} from "euckr";

isEuckr("가"); // true
encodeToEuckr("가"); // [0xB0, 0xA1]
decodeFromEuckr([0xb0, 0xa1]); // "가"
getEuckrByteLength("ABC한"); // 5 (A, B, C: 1 byte each + 한: 2 bytes)
```

---

## 🧠 작동 원리 | How It Works

EUC-KR은 가변 길이 문자 인코딩입니다.

- **ASCII (0x00–0x7F)** → 1 byte
- **KS X 1001 (0xA1A1–0xFEFE)** → 2 bytes
- **지원되지 않는 문자는 오류 발생**

This library uses a verified lookup table to convert between Unicode and EUC-KR byte values.

---

## 🧾 표준 및 참고 | Standards & References

- [EUC (Wikipedia)](https://en.wikipedia.org/wiki/Extended_Unix_Code?utm_source=chatgpt.com#EUC-KR)
- [EUC-KR (한국어 위키백과)](https://ko.wikipedia.org/wiki/EUC-KR)
- [KS X 1001](https://ko.wikipedia.org/wiki/KS_X_1001) – 완성형 한글 문자 세트
- [KS X 1003](https://ko.wikipedia.org/wiki/KS_X_1003) – ASCII 기반
- [EUC-KR 문자표](https://uic.io/ko/charset/show/euc-kr/)

---

## 📄 라이선스 | License

MIT License

---

## 👤 작성자 | CodemasterKimc

Made with ❤️ by [codemasterkimc](https://github.com/songk1992)
한국어 문자 처리를 쉽게!
