<template>
  <div class="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Competencia de Batalla - Puntajes</h1>
      <NuxtLink to="/" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        ← Regresar
      </NuxtLink>
    </div>

    <table class="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
      <thead class="bg-blue-100 text-gray-800">
        <tr>
          <th class="py-2 px-4 text-left">Participante</th>
          <th class="py-2 px-4">Puntos</th>
          <th class="py-2 px-4">Modificar Puntos</th>
          <th class="py-2 px-4">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in participantesBatalla" :key="p.$id" class="text-center">
          <td class="py-2 px-4 text-left">{{ p.Nombres }}</td>
          <td class="py-2 px-4">{{ p.Puntos ?? 0 }}</td>
          <td class="py-2 px-4">
            <input 
              type="number" 
              step="0.01" 
              v-model.number="p.nuevoPunto" 
              class="border rounded px-2 py-1 w-20 text-center"
              placeholder="0.0"
            />
          </td>
          <td class="py-2 px-4">
            <button 
              class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              @click="actualizarPuntos(p)"
            >
              Actualizar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Query, ID } from 'appwrite'

const { $databases } = useNuxtApp()
const toast = useToast()

const dbId = '686c5e84001c62957f30' // tu base de datos
const collectionParticipantes = '686c5fd50012c057e441' // colección general de participantes
const collectionBatalla = '6876fb3e000b5fe1380f' // nueva colección específica de Batalla

const participantesBatalla = ref([])

// Cargar participantes de la categoría Batalla
const loadParticipantesBatalla = async () => {
  try {
    // 1️⃣ Obtener todos los participantes inscritos en Batalla
    const res = await $databases.listDocuments(dbId, collectionParticipantes, [
      Query.or([
        Query.equal('Categoria_1', 'Batalla'),
        Query.equal('Categoria_2', 'Batalla')
      ])
    ])

    // 2️⃣ Crear documentos en Batalla_Competencia si no existen
    const batallaDocs = []
    for (const p of res.documents) {
      try {
        const existing = await $databases.listDocuments(dbId, collectionBatalla, [
          Query.equal('Participante', p.$id)
        ])
        if (existing.total === 0) {
          // Crear documento inicial
          const nuevo = await $databases.createDocument(
            dbId,
            collectionBatalla,
            ID.unique(),
            {
              Participante: p.$id,
              Puntos: 0
            }
          )
          batallaDocs.push({...nuevo, Nombres: p.Nombres, nuevoPunto: 0})
        } else {
          const doc = existing.documents[0]
          batallaDocs.push({...doc, Nombres: p.Nombres, nuevoPunto: 0})
        }
      } catch (e) {
        console.error("Error al crear doc Batalla:", e)
      }
    }

    participantesBatalla.value = batallaDocs
  } catch (error) {
    console.error(error)
    toast.add({ title: 'Error al cargar participantes', color: 'red' })
  }
}

// Actualizar puntos en Appwrite
const actualizarPuntos = async (p) => {
  if (!p.nuevoPunto) return

  try {
    const puntosActuales = p.Puntos ?? 0
    const nuevosPuntos = parseFloat(puntosActuales) + parseFloat(p.nuevoPunto)

    await $databases.updateDocument(
      dbId,
      collectionBatalla,
      p.$id,
      { Puntos: nuevosPuntos }
    )

    p.Puntos = nuevosPuntos
    p.nuevoPunto = 0
    toast.add({ title: `Puntos actualizados a ${nuevosPuntos}` })
  } catch (e) {
    console.error(e)
    toast.add({ title: 'Error al actualizar puntos', color: 'red' })
  }
}

onMounted(() => {
  loadParticipantesBatalla()
})
</script>
