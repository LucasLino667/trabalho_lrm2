import fs from 'fs'
import path from 'path'
import https from 'https'

// ⚠️ Cole aqui seu Read Access Token
// Acesse: https://www.themoviedb.org/settings/api
// Campo: "API Read Access Token" (começa com eyJ...)
const BEARER_TOKEN = 'ad50bc774af1c013c0354a268ce4655'

const posterPaths = [
  '/6ricSDD83BClJsFdGB6x7cM0MFQ.jpg',
  '/9e3Dz7aCANy5aRUQF745IlNloJ1.jpg',
  '/lDqMDI3xpbB9UQRyeXfei0MXhqb.jpg',
  '/4lj1ikfsSmMZNyfdi8R8Tv5tsgb.jpg',
  '/igw938inb6Fy0YVcwIyxQ7Lu5FO.jpg',
  '/2dSZQGwijlXvMSyuGe0FSgrXnv0.jpg',
  '/gte2cJ3mtc2I8hZyXwRTzyclKuC.jpg',
  '/erl801HYIodoIBGZeFk0GTwCUBh.jpg',
  '/z693uKD7j3zcdX0zVMQPIA3cSZf.jpg',
  '/ivHwYw3b03dFqRkcqaDSxjj2LQT.jpg',
  '/tlvsNCwWEIgwAM23aNzTmMIcPEZ.jpg',
  '/hGwm9Cj3CdbJIqQWNExQqiYmCd4.jpg',
  '/twfKp60THrcOIep9sjHODOOfO8d.jpg',
  '/xLxgVxFWvb9hhUyCDDXxRPPnFck.jpg',
  '/uzERcfV2rSHNhW5eViQiO9hNiA7.jpg',
  '/8LJJjLjAzAwXS40S5mx79PJ2jSs.jpg',
  '/rxNelQvAjOmNGUUHRujmsHiPEIh.jpg',
  '/el1KQzwdIm17I3A6cYPfsVIWhfX.jpg',
  '/6gcHdboppvplmBWxvROc96NJnmm.jpg',
  '/z0XiwdrCQ9yVIr4O0pxzaAYRxdW.jpg',
  '/zdowK9GrOxK0YddhXuMPyxnTA02.jpg',
  '/qqOtwhj8DxOBIwI0u6ThooXEIBR.jpg',
  '/wonYMeHauhrxSi5UTOtj5L479mS.jpg',
  '/A0RoSZh8PEYJgDMgM2EV7Ycz3dR.jpg',
  '/hR4dXPlWq5Nekwjqbp3gFGeiiZS.jpg',
  '/1G7QNn1sUShae0Rf9k9D99wVFg5.jpg',
  '/eIm2nKC0125GyEPSWl6ODCA9J1S.jpg',
  '/62SAZfLfzhxJWUFJvfIPMw6QUpE.jpg',
  '/27vEYsRKa3eAniwmoccOoluEXQ1.jpg',
  '/e7BoS8uUnew9ioS6reqtK9matqy.jpg',
  '/rABcQMa8m67EJslknSlMfE3BP8L.jpg',
  '/m0tQyMdp3fy5ooUOQkJMd1fQKBJ.jpg',
  '/qxwgxjFUtZ3qf7vib9na6tdPfwT.jpg',
  '/AvMietG6xuobpSSdmVnKuTjv4bL.jpg',
  '/uqEzxvGDYNzoQE7rayv7gRXBomt.jpg',
  '/gUD2xpkiWaCUabnwMgopECylsKc.jpg',
  '/oJagOzBu9Rdd9BrciseCm3U3MCU.jpg',
  '/mCICnh7QBH0gzYaTQChBDDVIKdm.jpg',
  '/tptjnB2LDbuUWya9Cx5sQtv5hqb.jpg',
  '/gfnXixcGC060QcG6JPxN6AMdVsq.jpg',
  '/47BdQqDWnj3VIzpH9bd2agho2PN.jpg',
  '/49pANIZXRAdHUiWjjBv4vxPeqRC.jpg',
  '/9IflTrxN8yw44ZxhfvJPziGzGHM.jpg',
  '/tH64gzAHDFg7EFcgfkkZyHdGM5P.jpg',
  '/xaY92XMToaSnBuvCui3LHzNGqZB.jpg',
  '/1NxHKZW5DPbUFtbF3MxbdSyxRqU.jpg',
  '/41Co0TRUJNyvjr2vHBEcAKAEFpX.jpg',
  '/z8k5EhZZTLsCRF8NWjSe6snWNZg.jpg',
  '/7yQyDCqSazrYTnmxdQLAZ8YDH87.jpg',
  '/3DjOAUBR8Hra4R9kK9U8jDaoqyC.jpg',
  '/tAJYUFaWot3jn5vtDUoxNNIw9aF.jpg',
  '/xEC4nyJvcWcOu7QaobLcqz6iRUL.jpg',
  '/8aMqmB5xSblsZc7bLMEhE28yHa2.jpg',
  '/5p6cdAeUevsLOX0oI1T4JIul4QO.jpg',
  '/67ujv4O6AalmGu3UaVSNdcw8juT.jpg',
  '/y8A0Cvp8WQmZ3bjbnsL53lY0dsC.jpg',
  '/4BarWJRYFB5fN7LsJI9U2ul79hB.jpg',
  '/l6jn53LMu07uPt8A42JWIKi1Beb.jpg',
  '/4DUClyGA6OqjXv6yC0Imf6THGfp.jpg',
  '/9fRX8UKlIW7Lb9GqNsJVakWWFCi.jpg',
  '/A4kvp7vY1BDLrrQIagRCffLKj1t.jpg',
  '/kPbuLGVSJHATkW9fX9L3h1wM0Pa.jpg',
  '/wd7b4Nv9QBHDTIjc2m7sr0IUMoh.jpg',
  '/hm6nONQOgVpKmRK5YUX9EqfJ0NH.jpg',
  '/6VDrtm6rLEW4hByVA45V0Gpime0.jpg',
  '/fM7cHZc9WK9yU47kiiyMS4tW0uw.jpg',
  '/ar63Sx8jeqk0OOu2uchS477S2zE.jpg',
  '/sIy0jXDkaMf3SDZGaWcmkC2IOl.jpg',
  '/54nI3vSKlPp42WhJmKVRdmMbkzl.jpg',
  '/dZXYPSEaXCeigR2GEuZoukNmLTf.jpg',
  '/4AiFo2MwU62mTtuZ7VH16tlZcmo.jpg',
  '/jFmlV5vUzOt1PgJ82efOhNsWcWX.jpg',
  '/4AUW2bGbQjWACUREckGJWXmyF0d.jpg',
  '/ds7jw0WYCd6k7hBzMnzgFsTfg96.jpg',
  '/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg',
  '/in1R2dDc421JxsoRWaIIAqVI2KE.jpg',
  '/5qfd0e2uMbVInX3YdeFbDsfxi1t.jpg',
  '/6JFWzlChcGgLiIUo2COgNlWGFKy.jpg',
  '/aCTL24B8ZuiI2osMwoUI5rqBXoF.jpg',
  '/5fhZdwP1DVJ0FyVH6vrFdHwpXIn.jpg',
  '/3mEoGWyJCZTSoYyjFD3gFd6hzU4.jpg',
  '/zqbwK2ugTPauBQwzcNAM3PxVoww.jpg',
  '/dmnY0Zs8uMSHkMiol7M3xOlvvkK.jpg',
  '/zoZvqAlIt6U8XWyo2ROU2SpTVAc.jpg',
  '/vdy4JZ2mVXEPTwTnPbAQJwopWu5.jpg',
  '/qNiwJPVCO4cgiM8LVtxwPV2HxHS.jpg',
  '/vdvEClt3J8sFWxyMo0Jm7JpouEo.jpg',
  '/sWv8T2WlSrmssqQ4egi9oE4g237.jpg',
  '/rEevavl5vebCVEd5imx7D1k8nmV.jpg',
  '/bYTMDg3eGFuO7emXbQip02a8zvQ.jpg',
  '/jk1LYcbiuUr0tv37cVcmp4u9KcN.jpg',
  '/4p8ljwqw0SJjKszU0ZSPTjYFbeR.jpg',
  '/hfpnFtgcYom9Gk9s1IyWiovpZYg.jpg',
  '/3rDwbFpn6z5HJUgDjpfhEePx8VI.jpg',
  '/Ae0pbv4E6YfqfN3UjKWIfQSzP9v.jpg',
  '/hbLDwYri1pyiEIMpICgftu7s8NE.jpg',
  '/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg',
  '/yPRl1dvc0FHi8Syy1XhsoMumw9J.jpg',
  '/1jGPgDDcmg3Xgs3WO8sfYfbnFoA.jpg',
]

function downloadImage(url, filepath) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(filepath)
    const req = https.get(
      url,
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
        },
      },
      (res) => {
        if (res.statusCode === 200) {
          res.pipe(file)
          file.on('finish', () => {
            file.close()
            resolve(true)
          })
        } else {
          file.close()
          fs.unlink(filepath, () => {})
          process.stdout.write(` [HTTP ${res.statusCode}]`)
          resolve(false)
        }
      },
    )
    req.on('error', () => resolve(false))
    req.setTimeout(15000, () => {
      req.destroy()
      resolve(false)
    })
  })
}

async function main() {
  if (BEARER_TOKEN === 'SEU_READ_ACCESS_TOKEN_AQUI') {
    console.error('❌ Configure o BEARER_TOKEN no script!')
    console.error('   Acesse: https://www.themoviedb.org/settings/api')
    console.error('   Copie o "API Read Access Token" (começa com eyJ...)')
    process.exit(1)
  }

  const dir = './public/posters'
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  console.log(`📦 ${posterPaths.length} posters para baixar\n`)
  let ok = 0,
    fail = 0

  for (const posterPath of posterPaths) {
    const filename = posterPath.slice(1)
    const filepath = path.join(dir, filename)

    if (fs.existsSync(filepath)) {
      console.log(`⏭️  Já existe: ${filename}`)
      ok++
      continue
    }

    process.stdout.write(`⬇️  ${filename}... `)
    const success = await downloadImage(`https://image.tmdb.org/t/p/w500${posterPath}`, filepath)
    console.log(success ? '✅' : '❌')
    if (success) ok++
    else fail++
    await new Promise((r) => setTimeout(r, 100))
  }

  console.log(`\n✅ ${ok} baixados  ❌ ${fail} falharam`)
}

main()
