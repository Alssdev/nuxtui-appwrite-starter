<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Podio Final - Drones</h1>
      <NuxtLink to="/" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        ← Regresar
      </NuxtLink>
    </div>

    <table class="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
      <thead class="bg-blue-100 text-gray-800">
        <tr>
          <th class="py-2 px-4">Participante</th>
          <th class="py-2 px-4">Ronda 1</th>
          <th class="py-2 px-4">Ronda 2</th>
          <th class="py-2 px-4">Ronda 3</th>
          <th class="py-2 px-4 font-bold">Tiempo Final</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(c, index) in competidoresOrdenados" :key="c.id" class="text-center">
          <td class="py-2 px-4">
            <span v-if="index === 0">🥇</span>
            <span v-else-if="index === 1">🥈</span>
            <span v-else-if="index === 2">🥉</span>
            <span v-else>{{ index + 1 }}.</span>
            {{ ' ' + c.nombre }}
          </td>
          <td class="py-2 px-4">{{ c.tiempos[1] ?? '-' }}</td>
          <td class="py-2 px-4">{{ c.tiempos[2] ?? '-' }}</td>
          <td class="py-2 px-4">{{ c.tiempos[3] ?? '-' }}</td>
          <td class="py-2 px-4 font-bold text-green-700">{{ c.menorTiempo }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Query } from 'appwrite'
const { $databases } = useNuxtApp()

const dbId = '686c5e84001c62957f30'
const collectionTiempos = '686f030d003a9e313b5e' // colección de resultados

const competidoresOrdenados = ref([])

const loadReporte = async () => {

  const tiempos = await $databases.listDocuments(dbId, collectionTiempos, [
    Query.equal('Fase', ['Final'])
  ])

  const agrupados = {}

  tiempos.documents.forEach(doc => {
    const participante = doc.Participante
    const ronda = parseInt(doc.Rondas)
    const tiempo = parseFloat(doc.Tiempo)

    if (!agrupados[participante.$id]) {
      agrupados[participante.$id] = { id: participante.$id, tiempos: {}, nombre: participante.Nombres }
    }

    agrupados[participante.$id].tiempos[ronda] = tiempo
  })

  const listaFinal = Object.values(agrupados).map(c => {
    const tiempos = Object.values(c.tiempos)
    return {
      ...c,
      menorTiempo: Math.min(...tiempos)
    }
  })

  competidoresOrdenados.value = listaFinal.sort((a, b) => a.menorTiempo - b.menorTiempo)
}

onMounted(() => {
  loadReporte()
})
</script>
