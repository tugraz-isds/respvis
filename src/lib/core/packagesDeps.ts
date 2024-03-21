// export const PackagesDev = (() => {
//   return {
//     barModule: import('../bar')  }
// })()
//
// export const PackagesProd = (() => {
//   let barPath = 'bar'
//   return {
//     barModule: import(barPath)
//   }
// })()


type PackagesProd = {
  barModule?: Promise<any>
}




export const PackagesProdUser: PackagesProd = {
  barModule: undefined
}
export const setPackagesProdUser = (barPath: string) => {
  PackagesProdUser.barModule = import(barPath)
}

//TODO: This already works. Create first package and test!
// setPackagesProdUser('../respvis/respvis.js')
// PackagesProdUser.barModule?.then((module) => {
//   console.log(module)
// }).catch((reason) => {
//   console.log(reason)
// })
