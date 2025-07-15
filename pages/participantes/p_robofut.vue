<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-center">Participantes - Robofut</h1>

    <div class="mb-4">
      <input
        v-model="busqueda"
        type="text"
        placeholder="Buscar participante por nombre..."
        class="input"
      />
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white shadow rounded-lg">
        <thead class="bg-gray-200 text-gray-700 text-left">
          <tr>
            <th class="p-3">#</th>
            <th class="p-3">Nombre</th>
            <th class="p-3">Grado y seccion</th>
            <th class="p-3">Telefono</th>
            <th class="p-3">No. Robot</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(p, index) in participantesFiltrados"
            :key="p.id"
            class="border-t"
          >
            <td class="p-3">{{ index + 1 }}</td>
            <td class="p-3">
              <input v-model="p.Nombres" class="input-table" />
            </td>
            <td class="p-3">
              <input v-model="p.Grado_Seccion" class="input-table" />
            </td>
            <td class="p-3">
              <input v-model="p.Telefono" class="input-table" />
            </td>
            <td class="p-3">
              <input v-model="p.Robot" class="input-table" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Botones -->
    <div class="mt-6 flex flex-wrap gap-3">
      <NuxtLink to="/">
        <button class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">← Regresar</button>
      </NuxtLink>

      <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded" @click="guardarCambios">
        Guardar
      </button>
    </div>
  </div>
</template>

<script setup>
import { Query } from "appwrite";
import { ref, computed } from 'vue';
const toast = useToast()
const { $databases } = useNuxtApp();
// Lista simulada de participantes
const participantes = ref([
])
const response = await $databases.listDocuments(
  '686c5e84001c62957f30', //ID base de datos
  '686c5fd50012c057e441', //ID coleccion
  [Query.limit(200),
    Query.or([Query.equal('Categoria_1','Robofut'),
    Query.equal('Categoria_2','Robofut'),])
  ]
)
participantes.value = response.documents;
const busqueda = ref('')

// Filtro por nombre
const participantesFiltrados = computed(() =>
  participantes.value.filter(p =>
    p.Nombres.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)

// Función de guardar (puedes conectar Appwrite aquí)
const guardarCambios = async() => {
  for (let i = 0; i < participantes.value.length; i++) {
    const participante = participantes.value[i];
    
    const updated = await $databases.updateDocument(
      '686c5e84001c62957f30', //ID base de datos
      '686c5fd50012c057e441', //ID coleccion
      participante.$id,
      {
        Telefono: participante.Telefono,
        Robot: participante.Robot,
        Grado_Seccion: participante.Grado_Seccion
      }
    )
    
  }
  toast.add({ title:'Se guardaron los cambios' })
}
</script>

<style scoped>

</style>
