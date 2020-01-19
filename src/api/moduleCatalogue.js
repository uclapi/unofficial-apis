import axios from 'axios'
import slugify from 'slugify'
import cheerio from 'cheerio'
import CacheManager from '../lib/CacheManager'

const getAllModules = ({
  max = 6000
} = {}) => CacheManager.wrap(`MODULE_CATALOGUE_ALL_${max}`, async () => {
  const {
    data: {
      response: {
        resultPacket: {
          results
        }
      }
    }
  } = await axios.get(`https://search2.ucl.ac.uk/s/search.json`, {
    params: {
      collection: `drupal-module-catalogue`,
      facetsort: `alpha`,
      num_ranks: max,
      daat: 10000,
      sort: `title`
    }
  })
  return results.map(({
    liveUrl,
    summary,
    metaData: {
      UclLevel,
      UclTeachingTerm,
      FeedTitle,
      UclMode,
      UclFaculty,
      UclTeachingDep,
      UclCredit
    }
  }) => {
    const [
      ,
      title,
      moduleCode
    ] = FeedTitle.match(/(^.*)\(([aA-zZ0-9]{8})\)/)
    return {
      url: liveUrl,
      summary,
      level: UclLevel,
      teachingTerm: UclTeachingTerm,
      title: title.trim(),
      mode: UclMode,
      faculty: UclFaculty,
      department: UclTeachingDep,
      credit: UclCredit,
      moduleCode
    }
  }).reduce((prev, cur) => {
    const { moduleCode } = cur
    return {
      ...prev,
      [moduleCode]: cur
    }
  }, {})
}, { ttl: CacheManager.TTLS.MODULE_CATALOGUE })

const getModuleByCode = async (moduleCode) =>
  CacheManager.wrap(`MODULE_CATALOGUE_${moduleCode}`, async () => {
    const allModules = await getAllModules()
    const selectedModule = allModules[moduleCode]
    if (typeof selectedModule === `undefined`) {
      return null
    }
    const moduleSlug = slugify(selectedModule.title).toLowerCase()
    const moduleURL = `https://www.ucl.ac.uk/module-catalogue/modules/${moduleSlug}/${moduleCode}`
    const { data } = await axios.get(moduleURL)

    const $ = cheerio.load(data)
    const mainContent = $(`.site-content__body .site-content__main`)
    const restrictions = $(
      `div.box.tagged.box--bar-thick:nth-of-type(1)`
      + ` section.middle-split`
      + ` section.middle-split__column2>dl>dd`,
      mainContent
    ).text().trim()
    const description = $(
      `.module-description`
    ).text().trim()

    const bottomBox = $(
      `div.box.tagged.box--bar-thick:nth-of-type(4)`
      + ` section.middle-split`
    )
    const expectedClassSize = $(
      `section.middle-split__column2>dl>dd:nth-of-type(1)`,
      bottomBox
    ).text().trim()
    const prevYearStudents = $(
      `section.middle-split__column2>dl>dd:nth-of-type(2)`,
      bottomBox
    ).text().trim()
    const moduleLeader = $(
      `section.middle-split__column2>dl>dd:nth-of-type(3)`,
      bottomBox
    ).text().trim()
    const assessment = $(
      `section.middle-split__column1>dl>dd:nth-of-type(2)>div`,
      bottomBox
    ).map((i, el) => $(el).text().trim().replace(/%\n[ ]*/, `% `)).get()

    const lastUpdated = $(
      `.module-updated>p`
    ).text().trim()

    return {
      ...selectedModule,
      restrictions,
      description,
      expectedClassSize,
      prevYearStudents,
      moduleLeader,
      assessment,
      lastUpdated
    }
  }, { ttl: CacheManager.TTLS.MODULE_CATALOGUE })

export default {
  getAllModules,
  getModuleByCode,
}