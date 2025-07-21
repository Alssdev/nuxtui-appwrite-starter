<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-4 text-center">Tabla de Posiciones</h2>

    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2">Posición</th>
          <th class="p-2">Participante</th>
          <th class="p-2">Puntos Totales</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(pos, index) in posiciones"
          :key="pos.id"
          :class="{
            'bg-yellow-200 font-bold': index === 0,
            'bg-gray-300 font-semibold': index === 1,
            'bg-yellow-100 font-semibold': index === 2,
            'border-t': index > 2,
          }"
        >
          <td class="p-2">{{ index + 1 }}</td>
          <td class="p-2">{{ pos.nombre }}</td>
          <td class="p-2">{{ pos.puntos }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useNuxtApp } from '#app';

const { $databases } = useNuxtApp();
const DB_ID = '686c5e84001c62957f30';
const BATALLA_COLL = '6876fb3e000b5fe1380f'; 
const PARTICIPANTES_COLL = '686c5fd50012c057e441'; 

const registros = ref([]);
const participantesMap = ref({}); // id -> nombre

onMounted(async () => {
  try {
    const batallas = await $databases.listDocuments(DB_ID, BATALLA_COLL, []);
    registros.value = batallas.documents;

    const uniqueIds = new Set();
    registros.value.forEach(b => {
      if(b.Participante1) uniqueIds.add(b.Participante1);
      if(b.Participante2) uniqueIds.add(b.Participante2);
    });

    const allParticipants = await $databases.listDocuments(DB_ID, PARTICIPANTES_COLL, []);
    allParticipants.documents.forEach(p => {
      if (uniqueIds.has(p.$id)) {
        participantesMap.value[p.$id] = p.Nombres;
      }
    });
  } catch (e) {
    console.error('Error cargando datos', e);
  }
});


const posiciones = computed(() => {
  const puntosMap = {};

  registros.value.forEach(b => {
    if(b.Participante1){
      if (!puntosMap[b.Participante1]) puntosMap[b.Participante1] = 0;
      puntosMap[b.Participante1] += b.Puntos1 || 0;
    }
    if(b.Participante2){
      if (!puntosMap[b.Participante2]) puntosMap[b.Participante2] = 0;
      puntosMap[b.Participante2] += b.Puntos2 || 0;
    }
  });


  const arrayPos = Object.entries(puntosMap).map(([id, pts]) => ({
    id,
    puntos: pts,
    nombre: participantesMap.value[id] || 'Desconocido',
  }))

  arrayPos.sort((a, b) => b.puntos - a.puntos);

  return arrayPos;
});
</script>

