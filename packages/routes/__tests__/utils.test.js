/* @flow */

// import {
//   parseIntParam,
//   parseFilterParam,
//   prepareNodeParams,
//  } from '../utils';

// describe('parseIntParam', () => {
//   it('should handle strings', () => {
//     expect(parseIntParam('1', 0)).toBe(1);
//   });
//   it('should prevent negative numbers', () => {
//     expect(parseIntParam('-1', 0)).toBe(0);
//   });
//   it('should handle defaults', () => {
//     expect(parseIntParam(null, 10)).toBe(10);
//   });
// });
// describe('parseJsonParam', () => {
//   it('should handle base64 strings', () => {
//     const obj = { op: 'and', content: [] };
//     const b64 = JSON.stringify(obj);
//     expect(parseFilterParam(b64, null)).toEqual(obj);
//   });
//   it('should handle defaults', () => {
//     const obj = { op: 'and', content: [] };
//     expect(parseFilterParam(null, obj)).toBe(obj);
//   });
// });
// describe('prepareNodeParams', () => {
//   it('should create a base64 id', () => {
//     const obj = { id: btoa('File:hello') };
//     expect(prepareNodeParams('File')({ params: { id: 'hello' } })).toEqual(obj);
//   });
// });
