const exercises = [
    // ── Ejercicio 1 ──────────────────────────────────────────────────────────
    {
        title: "🔧 Taller Mecánico",
        description: `Un taller mecánico desea registrar información referente a las reparaciones de los autos que llegan al taller y los dueños de los mismos.<br><br>
        • De cada <strong>Cliente</strong> se guarda la CI, nombre y apellido.<br>
        • De los <strong>Autos</strong> se guarda la matrícula, marca, modelo y combustible.<br>
        • De cada <strong>Reparación</strong> se guarda un código único y una descripción de la reparación.<br>
        • Un cliente puede tener muchos autos, mientras que un auto solo es de un cliente.<br>
        • Un auto puede recibir muchas reparaciones y una reparación puede aplicarse a muchos autos.<br>
        • Se registra la fecha de entrada y observación para cada reparación.`,
        hint: "Coloca las Entidades (rectángulos) principales en los extremos y al medio. Los atributos son los datos que guardamos de cada objeto (ovalos) Las Relaciones (rombos) coordinan la acción entre ellas.",
        wordBank: ["CLIENTE", "AUTO", "REPARACIÓN", "tiene", "recibe", "CI", "Nombre", "Apellido", "Matrícula", "Marca", "Modelo", "Combustible", "Código", "Descripción", "Fecha_entrada", "Observación", "1", "N", "N", "N"],
        nodes: [
            { id: "e1", type: "entity",      correctValue: "CLIENTE",       x: 15,   y: 50,   w: 120, h: 55 },
            { id: "e2", type: "entity",      correctValue: "AUTO",          x: 50,   y: 50,   w: 120, h: 55 },
            { id: "e3", type: "entity",      correctValue: "REPARACIÓN",    x: 85,   y: 50,   w: 120, h: 55 },
            { id: "r1", type: "relation",    correctValue: "tiene",         x: 32.5, y: 50,   w: 80,  h: 80 },
            { id: "r2", type: "relation",    correctValue: "recibe",        x: 67.5, y: 50,   w: 80,  h: 80 },
            { id: "a_e1_1", type: "attribute", isKey: true,  correctValue: "Ci",            x: 15,  y: 70, w: 85,  h: 42 },
            { id: "a_e1_2", type: "attribute", isKey: false, correctValue: "Nombre",        x: 15, y: 22, w: 85,  h: 42 },
            { id: "a_e1_3", type: "attribute", isKey: false, correctValue: "Apellido",     x: 25, y: 22, w: 85,  h: 42 },
            { id: "a_e2_1", type: "attribute", isKey: true,  correctValue: "Matrícula",     x: 40, y: 22, w: 88,  h: 42 },
            { id: "a_e2_2", type: "attribute", isKey: false, correctValue: "Marca",         x: 50, y: 22, w: 85,  h: 42 },
            { id: "a_e2_3", type: "attribute", isKey: false, correctValue: "Modelo",        x: 60, y: 22, w: 85,  h: 42 },
            { id: "a_e2_4", type: "attribute", isKey: false, correctValue: "Combustible",   x: 50, y: 70, w: 95,  h: 42 },
            { id: "a_e3_1", type: "attribute", isKey: true,  correctValue: "Código",        x: 80, y: 22, w: 85,  h: 42 },
            { id: "a_e3_2", type: "attribute", isKey: false, correctValue: "Descripción",   x: 90, y: 22, w: 92,  h: 42 },
            { id: "a_r2_1", type: "attribute", isKey: false, correctValue: "Fecha_entrada", x: 62, y: 70, w: 100, h: 42 },
            { id: "a_r2_2", type: "attribute", isKey: false, correctValue: "Observación",   x: 73, y: 70, w: 90,  h: 42 },
            { id: "c1", type: "cardinality", correctValue: "1", x: 24,   y: 50, w: 32, h: 32 },
            { id: "c2", type: "cardinality", correctValue: "N", x: 41,   y: 50, w: 32, h: 32 },
            { id: "c3", type: "cardinality", correctValue: "N", x: 59,   y: 50, w: 32, h: 32 },
            { id: "c4", type: "cardinality", correctValue: "N", x: 76,   y: 50, w: 32, h: 32 }
        ],
        connections: [
            { from: "a_e1_1", to: "e1" }, { from: "a_e1_2", to: "e1" }, { from: "a_e1_3", to: "e1" },
            { from: "a_e2_1", to: "e2" }, { from: "a_e2_2", to: "e2" }, { from: "a_e2_3", to: "e2" }, { from: "a_e2_4", to: "e2" },
            { from: "a_e3_1", to: "e3" }, { from: "a_e3_2", to: "e3" },
            { from: "e1", to: "r1" }, { from: "r1", to: "e2" },
            { from: "e2", to: "r2" }, { from: "r2", to: "e3" },
            { from: "r2", to: "a_r2_1" }, { from: "r2", to: "a_r2_2" }
        ],
        // METADATOS
        concept: "atributos_especiales",  // Relación N:N + atributo de relación
        availableFor: ["class", "home", "eval"],
        enabled: true
    },
    // ── Ejercicio 2 ──────────────────────────────────────────────────────────
    {
        title: "📚 Biblioteca Escolar",
        description: `Se desea diseñar el esquema para el control de los libros prestados en una biblioteca escolar.<br><br>
        • Cada <strong>Socio</strong> tiene id_socio, nombre y teléfono.<br>
        • De los <strong>Libros</strong> se registra el isbn, título y autor.<br>
        • Un socio puede solicitar múltiples préstamos y un libro puede prestarse a diferentes socios.<br>
        • El <strong>Préstamo</strong> registra la fecha_prestamo y si fue devuelto.`,
        hint: "Socio y Libro son las entidades primarias. Préstamo actúa como relación con atributos propios.",
        wordBank: ["SOCIO", "LIBRO", "préstamo", "Id_socio", "Nombre", "Teléfono", "Isbn", "Título", "Autor", "Fecha_prestamo", "Devuelto", "N", "N"],
        nodes: [
            { id: "e1", type: "entity",   correctValue: "SOCIO",           x: 20, y: 50, w: 120, h: 55 },
            { id: "e2", type: "entity",   correctValue: "LIBRO",           x: 80, y: 50, w: 120, h: 55 },
            { id: "r1", type: "relation", correctValue: "préstamo",        x: 50, y: 50, w: 85,  h: 85 },
            { id: "a_e1_1", type: "attribute", isKey: true,  correctValue: "Id_socio",      x: 10, y: 22, w: 88,  h: 42 },
            { id: "a_e1_2", type: "attribute", isKey: false, correctValue: "Nombre",        x: 20, y: 22, w: 85,  h: 42 },
            { id: "a_e1_3", type: "attribute", isKey: false, correctValue: "Teléfono",      x: 30, y: 22, w: 85,  h: 42 },
            { id: "a_e2_1", type: "attribute", isKey: true,  correctValue: "Isbn",          x: 70, y: 22, w: 85,  h: 42 },
            { id: "a_e2_2", type: "attribute", isKey: false, correctValue: "Título",        x: 80, y: 22, w: 85,  h: 42 },
            { id: "a_e2_3", type: "attribute", isKey: false, correctValue: "Autor",         x: 90, y: 22, w: 85,  h: 42 },
            { id: "a_r1_1", type: "attribute", isKey: false, correctValue: "Fecha_prestamo", x: 43, y: 78, w: 105, h: 42 },
            { id: "a_r1_2", type: "attribute", isKey: false, correctValue: "Devuelto",      x: 57, y: 78, w: 85,  h: 42 },
            { id: "c1", type: "cardinality", correctValue: "N", x: 35, y: 50, w: 32, h: 32 },
            { id: "c2", type: "cardinality", correctValue: "N", x: 65, y: 50, w: 32, h: 32 }
        ],
        connections: [
            { from: "a_e1_1", to: "e1" }, { from: "a_e1_2", to: "e1" }, { from: "a_e1_3", to: "e1" },
            { from: "a_e2_1", to: "e2" }, { from: "a_e2_2", to: "e2" }, { from: "a_e2_3", to: "e2" },
            { from: "e1", to: "r1" }, { from: "r1", to: "e2" },
            { from: "r1", to: "a_r1_1" }, { from: "r1", to: "a_r1_2" }
        ],
        // METADATOS
        concept: "atributos_especiales",  // Relación N:N + atributo de relación
        availableFor: ["class", "home", "eval"],
        enabled: true
    },
    // ── Ejercicio 3 ──────────────────────────────────────────────────────────
    {
        title: "🛒 Tienda Online",
        description: `Se modela un sistema simplificado de ventas para un comercio electrónico en Internet.<br><br>
        • El <strong>Cliente</strong> tiene id_cliente, nombre, email.<br>
        • El cliente realiza un <strong>Pedido</strong> con nro_pedido, fecha_pedido y total.<br>
        • Un cliente puede registrar múltiples pedidos en el mes, pero cada pedido solo pertenece a un único cliente.`,
        hint: "Este es un caso típico de relación Uno a Muchos (1 a N) entre Cliente y Pedido. No existen atributos propios en la relación.",
        wordBank: ["CLIENTE", "PEDIDO", "realiza", "Id_cliente", "Nombre", "Email", "Nro_pedido", "Fecha_pedido", "Total", "1", "N"],
        nodes: [
            { id: "e1", type: "entity",   correctValue: "CLIENTE",        x: 20, y: 50, w: 120, h: 55 },
            { id: "e2", type: "entity",   correctValue: "PEDIDO",         x: 80, y: 50, w: 120, h: 55 },
            { id: "r1", type: "relation", correctValue: "realiza",        x: 50, y: 50, w: 85,  h: 85 },
            { id: "a_e1_1", type: "attribute", isKey: true,  correctValue: "Id_cliente",   x: 10, y: 22, w: 90,  h: 42 },
            { id: "a_e1_2", type: "attribute", isKey: false, correctValue: "Nombre",       x: 20, y: 22, w: 85,  h: 42 },
            { id: "a_e1_3", type: "attribute", isKey: false, correctValue: "Email",        x: 30, y: 22, w: 85,  h: 42 },
            { id: "a_e2_1", type: "attribute", isKey: true,  correctValue: "Nro_pedido",   x: 70, y: 22, w: 90,  h: 42 },
            { id: "a_e2_2", type: "attribute", isKey: false, correctValue: "Fecha_pedido", x: 80, y: 22, w: 95,  h: 42 },
            { id: "a_e2_3", type: "attribute", isKey: false, correctValue: "Total",        x: 90, y: 22, w: 85,  h: 42 },
            { id: "c1", type: "cardinality", correctValue: "1", x: 35, y: 50, w: 32, h: 32 },
            { id: "c2", type: "cardinality", correctValue: "N", x: 65, y: 50, w: 32, h: 32 }
        ],
        connections: [
            { from: "a_e1_1", to: "e1" }, { from: "a_e1_2", to: "e1" }, { from: "a_e1_3", to: "e1" },
            { from: "a_e2_1", to: "e2" }, { from: "a_e2_2", to: "e2" }, { from: "a_e2_3", to: "e2" },
            { from: "e1", to: "r1" }, { from: "r1", to: "e2" }
        ],
        // METADATOS
        concept: "relaciones_simples",  // Relación 1:N
        availableFor: ["class", "home", "eval"],
        enabled: true
    },
    // ── Ejercicio 4 ──────────────────────────────────────────────────────────
    {
        title: "🌐 Red Social",
        description: `
            <p class="font-bold text-slate-300 mb-1">Red Social — Categorización</p>
            <p class="text-slate-400 text-xs leading-relaxed">
                Una red social tiene <strong>Usuarios</strong>, que pueden ser <strong>Creadores</strong>
                o <strong>Espectadores</strong>.
                Los usuarios tienen Id, Email y Año de ingreso.
                Los Creadores tienen cantidad de seguidores.
                Los Espectadores pueden tener varios teléfonos y una ciudad.
                Los Usuarios <em>publican</em> <strong>Contenidos</strong>.
                El Contenido tiene número, título y fecha. 
                Se sabe que un usuario puede publicar muchos contenidos
                 pero un contenido solo es propiedad de un usuario
            </p>`,
        hint: "Usá el triángulo ISA para la categorización USUARIO → CREADOR / ESPECTADOR. Las cardinalidades van entre la entidad y la relación. Teléfono es multivaluado (doble óvalo).",
        wordBank: ["USUARIO","CREADOR","ESPECTADOR","CONTENIDO","publica","Id_usuario","Email","Año_ingreso","Cant_seguidores","Teléfono","Ciudad","Nro_contenido","Título","Fecha","1","N"],
        nodes: [
            { id: "e1",   type: "entity",      correctValue: "USUARIO",           x: 28,  y: 42,  w: 120, h: 55 },
            { id: "e2",   type: "entity",      correctValue: "CONTENIDO",         x: 72,  y: 42,  w: 120, h: 55 },
            { id: "e3",   type: "entity",      correctValue: "CREADOR",           x: 16,  y: 76,  w: 110, h: 55 },
            { id: "e4",   type: "entity",      correctValue: "ESPECTADOR",        x: 42,  y: 76,  w: 120, h: 55 },
            { id: "r1",   type: "relation",    correctValue: "publica",           x: 50,  y: 42,  w: 90,  h: 90 },
            { id: "isa1", type: "isa",                                            x: 28,  y: 59,  w: 70,  h: 56 },
            { id: "c1",   type: "cardinality", correctValue: "1",                 x: 39,  y: 42,  w: 32,  h: 32 },
            { id: "c2",   type: "cardinality", correctValue: "N",                 x: 61,  y: 42,  w: 32,  h: 32 },
            { id: "a_e1_1", type: "attribute", isKey: true,  correctValue: "Id_usuario",     x: 16,  y: 18,  w: 95,  h: 42 },
            { id: "a_e1_2", type: "attribute", isKey: false, correctValue: "Email",           x: 28,  y: 18,  w: 85,  h: 42 },
            { id: "a_e1_3", type: "attribute", isKey: false, correctValue: "Año_ingreso",    x: 40,  y: 18,  w: 95,  h: 42 },
            { id: "a_e2_1", type: "attribute", isKey: true,  correctValue: "Nro_contenido",  x: 60,  y: 18,  w: 105, h: 42 },
            { id: "a_e2_2", type: "attribute", isKey: false, correctValue: "Título",          x: 72,  y: 18,  w: 85,  h: 42 },
            { id: "a_e2_3", type: "attribute", isKey: false, correctValue: "Fecha",           x: 83,  y: 18,  w: 85,  h: 42 },
            { id: "a_e3_1", type: "attribute", isKey: false, correctValue: "Cant_seguidores", x: 16,   y: 93,  w: 115, h: 42 },
            { id: "a_e4_1", type: "attribute", isMultivalued: true, correctValue: "Teléfono", x: 36,  y: 93,  w: 92,  h: 44 },
            { id: "a_e4_2", type: "attribute", isKey: false,        correctValue: "Ciudad",   x: 48,  y: 93,  w: 85,  h: 42 }
        ],
        connections: [
            { from: "a_e1_1", to: "e1" }, { from: "a_e1_2", to: "e1" }, { from: "a_e1_3", to: "e1" },
            { from: "e1", to: "r1" }, { from: "r1", to: "e2" },
            { from: "a_e2_1", to: "e2" }, { from: "a_e2_2", to: "e2" }, { from: "a_e2_3", to: "e2" },
            { from: "e1",   to: "isa1" },
            { from: "isa1", to: "e3"   },
            { from: "isa1", to: "e4"   },
            { from: "a_e3_1", to: "e3" },
            { from: "a_e4_1", to: "e4" }, { from: "a_e4_2", to: "e4" }
        ],
        // METADATOS
        concept: "generalizacion",  // Generalización/Herencia (ISA)
        availableFor: ["class", "home", "eval"],
        enabled: true
    },
    // ── Ejercicio 5 ──────────────────────────────────────────────────────────
    {
        title: "Caso 5: Plataforma de Streaming",
        description: `Una plataforma de streaming desea administrar su catálogo de películas y sus socios.<br><br>
        • De cada <strong>Socio</strong> se guarda Cod_socio, Nombre_completo (compuesto por Primer_nom y Primer_ape) y una lista de Directores_favoritos.<br>
        • De cada <strong>Película</strong> se registra Cod_pelicula, Titulo, Año y una lista de Actores.<br>
        • Las películas se almacenan en <strong>Archivadores</strong> con Nro_arch y Ubicacion.<br>
        • Un socio puede <em>alquilar</em> muchas películas y una película puede ser alquilada por muchos socios (N:M). Se registra Fecha y Devuelto.<br>
        • Un archivador <em>guarda</em> muchas películas, pero cada película está en un solo archivador (N:1).`,
        hint: "Nombre_completo es un atributo <strong>compuesto</strong>: Primer_nom y Primer_ape se conectan al óvalo de Nombre_completo, no a SOCIO directamente. Los atributos con doble borde son multivaluados (listas de valores).",
        wordBank: ["SOCIO","PELÍCULA","ARCHIVADOR","alquila","guarda","Cod_socio","Nombre_completo","Primer_nom","Primer_ape","Directores_favoritos","Cod_pelicula","Titulo","Año","Actores","Nro_arch","Ubicacion","Fecha","Devuelto","N","N","N","1"],
        nodes: [
            // ── Entidades ──
            { id: "e_soc", type: "entity",   correctValue: "SOCIO",      x: 10, y: 45, w: 110, h: 52 },
            { id: "e_pel", type: "entity",   correctValue: "PELÍCULA",   x: 50, y: 45, w: 115, h: 52 },
            { id: "e_arc", type: "entity",   correctValue: "ARCHIVADOR", x: 85, y: 45, w: 115, h: 52 },
            // ── Relaciones ──
            { id: "r_alq", type: "relation", correctValue: "alquila",    x: 30, y: 45, w: 80,  h: 80 },
            { id: "r_gua", type: "relation", correctValue: "guarda",     x: 67, y: 45, w: 75,  h: 75 },
            // ── Cardinalidades ──
            { id: "c1",    type: "cardinality", correctValue: "N",  x: 18, y: 45, w: 30, h: 30 },
            { id: "c2",    type: "cardinality", correctValue: "N",  x: 42, y: 45, w: 30, h: 30 },
            { id: "c3",    type: "cardinality", correctValue: "N",  x: 58, y: 45, w: 30, h: 30 },
            { id: "c4",    type: "cardinality", correctValue: "1",  x: 77, y: 45, w: 30, h: 30 },
            // ── Atributos SOCIO ──
            { id: "a_s1",  type: "attribute", isKey: true,         correctValue: "Cod_socio",           x: 7,  y: 23, w: 92,  h: 40 },
            { id: "a_s2",  type: "attribute", isKey: false,        correctValue: "Nombre_completo",     x: 10, y: 60, w: 112, h: 40 },
            { id: "a_s3",  type: "attribute", isKey: false,        correctValue: "Primer_nom",          x: 7,  y: 76,  w: 88,  h: 38 },
            { id: "a_s4",  type: "attribute", isKey: false,        correctValue: "Primer_ape",          x: 17, y: 76,  w: 88,  h: 38 },
            { id: "a_s5",  type: "attribute", isMultivalued: true, correctValue: "Directores_favoritos",x: 20,  y: 23, w: 132, h: 44 },
            // ── Atributos PELÍCULA ──
            { id: "a_p1",  type: "attribute", isKey: true,         correctValue: "Cod_pelicula",        x: 46, y: 23, w: 98,  h: 40 },
            { id: "a_p2",  type: "attribute", isKey: false,        correctValue: "Titulo",              x: 57, y: 23, w: 78,  h: 40 },
            { id: "a_p3",  type: "attribute", isKey: false,        correctValue: "Año",                 x: 55, y: 60, w: 65,  h: 40 },
            { id: "a_p4",  type: "attribute", isMultivalued: true, correctValue: "Actores",             x: 46, y: 60, w: 82,  h: 44 },
            // ── Atributos ARCHIVADOR ──
            { id: "a_a1",  type: "attribute", isKey: true,         correctValue: "Nro_arch",            x: 80, y: 23, w: 82,  h: 40 },
            { id: "a_a2",  type: "attribute", isKey: false,        correctValue: "Ubicacion",           x: 90, y: 23, w: 85,  h: 40 },
            // ── Atributos relación alquila ──
            { id: "a_r1",  type: "attribute", isKey: false,        correctValue: "Fecha",               x: 24, y: 60, w: 72,  h: 40 },
            { id: "a_r2",  type: "attribute", isKey: false,        correctValue: "Devuelto",            x: 35, y: 60, w: 80,  h: 40 }
        ],
        connections: [
            // SOCIO ↔ atributos
            { from: "a_s1",  to: "e_soc" },
            { from: "a_s2",  to: "e_soc" },           // Nombre_completo → SOCIO
            { from: "a_s3",  to: "a_s2" },            // Primer_nom → Nombre_completo (compuesto)
            { from: "a_s4",  to: "a_s2" },            // Primer_ape → Nombre_completo (compuesto)
            { from: "a_s5",  to: "e_soc" },
            // Relaciones entidad-relación
            { from: "e_soc", to: "r_alq" },
            { from: "r_alq", to: "e_pel" },
            { from: "e_pel", to: "r_gua" },
            { from: "r_gua", to: "e_arc" },
            // alquila ↔ sus atributos
            { from: "r_alq", to: "a_r1" },
            { from: "r_alq", to: "a_r2" },
            // PELÍCULA ↔ atributos
            { from: "a_p1",  to: "e_pel" },
            { from: "a_p2",  to: "e_pel" },
            { from: "a_p3",  to: "e_pel" },
            { from: "a_p4",  to: "e_pel" },
            // ARCHIVADOR ↔ atributos
            { from: "a_a1",  to: "e_arc" },
            { from: "a_a2",  to: "e_arc" }
        ],
        // METADATOS
        concept: "atributos_especiales",  // Atributo compuesto + multivaluado
        availableFor: ["class", "home", "eval"],
        enabled: true
    },
    // ── Ejercicio 6: Sistema Hospitalario ──────────────────────────────────
    {
        title: "🏥 Sistema Hospitalario",
        description: `Un hospital desea gestionar información sobre sus pacientes, médicos y consultas.<br><br>
        • De cada <strong>Paciente</strong> se guarda Cédula, Nombre y Teléfono.<br>
        • De cada <strong>Médico</strong> se registra Matrícula, Nombre y Especialidad.<br>
        • Las <strong>Consultas</strong> tienen Número, Fecha y Diagnóstico.<br>
        • Un paciente puede tener muchas consultas; cada consulta es de un médico (1:N).<br>
        • Un médico puede atender muchos pacientes.`,
        hint: "Recuerda que Cédula es la clave primaria de PACIENTE y Matrícula de MÉDICO. Las relaciones 'realiza' y 'atiende' conectan las entidades.",
        wordBank: ["PACIENTE", "MÉDICO", "CONSULTA", "realiza", "atiende", "Cédula", "Nombre", "Teléfono", "Matrícula", "Especialidad", "Número", "Fecha", "Diagnóstico", "N", "1", "N", "1"],
        nodes: [
            { id: "e_pac", type: "entity",      correctValue: "PACIENTE",    x: 15,   y: 50,   w: 120, h: 55 },
            { id: "e_med", type: "entity",      correctValue: "MÉDICO",      x: 50,   y: 50,   w: 120, h: 55 },
            { id: "e_con", type: "entity",      correctValue: "CONSULTA",    x: 85,   y: 50,   w: 120, h: 55 },
            { id: "r_rea", type: "relation",    correctValue: "realiza",     x: 32,   y: 50,   w: 80,  h: 80 },
            { id: "r_ate", type: "relation",    correctValue: "atiende",     x: 68,   y: 50,   w: 80,  h: 80 },
            { id: "a_p1", type: "attribute", isKey: true,  correctValue: "Cédula",       x: 5,  y: 22, w: 85,  h: 42 },
            { id: "a_p2", type: "attribute", isKey: false, correctValue: "Nombre",      x: 15, y: 22, w: 85,  h: 42 },
            { id: "a_p3", type: "attribute", isKey: false, correctValue: "Teléfono",    x: 25, y: 22, w: 90,  h: 42 },
            { id: "a_m1", type: "attribute", isKey: true,  correctValue: "Matrícula",   x: 40, y: 22, w: 90,  h: 42 },
            { id: "a_m2", type: "attribute", isKey: false, correctValue: "Nombre",      x: 50, y: 22, w: 85,  h: 42 },
            { id: "a_m3", type: "attribute", isKey: false, correctValue: "Especialidad",x: 60, y: 22, w: 100, h: 42 },
            { id: "a_c1", type: "attribute", isKey: true,  correctValue: "Número",      x: 80, y: 22, w: 85,  h: 42 },
            { id: "a_c2", type: "attribute", isKey: false, correctValue: "Fecha",       x: 90, y: 22, w: 85,  h: 42 },
            { id: "a_c3", type: "attribute", isKey: false, correctValue: "Diagnóstico", x: 85, y: 78, w: 95,  h: 42 },
            { id: "c_p", type: "cardinality", correctValue: "N", x: 24,   y: 50, w: 32, h: 32 },
            { id: "c_m", type: "cardinality", correctValue: "1", x: 41,   y: 50, w: 32, h: 32 },
            { id: "c_m2", type: "cardinality", correctValue: "N", x: 59,   y: 50, w: 32, h: 32 },
            { id: "c_c", type: "cardinality", correctValue: "1", x: 76,   y: 50, w: 32, h: 32 }
        ],
        connections: [
            { from: "a_p1", to: "e_pac" }, { from: "a_p2", to: "e_pac" }, { from: "a_p3", to: "e_pac" },
            { from: "a_m1", to: "e_med" }, { from: "a_m2", to: "e_med" }, { from: "a_m3", to: "e_med" },
            { from: "a_c1", to: "e_con" }, { from: "a_c2", to: "e_con" }, { from: "a_c3", to: "e_con" },
            { from: "e_pac", to: "r_rea" }, { from: "r_rea", to: "e_con" },
            { from: "e_med", to: "r_ate" }, { from: "r_ate", to: "e_con" }
        ],
        // METADATOS
        concept: "relaciones_simples",  // Relación 1:N con entidad intermedia
        availableFor: ["class", "home", "eval"],
        enabled: true
    },
// ── Ejercicio 7: Institución educativa ──────────────────────────────────
{
    title: "Institución educativa",
    description: `Se quiere llevar un registro digital de las materias que los alumnos están cursando actualmente.<br>De las materias nos interesa su código, nombre y año.<br>De los alumnos su cédula de identidad, nombre, dirección compuesta por calle, nro y esquina, además el teléfono y la fecha nacimiento.<br>Por otra parte, se desea agregar la nota que tiene el alumno en cada materia.<br>Un alumno puede asistir a muchas materias y a una materia pueden asistir muchos alumnos.`,
    hint: "Recuerda que Institución no es una entidad",
    wordBank: ["MATERIA", "Código", "NombreMat", "Año", "ALUMNO", "Cédula", "Nombre", "Teléfonos", "Dirección", "Calle", "Nro", "Esquina", "Fecha_nac", "Edad", "cursa", "Nota", "N", "N"],
    nodes: [
        { id: "e_0", type: "entity", correctValue: "MATERIA", x: 30, y: 50, w: 110, h: 52 },
        { id: "a_0", type: "attribute", isKey: true, correctValue: "Código", x: 30, y: 35, w: 92, h: 40 },
        { id: "a_1", type: "attribute", correctValue: "NombreMat", x: 20, y: 72, w: 92, h: 40 },
        { id: "a_2", type: "attribute", correctValue: "Año", x: 30, y: 72, w: 92, h: 40 },
        { id: "e_1", type: "entity", correctValue: "ALUMNO", x: 70, y: 50, w: 110, h: 52 },
        { id: "a_3", type: "attribute", isKey: true, correctValue: "Cédula", x: 60, y: 35, w: 92, h: 40 },
        { id: "a_3_2", type: "attribute", correctValue: "Nombre", x: 80, y: 35, w: 92, h: 40 },
        { id: "a_4", type: "attribute", isMultivalued: true, correctValue: "Teléfonos", x: 60, y: 72, w: 92, h: 40 },
        { id: "a_5", type: "attribute", correctValue: "Dirección", x: 70, y: 35, w: 92, h: 40 },
        { id: "a_5_1", type: "attribute", correctValue: "Calle", x: 62, y: 22, w: 65, h: 28 },
        { id: "a_5_2", type: "attribute", correctValue: "Nro", x: 70, y: 22, w: 65, h: 28 },
        { id: "a_5_3", type: "attribute", correctValue: "Esquina", x: 78, y: 22, w: 65, h: 28 },
        { id: "a_6", type: "attribute", correctValue: "Fecha_nac", x: 80, y: 72, w: 92, h: 40 },
        { id: "a_7", type: "attribute", isDerived: true, correctValue: "Edad", x: 70, y: 72, w: 92, h: 40 },
        { id: "r_0", type: "relation", correctValue: "cursa", x: 50, y: 50, w: 80, h: 80 },
        { id: "c_0_n", type: "cardinality", correctValue: "N", x: 40, y: 50, w: 30, h: 30 },
        { id: "c_0_n2", type: "cardinality", correctValue: "N", x: 60, y: 50, w: 30, h: 30 },
        { id: "a_8", type: "attribute", correctValue: "Nota", x: 50, y: 72, w: 92, h: 40 }
    ],
    connections: [
        { from: "a_0", to: "e_0" },
        { from: "a_1", to: "e_0" },
        { from: "a_2", to: "e_0" },
        { from: "a_3", to: "e_1" },
        { from: "a_3_2", to: "e_1" },
        { from: "a_4", to: "e_1" },
        { from: "a_5", to: "e_1" },
        { from: "a_5_1", to: "a_5" },
        { from: "a_5_2", to: "a_5" },
        { from: "a_5_3", to: "a_5" },
        { from: "a_6", to: "e_1" },
        { from: "a_7", to: "e_1" },
        { from: "e_1", to: "r_0" },
        { from: "r_0", to: "e_0" },
        { from: "c_0_n", to: "r_0" },
        { from: "c_0_n2", to: "r_0" },
        { from: "a_8", to: "r_0" }
    ],
    // METADATOS
    concept: "atributos_especiales",  // Atributo compuesto + derivado + relación N:N
    availableFor: ["class", "home", "eval"],
    enabled: true
},
// Ejercicio 8 --Colegio
   {
    title: "Colegio",
    description: `Representar la siguiente realidad a través de un diagrama entidad relación. <br>• De cada PROFESOR se guarda Nombre, TeléfonoP, FechaNac, AñoIngreso. El Grado se calcula automáticamente.<br>• De cada ASIGNATURA se guarda Código y su NombreAsisg.<br>• De cada ALUMNO se guarda CédulaA, NombreCom, Teléfono, FechaNac. Su Edad se calcula automáticamente. Se registran sus Antecedentes.<br>• De cada LIBRO se guarda CódigoL, Titulo, Tema y Fecha.<br>• PROFESOR puede dictar muchas ASIGNATURAS.<br>• ALUMNO puede cursar muchas ASIGNATURAS.<br>• PROFESOR puede publicar un LIBRO.<br>`,
    hint: "Recuerda que Colegio no es una entidad",
    wordBank: ["PROFESOR", "CédulaP", "Nombre", "TeléfonoP", "FechaNac", "AñoIngreso", "Grado", "ASIGNATURA", "Código", "NombreAsisg", "ALUMNO", "CédulaA", "NombreCom", "Nom", "Ape1", "Ape2", "Teléfono", "FechaNac", "Edad", "Antecedentes", "LIBRO", "CódigoL", "Titulo", "Tema", "Fecha", "dicta", "N", "N", "cursa", "N", "N", "publica", "1", "N"],
    nodes: [
        { id: "e_0", type: "entity", correctValue: "PROFESOR", x: 20, y: 70, w: 110, h: 52 },
        { id: "a_0", type: "attribute", isKey: true, correctValue: "CédulaP", x: 5, y: 50, w: 92, h: 40 },
        { id: "a_1", type: "attribute", correctValue: "Nombre", x: 20, y: 92, w: 92, h: 40 },
        { id: "a_2", type: "attribute", correctValue: "TeléfonoP", x: 5, y: 65, w: 92, h: 40 },
        { id: "a_3", type: "attribute", correctValue: "FechaNac", x: 5, y: 80, w: 92, h: 40 },
        { id: "a_4", type: "attribute", correctValue: "AñoIngreso", x: 10, y: 92, w: 92, h: 40 },
        { id: "a_5", type: "attribute", isDerived: true, correctValue: "Grado", x: 30, y: 92, w: 92, h: 40 },
        
        { id: "e_1", type: "entity", correctValue: "ASIGNATURA", x: 55, y: 70, w: 110, h: 52 },
        { id: "a_6", type: "attribute", isKey: true, correctValue: "Código", x: 55, y: 52, w: 92, h: 40 },
        { id: "a_7", type: "attribute", correctValue: "NombreAsisg", x: 55, y: 92, w: 92, h: 40 },
        
        { id: "e_2", type: "entity", correctValue: "ALUMNO", x: 90, y: 70, w: 110, h: 52 },
        { id: "a_8", type: "attribute", isKey: true, correctValue: "CédulaA", x: 95, y: 52, w: 92, h: 40 },
        { id: "a_9", type: "attribute", correctValue: "NombreCom", x: 85, y: 52, w: 92, h: 40 },
        { id: "a_10", type: "attribute", correctValue: "Nom", x: 77, y: 36, w: 65, h: 28 },
        { id: "a_11", type: "attribute", correctValue: "Ape1", x: 84, y: 36, w: 65, h: 28 },
        { id: "a_12", type: "attribute", correctValue: "Ape2", x: 91, y: 36, w: 65, h: 28 },
        { id: "a_13", type: "attribute", correctValue: "Teléfono", x: 75, y: 52, w: 92, h: 40 },
        { id: "a_14", type: "attribute", correctValue: "FechaNac", x: 75, y: 92, w: 92, h: 40 },
        { id: "a_15", type: "attribute", isDerived: true, correctValue: "Edad", x: 85, y: 92, w: 92, h: 40 },
        { id: "a_16", type: "attribute", isMultivalued: true, correctValue: "Antecedentes", x: 95, y: 92, w: 92, h: 40 },
        
        { id: "e_3", type: "entity", correctValue: "LIBRO", x: 20, y: 10, w: 110, h: 52 },
        { id: "a_17", type: "attribute", isKey: true, correctValue: "CódigoL", x: 32, y: 10, w: 92, h: 40 },
        { id: "a_18", type: "attribute", correctValue: "Titulo", x: 32, y: 25, w: 92, h: 40 },
        { id: "a_19", type: "attribute", correctValue: "Tema", x: 8, y: 10, w: 92, h: 40 },
        { id: "a_20", type: "attribute", correctValue: "Fecha", x: 8, y: 25, w: 92, h: 40 },
       
        { id: "r_0", type: "relation", correctValue: "dicta", x: 37, y: 70, w: 80, h: 80, totalityRight: true },
        { id: "c_0_1", type: "cardinality", correctValue: "N", x: 29, y: 70, w: 30, h: 30 },
        { id: "c_0_n", type: "cardinality", correctValue: "N", x: 45, y: 70, w: 30, h: 30 },
        
        { id: "r_1", type: "relation", correctValue: "cursa", x: 73, y: 70, w: 80, h: 80, totalityRight: true },
        { id: "c_1_1", type: "cardinality", correctValue: "N", x: 65, y: 70, w: 30, h: 30 },
        { id: "c_1_n", type: "cardinality", correctValue: "N", x: 80, y: 70, w: 30, h: 30 },
        
        { id: "r_2", type: "relation", correctValue: "publica", x: 20, y: 40, w: 80, h: 80, totalityRight: true },
        { id: "c_2_1", type: "cardinality", correctValue: "1", x: 20, y: 57, w: 30, h: 30 },
        { id: "c_2_n", type: "cardinality", correctValue: "N", x: 20, y: 23, w: 30, h: 30 },

        { id: "t_0_left", type: "totalidad", correctValue: "N", x: 32, y: 65, w: 28, h: 24 },
        { id: "t_0_right", type: "totalidad", correctValue: "S", x: 42, y: 65, w: 28, h: 24 },

        { id: "t_1_left", type: "totalidad", correctValue: "N", x: 69, y: 65, w: 28, h: 24 },
        { id: "t_1_right", type: "totalidad", correctValue: "S", x: 77, y: 65, w: 28, h: 24 },

        { id: "t_2_left", type: "totalidad", correctValue: "N", x: 24, y: 49, w: 28, h: 24 },
        { id: "t_2_right", type: "totalidad", correctValue: "S", x: 24, y: 32, w: 28, h: 24 }
    ],
    connections: [
        { from: "a_0", to: "e_0" },
        { from: "a_1", to: "e_0" },
        { from: "a_2", to: "e_0" },
        { from: "a_3", to: "e_0" },
        { from: "a_4", to: "e_0" },
        { from: "a_5", to: "e_0" },
        { from: "a_6", to: "e_1" },
        { from: "a_7", to: "e_1" },
        { from: "a_8", to: "e_2" },
        { from: "a_9", to: "e_2" },
        { from: "a_10", to: "a_9" },
        { from: "a_11", to: "a_9" },
        { from: "a_12", to: "a_9" },
        { from: "a_13", to: "e_2" },
        { from: "a_14", to: "e_2" },
        { from: "a_15", to: "e_2" },
        { from: "a_16", to: "e_2" },
        { from: "a_17", to: "e_3" },
        { from: "a_18", to: "e_3" },
        { from: "a_19", to: "e_3" },
        { from: "a_20", to: "e_3" },
        { from: "e_0", to: "r_0" },
        { from: "r_0", to: "e_1" },
        { from: "c_0_n", to: "r_0" },
        { from: "c_0_1", to: "r_0" },
        { from: "e_2", to: "r_1" },
        { from: "r_1", to: "e_1" },
        { from: "c_1_n", to: "r_1" },
        { from: "c_1_1", to: "r_1" },
        { from: "e_0", to: "r_2" },
        { from: "r_2", to: "e_3" },
        { from: "c_2_n", to: "r_2" },
        { from: "c_2_1", to: "r_2" }
    ],
    // METADATOS
    concept: "participacion",
    availableFor: ["class", "home", "eval"],
    enabled: true
},

// EJER 9- Peliculas

{
    title: "Película",
    description: `Representar la siguiente realidad a través de un diagrama entidad relación. <br><br>• De cada CLIENTE se guarda CédulaC, NombreC, Dirección, Teléfono.<br>• De cada EJEMPLAR! se guarda Número, Estado.<br>• De cada PELICULA se guarda Título, Productora, Fecha, NacionalidadP.<br>• De cada DIRECTOR se guarda CédulaD, NombreD, NacionalidadD.<br>• De cada ACTOR se guarda CédulaA, Principal, Sexo, NacionalidadA, NombreA.<br><br>• CLIENTE puede alquila muchas EJEMPLAR y un EJEMPLAR puede ser alquilado por muchos CLIENTES<br>• PELICULA puede tener muchos EJEMPLARES pero un EJEMPLAR solo es de una PELICULA<br>• ACTOR puede participar en  muchas PELICULAS y en una PELICULA pueden participar muchos ACTORES<br>• DIRECTOR puede dirigir una PELICULA y una PELICULA solo es dirigida por un DIRECTOR<br>`,
    hint: "",
    wordBank: ["CLIENTE", "CédulaC", "NombreC", "Dirección", "Teléfono",
               "EJEMPLAR", "Número", "Estado",
               "PELICULA", "Título", "Productora", "Fecha", "NacionalidadP",
               "DIRECTOR", "CédulaD", "NombreD", "NacionalidadD",
               "ACTOR", "CédulaA", "Principal", "Sexo", "NacionalidadA", "NombreA",
               "alquila", "FechaComienzo", "FechaDevolución", "N", "N",
               "tiene", "1", "N",
               "participa", "N", "N",
               "dirige", "N", "1"],
    nodes: [
        { id: "e_0", type: "entity", correctValue: "CLIENTE", x: 20, y: 85, w: 110, h: 52 },
        { id: "a_0", type: "attribute", isKey: true, correctValue: "CédulaC", x: 7, y: 80, w: 92, h: 40 },
        { id: "a_1", type: "attribute", correctValue: "NombreC", x: 8, y: 93, w: 92, h: 40 },
        { id: "a_2", type: "attribute", correctValue: "Dirección", x: 33, y: 93, w: 92, h: 40 },
        { id: "a_3", type: "attribute", correctValue: "Teléfono", x: 33, y: 80, w: 92, h: 40 },
        { id: "e_1", type: "entity", isWeak: true, correctValue: "EJEMPLAR", x: 20, y: 25, w: 110, h: 52 },
        { id: "a_4", type: "attribute", isKey: true, isDashed: true, correctValue: "Número", x: 10, y: 10, w: 92, h: 40 },
        { id: "a_5", type: "attribute", correctValue: "Estado", x: 20, y: 10, w: 92, h: 40 },
        { id: "e_2", type: "entity", correctValue: "PELICULA", x: 50, y: 25, w: 110, h: 52 },
        { id: "a_6", type: "attribute", isKey: true, correctValue: "Título", x: 60, y: 42, w: 92, h: 40 },
        { id: "a_7", type: "attribute", correctValue: "Productora", x: 40, y: 12, w: 92, h: 40 },
        { id: "a_8", type: "attribute", correctValue: "Fecha", x: 40, y: 42, w: 92, h: 40 },
        { id: "a_9", type: "attribute", correctValue: "NacionalidadP", x: 60, y: 12, w: 92, h: 40 },
       
        { id: "e_3", type: "entity", correctValue: "DIRECTOR", x: 50, y: 85, w: 110, h: 52 },
        { id: "a_10", type: "attribute", isKey: true, correctValue: "CédulaD", x: 62, y: 69, w: 92, h: 40 },
        { id: "a_11", type: "attribute", correctValue: "NombreD", x: 62, y: 82, w: 92, h: 40 },
        { id: "a_12", type: "attribute", correctValue: "NacionalidadD", x: 62, y: 94, w: 92, h: 40 },
        
        { id: "e_4", type: "entity", correctValue: "ACTOR", x: 82, y: 25, w: 110, h: 52 },
        { id: "a_13", type: "attribute", isKey: true, correctValue: "CédulaA", x: 82, y: 10, w: 92, h: 40 },
        { id: "a_14", type: "attribute", correctValue: "Principal", x: 72, y: 10, w: 92, h: 40 },
        { id: "a_15", type: "attribute", correctValue: "Sexo", x: 82, y: 40, w: 92, h: 40 },
        { id: "a_16", type: "attribute", correctValue: "NacionalidadA", x: 92, y: 40, w: 92, h: 40 },
        { id: "a_17", type: "attribute", correctValue: "NombreA", x: 72, y: 40, w: 92, h: 40 },
        { id: "r_0", type: "relation", correctValue: "alquila",   x: 20, y: 55, w: 80, h: 80 },
       
        { id: "c_0_l", type: "cardinality", correctValue: "N", x: 20, y: 40, w: 30, h: 30 },
        { id: "c_0_r", type: "cardinality", correctValue: "N", x: 20, y: 70, w: 30, h: 30 },
        
        { id: "a_18", type: "attribute", correctValue: "FechaComienzo",   x: 10, y: 55, w: 100, h: 40 },
        { id: "a_19", type: "attribute", correctValue: "FechaDevolución", x: 30, y: 55, w: 100, h: 40 },
        { id: "r_1", type: "relation", isDoubleRelation: true, correctValue: "tiene",     x: 35, y: 25, w: 80, h: 80 },
        
        { id: "c_1_l", type: "cardinality", correctValue: "1", x: 42, y: 25, w: 30, h: 30 },
        { id: "c_1_r", type: "cardinality", correctValue: "N", x: 28, y: 25, w: 30, h: 30 },
        { id: "r_2", type: "relation",                          correctValue: "participa", x: 65, y: 25, w: 80, h: 80 },
        
        { id: "c_2_l", type: "cardinality", correctValue: "N", x: 58, y: 25, w: 30, h: 30 },
        { id: "c_2_r", type: "cardinality", correctValue: "N", x: 72, y: 25, w: 30, h: 30 },
        { id: "r_3", type: "relation",                          correctValue: "dirige",    x: 50, y: 55, w: 80, h: 80 },
        
        { id: "c_3_l", type: "cardinality", correctValue: "N", x: 50, y: 40, w: 30, h: 30 },
        { id: "c_3_r", type: "cardinality", correctValue: "1", x: 50, y: 70, w: 30, h: 30 }
    ],
    connections: [
        { from: "a_0", to: "e_0" },
        { from: "a_1", to: "e_0" },
        { from: "a_2", to: "e_0" },
        { from: "a_3", to: "e_0" },
        { from: "a_4", to: "e_1" },
        { from: "a_5", to: "e_1" },
        { from: "a_6", to: "e_2" },
        { from: "a_7", to: "e_2" },
        { from: "a_8", to: "e_2" },
        { from: "a_9", to: "e_2" },
        { from: "a_10", to: "e_3" },
        { from: "a_11", to: "e_3" },
        { from: "a_12", to: "e_3" },
        { from: "a_13", to: "e_4" },
        { from: "a_14", to: "e_4" },
        { from: "a_15", to: "e_4" },
        { from: "a_16", to: "e_4" },
        { from: "a_17", to: "e_4" },
        { from: "e_0",  to: "r_0" }, { from: "r_0",  to: "e_1" },
        { from: "c_0_l", to: "r_0" }, { from: "c_0_r", to: "r_0" },
        { from: "a_18", to: "r_0" }, { from: "a_19", to: "r_0" },
        { from: "e_2",  to: "r_1" }, { from: "r_1",  to: "e_1" },
        { from: "c_1_l", to: "r_1" }, { from: "c_1_r", to: "r_1" },
        { from: "e_4",  to: "r_2" }, { from: "r_2",  to: "e_2" },
        { from: "c_2_l", to: "r_2" }, { from: "c_2_r", to: "r_2" },
        { from: "e_3",  to: "r_3" }, { from: "r_3",  to: "e_2" },
        { from: "c_3_l", to: "r_3" }, { from: "c_3_r", to: "r_3" }
    ],
    // METADATOS
    concept: "entidad_debil",  // aparece en sección Entidades débiles de index.html
    availableFor: ["class", "home", "eval"],
    enabled: true
}

//10   x
    // ┌─────────────────────────────────────────────────────────────────────────┐
    // │ 🟢 PEGAR AQUÍ: 1er BLOQUE (ejercicio completo) del asistente            │
    // │ AGREGAR COMA después del último ejercicio (arriba ↑) y antes de esto    │
    // │ Reemplazar esta línea con el código del Paso 3                          │
    // └─────────────────────────────────────────────────────────────────────────┘
];
// ── Datos de análisis de texto por ejercicio ─────────────────────────────
// Cada elemento es un array de segmentos: string = texto plano, objeto = palabra clickeable
const analyzeData = [
    // 1 ── Taller Mecánico
    [
        "Un taller mecánico desea registrar información referente a las reparaciones de los autos que llegan al taller y los dueños de los mismos.\n\n",
        "• De cada ", {word:"Cliente",type:"entidad",entityType:"fuerte"}, " se guarda la ",
        {word:"ci",type:"atributo",attrType:"clave"}, ", ", {word:"nombre",type:"atributo",attrType:"simple"}, ", ", {word:"apellido",type:"atributo",attrType:"simple"}, ".\n",
        "• De los ", {word:"Autos",type:"entidad",entityType:"fuerte"}, " se guarda la ",
        {word:"matrícula",type:"atributo",attrType:"clave"}, ", ", {word:"marca",type:"atributo",attrType:"simple"}, ", ", {word:"modelo",type:"atributo",attrType:"simple"}, " y ", {word:"combustible",type:"atributo",attrType:"simple"}, ".\n",
        "• De cada ", {word:"Reparación",type:"entidad",entityType:"fuerte"}, " se guarda un ",
        {word:"código",type:"atributo",attrType:"clave"}, " único y una ", {word:"descripción",type:"atributo",attrType:"simple"}, " de la reparación.\n",
        "• Un cliente puede ", {word:"tener",type:"relacion"}, " muchos autos, mientras que un auto solo es de un cliente.\n",
        "• Un auto puede ", {word:"recibir",type:"relacion"}, " muchas reparaciones y una reparación puede aplicarse a muchos autos.\n",
        "• Se registra la ", {word:"fecha_entrada",type:"atributo",attrType:"relacion"}, " y ", {word:"observación",type:"atributo",attrType:"relacion"}, " para cada reparación."
    ],
    // 2 ── Biblioteca Escolar
    [
        "Se desea diseñar el esquema para el control de los libros prestados en una biblioteca escolar.\n\n",
        "• Cada ", {word:"Socio",type:"entidad",entityType:"fuerte"}, " tiene ",
        {word:"id_socio",type:"atributo",attrType:"clave"}, ", ", {word:"nombre",type:"atributo",attrType:"simple"}, " y ", {word:"teléfono",type:"atributo",attrType:"simple"}, ".\n",
        "• De los ", {word:"Libros",type:"entidad",entityType:"fuerte"}, " se registra el ",
        {word:"isbn",type:"atributo",attrType:"clave"}, ", ", {word:"título",type:"atributo",attrType:"simple"}, " y ", {word:"autor",type:"atributo",attrType:"simple"}, ".\n",
        "• Un socio puede ", {word:"solicitar",type:"relacion"}, " múltiples préstamos y un libro puede prestarse a diferentes socios.\n",
        "• El Préstamo registra la ", {word:"fecha_prestamo",type:"atributo",attrType:"relacion"}, " y si fue ", {word:"devuelto",type:"atributo",attrType:"relacion"}, "."
    ],
    // 3 ── Tienda Online
    [
        "Se modela un sistema simplificado de ventas para un comercio electrónico en Internet.\n\n",
        "• El ", {word:"Cliente",type:"entidad",entityType:"fuerte"}, " tiene ",
        {word:"id_cliente",type:"atributo",attrType:"clave"}, ", ", {word:"nombre",type:"atributo",attrType:"simple"}, ", ", {word:"email",type:"atributo",attrType:"simple"}, ".\n",
        "• El cliente ", {word:"realiza",type:"relacion"}, " un ", {word:"Pedido",type:"entidad",entityType:"fuerte"}, " con ",
        {word:"nro_pedido",type:"atributo",attrType:"clave"}, ", ", {word:"fecha_pedido",type:"atributo",attrType:"simple"}, ", ", {word:"total",type:"atributo",attrType:"simple"}, ".\n",
        "• Un cliente puede registrar múltiples pedidos en el mes, pero cada pedido solo pertenece a un único cliente."
    ],
    // 4 ── Red Social
    [
        "Una red social tiene ", {word:"Usuarios",type:"entidad",entityType:"fuerte"}, ", que pueden ser ",
        {word:"Creadores",type:"entidad",entityType:"fuerte"}, " o ", {word:"Espectadores",type:"entidad",entityType:"fuerte"}, " (categorización IS-A).\n",
        "Los usuarios tienen ", {word:"Id_usuario",type:"atributo",attrType:"clave"}, ", ", {word:"Email",type:"atributo",attrType:"simple"}, " y ", {word:"Año_ingreso",type:"atributo",attrType:"simple"}, ".\n",
        "Los Creadores tienen ", {word:"Cant_seguidores",type:"atributo",attrType:"simple"}, ".\n",
        "Los Espectadores pueden tener varios ", {word:"Teléfono",type:"atributo",attrType:"multivaluado"}, " y una ", {word:"Ciudad",type:"atributo",attrType:"simple"}, ".\n",
        "Los Usuarios ", {word:"publican",type:"relacion"}, " ", {word:"Contenidos",type:"entidad",entityType:"fuerte"}, ".\n",
        "El Contenido tiene ", {word:"Nro_contenido",type:"atributo",attrType:"clave"}, ", ", {word:"Título",type:"atributo",attrType:"simple"}, " y ", {word:"Fecha",type:"atributo",attrType:"simple"}, "."
    ],
    // 5 ── Plataforma Streaming
    [
        "Una plataforma de streaming desea administrar su catálogo de películas y sus socios.\n\n",
        "• De cada ", {word:"Socio",type:"entidad",entityType:"fuerte"}, " se guarda ",
        {word:"Cod_socio",type:"atributo",attrType:"clave"}, ", ", {word:"Nombre_completo",type:"atributo",attrType:"compuesto",components:["Primer_nom","Primer_ape"]},
        " (compuesto por ", {word:"Primer_nom",type:"atributo",attrType:"simple"}, " y ", {word:"Primer_ape",type:"atributo",attrType:"simple"}, ") y una lista de ",
        {word:"Directores_favoritos",type:"atributo",attrType:"multivaluado"}, ".\n",
        "• De cada ", {word:"Película",type:"entidad",entityType:"fuerte"}, " se registra ",
        {word:"Cod_pelicula",type:"atributo",attrType:"clave"}, ", ", {word:"Titulo",type:"atributo",attrType:"simple"}, ", ",
        {word:"Año",type:"atributo",attrType:"simple"}, " y una lista de ", {word:"Actores",type:"atributo",attrType:"multivaluado"}, ".\n",
        "• Las películas se almacenan en ", {word:"Archivadores",type:"entidad",entityType:"fuerte"}, " con ",
        {word:"Nro_arch",type:"atributo",attrType:"clave"}, " y ", {word:"Ubicacion",type:"atributo",attrType:"simple"}, ".\n",
        "• Un socio puede ", {word:"alquilar",type:"relacion"}, " muchas películas y una película puede ser alquilada por muchos socios. Se registra ",
        {word:"Fecha",type:"atributo",attrType:"relacion"}, " y ", {word:"Devuelto",type:"atributo",attrType:"relacion"}, ".\n",
        "• Un archivador ", {word:"guarda",type:"relacion"}, " muchas películas, pero cada película está en un solo archivador (N:1)."
    ],
    // 6 ── Sistema Hospitalario
    [
        "Un hospital desea gestionar información sobre sus pacientes, médicos y consultas.\n\n",
        "• De cada ", {word:"Paciente",type:"entidad",entityType:"fuerte"}, " se guarda ",
        {word:"Cédula",type:"atributo",attrType:"clave"}, ", ", {word:"Nombre",type:"atributo",attrType:"simple"}, " y ", {word:"Teléfono",type:"atributo",attrType:"simple"}, ".\n",
        "• De cada ", {word:"Médico",type:"entidad",entityType:"fuerte"}, " se registra ",
        {word:"Matrícula",type:"atributo",attrType:"clave"}, ", ", {word:"Nombre",type:"atributo",attrType:"simple"}, " y ", {word:"Especialidad",type:"atributo",attrType:"simple"}, ".\n",
        "• Las ", {word:"Consultas",type:"entidad",entityType:"fuerte"}, " tienen ",
        {word:"Número",type:"atributo",attrType:"clave"}, ", ", {word:"Fecha",type:"atributo",attrType:"simple"}, " y ", {word:"Diagnóstico",type:"atributo",attrType:"simple"}, ".\n",
        "• Un paciente puede ", {word:"realizar",type:"relacion"}, " muchas consultas; cada consulta es de un médico (1:N).\n",
        "• Un médico puede ", {word:"atender",type:"relacion"}, " muchos pacientes."
    ],
    // 7 ── Institución educativa
[
    "Se quiere llevar un registro digital de las materias que los alumnos están cursando actualmente.\n\n",
    "• De cada ",
    {word:"MATERIA",type:"entidad",entityType:"fuerte"},
    " se guarda ",
    {word:"Código",type:"atributo",attrType:"clave"},
    ", ",
    {word:"NombreMat",type:"atributo",attrType:"simple"},
    ", ",
    {word:"Año",type:"atributo",attrType:"simple"},
    ".\n",
    "• De cada ",
    {word:"ALUMNO",type:"entidad",entityType:"fuerte"},
    " se guarda ",
    {word:"Cédula",type:"atributo",attrType:"clave"},
    ", ",
    {word:"Teléfonos",type:"atributo",attrType:"multivaluado"},
    ", ",
    {word:"Dirección",type:"atributo",attrType:"simple"},
    ", ",
    {word:"Fecha_nac",type:"atributo",attrType:"simple"},
    ", ",
    {word:"Edad",type:"atributo",attrType:"derivado"},
    ".\n",
    "• ALUMNO puede ",
    {word:"cursa",type:"relacion"},
    " muchos(as) MATERIA.\n"
],
     // 8─Colegio
   [
    "Representar la siguiente realidad a través de un diagrama entidad relación. \n\n",
    "• De cada ",
    {word:"PROFESOR",type:"entidad",entityType:"fuerte"},
    " se guarda ",
    {word:"Nombre",type:"atributo",attrType:"clave"},
    ", ",
    {word:"TeléfonoP",type:"atributo",attrType:"simple"},
    ", ",
    {word:"FechaNac",type:"atributo",attrType:"simple"},
    ", ",
    {word:"AñoIngreso",type:"atributo",attrType:"simple"},
    ". El ",
    {word:"Grado",type:"atributo",attrType:"derivado"},
    ".\n",
    "• De cada ",
    {word:"ASIGNATURA",type:"entidad",entityType:"fuerte"},
    " se guarda ",
    {word:"Código",type:"atributo",attrType:"clave"},
    " y su ",
    {word:"NombreAsisg",type:"atributo",attrType:"simple"},
    ".\n",
    "• De cada ",
    {word:"ALUMNO",type:"entidad",entityType:"fuerte"},
    " se guarda ",
    {word:"CédulaA",type:"atributo",attrType:"clave"},
    ", ",
    {word:"NombreCom",type:"atributo",attrType:"compuesto"},
    ", ",
    {word:"Teléfono",type:"atributo",attrType:"simple"},
    ", ",
    {word:"FechaNac",type:"atributo",attrType:"simple"},
    ", ",
    {word:"Edad",type:"atributo",attrType:"derivado"},
    " y sus ",
    {word:"Antecedentes",type:"atributo",attrType:"multivaluado"},
    ".\n",
    "• De cada ",
    {word:"LIBRO",type:"entidad",entityType:"fuerte"},
    " se guarda ",
    {word:"CódigoL",type:"atributo",attrType:"clave"},
    ", ",
    {word:"Titulo",type:"atributo",attrType:"simple"},
    ", ",
    {word:"Tema",type:"atributo",attrType:"simple"},
    " y ",
    {word:"Fecha",type:"atributo",attrType:"simple"},
    ".\n",
    "• PROFESOR puede ",
    {word:"dictar",type:"relacion"},
    " muchas ASIGNATURAS.\n",
    "• ALUMNO puede ",
    {word:"cursar",type:"relacion"},
    " muchas ASIGNATURAS.\n",
    "• PROFESOR puede ",
    {word:"publicar",type:"relacion"},
    " un LIBRO.\n"
],
     //9--Peliculas
[
    "Representar la siguiente realidad a través de un diagrama entidad relación. \n\n",
    "• De cada ",
    {word:"CLIENTE",type:"entidad",entityType:"fuerte"},
    " se guarda ",
    {word:"CédulaC",type:"atributo",attrType:"clave"},
    ", ",
    {word:"NombreC",type:"atributo",attrType:"simple"},
    ", ",
    {word:"Dirección",type:"atributo",attrType:"simple"},
    ", ",
    {word:"Teléfono",type:"atributo",attrType:"simple"},
    ".\n",
    "• De cada ",
    {word:"EJEMPLAR",type:"entidad",entityType:"débil"},
    " se guarda ",
    {word:"Número",type:"atributo",attrType:"clave"},
    ", ",
    {word:"Estado",type:"atributo",attrType:"simple"},
    ".\n",
    "• De cada ",
    {word:"PELICULA",type:"entidad",entityType:"fuerte"},
    " se guarda ",
    {word:"Título",type:"atributo",attrType:"clave"},
    ", ",
    {word:"Productora",type:"atributo",attrType:"simple"},
    ", ",
    {word:"Fecha",type:"atributo",attrType:"simple"},
    ", ",
    {word:"NacionalidadP",type:"atributo",attrType:"simple"},
    ".\n",
    "• De cada ",
    {word:"DIRECTOR",type:"entidad",entityType:"fuerte"},
    " se guarda ",
    {word:"CédulaD",type:"atributo",attrType:"clave"},
    ", ",
    {word:"NombreD",type:"atributo",attrType:"simple"},
    ", ",
    {word:"NacionalidadD",type:"atributo",attrType:"simple"},
    ".\n",
    "• De cada ",
    {word:"ACTOR",type:"entidad",entityType:"fuerte"},
    " se guarda ",
    {word:"CédulaA",type:"atributo",attrType:"clave"},
    ", ",
    {word:"Principal",type:"atributo",attrType:"simple"},
    ", ",
    {word:"Sexo",type:"atributo",attrType:"simple"},
    ", ",
    {word:"NacionalidadA",type:"atributo",attrType:"simple"},
    ", ",
    {word:"NombreA",type:"atributo",attrType:"simple"},
    ".\n",
    "• CLIENTE puede ",
    {word:"alquila",type:"relacion"},
    " muchos EJEMPLARES y un EJEMPLAR puede ser alquilado por muchos CLIENTES.\n",
    "• Una PELICULA puede ",
    {word:"tiene",type:"relacion"},
    " muchos EJEMPLARES pero un EJEMPLAR solo pertenece a una PELICULA.\n",
    "• Un ACTOR puede ",
    {word:"participa",type:"relacion"},
    " en muchas PELICULAS y en una PELICULA pueden participar muchos ACTORES.\n",
    "• Un DIRECTOR puede ",
    {word:"dirige",type:"relacion"},
    " muchas PELICULAS pero una PELICULA solo es dirigida por un DIRECTOR.\n"
]
     //10XX
    // ┌─────────────────────────────────────────────────────────────────────────┐
    // │ 🟡 PEGAR AQUÍ: 2do BLOQUE (analyzeData) del asistente                   │
    // │ AGREGAR COMA después del último análisis (arriba ↑) y antes de esto     │
    // │ Reemplazar esta línea con el código del Paso 3                          │
    // └─────────────────────────────────────────────────────────────────────────┘
];
const analyzeConfig = [
    { requireSubtypes: false }, // 0 Taller - básico
    { requireSubtypes: false }, // 1 Biblioteca - básico
    { requireSubtypes: false }, // 2 Tienda - básico
    { requireSubtypes: true  }, // 3 Red Social - ISA
    { requireSubtypes: true  }, // 4 Streaming - compuesto/multivaluado
    { requireSubtypes: false }, // 5 Hospital - básico
    { requireSubtypes: false }, // 6 Institución educativa
    { requireSubtypes: false }, // 7 Colegio
    { requireSubtypes: false }  // 9 Peliculas
    // ┌─────────────────────────────────────────────────────────────────────────┐
    // │ 🔴 PEGAR AQUÍ: 3er BLOQUE (config) del asistente                        │
    // │ AGREGAR COMA después del config anterior (arriba ↑) y antes de esto     │
    // │ Reemplazar esta línea con el código del Paso 3 (la línea con { ... })   │
    // └─────────────────────────────────────────────────────────────────────────┘
];
let activeExercise  = 0;
let highlightedWord = null;
let analysisAttempts = 0;
let usedWords = new Set();     // Palabras ya colocadas en el diagrama
let wordClassifications = {};
let wordAttrTypes = {};
let wordEntityTypes = {};
let wordCompounds = {};        // idx → [component words]
let selectedComponents = new Set();
let activeWordIdx = null;
let evalMode = false;  // false = ejercitación, true = evaluación
let _totalidadCorrectMap = null; // establecido por checkAnswers, leído por drawCrispConnectors
let textZoom = 100;    // zoom level for consigna (tab análisis)
let descZoom = 100;    // zoom level for descripción (tab diseño)
// ── Control de zoom para la consigna (tab análisis) ──────
function zoomText(direction) {
    const minZoom = 80;
    const maxZoom = 150;
    const step = 10;
    textZoom = Math.max(minZoom, Math.min(maxZoom, textZoom + (direction * step)));
    const textEl = document.getElementById('analyze-text');
    if (textEl) {
        textEl.style.fontSize = (textZoom / 100) + 'em';
    }
    const levelEl = document.getElementById('zoom-level');
    if (levelEl) {
        levelEl.textContent = textZoom + '%';
    }
}
// ── Control de zoom para la descripción (tab diseño) ─────
function zoomDescription(direction) {
    const minZoom = 80;
    const maxZoom = 150;
    const step = 10;
    descZoom = Math.max(minZoom, Math.min(maxZoom, descZoom + (direction * step)));
    const descEl = document.getElementById('problem-description');
    if (descEl) {
        descEl.style.fontSize = (descZoom / 100) + 'em';
    }
    const levelEl = document.getElementById('desc-zoom-level');
    if (levelEl) {
        levelEl.textContent = descZoom + '%';
    }
}
window.addEventListener('DOMContentLoaded', () => {
    _initMode();
    document.addEventListener('click', hidePopup);
    // Fecha de hoy en la cabecera de impresión
    const hoy = new Date().toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const dateEl = document.getElementById('exam-date');
    if (dateEl) dateEl.value = hoy;
    // Leer parámetro ?ejercicio=N de la URL (viene desde index.html)
    const params   = new URLSearchParams(window.location.search);
    const ejercicio = parseInt(params.get('ejercicio') ?? '0');
    const inicio    = isNaN(ejercicio) ? 0 : Math.max(0, Math.min(ejercicio, exercises.length - 1));
    loadExercise(inicio);
    window.addEventListener('resize', drawCrispConnectors);
    if (!localStorage.getItem('ert_tutorial_seen')) showTutorial();
});
// ── Divisor redimensionable ──────────────────────────────
(function initResizer() {
    const handle    = document.getElementById('resize-handle');
    const leftPanel = document.getElementById('left-panel');
    if (!handle || !leftPanel) return;
    let dragging = false, startX = 0, startW = 0;
    handle.addEventListener('mousedown', e => {
        dragging = true;
        startX   = e.clientX;
        startW   = leftPanel.offsetWidth;
        document.body.style.cursor     = 'col-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
        if (!dragging) return;
        const newW = Math.max(220, Math.min(startW + (e.clientX - startX), window.innerWidth * 0.55));
        leftPanel.style.width = newW + 'px';
    });
    document.addEventListener('mouseup', () => {
        if (!dragging) return;
        dragging = false;
        document.body.style.cursor     = '';
        document.body.style.userSelect = '';
        requestAnimationFrame(drawCrispConnectors);
    });
})();
// ── Accesibilidad ────────────────────────────────────────
function toggleAccessibility() {
    document.body.classList.toggle('high-contrast-mode');
}
function toggleHint() {
    document.getElementById('hint-box').classList.toggle('hidden');
}
// ── Cargar ejercicio ─────────────────────────────────────
function loadExercise(index) {
    activeExercise  = parseInt(index);
    highlightedWord = null;
    usedWords.clear();  // Limpiar palabras usadas al cargar nuevo ejercicio
    document.getElementById('selection-status').innerText = "";
    document.getElementById('exercise-select').value = index;
    const asel = document.getElementById('analyze-select');
    if (asel) asel.value = index;
    document.getElementById('progress-indicator').innerText = `${activeExercise + 1} de ${exercises.length}`;
    document.getElementById('hint-box').classList.add('hidden');
    document.getElementById('feedback-alert').classList.add('hidden');
    // Resetear calificación
    const gb = document.getElementById('grade-box');
    gb.innerText = "--";
    gb.className = "text-2xl font-black text-slate-400 italic";
    const cur = exercises[activeExercise];
    document.getElementById('problem-description').innerHTML = cur.description;
    document.getElementById('hint-box').innerHTML = `<strong>Guía del docente:</strong> ${cur.hint}`;
    // Mostrar instrucciones de totalidad si el ejercicio tiene nodos de totalidad
    const hasTotalityNodes = cur.nodes.some(n => n.type === 'totalidad');
    const totalidadInstructions = document.getElementById('totalidad-instructions');
    if (totalidadInstructions) {
        totalidadInstructions.classList.toggle('hidden', !hasTotalityNodes);
    }
    // Banco de palabras: mezclado, estilo dark
    const bank = document.getElementById('word-bank');
    bank.innerHTML = "";
    const shuffled = [...cur.wordBank].sort(() => Math.random() - 0.5);
    shuffled.forEach(word => {
        const btn = document.createElement('button');
        btn.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 text-slate-300 word-tag";
        btn.innerText = word;
        btn.onclick = () => selectWord(word, btn);
        bank.appendChild(btn);
    });
    renderInteractiveCanvas(cur);
    renderTotalidadPanel(cur);
    updateWordBankVisuals();
    renderAnalysisPanel(activeExercise);
    _resetCorregirBtn();
    setStage('analyze');
}
// ── Actualizar estado visual de palabras usadas ──────────
function updateWordBankVisuals() {
    const cur = exercises[activeExercise];
    // Contar cuántas veces aparece cada palabra en el word-bank
    const wordCounts = {};
    cur.wordBank.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    // Contar cuántas veces está cada palabra en inputs llenos
    const filledCounts = {};
    document.querySelectorAll('.diagram-input').forEach(inp => {
        if (inp.value && inp.value !== "") {
            const word = inp.value;
            filledCounts[word] = (filledCounts[word] || 0) + 1;
        }
    });
    // Marcar como gris solo si se usó la cantidad máxima de veces
    document.getElementById('word-bank').querySelectorAll('button').forEach(b => {
        const word = b.innerText;
        const maxAllowed = wordCounts[word] || 0;
        const used = filledCounts[word] || 0;
        if (used >= maxAllowed) {
            // Gris si se usó todas las veces disponibles
            b.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 text-slate-500 word-tag opacity-50";
            b.disabled = true;
        } else {
            // Normal si hay más disponibles
            b.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 text-slate-300 word-tag";
            b.disabled = false;
        }
    });
}
// ── Seleccionar palabra del banco ────────────────────────
function selectWord(word, el) {
    const cur = exercises[activeExercise];
    // Contar cuántas veces está permitida esta palabra
    const maxAllowed = cur.wordBank.filter(w => w === word).length;
    // Contar cuántas veces ya está usada
    const used = Array.from(document.querySelectorAll('.diagram-input'))
        .filter(inp => inp.value === word).length;
    // No permitir si ya se usó todas las veces
    if (used >= maxAllowed) return;
    highlightedWord = word;
    document.getElementById('selection-status').innerText = `📝 Pegarás: "${word}"`;
    // Quitar selección anterior y actualizar colores
    updateWordBankVisuals();
    el.className = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 text-white bg-emerald-600 word-tag-selected";
}
// ── Renderizar el canvas interactivo ─────────────────────
function renderInteractiveCanvas(exercise) {
    const container = document.getElementById('diagram-nodes');
    container.innerHTML = "";
    exercise.nodes.forEach(node => {
        if (node.type === 'totalidad') return;
        const el = document.createElement('div');
        el.id = node.id;
        el.style.cssText = `
            left: ${node.x}%;
            top: ${node.y}%;
            width: ${node.w}px;
            height: ${node.h}px;
            position: absolute;
            transform: translate(-50%, -50%);
        `;
        let html = "";
        if (node.type === "entity") {
            // Entidad débil: doble borde (borde exterior + borde interior)
            if (node.isWeak) {
                el.className = "bg-blue-50 border-2 border-blue-500 shadow-md flex justify-center items-center p-2 z-20";
                html = `
                    <div class="absolute inset-[3px] border-2 border-blue-500 pointer-events-none"></div>
                    <input type="text" id="input-${node.id}" placeholder="?"
                        class="diagram-input w-full h-full text-xs text-center leading-none border-none bg-transparent relative z-10"
                        onclick="fillSlot('${node.id}')" readonly>
                `;
            } else {
                el.className = "bg-blue-50 border-2 border-blue-500 shadow-md flex justify-center items-center p-2 z-20";
                html = `
                    <input type="text" id="input-${node.id}" placeholder="?"
                        class="diagram-input w-full h-full text-xs text-center leading-none border-none bg-transparent"
                        onclick="fillSlot('${node.id}')" readonly>
                `;
            }
        } else if (node.type === "relation") {
            el.className = "relative flex justify-center items-center z-20";
            // Relación identificadora (entidad débil): doble rombo
            if (node.isDoubleRelation) {
                html = `
                    <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polygon points="50,3 97,50 50,97 3,50" fill="#fdf2f8" stroke="#db2777" stroke-width="3.5" stroke-linejoin="round"/>
                        <polygon points="50,12 88,50 50,88 12,50" fill="none" stroke="#db2777" stroke-width="2.5" stroke-linejoin="round"/>
                    </svg>
                    <div class="relative z-30 flex items-center justify-center text-center w-full h-full">
                        <input type="text" id="input-${node.id}" placeholder="?"
                            class="diagram-input w-10/12 h-full text-[11px] text-center leading-none border-none bg-transparent"
                            onclick="fillSlot('${node.id}')" readonly>
                    </div>
                `;
            } else {
                html = `
                    <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polygon points="50,3 97,50 50,97 3,50" fill="#fdf2f8" stroke="#db2777" stroke-width="3.5" stroke-linejoin="round"/>
                    </svg>
                    <div class="relative z-30 flex items-center justify-center text-center w-full h-full">
                        <input type="text" id="input-${node.id}" placeholder="?"
                            class="diagram-input w-10/12 h-full text-[11px] text-center leading-none border-none bg-transparent"
                            onclick="fillSlot('${node.id}')" readonly>
                    </div>
                `;
            }
        } else if (node.type === "attribute") {
            let borderClass, inputExtra;
            if (node.isKey) {
                borderClass = "border-2 border-emerald-500";
                inputExtra  = "underline";
            } else if (node.isMultivalued) {
                borderClass = "border-double border-[4px] border-emerald-600";
                inputExtra  = "";
            } else if (node.isDerived) {
                borderClass = "border-2 border-dashed border-emerald-500";
                inputExtra  = "";
            } else {
                borderClass = "border-2 border-emerald-500";
                inputExtra  = "";
            }
            el.className = `bg-emerald-50 rounded-[50%] shadow-sm flex justify-center items-center z-20 ${borderClass}`;
            html = `
                <input type="text" id="input-${node.id}" placeholder="?"
                    class="diagram-input w-11/12 h-11/12 text-[10px] text-center leading-none border-none bg-transparent ${inputExtra}"
                    onclick="fillSlot('${node.id}')" readonly>
            `;
        } else if (node.type === "cardinality") {
            el.className = "bg-white border-2 border-slate-600 rounded-full flex items-center justify-center shadow-md z-30 overflow-hidden";
            html = `
                <input type="text" id="input-${node.id}" placeholder="?"
                    class="diagram-input w-full h-full text-sm font-extrabold text-center uppercase border-none bg-transparent"
                    onclick="fillSlot('${node.id}')" readonly>
            `;
        } else if (node.type === "totalidad") {
            el.className = "bg-white border-2 border-slate-600 rounded-lg flex items-center justify-center shadow-md z-30 overflow-hidden";
            html = `
                <input type="text" id="input-${node.id}" placeholder="S/N" maxlength="1"
                    class="diagram-input w-full h-full text-xs font-bold text-center uppercase border-none bg-transparent"
                    title="Escribir S (Sí) o N (No)">
            `;
        } else if (node.type === "isa") {
            el.className = "relative z-20 pointer-events-none";
            html = `
                <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon points="50,4 96,96 4,96" fill="white" stroke="#475569" stroke-width="5" stroke-linejoin="round"/>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center pb-2">
                    <span class="text-[9px] font-extrabold text-slate-500 tracking-widest select-none" style="margin-top:18px;">ISA</span>
                </div>
            `;
        }
        el.innerHTML = html;
        container.appendChild(el);
    });
    setTimeout(drawCrispConnectors, 150);
}
// ── Pegar palabra en un slot ──────────────────────────────
function fillSlot(nodeId) {
    if (highlightedWord === null) return;
    const inp = document.getElementById(`input-${nodeId}`);
    if (!inp) return;
    inp.value = highlightedWord;
    inp.classList.remove('input-correct', 'input-incorrect');

    // Cardinalidades: ocultar borde del círculo al llenarlo
    const cur  = exercises[activeExercise];
    const node = cur?.nodes.find(n => n.id === nodeId);
    if (node?.type === 'cardinality') {
        const container = document.getElementById(nodeId);
        if (container) {
            container.classList.remove('border-slate-600', 'border-emerald-500', 'border-rose-500');
            container.classList.add('border-transparent');
        }
    }

    highlightedWord = null;
    document.getElementById('selection-status').innerText = "";
    updateWordBankVisuals();
}
// ── Dibujar conectores con recorte a bordes de figura ────
function drawCrispConnectors() {
    const cur    = exercises[activeExercise];
    const svg    = document.getElementById('svg-connectors');
    const canvas = document.getElementById('er-canvas');
    svg.innerHTML = "";
    const cr = canvas.getBoundingClientRect();
    // Mapa id → tipo de nodo
    const typeMap = {};
    cur.nodes.forEach(n => { typeMap[n.id] = n.type; });
    // Centro del elemento en coordenadas del canvas
    function center(el) {
        const r = el.getBoundingClientRect();
        return {
            x:  (r.left + r.width  / 2) - cr.left + canvas.scrollLeft,
            y:  (r.top  + r.height / 2) - cr.top  + canvas.scrollTop,
            hw: r.width  / 2,
            hh: r.height / 2
        };
    }
    // Punto en el borde de la figura, en dirección al objetivo
    function edgePoint(c, tx, ty, type) {
        const dx  = tx - c.x;
        const dy  = ty - c.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 0.5) return { x: c.x, y: c.y };
        const ndx = dx / len;
        const ndy = dy / len;
        let t;
        if (type === 'attribute' || type === 'cardinality') {
            // Elipse
            t = 1 / Math.sqrt((ndx / c.hw) ** 2 + (ndy / c.hh) ** 2);
        } else if (type === 'relation') {
            // Rombo (norma L1)
            t = 1 / (Math.abs(ndx) / c.hw + Math.abs(ndy) / c.hh);
        } else {
            // Rectángulo / ISA
            const tx2 = c.hw / Math.abs(ndx || 1e-9);
            const ty2 = c.hh / Math.abs(ndy || 1e-9);
            t = Math.min(tx2, ty2);
        }
        return { x: c.x + ndx * t, y: c.y + ndy * t };
    }
    cur.connections.forEach(({ from, to }) => {
        const a = document.getElementById(from);
        const b = document.getElementById(to);
        if (!a || !b) return;
        const ca = center(a);
        const cb = center(b);
        const p1 = edgePoint(ca, cb.x, cb.y, typeMap[from]);
        const p2 = edgePoint(cb, ca.x, ca.y, typeMap[to]);
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", p1.x); line.setAttribute("y1", p1.y);
        line.setAttribute("x2", p2.x); line.setAttribute("y2", p2.y);
        const isAttr = typeMap[from] === 'attribute' || typeMap[to] === 'attribute';
        line.setAttribute("stroke",         isAttr ? "#10b981" : "#94a3b8");
        line.setAttribute("stroke-width",   isAttr ? "1.5"     : "2");
        line.setAttribute("stroke-linecap", "round");
        svg.appendChild(line);

        // Dibujar círculos de totalidad solo si no hay nodos de totalidad pendientes
        // (si hay nodos de totalidad, el estudiante debe completarlos)
        const toNode = cur.nodes.find(n => n.id === to);
        const fromNode = cur.nodes.find(n => n.id === from);

        // Verificar si hay nodos de totalidad en este ejercicio
        const hasTotalityNodes = cur.nodes.some(n => n.type === 'totalidad');

        if (!hasTotalityNodes) {
            // Solo dibujar círculos si NO hay nodos de totalidad para completar
            if (toNode?.type === 'relation' && fromNode?.type !== 'relation' && toNode.totalityLeft) {
                // Totalidad en el lado izquierdo del rombo (donde viene ent1)
                const relEl = document.getElementById(to);
                const rel = center(relEl);
                const entityEl = document.getElementById(from);
                const entity = center(entityEl);
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                // Calcular vértice basado en dirección hacia la entidad
                const dx = entity.x - rel.x;
                const dy = entity.y - rel.y;
                const len = Math.sqrt(dx * dx + dy * dy);
                const ndx = len > 0 ? dx / len : 1;
                const ndy = len > 0 ? dy / len : 0;
                circle.setAttribute("cx", rel.x + ndx * rel.hw);
                circle.setAttribute("cy", rel.y + ndy * rel.hh);
                circle.setAttribute("r", "3.5");
                circle.setAttribute("fill", "#000000");
                svg.appendChild(circle);
            } else if (fromNode?.type === 'relation' && toNode?.type !== 'relation' && fromNode.totalityRight) {
                // Totalidad en el lado derecho del rombo (donde va ent2)
                const relEl = document.getElementById(from);
                const rel = center(relEl);
                const entityEl = document.getElementById(to);
                const entity = center(entityEl);
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                // Calcular vértice basado en dirección hacia la entidad
                const dx = entity.x - rel.x;
                const dy = entity.y - rel.y;
                const len = Math.sqrt(dx * dx + dy * dy);
                const ndx = len > 0 ? dx / len : 1;
                const ndy = len > 0 ? dy / len : 0;
                circle.setAttribute("cx", rel.x + ndx * rel.hw);
                circle.setAttribute("cy", rel.y + ndy * rel.hh);
                circle.setAttribute("r", "3.5");
                circle.setAttribute("fill", "#000000");
                svg.appendChild(circle);
            }
        }
    });

    // ── Círculos de totalidad post-validación ──────────────
    if (_totalidadCorrectMap) {
        svg.querySelectorAll('.totalidad-circle').forEach(c => c.remove());
        cur.nodes.forEach(n => {
            if (n.type !== 'totalidad') return;
            const userVal   = (n.userValue || '').toUpperCase();
            const isCorrect = _totalidadCorrectMap[n.id] === true;
            if (userVal !== 'S' || !isCorrect) return;

            const match = n.id.match(/t_(\d+)_(left|right)/);
            if (!match) return;
            const relId = `r_${match[1]}`;

            const relEl = document.getElementById(relId);
            if (!relEl) return;
            const rel = center(relEl);

            // Encontrar la entidad conectada a esta relación que sea
            // la más cercana al nodo de totalidad (en coordenadas %).
            // Esto evita depender de la dirección from/to de la conexión,
            // que puede estar invertida según el ejercicio.
            let entityEl = null;
            let minDist  = Infinity;
            cur.connections.forEach(conn => {
                const otherId = conn.from === relId ? conn.to : (conn.to === relId ? conn.from : null);
                if (!otherId) return;
                const otherNode = cur.nodes.find(nd => nd.id === otherId);
                if (otherNode?.type !== 'entity') return;
                const dist = Math.hypot(otherNode.x - n.x, otherNode.y - n.y);
                if (dist < minDist) { minDist = dist; entityEl = document.getElementById(otherId); }
            });
            if (!entityEl) return;

            const entity = center(entityEl);
            const dx = entity.x - rel.x;
            const dy = entity.y - rel.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len < 0.5) return;
            const ndx = dx / len;
            const ndy = dy / len;
            const t = 1 / (Math.abs(ndx) / rel.hw + Math.abs(ndy) / rel.hh);

            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", rel.x + ndx * t);
            circle.setAttribute("cy", rel.y + ndy * t);
            circle.setAttribute("r", "5");
            circle.setAttribute("fill", "#1e293b");
            circle.classList.add('totalidad-circle');
            svg.appendChild(circle);
        });
    }
}
// ── Reiniciar ────────────────────────────────────────────
function resetExercise() {
    const cur = exercises[activeExercise];
    cur.nodes.forEach(n => {
        // Limpiar inputs del diagrama
        const el = document.getElementById(`input-${n.id}`);
        if (el) { el.value = ""; el.classList.remove('input-correct', 'input-incorrect'); }
        // Restaurar borde de cardinalidad
        if (n.type === 'cardinality') {
            const container = document.getElementById(n.id);
            if (container) {
                container.classList.remove('border-emerald-500', 'border-rose-500', 'border-transparent');
                container.classList.add('border-slate-600');
            }
        }
        // Limpiar userValue de totalidad
        if (n.type === 'totalidad') { n.userValue = undefined; }
    });
    _totalidadCorrectMap = null; // limpiar mapa para que drawCrispConnectors no redibuje
    // Eliminar círculos de totalidad del SVG
    document.querySelectorAll('.totalidad-circle').forEach(c => c.remove());
    document.getElementById('feedback-alert').classList.add('hidden');
    const gb = document.getElementById('grade-box');
    gb.innerText = "--";
    gb.className = "text-2xl font-black text-slate-400 italic";
    // Resetear colores de botones del panel de totalidad
    document.querySelectorAll('.totalidad-btn').forEach(btn => {
        btn.className = 'totalidad-btn px-3 py-1 text-xs font-bold bg-slate-700 border border-slate-600 rounded';
    });
}
// ── Siguiente ejercicio ──────────────────────────────────
function nextExercise() {
    loadExercise((activeExercise + 1) % exercises.length);
}
// ── Corregir ─────────────────────────────────────────────

// Seleccionar opción en totalidad
function selectTotalidad(nodeId, value) {
    const cur = exercises[activeExercise];
    const node = cur.nodes.find(n => n.id === nodeId);
    if (!node) return;
    node.userValue = value;
    // Mostrar selección visual (azul cuando seleccionado)
    document.querySelectorAll(`.totalidad-btn[data-nodeid="${nodeId}"]`).forEach(btn => {
        const isSelected = btn.getAttribute('data-value') === value;
        btn.classList.toggle('bg-blue-600', isSelected);
        btn.classList.toggle('border-blue-500', isSelected);
        btn.classList.toggle('bg-slate-700', !isSelected);
        btn.classList.toggle('border-slate-600', !isSelected);
    });
}

// Renderizar panel de totalidad
// Layout por relación: [S][N]  ◆ relación ◆  [S][N]
function renderTotalidadPanel(exercise) {
    const panel = document.getElementById('totalidad-panel');
    const questions = document.getElementById('totalidad-questions');
    if (!panel || !questions) return;

    const totalidadByRelation = {};
    exercise.nodes.forEach(n => {
        if (n.type === 'totalidad') {
            const match = n.id.match(/t_([0-9]+)_(left|right)/);
            if (match) {
                const relIndex = match[1], side = match[2];
                if (!totalidadByRelation[relIndex]) totalidadByRelation[relIndex] = {};
                totalidadByRelation[relIndex][side] = n;
            }
        }
    });

    if (Object.keys(totalidadByRelation).length === 0) {
        panel.classList.add('hidden');
        return;
    }

    panel.classList.remove('hidden');
    questions.innerHTML = '';

    function btnGroup(node) {
        if (!node) return '<div class="w-20"></div>';
        return `
            <div class="flex gap-1">
                <button class="totalidad-btn w-9 py-1 text-xs font-bold bg-slate-700 border border-slate-600 rounded hover:bg-violet-800 hover:border-violet-500 transition"
                    onclick="selectTotalidad('${node.id}','S')" data-nodeid="${node.id}" data-value="S">S</button>
                <button class="totalidad-btn w-9 py-1 text-xs font-bold bg-slate-700 border border-slate-600 rounded hover:bg-slate-600 hover:border-slate-500 transition"
                    onclick="selectTotalidad('${node.id}','N')" data-nodeid="${node.id}" data-value="N">N</button>
            </div>`;
    }

    Object.entries(totalidadByRelation).forEach(([relIndex, sides]) => {
        const rel = exercise.nodes.find(n => n.type === 'relation' && n.id === `r_${relIndex}`);
        if (!rel) return;

        const row = document.createElement('div');
        row.className = 'flex items-center justify-center gap-3 bg-slate-800/50 px-4 py-2.5 rounded-lg border border-violet-700/40';
        row.innerHTML = `
            ${btnGroup(sides.left)}
            <span class="text-sm font-bold text-violet-300 whitespace-nowrap">◆ ${rel.correctValue} ◆</span>
            ${btnGroup(sides.right)}
        `;
        questions.appendChild(row);
    });
}

function checkAnswers() {
    const cur   = exercises[activeExercise];
    const total = cur.nodes.filter(n => !!n.correctValue).length;
    // Map: attrId → parentId (from connections where the attr is the "from" side)
    const parentMap = {};
    cur.connections.forEach(({ from, to }) => {
        const fromNode = cur.nodes.find(n => n.id === from);
        if (fromNode?.type === 'attribute') parentMap[from] = to;
    });
    // Group attribute nodes by parent
    const attrGroups = {};
    cur.nodes.forEach(n => {
        if (n.type !== 'attribute' || !n.correctValue) return;
        const parent = parentMap[n.id] ?? '__orphan__';
        (attrGroups[parent] = attrGroups[parent] ?? []).push(n.id);
    });
    // Build correctness map:
    // - key attributes (isKey:true): exact match required
    // - non-key attributes within same parent: order-independent
    const correctMap = {};
    Object.values(attrGroups).forEach(nodeIds => {
        // Separate key nodes from non-key nodes
        const keyIds    = nodeIds.filter(id => cur.nodes.find(n => n.id === id).isKey);
        const nonKeyIds = nodeIds.filter(id => !cur.nodes.find(n => n.id === id).isKey);
        // Key attrs: exact match
        keyIds.forEach(id => {
            const node = cur.nodes.find(n => n.id === id);
            const el   = document.getElementById(`input-${id}`);
            const val  = el ? el.value.trim().toLowerCase() : '';
            correctMap[id] = val === node.correctValue.toLowerCase();
        });
        // Non-key attrs: order-independent pool
        const pool = nonKeyIds.map(id => cur.nodes.find(n => n.id === id).correctValue.toLowerCase());
        nonKeyIds.forEach(id => {
            const el  = document.getElementById(`input-${id}`);
            const val = el ? el.value.trim().toLowerCase() : '';
            const idx = pool.indexOf(val);
            if (idx !== -1) { pool.splice(idx, 1); correctMap[id] = true; }
            else correctMap[id] = false;
        });
    });
    // Non-attribute nodes: exact match OR flexible entity order
    const entities = cur.nodes.filter(n => n.type === 'entity' && n.correctValue);
    cur.nodes.forEach(n => {
        if (!n.correctValue || n.type === 'attribute') return;

        // Totalidad: no tiene input en el DOM, se valida por userValue (botones S/N del panel)
        if (n.type === 'totalidad') {
            const val = n.userValue?.toUpperCase() || '';
            correctMap[n.id] = val === n.correctValue;
            return;
        }

        const el = document.getElementById(`input-${n.id}`);
        if (!el) return;
        correctMap[n.id] = el.value.trim().toLowerCase() === n.correctValue.toLowerCase();
    });
    // Si hay exactamente 2 entidades y ambas son incorrectas, intentar intercambiar
    if (entities.length === 2) {
        const [e1, e2] = entities;
        const e1_correct = correctMap[e1.id];
        const e2_correct = correctMap[e2.id];
        // Si ambas son incorrectas, intenta intercambiar valores
        if (!e1_correct && !e2_correct) {
            const el1 = document.getElementById(`input-${e1.id}`);
            const el2 = document.getElementById(`input-${e2.id}`);
            if (el1 && el2) {
                const v1 = el1.value.trim().toLowerCase();
                const v2 = el2.value.trim().toLowerCase();
                if (v1 === e2.correctValue.toLowerCase() && v2 === e1.correctValue.toLowerCase()) {
                    correctMap[e1.id] = true;
                    correctMap[e2.id] = true;
                    // Revalidar atributos con padres intercambiados
                    const allKeyValues = [];
                    Object.entries(attrGroups).forEach(([parentId, nodeIds]) => {
                        if (parentId !== e1.id && parentId !== e2.id) return;
                        nodeIds.forEach(id => {
                            const node = cur.nodes.find(n => n.id === id);
                            if (node?.isKey) allKeyValues.push(node.correctValue.toLowerCase());
                        });
                    });
                    Object.entries(attrGroups).forEach(([parentId, nodeIds]) => {
                        if (parentId !== e1.id && parentId !== e2.id) return; // solo padres entidades
                        const swappedParent = parentId === e1.id ? e2.id : e1.id;
                        const swappedAttrGroup = attrGroups[swappedParent] || [];
                        // Mezclar los dos grupos de atributos para validación flexible
                        const allAttrNodeIds = [...nodeIds, ...swappedAttrGroup];
                        const keyIds = allAttrNodeIds.filter(id => cur.nodes.find(n => n.id === id).isKey);
                        const nonKeyIds = allAttrNodeIds.filter(id => !cur.nodes.find(n => n.id === id).isKey);
                        // Revalidar claves como pool combinado
                        const keyPool = [...allKeyValues];
                        keyIds.forEach(id => {
                            const el = document.getElementById(`input-${id}`);
                            if (!el) return;
                            const val = el.value.trim().toLowerCase();
                            const idx = keyPool.indexOf(val);
                            if (idx !== -1) { keyPool.splice(idx, 1); correctMap[id] = true; }
                        });
                        // Revalidar no-claves como pool combinado
                        const nonKeyPool = nonKeyIds.map(id => cur.nodes.find(n => n.id === id).correctValue.toLowerCase());
                        nonKeyIds.forEach(id => {
                            const el = document.getElementById(`input-${id}`);
                            if (!el) return;
                            const val = el.value.trim().toLowerCase();
                            const idx = nonKeyPool.indexOf(val);
                            if (idx !== -1) { nonKeyPool.splice(idx, 1); correctMap[id] = true; }
                        });
                    });
                }
            }
        }
    }
    // Apply styles and count
    let hits = 0;
    cur.nodes.forEach(n => {
        if (!n.correctValue) return;
        const ok = correctMap[n.id] ?? false;
        if (ok) hits++;

        // Totalidad: feedback visual en los botones del panel
        if (n.type === 'totalidad') {
            document.querySelectorAll(`.totalidad-btn[data-nodeid="${n.id}"]`).forEach(btn => {
                const isSelected = btn.getAttribute('data-value') === (n.userValue || '');
                if (isSelected) {
                    btn.classList.toggle('bg-emerald-700', ok);
                    btn.classList.toggle('border-emerald-500', ok);
                    btn.classList.toggle('bg-rose-700', !ok);
                    btn.classList.toggle('border-rose-500', !ok);
                }
            });
            return;
        }

        const el = document.getElementById(`input-${n.id}`);
        if (!el) return;
        el.classList.toggle('input-correct',   ok);
        el.classList.toggle('input-incorrect', !ok);

        // Cardinalidad: colorear también el borde del círculo contenedor
        if (n.type === 'cardinality') {
            const container = document.getElementById(n.id);
            if (container) {
                container.classList.toggle('border-emerald-500', ok);
                container.classList.toggle('border-rose-500',   !ok);
                container.classList.remove('border-slate-600');
            }
        }
    });

    _totalidadCorrectMap = correctMap; // drawCrispConnectors lo leerá para pintar círculos
    drawCrispConnectors();
    // Calificación /10
    const grade     = Math.round((hits / total) * 10);
    const approved  = grade >= 6;
    const gb        = document.getElementById('grade-box');
    gb.innerText    = `${grade}/10`;
    gb.className    = `text-2xl font-black italic ${approved ? 'text-emerald-500' : 'text-rose-500'}`;
    // Feedback en pantalla
    const fb  = document.getElementById('feedback-alert');
    fb.classList.remove(
        'hidden',
        'bg-emerald-950','text-emerald-300','border-emerald-700',
        'bg-amber-950', 'text-amber-300', 'border-amber-700'
    );
    const pct = Math.round((hits / total) * 100);
    const msg = hits === total
        ? `🎉 ¡Perfecto! Completaste el modelo E-R de <strong>"${cur.title}"</strong> — ${grade}/10`
        : `👀 <strong>${hits} de ${total}</strong> correctas (${pct}%) — Calificación: <strong>${grade}/10</strong>. Revisá las marcas rojas.`;
    fb.classList.add(
        ...(hits === total
            ? ['bg-emerald-950','text-emerald-300','border-emerald-700']
            : ['bg-amber-950',  'text-amber-300', 'border-amber-700'])
    );
    fb.innerHTML = `<span class="text-sm">${msg}</span>`;
    requestAnimationFrame(drawCrispConnectors);
    if (evalMode) {
        const btn = document.querySelector('button[onclick="checkAnswers()"]');
        if (btn) {
            btn.disabled = true;
            btn.className = 'w-full py-3.5 bg-slate-700/50 text-slate-400 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 cursor-not-allowed border border-slate-700';
            btn.textContent = '✓ Diagrama registrado';
        }
    }
}
// ── Guardar diagrama como PNG ────────────────────────────
async function saveAsPNG() {
    const btn      = document.getElementById('png-btn');
    const canvasEl = document.getElementById('er-canvas');

    if (btn) { btn.textContent = '⏳ Generando…'; btn.disabled = true; }
    canvasEl.scrollLeft = 0;
    canvasEl.scrollTop  = 0;

    // Dimensiones reales del canvas en pantalla
    const W = canvasEl.offsetWidth;
    const H = canvasEl.offsetHeight;

    // Fijar ancho explícito para que el layout del clone sea idéntico al original
    const prevWidth = canvasEl.style.width;
    canvasEl.style.width = W + 'px';

    // Crear overlays de texto posicionados con las coordenadas % del nodo
    // (evita getBoundingClientRect y problemas de clip en el clone)
    const cur      = exercises[activeExercise];
    const overlays = [];
    cur.nodes.forEach(node => {
        if (!node.correctValue) return;
        const inp = document.getElementById(`input-${node.id}`);
        if (!inp || !inp.value) return;

        inp.style.opacity = '0';

        const left = (node.x / 100) * W - node.w / 2;
        const top  = (node.y / 100) * H - node.h / 2;
        const isCorrect   = inp.classList.contains('input-correct');
        const isIncorrect = inp.classList.contains('input-incorrect');
        const color = isCorrect ? '#059669' : isIncorrect ? '#dc2626' : '#1e293b';

        const ov = document.createElement('div');
        ov.style.cssText = `
            position:absolute;
            left:${left}px; top:${top - 5}px;
            width:${node.w}px; height:${node.h}px;
            display:flex; align-items:center; justify-content:center;
            font-size:${node.type === 'cardinality' ? '13' : '11'}px;
            font-weight:700; text-align:center; line-height:1.2;
            font-family:'Plus Jakarta Sans',sans-serif;
            color:${color};
            text-decoration:${inp.classList.contains('underline') ? 'underline' : 'none'};
            background:transparent; pointer-events:none; z-index:9999;
            white-space:nowrap;
        `;
        ov.textContent = inp.value;
        canvasEl.appendChild(ov);
        overlays.push(ov);
    });

    await new Promise(r => requestAnimationFrame(r));

    try {
        const shot = await html2canvas(canvasEl, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#f8fafc',
            width:  W,
            height: H,
            onclone: (clonedDoc) => {
                const cc = clonedDoc.getElementById('er-canvas');
                const cn = clonedDoc.getElementById('diagram-nodes');
                if (cc) { cc.style.width = W + 'px'; cc.style.height = H + 'px'; }
                if (cn) { cn.style.width = W + 'px'; cn.style.height = H + 'px'; }
            }
        });
        const link = document.createElement('a');
        const nombre = exercises[activeExercise].title.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, '_');
        link.download = `ER_${nombre}.png`;
        link.href = shot.toDataURL('image/png');
        link.click();
    } catch (err) {
        console.error('PNG error:', err);
        alert('No se pudo generar la imagen. Intentar nuevamente.');
    } finally {
        // Restaurar inputs y limpiar overlays
        canvasEl.querySelectorAll('input.diagram-input').forEach(inp => inp.style.opacity = '');
        overlays.forEach(ov => ov.remove());
        canvasEl.style.width = prevWidth;
        if (btn) { btn.textContent = '🖼️ Guardar como PNG'; btn.disabled = false; }
    }
}
// ── Modo ejercitación / evaluación ───────────────────
// Activado via ?ex=1 en la URL (no visible para estudiantes).
// Se persiste en sessionStorage para sobrevivir un F5 sin el param.
function _initMode() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('ex') === '1') {
        sessionStorage.setItem('ermode', 'eval');
    }
    evalMode = sessionStorage.getItem('ermode') === 'eval';
}
// ── Stage navigation ─────────────────────────────────
function setStage(stage) {
    ['analyze', 'diagram', 'tables'].forEach(s => {
        const panel = document.getElementById(`stage-${s}`);
        if (panel) panel.classList.toggle('hidden', s !== stage);
        const tab = document.getElementById(`tab-${s}`);
        if (tab && !tab.disabled) tab.classList.toggle('active', s === stage);
    });
    hidePopup();
    if (stage === 'diagram') requestAnimationFrame(drawCrispConnectors);
}
// ── Render analysis panel ─────────────────────────────
function renderAnalysisPanel(exerciseIndex) {
    wordClassifications = {};
    wordAttrTypes = {};
    analysisAttempts = 0;
    wordEntityTypes = {};
    wordCompounds = {};
    selectedComponents = new Set();
    activeWordIdx = null;
    const btn = document.getElementById('btn-go-diagram');
    if (btn) {
        btn.disabled = false;
        btn.className = 'py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition border border-indigo-600';
        btn.textContent = '🔗 Ir al Diseño E-R';
    }
    const tab = document.getElementById('tab-diagram');
    // if (tab) tab.disabled = true;  // Comentado para permitir acceso sin completar análisis
    const vbtn = document.getElementById('btn-validate-analysis');
    if (vbtn) {
        vbtn.disabled = false;
        vbtn.className = 'py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-lg';
        vbtn.textContent = '📝 Validar clasificación';
    }
    document.getElementById('analyze-feedback').classList.add('hidden');
    const segments = analyzeData[exerciseIndex];
    // Texto completamente limpio (sin resaltados)
    const textContainer = document.getElementById('analyze-text');
    textContainer.innerHTML = '';
    if (!segments) {
        textContainer.innerHTML = '<p class="text-slate-500 italic">Análisis no disponible para este ejercicio.</p>';
        document.getElementById('terms-pool').innerHTML = '';
        updateClassificationPanels();
        return;
    }
    segments.forEach(seg => {
        textContainer.appendChild(document.createTextNode(typeof seg === 'string' ? seg : seg.word));
    });
    // Fichas en el panel lateral
    const pool = document.getElementById('terms-pool');
    pool.innerHTML = '';
    segments.forEach((seg, idx) => {
        if (typeof seg === 'string') return;
        const chip = document.createElement('button');
        chip.className = 'word-tag px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 text-slate-300';
        chip.dataset.wordIdx = idx;
        chip.dataset.word = seg.word;
        chip.textContent = seg.word;
        chip.onclick = (e) => { e.stopPropagation(); showPopup(chip, idx); };
        pool.appendChild(chip);
    });
    updateClassificationPanels();
}
// ── Word popup ────────────────────────────────────────
function showPopup(chipEl, wordIdx) {
    activeWordIdx = wordIdx;
    const popup = document.getElementById('word-popup');
    const rect  = chipEl.getBoundingClientRect();
    popup.style.top  = (rect.bottom + 6 + window.scrollY) + 'px';
    popup.style.left = Math.min(rect.left + window.scrollX, window.innerWidth - 260) + 'px';
    popup.classList.remove('hidden');
}
function hidePopup() {
    const p = document.getElementById('word-popup');
    if (p) {
        p.classList.add('hidden');
        document.getElementById('popup-step1').style.display = '';
        document.getElementById('popup-step2').style.display = '';
        document.getElementById('popup-step3').style.display = '';
    }
    activeWordIdx = null;
    selectedComponents = new Set();
}
function classifyWord(type) {
    if (activeWordIdx === null) return;
    wordClassifications[activeWordIdx] = type;
    if (type === 'atributo') { _showSubtypePopup('atributo'); return; }
    if (type === 'entidad')  { _showSubtypePopup('entidad');  return; }
    // relacion: clasificación directa
    delete wordAttrTypes[activeWordIdx];
    delete wordEntityTypes[activeWordIdx];
    updateChipStyle(activeWordIdx);
    hidePopup();
    updateClassificationPanels();
}
function _showSubtypePopup(mainType) {
    wordClassifications[activeWordIdx] = mainType;
    // Si el ejercicio no requiere subtipos de atributo, clasificar directo
    if (mainType === 'atributo' && !analyzeConfig[activeExercise]?.requireSubtypes) {
        updateChipStyle(activeWordIdx);
        hidePopup();
        updateClassificationPanels();
        return;
    }
    // Calcular qué subtipos existen en este ejercicio
    const segments = analyzeData[activeExercise] || [];
    const existing = new Set();
    segments.forEach(seg => {
        if (typeof seg === 'string') return;
        if (seg.type === mainType) {
            const sub = mainType === 'atributo' ? seg.attrType : seg.entityType;
            if (sub) existing.add(sub);
        }
    });
    // Entidad: si solo existe "fuerte", clasificar directo sin preguntar
    if (mainType === 'entidad') {
        const entOpts = [['fuerte','Fuerte'],['débil','Débil']].filter(([v]) => existing.has(v));
        if (entOpts.length <= 1) {
            wordEntityTypes[activeWordIdx] = 'fuerte';
            updateChipStyle(activeWordIdx);
            hidePopup();
            updateClassificationPanels();
            return;
        }
        // Múltiples tipos → mostrar paso 2
        _renderStep2(mainType, entOpts);
        return;
    }
    // Atributo → siempre mostrar paso 2 con las opciones del ejercicio
    const attrOpts = [
        ['simple','Simple'], ['clave','Clave'], ['relacion','De relación'],
        ['compuesto','Compuesto'], ['multivaluado','Multivaluado'], ['derivado','Derivado']
    ].filter(([v]) => existing.has(v));
    _renderStep2(mainType, attrOpts);
}
function _renderStep2(mainType, opts) {
    document.getElementById('popup-step1').style.display = 'none';
    const step2 = document.getElementById('popup-step2');
    step2.style.display = 'flex';
    step2.style.flexDirection = 'column';
    document.getElementById('popup-step2-title').textContent =
        mainType === 'atributo' ? '¿Qué tipo de atributo?' : '¿Qué tipo de entidad?';
    const btnClass = 'px-2.5 py-1.5 text-[11px] font-bold rounded-lg transition border';
    const color = mainType === 'atributo'
        ? 'text-emerald-300 hover:bg-emerald-900/60 border-emerald-700/40'
        : 'text-blue-300 hover:bg-blue-900/60 border-blue-700/40';
    document.getElementById('popup-step2-options').innerHTML = opts.map(([val, label]) =>
        `<button onclick="classifySubtype('${val}')" class="${btnClass} ${color}">${label}</button>`
    ).join('');
}
function classifySubtype(subtype) {
    if (activeWordIdx === null) return;
    const mainType = wordClassifications[activeWordIdx];
    if (mainType === 'atributo') wordAttrTypes[activeWordIdx]   = subtype;
    if (mainType === 'entidad')  wordEntityTypes[activeWordIdx] = subtype;
    if (mainType === 'atributo' && subtype === 'compuesto') {
        _showCompoundStep(); return;
    }
    updateChipStyle(activeWordIdx);
    hidePopup();
    updateClassificationPanels();
}
function _showCompoundStep() {
    document.getElementById('popup-step2').style.display = 'none';
    const step3 = document.getElementById('popup-step3');
    step3.style.display = 'flex';
    step3.style.flexDirection = 'column';
    selectedComponents = new Set();
    const segments = analyzeData[activeExercise] || [];
    const opts = segments
        .filter((seg, idx) => typeof seg !== 'string' && idx !== activeWordIdx && seg.type === 'atributo')
        .map(seg => seg.word);
    const btnCls = 'comp-btn px-2 py-1 text-[10px] font-bold rounded-lg transition border border-slate-600 bg-slate-700/40 text-slate-300 hover:border-emerald-500 hover:text-emerald-300';
    document.getElementById('popup-step3-options').innerHTML = opts.map(w =>
        `<button onclick="toggleComponent(this,'${w}')" class="${btnCls}" data-word="${w}">${w}</button>`
    ).join('');
}
function toggleComponent(btn, word) {
    if (selectedComponents.has(word)) {
        selectedComponents.delete(word);
        btn.className = 'comp-btn px-2 py-1 text-[10px] font-bold rounded-lg transition border border-slate-600 bg-slate-700/40 text-slate-300 hover:border-emerald-500 hover:text-emerald-300';
    } else {
        selectedComponents.add(word);
        btn.className = 'comp-btn px-2 py-1 text-[10px] font-bold rounded-lg transition border border-emerald-500 bg-emerald-500/20 text-emerald-300';
    }
}
function confirmCompoundComponents() {
    if (activeWordIdx === null) return;
    wordCompounds[activeWordIdx] = [...selectedComponents];
    updateChipStyle(activeWordIdx);
    // Gregor visualmente los chips que son componentes
    _refreshComponentChips();
    hidePopup();
    updateClassificationPanels();
}
// Pone en gris los chips que ya fueron identificados como parte de un compuesto
function _refreshComponentChips() {
    const componentWords = _getComponentWords();
    document.querySelectorAll('#terms-pool [data-word-idx]').forEach(chip => {
        if (componentWords.has(chip.dataset.word)) {
            chip.className = 'term-chip px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-700/40 bg-slate-800/40 text-slate-600 cursor-default select-none';
            chip.onclick = null;
            chip.dataset.isComponent = 'true';
        } else if (chip.dataset.isComponent === 'true') {
            // Re-habilitar si ya no es componente de nada
            chip.dataset.isComponent = '';
            chip.className = 'word-tag px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 text-slate-300';
            const idx = chip.dataset.wordIdx;
            chip.onclick = (e) => { e.stopPropagation(); showPopup(chip, parseInt(idx)); };
        }
    });
}
function _getComponentWords() {
    const s = new Set();
    Object.values(wordCompounds).forEach(comps => comps.forEach(w => s.add(w)));
    return s;
}
function updateChipStyle(idx) {
    const chip = document.querySelector(`#terms-pool [data-word-idx="${idx}"]`);
    if (!chip) return;
    const type      = wordClassifications[idx];
    const attrSub   = wordAttrTypes[idx];
    const entSub    = wordEntityTypes[idx];
    const word      = chip.dataset.word;
    const base = 'term-chip rounded-lg text-xs font-bold transition-all active:scale-95 border flex flex-col items-center leading-tight';
    if (type === 'entidad') {
        chip.className = `${base} px-2.5 py-1 border-blue-500 bg-blue-500/15 text-blue-300 hover:bg-blue-500/25`;
        chip.innerHTML = entSub
            ? `${word}<span class="text-[9px] font-extrabold text-blue-400/80 uppercase tracking-wide">${entSub}</span>`
            : word;
    } else if (type === 'relacion') {
        chip.className = `${base} px-2.5 py-1.5 border-pink-500 bg-pink-500/15 text-pink-300 hover:bg-pink-500/25`;
        chip.innerHTML = word;
    } else if (type === 'atributo') {
        // Si el ejercicio no requiere subtipos, no mostrar el badge
        if (!analyzeConfig[activeExercise]?.requireSubtypes) {
            chip.className = `${base} px-2.5 py-1.5 border-emerald-500 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25`;
            chip.innerHTML = word;
            return;
        }
        chip.className = `${base} px-2.5 py-1 border-emerald-500 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25`;
        const comps = wordCompounds[idx];
        if (attrSub === 'compuesto' && comps && comps.length > 0) {
            chip.innerHTML = `${word}<span class="text-[9px] font-extrabold text-emerald-400/80 uppercase tracking-wide">compuesto: ${comps.join(', ')}</span>`;
        } else if (attrSub) {
            chip.innerHTML = `${word}<span class="text-[9px] font-extrabold text-emerald-400/80 uppercase tracking-wide">${attrSub}</span>`;
        } else {
            chip.innerHTML = word;
        }
    }
}
function updateClassificationPanels() {
    const segments = analyzeData[activeExercise] || [];
    const componentWords = _getComponentWords();
    const cols = { entidad: [], atributo: [], relacion: [] };
    segments.forEach((seg, idx) => {
        if (typeof seg === 'string') return;
        if (componentWords.has(seg.word)) return; // no mostrar componentes por separado
        const t = wordClassifications[idx];
        if (!t) return;
        if (t === 'atributo') {
            const sub = wordAttrTypes[idx];
            cols.atributo.push(sub ? `${seg.word} <span class="text-[9px] text-emerald-400/70 font-extrabold uppercase">${sub}</span>` : seg.word);
        } else if (t === 'entidad') {
            const sub = wordEntityTypes[idx];
            cols.entidad.push(sub ? `${seg.word} <span class="text-[9px] text-blue-400/70 font-extrabold uppercase">${sub}</span>` : seg.word);
        } else {
            cols[t].push(seg.word);
        }
    });
    const color = { entidad: 'text-blue-300 bg-blue-900/30', atributo: 'text-emerald-300 bg-emerald-900/30', relacion: 'text-pink-300 bg-pink-900/30' };
    const ids   = { entidad: 'classified-entities', atributo: 'classified-attrs', relacion: 'classified-relations' };
    Object.keys(cols).forEach(type => {
        const el = document.getElementById(ids[type]);
        if (el) el.innerHTML = cols[type].map(w =>
            `<span class="px-2 py-1 rounded-lg font-semibold text-[11px] ${color[type]}">${w}</span>`
        ).join('');
    });
}
function _resetCorregirBtn() {
    const btn = document.querySelector('button[onclick="checkAnswers()"]');
    if (btn) {
        btn.disabled = false;
        btn.className = 'w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] transition flex items-center justify-center gap-2 text-sm';
        btn.textContent = '📝 Corregir Diagrama';
    }
}

// ── Validar etapa Analizar ────────────────────────────────────────────────────
function validateAnalysis() {
    const segments = analyzeData[activeExercise] || [];
    const componentWords = _getComponentWords();
    let total = 0, hits = 0;
    segments.forEach((seg, idx) => {
        if (typeof seg === 'string') return;
        if (componentWords.has(seg.word)) return;
        total++;
        const chip = document.querySelector(`#terms-pool [data-word-idx="${idx}"]`);
        if (!chip) return;
        const userType    = wordClassifications[idx];
        const userAttrSub = wordAttrTypes[idx];
        let correct = false;
        if (userType === seg.type) {
            if (seg.type === 'atributo' && seg.attrType && analyzeConfig[activeExercise]?.requireSubtypes) {
                if (userAttrSub !== seg.attrType) {
                    correct = false;
                } else if (seg.attrType === 'compuesto' && seg.components) {
                    const userComps = wordCompounds[idx] || [];
                    correct = seg.components.length === userComps.length &&
                              seg.components.every(c => userComps.includes(c));
                } else {
                    correct = true;
                }
            } else if (seg.type === 'entidad' && seg.entityType) {
                correct = wordEntityTypes[idx] === seg.entityType;
            } else {
                correct = true;
            }
        }
        const word = chip.dataset.word || chip.textContent;
        if (!userType) {
            chip.className = 'term-chip px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-600 bg-slate-700/30 text-slate-500';
            chip.textContent = word;
        } else if (correct) {
            chip.className = 'term-chip px-2.5 py-1 rounded-lg text-xs font-bold border-2 border-emerald-500 bg-emerald-500/20 text-emerald-300 flex flex-col items-center leading-tight';
            const showAttrLabel = seg.attrType && analyzeConfig[activeExercise]?.requireSubtypes;
            const label = showAttrLabel ? `<span class="text-[9px] font-extrabold text-emerald-400/80 uppercase">${seg.attrType}</span>` : '';
            chip.innerHTML = `${word}${label}`;
            hits++;
        } else {
            const correctLabel = seg.type === 'atributo' && seg.attrType ? `atributo (${seg.attrType})`
                               : seg.type === 'entidad'  && seg.entityType ? `entidad (${seg.entityType})`
                               : seg.type;
            chip.className = 'term-chip px-2.5 py-1 rounded-lg text-xs font-bold border-2 border-rose-500 bg-rose-500/20 text-rose-300 flex flex-col items-center leading-tight';
            chip.innerHTML = `${word}<span class="text-[9px] font-extrabold text-rose-400/80 uppercase">${correctLabel}</span>`;
        }
    });
    const fb  = document.getElementById('analyze-feedback');
    const pct = total > 0 ? Math.round((hits / total) * 100) : 0;
    fb.classList.remove('hidden','bg-emerald-950','text-emerald-300','border-emerald-700','bg-amber-950','text-amber-300','border-amber-700');
    const msg = hits === total
        ? `🎉 ¡Perfecto! Identificaste todos los términos (${hits}/${total})`
        : `👀 <strong>${hits} de ${total}</strong> correctos (${pct}%). Verde = correcto · Rojo = incorrecto · Gris = sin clasificar.`;
    fb.classList.add(...(hits === total
        ? ['bg-emerald-950','text-emerald-300','border-emerald-700']
        : ['bg-amber-950','text-amber-300','border-amber-700']));
    fb.innerHTML = `<span class="text-sm">${msg}</span>`;
    analysisAttempts++;
    _saveScore(activeExercise, hits, total);
    const prev = _getPrevScore(activeExercise);
    if (prev && !evalMode) {
        const diff = hits - prev.hits;
        const arrow = diff > 0 ? `⬆️ +${diff} respuestas más que la vez anterior` : diff < 0 ? `⬇️ ${Math.abs(diff)} menos que la vez anterior` : '↔️ Igual que la vez anterior';
        fb.innerHTML += `<div class="mt-2 text-xs font-semibold text-slate-300">${arrow}</div>`;
    }
    if (!evalMode && analysisAttempts >= 2 && hits < total) {
        const goBtn = document.getElementById('btn-go-diagram');
        const vbtn  = document.getElementById('btn-validate-analysis');
        if (evalMode) {
            vbtn.disabled = true;
            vbtn.className = 'py-3.5 bg-slate-700/50 text-slate-400 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 cursor-not-allowed border border-slate-700';
            vbtn.textContent = '✓ Clasificación registrada';
            goBtn.disabled = true;
            goBtn.className = 'py-3 bg-sky-600/50 text-sky-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition border border-sky-600 cursor-not-allowed';
        } else {
            goBtn.textContent = '✓ Siguiente: Diseño E-R';
            goBtn.classList.remove('hidden');
        }
    }
}

// ── Conceptos E-R modal ───────────────────────────────────────────────────────
function showConcepts() {
    document.getElementById('concepts-modal').classList.remove('hidden');
}
function closeConcepts() {
    document.getElementById('concepts-modal').classList.add('hidden');
}

// ── Glosario modal ────────────────────────────────────────────────────────────
function showGlossary() {
    document.getElementById('glossary-modal').classList.remove('hidden');
}
function closeGlossary() {
    document.getElementById('glossary-modal').classList.add('hidden');
}

// ── Tutorial modal ────────────────────────────────────────────────────────────
let _tutorialStep = 0;
function showTutorial() {
    _tutorialStep = 0;
    _renderTutorialStep();
    document.getElementById('tutorial-modal').classList.remove('hidden');
}
function closeTutorial() {
    document.getElementById('tutorial-modal').classList.add('hidden');
    localStorage.setItem('ert_tutorial_seen', '1');
}
function nextTutorialStep() {
    const steps = document.querySelectorAll('.tutorial-step');
    if (_tutorialStep >= steps.length - 1) { closeTutorial(); return; }
    _tutorialStep++;
    _renderTutorialStep();
}
function _renderTutorialStep() {
    const steps = document.querySelectorAll('.tutorial-step');
    const dots  = document.querySelectorAll('[data-dot]');
    steps.forEach((s, i) => s.classList.toggle('hidden', i !== _tutorialStep));
    dots.forEach((d, i)  => d.className = `w-2 h-2 rounded-full ${i === _tutorialStep ? 'bg-indigo-500' : 'bg-slate-600'}`);
    const btn = document.getElementById('tutorial-next-btn');
    if (btn) btn.textContent = _tutorialStep === steps.length - 1 ? '¡Comenzar! 🚀' : 'Siguiente →';
}
