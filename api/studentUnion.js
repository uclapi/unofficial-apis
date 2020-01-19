import axios from 'axios'
import cheerio from 'cheerio'
import CacheManager from '../lib/CacheManager'

const BASE_DOMAIN = `https://studentsunionucl.org`

const scrapeSocietiesDirectoryPage = async (pageUrl) => {
  const { data } = await axios.get(pageUrl)

}

const parseSocietiesDirectory = html => {
  const $ = cheerio.load(html)

  const societies = $(
    `#block-system-main`
    + ` .search-index__results`
    + ` .container`
    + ` .search-index__results-container`
    + ` a.clubs`
  ).map((i, el) => {
    const url = BASE_DOMAIN + $(el).attr(`href`)
    const logo = BASE_DOMAIN + $(`.clubs__logo`, el).css(`background-image`).slice(5, -2)
    const name = $(`h3.clubs__name`, el).text().trim()
    const [, id] = url.match(/clubs-societies\/([a-z-0-9]{1,})/)
    return {
      id,
      logo,
      name,
      url
    }
  }).get()

  return societies
}

const getSocieties = async () =>
  CacheManager.wrap(`STUDENT_UNION_SOCIETIES_ALL`, async () => {
    const { data } = await axios.get(`${BASE_DOMAIN}/clubs-societies/directory`)
    const societies = parseSocietiesDirectory(data)

    const $ = cheerio.load(data)
    const [
      ,
      first,
      endOfFirst,
      total
    ] = $(`.search-index__results .view-footer p.hint`).text().trim().match(/([0-9]{1,}) - ([0-9]{1,}) of ([0-9]{1,})/)
    const batchSize = Number.parseInt(endOfFirst) - Number.parseInt(first)
    const lastPage = Math.floor(Number.parseInt(total) / batchSize) - 1 // zero-indexed

    const moreSocieties = (await Promise.all(
      Array(lastPage).fill().map((_, i) => i + 1).map(pageNumber =>
        axios.get(`${BASE_DOMAIN}/clubs-societies/directory`, { params: { page: pageNumber } })
      )
    )).map(({ data: html }) => parseSocietiesDirectory(html))

    return moreSocieties.reduce((acc, cur) => [...acc, ...cur], societies)
  }, { ttl: CacheManager.TTLS.SOCIETIES })

const getSocietyById = async (id) =>
  CacheManager.wrap(`STUDENT_UNION_SOCIETIES_${id}`, async () => {
    const { data } = await axios.get(`https://studentsunionucl.org/clubs-societies/${id}`)
    const $ = cheerio.load(data)

    const name = $(`h1.banner__title.h1`).text().trim()
    const category = $(`.banner__club--category`).text().trim()
    const logo = $(`.banner__club--image--image`).css(`background-image`).slice(5, -2)
    const description = $(`#block-system-main .content .field.field-type-text-with-summary .field-items`).text().trim()

    const [
      created,
      updated,
    ] = $(`.article-date`).text().trim().split(`\n`).map(t => {
      const [
        ,
        day,
        month,
        year,
        hour,
        seconds
      ] = t.trim().match(/: [aA-zZ]{3}, ([0-9]{2})\/([0-9]{2})\/([0-9]{4}) - ([0-9]{2}):([0-9]{2})/)
      return new Date(year, month - 1, day, hour, seconds).toISOString()
    })

    const members = Number.parseInt($(`.members-block-count>h3.statistics-block-count`).text().trim())
    const president = $(`#block-uclu-societies-uclu-societies-contact p.h4.aside-block__name:nth-of-type(1)`).text().trim().slice(11)
    const website = $(`#block-uclu-societies-uclu-societies-contact p.h4.aside-block__name:nth-of-type(2)`).text().trim().slice(9)
    const email = $(`#block-uclu-societies-uclu-societies-contact p.h4.aside-block__name:nth-of-type(3)`).text().trim().slice(7)
    const constitution = $(`#block-uclu-societies-uclu-societies-contact p.h4.aside-block__name:nth-of-type(4)>span>a`).attr(`href`)

    const price = Number.parseInt($(`.field.field-name-commerce-price.field-type-commerce-price.field-label-hidden`).text().trim().slice(1))

    const facebook = $(`.field.field-name-field-facebook-group.field-type-link-field.field-label-hidden a`).attr(`href`)

    return {
      category,
      description,
      id,
      logo,
      name,
      created,
      updated,
      president,
      website,
      email,
      constitution,
      members,
      price,
      facebook
    }
  }, { ttl: CacheManager.TTLS.SOCIETIES })

export default {
  getSocieties,
  getSocietyById
}