'use strict'

Boolean(((w, d, modName) => {
  const DAT_HASH_REGEX = /^[a-z0-9]{64}$/i
  const DAT_WHASH_REGEX = /[a-z0-9]{64}/i

  let isDat
  let getProtocol

  // typeof w.beaker === 'object' for Beaker
  const isBeaker = () => w.navigator.appVersion.indexOf('BeakerBrowser/') !== -1
  const isDatKey = (k) => DAT_HASH_REGEX.test(k || window.location.hostname)

  const getDatKey = (u) => {
    if (!u) { u = window.location.hostname }
    if (isDatKey(u)) { return u }
    const k = u.match(DAT_WHASH_REGEX)
    if (k && k[0]) { return k[0] }
    return false
  }

  if (typeof w.DatArchive === 'undefined') {
    isDat = () => false
    getProtocol = () => w.location.protocol

    class DatArchive {
      // Contrary to beaker DatArchive, we need to support shortnames over https
      // and not simply a dat key
      // This let's us fetch https://a-site.example.com/
      // and further https://a-site.example.com/dat.json
      // and https://a-site.example.com/.well-known/dat

      // If we are given a dat key over the dat protocol, we're kind of stuck
      // since we can't fetch('dat://...') and we have no way
      // of turning a dat address into a shortname.
      constructor (u) {
        const k = getDatKey(u)
        if (k) { throw new Error('Expecting a shortname') }
        this.key = k
        this.u = u
      }

      waitValid () {
        return DatArchive.resolveName(this.u)
          .then((x) => { this.key = x })
          .then(() => {
            const $a = d.createElement('a')
            $a.href = this.u
            return w.fetch(`https://${$a.hostname}/dat.json`)
          })
          .then((res) => res.ok ? res.json() : Promise.reject())
          .then((x) => Object.assign(this, x, { ready: true }))
          .then((x) => {
            console.log('XXX:', x)
            return x
          })
          .catch((e) => {
            e.message2 = 'Expecting a shortname'
            console.error('CATEEE:', e)
            this.invalid = true
            return Promise.reject(e)
          })
      }

      static resolveName (u) {
        // handles:
        // abc123abc (dat key)
        // dat://abc123abc (dat key)
        // short.name.com (hostname only)
        // dat://short.name.com/
        // https://short.name.com/
        if (isDatKey(u)) { return Promise.resolve(u) }
        const $a = d.createElement('a')
        $a.href = u
        return w.fetch(`https://${$a.hostname}/.well-known/dat`)
          .then((res) => res.ok ? res.text() : Promise.reject())
          .then((t) => {
            const k = t.match(DAT_WHASH_REGEX)
            if (k && k[0]) { return k[0] }
            return Promise.reject()
          })
          .catch((e) => Promise.reject(new Error('Cannot resolve to a dat key')))
      }
    }

    w.DatArchive = DatArchive
  } else {
    isDat = () => true
    getProtocol = () => 'dat:'
  }

  const info = () => {
    /*
    console.log('isBeaker:', isBeaker())
    console.log('isDat:', isDat())
    console.log('getProtocol:', getProtocol())
    console.log('typeof window.DatArchive', typeof w.DatArchive)
    */

    return DatArchive.resolveName(w.location.hostname)
      .then((x) => {
        try {
          const bof = new DatArchive(w.location.href)

          bof.waitValid()
            .then((x) => {
              console.log('RN:', x)
              console.log('BOF.key:', bof.key)
              console.log('BOF.createdBy:', bof.createdBy)
              console.log('BOF.description:', bof.description)
              console.log('BOF.title:', bof.title)
              console.log('BOF.url:', bof.url)
              console.log('BOF.ready:', bof.ready)
              console.log('BOF.invalid:', bof.invalid)
            })
        } catch (e) {
          console.error('BOOO', e)
        }
        return x
      })
      .catch(console.error)
  }

  w[modName] = { isBeaker, isDat, info }
})(window, document, 'utils'))
