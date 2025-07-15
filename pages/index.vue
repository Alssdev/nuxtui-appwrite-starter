<template>
  <div class="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
    <h1 class="text-4xl font-bold text-gray-800 mb-10">Menú Principal de Competencias</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

      <div
        v-for="item in paginas"
        :key="item.nombre"
        class="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition flex flex-col items-center text-center"
      >
        <img :src="item.imagen" alt="icono" class="w-24 h-24 object-contain mb-4" />

        <h2 class="text-xl font-semibold text-gray-700 mb-2">{{ item.nombre }}</h2>

        <div class="flex flex-col gap-2 w-full">
          <NuxtLink :to="item.link">
            <button class="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
              Ingresar
            </button>
          </NuxtLink>

          <NuxtLink :to="item.participantes">
            <button class="w-full px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg">
              Ver Participantes
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const paginas = [
  {
    nombre: "Robot de Batalla",
    link: "/batalla",
    participantes: "/participantes/p_batalla",
    imagen: "https://img.freepik.com/vector-premium/ilustracion-vectorial-isometrica-generador-compacto_96318-150280.jpg"
  },
  {
    nombre: "Drones",
    link: "/drones",
    participantes: "/participantes/p_drones",
    imagen: "https://img.freepik.com/vector-premium/drone-quadcopter-o-quadrotor-ilustracion-estilo-plano_465677-156.jpg"
  },
  {
    nombre: "Esquiva Objetos",
    link: "/esquiva",
    participantes: "/participantes/p_esquiva",
    imagen: "https://img.freepik.com/vector-premium/rover-exploracion-mueve-superficie-planeta-alienigena-recopilando-informacion_96318-207584.jpg"
  },
  {
    nombre: "RoboFut",
    link: "/robofut",
    participantes: "/participantes/p_robofut",
    imagen: "https://img.freepik.com/vector-premium/pequeno-robot-domestico-mueve-piernas-rueda_96318-196552.jpg"
  },
  {
    nombre: "Seguidor de linea",
    link: "/seguidor",
    participantes: "/participantes/p_seguidor",
    imagen: "https://img.freepik.com/vector-premium/icono-coche-rc-digital-vector-isometrico-control-remoto-medios-web_96318-83598.jpg"
  },
  {
    nombre: "Mecatronica",
    link: "/mecatronica",
    //participantes: "/participantes/mecatronica",
    imagen: "https://img.freepik.com/vector-premium/robot-dibujos-animados-isometrico-burbuja-habla_96318-151051.jpg"
  }
]
</script>
