<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Podio Competencia - Batalla</h1>
      <NuxtLink to="/" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        ← Regresar
      </NuxtLink>
    </div>

    <table class="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
      <thead class="bg-blue-100 text-gray-800">
        <tr>
          <th class="py-2 px-4">Posición</th>
          <th class="py-2 px-4 text-left">Participante</th>
          <th class="py-2 px-4">Puntos</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(p, index) in podio" :key="p.$id" class="text-center">
          <td class="py-2 px-4">
            <span v-if="index === 0">🥇</span>
            <span v-else-if="index === 1">🥈</span>
            <span v-else-if="index === 2">🥉</span>
            <span v-else>{{ index + 1 }}</span>
          </td>
          <td class="py-2 px-4 text-left">{{ p.Nombres }}</td>
          <td class="py-2 px-4 font-bold text-green-700">{{ p.Puntos }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Query } from 'appwrite'

const { $databases } = useNuxtApp()
const toast = useToast()

const dbId = '686c5e84001c62957f30'
const collectionBatalla = '6876fb3e000b5fe1380f'
const collectionParticipantes = '686c5fd50012c057e441'

const podio = ref([])

const cargarPodio = async () => {
  try {
    const batallaDocs = await $databases.listDocuments(dbId, collectionBatalla)
    const podioConNombres = []

    for (const doc of batallaDocs.documents) {
      try {

        const participanteId = doc.Participante?.$id || doc.Participante
        const participante = await $databases.getDocument(dbId, collectionParticipantes, participanteId)
        podioConNombres.push({
          ...doc,
          Nombres: participante.Nombres,
          Puntos: parseFloat(doc.Puntos ?? 0)
        })
      } catch (e) {
        console.warn(`Participante con ID ${doc.Participante} no existe y será omitido.`)
      }
    }

    podio.value = podioConNombres
      .sort((a, b) => b.Puntos - a.Puntos)
      .slice(0, 8)

  } catch (error) {
    console.error("Error cargando podio:", error)
    toast.add({ title: 'Error cargando podio', color: 'red' })
  }
}

onMounted(() => {
  cargarPodio()
})
</script>
