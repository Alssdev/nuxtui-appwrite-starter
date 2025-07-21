<template>
  <div class="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Registrar Tiempos - Esquiva Objetos</h1>
      <span class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">Ronda Activa</span>
    </div>

    <form @submit.prevent="create">
      <div class="grid grid-cols-1 gap-4 mb-6">
        <UFormField label="Participante">
          <UInputMenu
            v-model="form.ParticipanteSeleccionado"
            :items="participantes"
            placeholder="Seleccione un participante"
            value-key="$id"
            label-key="Nombres"
          />
        </UFormField>

        <UFormField label="Tiempo (segundos)">
          <UInput
            v-model="form.Tiempo"
            type="number"
            step="0.01"
            min="0"
            placeholder="Ej. 12.58"
          />
        </UFormField>

        <UFormField label="Ronda">
          <USelect
            v-model="form.Rondas"
            :items="['1', '2']"
            placeholder="Seleccione una ronda"
            class="w-48"
          />
        </UFormField>

        <UFormField label="Fase">
          <USelect
            v-model="form.Fase"
            :items="['Clasificatoria', 'Final']"
            placeholder="Seleccione una fase"
          />
        </UFormField>
      </div>

      <div class="flex flex-wrap gap-3">
        <NuxtLink to="/" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded text-center">
          Regresar
        </NuxtLink>

        <button type="submit" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
          Guardar
        </button>

        <button type="button" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded" @click="finalizar">
          Finalizar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ID, Query } from 'appwrite'
const toast = useToast()
const { $databases } = useNuxtApp()

const form = ref({
  ParticipanteSeleccionado: '', 
  Tiempo: null,
  Rondas: '',
  Fase: ''
})

const participantes = ref([])

const response = await $databases.listDocuments(
  '686c5e84001c62957f30', /* Base de datos */
  '686c5fd50012c057e441', /* 686c5fd50012c057e441 */
  [
    Query.or([
      Query.equal('Categoria_1', 'Esquiva'),
      Query.equal('Categoria_2', 'Esquiva')
    ]),
    Query.limit(30)
  ]
)
participantes.value = response.documents

async function create() {
  const { ParticipanteSeleccionado, Tiempo, Rondas, Fase } = form.value

  if (!ParticipanteSeleccionado || !Tiempo || !Rondas || !Fase) {
    toast.add({ title: 'Por favor complete todos los campos', color: 'red' })
    return
  }

  try {
    await $databases.createDocument(
      '686c5e84001c62957f30', /* Base de datos */
      '686f030d003a9e313b5e', /* categoria  */
      ID.unique(),
      {
        Participante: ParticipanteSeleccionado, //Quitar el .$id
        Tiempo,
        Rondas,
        Fase
      }
    )

    toast.add({ title: 'Guardado exitosamente' })
    form.value = {
      ParticipanteSeleccionado: null,
      Tiempo: null,
      Rondas: '',
      Fase: ''
    }
  } catch (error) {
    console.error("Error al guardar:", error)
    toast.add({ title: 'Error al guardar los datos', color: 'red' })
  }
}

</script>

