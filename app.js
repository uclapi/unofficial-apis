import express from 'express'

import api from './api'

const app = express()

const PORT = process.env.PORT || 3000

app.get(`/`, (req, res) => res.send(`Hello`))

app.get(`/modules`, async (req, res) => res.json(await api.moduleCatalogue.getAllModules()))

app.get(`/modules/:moduleCode`, async (req, res) => {
  const selectedModule = await api.moduleCatalogue.getModuleByCode(req.params.moduleCode)
  if (selectedModule === null) {
    return res.status(404).json({ error: `Module not found` })
  }
  return res.json(selectedModule)
})

app.get(`/societies`, async (req, res) => res.json(await api.studentUnion.getSocieties()))

app.get(`/societies/:id`, async (req, res) => res.json(await api.studentUnion.getSocietyById(req.params.id)))

app.listen(
  PORT,
  () => {
    console.log(`Server running`)
  }
)