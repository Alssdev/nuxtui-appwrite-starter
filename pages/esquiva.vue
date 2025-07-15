<template>
  <div class="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
    <!-- Encabezado -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Registrar Tiempos "Esquiva Objetos" </h1>
      <span class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">Ronda Activa</span>
    </div>

    <form @submit.prevent="guardar">
      <div class="grid grid-cols-1 gap-4 mb-6">
        <!-- Participante ID -->
        <label>
          Participante
          <select v-model="form.participanteId" class="input">
            <option disabled value="">Seleccione un participante</option>
            <option v-for="p in participantes" :key="p.$id" :value="p.$id">{{ p.nombre }}</option>
          </select>
        </label>

        <!-- Tiempo -->
        <label>
          Tiempo (segundos)
          <input v-model="form.tiempo" type="number" step="0.01" min="0" class="input" placeholder="Ej. 12.58" />
        </label>

        <!-- Rondas -->
        <label>
          Ronda
          <select v-model="form.ronda" class="input">
            <!--Opciones-->
          </select>
        </label>

        <!-- Fase -->
        <label>
          Fase
          <select v-model="form.fase" class="input">
            <!--Opciones-->
          </select>
        </label>
      </div>

      <!-- Botones -->
      <div class="flex flex-wrap gap-3">
        <NuxtLink to="/">
          <button type="button" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded">
            Regresar
          </button>
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
import { ref, onMounted } from 'vue'
// Aquí simulas los participantes que vienen de Appwrite
const participantes = ref([])

const form = ref({
  participanteId: '',
  tiempo: null,
  ronda: '',
  fase: ''
})

const guardar = () => {
  console.log('Guardando datos:', form.value)
  // Aquí va tu lógica con Appwrite SDK
}

const finalizar = () => {
  console.log('Finalizando participación')
  // Aquí va lógica de finalización
}

onMounted(() => {
  // Simular fetch de participantes desde Appwrite
  participantes.value = []
})
</script>

<style scoped>
  
</style>
