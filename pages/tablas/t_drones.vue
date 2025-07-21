<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Reporte de Competidores - Fase Clasificatoria - Drones</h1>
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
const collectionTiempos = '686efc5f0022577bcd81' // colección de resultados
const collectionParticipantes = '686c5fd50012c057e441' // colección de participantes

const competidoresOrdenados = ref([])

const loadReporte = async () => {
  const tiempos = await $databases.listDocuments(dbId, collectionTiempos, [
    Query.equal('Fase', ['Clasificatoria'])
  ])
  console.log("TIEMPOS:", tiempos.documents)
  const agrupados = {}
  const participanteIds = new Set()

  tiempos.documents.forEach(doc => {
    const participante = doc.Participante //Quitar el _ID, tambien en appwrite en todo
    const ronda = parseInt(doc.Rondas)
    const tiempo = parseFloat(doc.Tiempo)

    if (!agrupados[participante.$id]) {
      agrupados[participante.$id] = { id: participante.$id, tiempos: {}, nombre: participante.Nombres }
    } // nombre: participante.Nombres y borrar lo de abajo 

    agrupados[participante.$id].tiempos[ronda] = tiempo
    participanteIds.add(participante.$id)
  })

  const nombresMap = {}

  /* for (const id of participanteIds) {
    try {
      const participante = await $databases.getDocument(dbId, collectionParticipantes, id)
      nombresMap[id] = participante.Nombres // asegúrate que el campo se llama "Nombres"
    } catch (e) {
      console.error(`No se pudo cargar el participante con ID ${id}`, e)
      nombresMap[id] = 'Desconocido'
    }
  } */

  const listaFinal = Object.values(agrupados).map(c => {
    const tiempos = Object.values(c.tiempos)
    return {
      ...c,
      /* nombre: nombresMap[c.id], */
      menorTiempo: Math.min(...tiempos)
    }
  })

  competidoresOrdenados.value = listaFinal.sort((a, b) => a.menorTiempo - b.menorTiempo)
}

onMounted(() => {
  loadReporte()
})
</script>
