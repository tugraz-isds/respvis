export async function writeStreamToPromise(stream: NodeJS.ReadWriteStream) {
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve({}))
    stream.on('error', () => reject())
  })
}
