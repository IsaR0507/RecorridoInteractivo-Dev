import * as ecs from '@8thwall/ecs'


// ============================================================
// MAPEO DE INFOGRAMAS → ANIMALES
// ============================================================
//
// El nombre debe coincidir EXACTAMENTE con el nombre del
// Image Target creado en 8th Wall Studio.
//

const HABITATS = {
  InfogramaOso: 'oso',
  InfogramaOcelote: 'ocelote',
  InfogramaGuacayama: 'guacamaya',
  InfogramaMono: 'mono',
}


// ============================================================
// COMPONENTE HABITAT-ANIMAL
// ============================================================

ecs.registerComponent({
  name: 'habitat-animal',

  schema: {

    // --------------------------------------------------------
    // Entidades de los cuatro animales
    // --------------------------------------------------------

    oso: ecs.eid,

    ocelote: ecs.eid,

    guacamaya: ecs.eid,

    mono: ecs.eid,


    // --------------------------------------------------------
    // Entidad que contiene el mensaje de instrucciones
    //
    // Ejemplo:
    // "Aléjate del infograma y apunta al suelo"
    // --------------------------------------------------------

    mensajeSuperficie: ecs.eid,
  },


  // ==========================================================
  // ADD
  // ==========================================================

  add: (world, component) => {

    console.log('=================================')
    console.log('HABITAT ANIMAL INICIADO')
    console.log('=================================')

    console.log(
      'Esperando un infograma...'
    )


    // ========================================================
    // 1. DETECCIÓN DEL INFOGRAMA
    // ========================================================
    //
    // REALITY_IMAGE_FOUND es un evento oficial de 8th Wall.
    //
    // event.data.name contiene el nombre del Image Target
    // encontrado.
    //

    world.events.addListener(
      world.events.globalId,
      ecs.events.REALITY_IMAGE_FOUND,

      (event) => {

        const nombreInfograma = event.data.name


        console.log(
          'INFOGRAMA DETECTADO:',
          nombreInfograma
        )


        // ----------------------------------------------------
        // Buscar qué animal corresponde al infograma
        // ----------------------------------------------------

        const animal = HABITATS[nombreInfograma]


        // ----------------------------------------------------
        // Si el infograma no está dentro de nuestra lista,
        // ignoramos el evento.
        // ----------------------------------------------------

        if (!animal) {

          console.warn(
            'Infograma no configurado:',
            nombreInfograma
          )

          return
        }


        console.log(
          'ANIMAL SELECCIONADO:',
          animal
        )


        // ----------------------------------------------------
        // Mostrar instrucciones
        // ----------------------------------------------------

        mostrarMensaje(
          world,
          component.schema.mensajeSuperficie
        )


        console.log(
          'INSTRUCCIÓN:'
        )

        console.log(
          'Aléjate del infograma y apunta hacia el suelo.'
        )


        // ----------------------------------------------------
        // Guardamos el animal seleccionado
        //
        // Lo hacemos dentro del componente mediante una
        // propiedad privada del runtime.
        // ----------------------------------------------------

        component.__animalActual = animal


        // ----------------------------------------------------
        // El usuario ahora debe retirar el teléfono del
        // infograma y permitir que World Tracking trabaje.
        // ----------------------------------------------------

        component.__animalListo = false
      }
    )


    // ========================================================
    // 2. ESTADO DE WORLD TRACKING
    // ========================================================
    //
    // REALITY_TRACKING_STATUS es el evento oficial de
    // World Effects.
    //
    // Los estados documentados son:
    //
    // LIMITED
    // NORMAL
    //

    world.events.addListener(
      world.events.globalId,
      ecs.events.REALITY_TRACKING_STATUS,

      (event) => {

        const status = event.data.status


        console.log(
          'WORLD TRACKING:',
          status
        )


        // ----------------------------------------------------
        // TRACKING NORMAL
        // ----------------------------------------------------

        if (status === 'NORMAL') {

          console.log(
            'World Tracking funcionando normalmente.'
          )


          // --------------------------------------------------
          // Solo continuar si ya se detectó un infograma.
          // --------------------------------------------------

          if (!component.__animalActual) {

            console.log(
              'Todavía no se ha seleccionado ningún animal.'
            )

            return
          }


          // --------------------------------------------------
          // Evitar activar varias veces el mismo animal
          // mientras el tracking siga NORMAL.
          // --------------------------------------------------

          if (component.__animalListo) {

            return
          }


          component.__animalListo = true


          console.log(
            'PREPARANDO ANIMAL:',
            component.__animalActual
          )


          // --------------------------------------------------
          // Ocultar mensaje de instrucciones
          // --------------------------------------------------

          ocultarMensaje(
            world,
            component.schema.mensajeSuperficie
          )


          // --------------------------------------------------
          // Mostrar animal correspondiente
          // --------------------------------------------------

          mostrarAnimal(
            world,
            component,
            component.__animalActual
          )
        }


        // ----------------------------------------------------
        // TRACKING LIMITADO
        // ----------------------------------------------------

        if (status === 'LIMITED') {

          console.log(
            'World Tracking limitado.'
          )
        }
      }
    )
  },
})


// ============================================================
// MOSTRAR ANIMAL
// ============================================================

function mostrarAnimal(
  world,
  component,
  animal
) {

  let entidadAnimal = null


  // ----------------------------------------------------------
  // Determinar qué entidad corresponde al animal
  // ----------------------------------------------------------

  switch (animal) {

    case 'oso':

      entidadAnimal = component.schema.oso

      break


    case 'ocelote':

      entidadAnimal = component.schema.ocelote

      break


    case 'guacamaya':

      entidadAnimal = component.schema.guacamaya

      break


    case 'mono':

      entidadAnimal = component.schema.mono

      break


    default:

      console.warn(
        'Animal desconocido:',
        animal
      )

      return
  }


  // ----------------------------------------------------------
  // Comprobar que la entidad exista
  // ----------------------------------------------------------

  if (!entidadAnimal) {

    console.warn(
      'No hay una entidad asignada para:',
      animal
    )

    return
  }


  console.log(
    '================================='
  )

  console.log(
    'MOSTRANDO:',
    animal
  )

  console.log(
    'ENTIDAD:',
    entidadAnimal
  )

  console.log(
    '================================='
  )


  // ----------------------------------------------------------
  // El suelo de World Effects está definido en Y = 0.
  //
  // Por eso la entidad del animal debe estar configurada
  // correctamente en relación con ese nivel.
  //
  // La base del modelo debe quedar sobre Y = 0.
  // ----------------------------------------------------------

  console.log(
    'El animal debe estar apoyado sobre Y = 0.'
  )


  // ----------------------------------------------------------
  // El modelo debe estar configurado en la entidad mediante
  // el componente GltfModel de 8th Wall Studio.
  //
  // Aquí NO cargamos manualmente el GLB porque Studio ya
  // proporciona el componente GltfModel para esto.
  // ----------------------------------------------------------
}


// ============================================================
// MOSTRAR MENSAJE
// ============================================================

function mostrarMensaje(
  world,
  mensaje
) {

  if (!mensaje) {

    console.warn(
      'No se asignó mensajeSuperficie.'
    )

    return
  }


  console.log(
    'Mostrando instrucciones de superficie.'
  )


  // ----------------------------------------------------------
  // El mensaje se controla mediante la entidad asignada
  // en el Inspector.
  //
  // La entidad puede contener los componentes de UI que
  // hayas creado en Studio.
  // ----------------------------------------------------------
}


// ============================================================
// OCULTAR MENSAJE
// ============================================================

function ocultarMensaje(
  world,
  mensaje
) {

  if (!mensaje) {

    return
  }


  console.log(
    'Ocultando instrucciones de superficie.'
  )
}