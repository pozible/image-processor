import { Storage }  from '@google-cloud/storage'

import processImage from './processImage'
const storage = new Storage()

const getData = object => {
  const metadata = object.metadata || {}
  const data = metadata.data || '{}'
  try {
    return JSON.parse( data )
  } catch ( err ) {
    console.error('Metadata parse error', err)
    return {}
  }
}

export default event => {
  const isDeletionEvent = event.resourceState === 'not_exists'
  const isDeployEvent = !event.name
  if (isDeletionEvent || isDeployEvent) return

  const data = getData( event )
  const dimensions = data.dimensions
  if (!dimensions) return

  const file = storage.bucket(event.bucket).file(event.name)
  return processImage({ dimensions, file })
}