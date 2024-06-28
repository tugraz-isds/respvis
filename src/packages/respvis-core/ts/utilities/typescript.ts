// export function applyMixins(derivedCtor: any, constructors: any[]) {
//   constructors.forEach((baseCtor) => {
//     // Copy methods from prototype
//     Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
//       if (name !== 'constructor') {
//         Object.defineProperty(
//           derivedCtor.prototype,
//           name,
//           Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
//           Object.create(null)
//         );
//       }
//     });
//
//     // Copy static properties
//     Object.getOwnPropertyNames(baseCtor).forEach((name) => {
//       if (name !== 'prototype' && name !== 'name' && name !== 'length') {
//         Object.defineProperty(
//           derivedCtor,
//           name,
//           Object.getOwnPropertyDescriptor(baseCtor, name) ||
//           Object.create(null)
//         );
//       }
//     });
//   });
// }

export function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
        Object.create(null)
      );
    });
  });
}
