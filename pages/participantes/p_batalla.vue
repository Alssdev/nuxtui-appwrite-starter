<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-center">Participantes - Robot de Batalla</h1>

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
              <input v-model="p.nombre" class="input-table" />
            </td>
            <td class="p-3">
              <input v-model="p.institucion" class="input-table" />
            </td>
            <td class="p-3">
              <input v-model="p.categoria" class="input-table" />
            </td>
            <td class="p-3">
              <input v-model="p.tiempo" type="number" step="0.01" class="input-table" />
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
import { ref, computed } from 'vue'

// Lista simulada de participantes
const participantes = ref([
])

const busqueda = ref('')

// Filtro por nombre
const participantesFiltrados = computed(() =>
  participantes.value.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)

// Función de guardar (puedes conectar Appwrite aquí)
const guardarCambios = () => {
  console.log('Guardado:', JSON.stringify(participantes.value, null, 2))
  alert('Cambios guardados correctamente.')
}
</script>

<style scoped>

</style>
