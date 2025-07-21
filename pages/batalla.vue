<template>
  <div class="p-6 max-w-md mx-auto bg-white rounded-lg shadow">
    <h1 class="text-2xl font-bold mb-6 text-center">Registro de Competencia - Robot de Batalla</h1>

    <form @submit.prevent="guardarBatalla" class="flex flex-col gap-4 mb-6">
      <div>
        <label class="block mb-1 font-semibold">Categoría:</label>
        <select v-model="categoria" class="w-full border rounded p-2">
          <option disabled value="">Selecciona una categoría</option>
          <option value="Senior">Senior</option>
          <option value="Junior">Junior</option>
        </select>
      </div>

      <div>
        <label class="block mb-1 font-semibold">Fase:</label>
        <select v-model="fase" class="w-full border rounded p-2">
          <option disabled value="">Selecciona una fase</option>
          <option value="Clasificatoria">Clasificatoria</option>
          <!-- <option value="Semifinal">Semifinal</option> -->
          <option value="Final">Final</option>
        </select>
      </div>

      <div>
        <label class="block mb-1 font-semibold">Participante 1:</label>
        <select v-model="participante1" class="w-full border rounded p-2">
          <option disabled value="">Selecciona uno</option>
          <option
            v-for="p in participantes"
            :key="p.$id"
            :value="p.$id"
            :disabled="p.$id === participante2"
          >
            {{ p.Nombres }}
          </option>
        </select>
      </div>

      <div>
        <label class="block mb-1 font-semibold">Puntos Participante 1:</label>
        <input v-model.number="puntos1" type="number" min="0" class="w-full border rounded p-2" />
      </div>

      <div>
        <label class="block mb-1 font-semibold">Participante 2:</label>
        <select v-model="participante2" class="w-full border rounded p-2">
          <option disabled value="">Selecciona uno</option>
          <option
            v-for="p in participantes"
            :key="p.$id"
            :value="p.$id"
            :disabled="p.$id === participante1"
          >
            {{ p.Nombres }}
          </option>
        </select>
      </div>

      <div>
        <label class="block mb-1 font-semibold">Puntos Participante 2:</label>
        <input v-model.number="puntos2" type="number" min="0" class="w-full border rounded p-2" />
      </div>

      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4">
        Guardar
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import { ID, Query } from 'appwrite';

const { $databases } = useNuxtApp();
const DB_ID = '686c5e84001c62957f30';
const PARTICIPANTES_COLL = '686c5fd50012c057e441';
const BATALLA_COLL = '6876fb3e000b5fe1380f';

const participantes = ref([]);
const registros = ref([]);
const categoria = ref('');
const fase = ref('');
const participante1 = ref('');
const participante2 = ref('');
const puntos1 = ref(0);
const puntos2 = ref(0);

const nombresMap = ref({});

const obtenerNombre = (id) => nombresMap.value[id] || 'Desconocido';

onMounted(async () => {
  const res = await $databases.listDocuments(
    DB_ID,
    PARTICIPANTES_COLL,
    [
      Query.or([
        Query.equal('Categoria_1', 'Batalla'),
        Query.equal('Categoria_2', 'Batalla'),
      ]),
      Query.limit(100),
    ]
  );
  participantes.value = res.documents;

  res.documents.forEach(p => {
    nombresMap.value[p.$id] = p.Nombres;
  });

  const batallasRes = await $databases.listDocuments(DB_ID, BATALLA_COLL, [Query.limit(50)]);
  registros.value = batallasRes.documents;
});

const guardarBatalla = async () => {
  if (!categoria.value || !fase.value || !participante1.value || !participante2.value) {
    alert('Completa todos los campos');
    return;
  }

  try {
    await $databases.createDocument(DB_ID, BATALLA_COLL, ID.unique(), {
      Categoria: categoria.value,
      Fase: fase.value,
      Participante1: participante1.value,
      Participante2: participante2.value,
      Puntos1: puntos1.value,
      Puntos2: puntos2.value,
    });

    registros.value.push({
      Categoria: categoria.value,
      Fase: fase.value,
      Participante1: participante1.value,
      Participante2: participante2.value,
      Puntos1: puntos1.value,
      Puntos2: puntos2.value,
    });

    categoria.value = '';
    fase.value = '';
    participante1.value = '';
    participante2.value = '';
    puntos1.value = 0;
    puntos2.value = 0;
  } catch (err) {
    console.error('Error al guardar', err);
    alert('Ocurrió un error al guardar');
  }
  try {
  const test = await $databases.listDocuments(DB_ID, BATALLA_COLL, [Query.limit(1)]);
  console.log('Consulta exitosa:', test);
} catch (error) {
  console.error('Error en consulta:', error);
} 
};
</script>
