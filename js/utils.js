'use strict'

Boolean(((w, d, modName) => {
  const isBeaker = () => w.navigator.appVersion.indexOf('BeakerBrowser/') !== -1

  const isDat = () => typeof w.DatArchive !== 'undefined' && 'dat:'

  const getProtocol = () => isDat() || w.location.protocol

  const info = () => {
    console.log('isBeaker:', isBeaker())
    console.log('isDat:', isDat())
    console.log('getProtocol:', getProtocol())
  }

  w[modName] = { isBeaker, isDat, info }
})(window, document, 'utils'))
