const exercises = [
// ── Ejercicio 1: Taller Mecánico ─────────────────────────────────────────
    {
        title: "🔧 Taller Mecánico",
        description: `Un taller mecánico desea registrar información referente a las reparaciones de los autos que llegan al taller y los dueños de los mismos.<br><br>
        • De cada <strong>cliente</strong> se guarda la CI, nombre y apellido.<br>
        • De los <strong>autos</strong> se guarda la matrícula, marca, modelo y combustible.<br>
        • De cada <strong>reparación</strong> se guarda un código único y una descripción de la misma.<br>
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
// ── Ejercicio 2: Biblioteca Escolar ──────────────────────────────────────
    {
        title: "📚 Biblioteca Escolar",
        description: `Se desea diseñar el esquema para el control de los libros prestados en una biblioteca escolar.<br><br>
        • Cada <strong>socio</strong> tiene id_socio, nombre y teléfono.<br>
        • De los <strong>libros</strong> se registra el isbn, título y autor.<br>
        • Un socio puede solicitar múltiples préstamos y un libro puede prestarse a diferentes socios.<br>
        • El <strong>préstamo</strong> registra la fecha_prestamo y si fue devuelto.`,
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
// ── Ejercicio 3: Tienda Online ────────────────────────────────────────────
    {
        title: "🛒 Tienda Online",
        description: `Se modela un sistema simplificado de ventas para un comercio electrónico en Internet.<br><br>
        • El <strong>cliente</strong> tiene id_cliente, nombre, email.<br>
        • El cliente realiza un <strong>pedido</strong> con nro_pedido, fecha_pedido y total.<br>
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
// ── Ejercicio 4: Red Social ───────────────────────────────────────────────
    {
        title: "🌐 Red Social",
        description: `Una red social tiene <strong>usuarios</strong>, que pueden ser <strong>creadores</strong> o <strong>espectadores</strong>.<br><br>
        • Los usuarios tienen id, email y año de ingreso.<br>
        • Los creadores tienen cantidad de seguidores.<br>
        • Los espectadores pueden tener varios teléfonos y una ciudad.<br>
        • Los usuarios <em>publican</em> <strong>contenidos</strong>. El contenido tiene número, título y fecha.<br>
        • Un usuario puede publicar muchos contenidos, pero un contenido solo es propiedad de un usuario.`,
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
// ── Ejercicio 5: Plataforma Streaming ────────────────────────────────────
    {
        title: "📺 Plataforma de Streaming",
        description: `Una plataforma de streaming desea administrar su catálogo de películas y sus socios.<br><br>
        • De cada <strong>socio</strong> se guarda cod_socio, nombre_completo (compuesto por primer_nom y primer_ape) y una lista de directores_favoritos.<br>
        • De cada <strong>película</strong> se registra cod_pelicula, titulo, año y una lista de actores.<br>
        • Las películas se almacenan en <strong>archivadores</strong> con nro_arch y ubicacion.<br>
        • Un socio puede <em>alquilar</em> muchas películas y una película puede ser alquilada por muchos socios. Se registra fecha_alq y fech_devuelto.<br>
        • Un archivador <em>guarda</em> muchas películas, pero cada película está en un solo archivador.`,
        hint: "Nombre_completo es un atributo <strong>compuesto</strong>: Primer_nom y Primer_ape se conectan al óvalo de Nombre_completo, no a SOCIO directamente. Los atributos con doble borde son multivaluados (listas de valores).",
        wordBank: ["SOCIO","PELÍCULA","ARCHIVADOR","alquila","guarda","Cod_socio","Nombre_completo","Primer_nom","Primer_ape","Directores_favoritos","Cod_pelicula","Titulo","Año","Actores","Nro_arch","Ubicacion","Fecha_alq","Fech_devuelto","N","N","N","1"],
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
            { id: "a_r1",  type: "attribute", isKey: false,        correctValue: "Fecha_alq",           x: 24, y: 60, w: 82,  h: 40 },
            { id: "a_r2",  type: "attribute", isKey: false,        correctValue: "Fech_devuelto",       x: 35, y: 60, w: 105, h: 40 }
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
// ── Ejercicio 6: Sistema Hospitalario ────────────────────────────────────
    {
        title: "🏥 Sistema Hospitalario",
        description: `Un hospital desea gestionar información sobre sus pacientes, médicos y consultas.<br><br>
        • De cada <strong>paciente</strong> se guarda cédula, nombre y teléfono.<br>
        • De cada <strong>médico</strong> se registra matrícula, nombre y especialidad.<br>
        • Las <strong>consultas</strong> tienen número, fecha y diagnóstico.<br>
        • Un paciente puede tener muchas consultas; cada consulta es de un médico.<br>
        • Un médico puede atender muchos pacientes y un paciente se puede atender con muchos médicos.`,
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
    title: "🏫 Institución educativa",
    description: `Se quiere llevar un registro digital de las materias que los alumnos están cursando actualmente.<br>De las materias nos interesa su código, nombre y año.<br>De los alumnos su cédula de identidad, nombre, dirección compuesta por calle, nro y esquina, además el teléfono y la fecha nacimiento.<br>Por otra parte, se desea agregar la nota que tiene el alumno en cada materia.<br>Un alumno puede cursar muchas materias y una materia puede ser cursada por muchos alumnos.`,
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
// ── Ejercicio 8: Colegio ──────────────────────────────────────────────────
   {
    title: "🏫 Colegio",
    description: `En un colegio privado, sucede lo siguiente:  <br>• De cada PROFESOR se guarda Nombre, TeléfonoP, FechaNac y AñoIngreso. El Grado se calcula automáticamente.<br>• De cada ASIGNATURA se guarda Código y su NombreAsisg.<br>• De cada ALUMNO se guarda CédulaA, NombreCom, Teléfono, FechaNac. Su Edad se calcula automáticamente. Además, se registran sus Antecedentes.<br>• De cada LIBRO se guarda CódigoL, Titulo, Tema y Fecha.<br>• Un PROFESOR puede dictar muchas ASIGNATURAS y una ASIGNATURA pueden ser dictadas por muchos PROFESORES<br>• Un ALUMNO puede cursar muchas ASIGNATURAS y una ASIGNATURA puede ser cursada por muchos ALUMNOS.<br>• Un PROFESOR puede publicar muchos LIBROS y un LIBRO es solo publicado por un PROFESOR .<br>`,
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
        { from: "a_3", to: "a_2" },
        { from: "a_4", to: "a_2" },
        { from: "a_5", to: "a_2" },
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

// ── Ejercicio 9: Película ─────────────────────────────────────────────────

{
    title: "🎬 Película",
    description: `Un videoclub desea llevar un registro de sus clientes, las películas disponibles, los ejemplares en alquiler, y los directores y actores que participan en cada película.<br><br>
        • De cada <strong>cliente</strong> se guarda cédulaC, nombreC, dirección y teléfono.<br>
        • De cada <strong>ejemplar</strong> se guarda número y estado.<br>
        • De cada <strong>película</strong> se guarda título, productora, fecha y nacionalidadP.<br>
        • De cada <strong>director</strong> se guarda cédulaD, nombreD y nacionalidadD.<br>
        • De cada <strong>actor</strong> se guarda cédulaA, principal, sexo, nacionalidadA y nombreA.<br><br>
        • Un <strong>cliente</strong> puede alquilar muchos <strong>ejemplares</strong> y un <strong>ejemplar</strong> puede ser alquilado por muchos <strong>clientes</strong>.<br>
        • Una <strong>película</strong> puede tener muchos <strong>ejemplares</strong> pero un <strong>ejemplar</strong> solo es de una <strong>película</strong>.<br>
        • Un <strong>actor</strong> puede participar en muchas <strong>películas</strong> y en una <strong>película</strong> pueden participar muchos <strong>actores</strong>.<br>
        • Un <strong>director</strong> puede dirigir una <strong>película</strong> y una <strong>película</strong> solo es dirigida por un <strong>director</strong>.`,
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
        
        { id: "c_3_l", type: "cardinality", correctValue: "N", x: 50, y: 39, w: 30, h: 30 },
        { id: "c_3_r", type: "cardinality", correctValue: "1", x: 50, y: 70, w: 30, h: 30 },

        // ── Totalidad ──
        // alquila (vertical): from=CLIENTE(e_0,y:85) → to=EJEMPLAR(e_1,y:25)
        { id: "t_0_left",  type: "totalidad", correctValue: "N", x: 14, y: 67, w: 28, h: 24 },
        { id: "t_0_right", type: "totalidad", correctValue: "N", x: 14, y: 43, w: 28, h: 24 },
        // tiene (horizontal): from=PELICULA(e_2,x:50) → to=EJEMPLAR(e_1,x:20)
        { id: "t_1_left",  type: "totalidad", correctValue: "N", x: 42, y: 20, w: 28, h: 24 },
        { id: "t_1_right", type: "totalidad", correctValue: "S", x: 28, y: 20, w: 28, h: 24 },
        // participa (horizontal): from=ACTOR(e_4,x:82) → to=PELICULA(e_2,x:50)
        { id: "t_2_left",  type: "totalidad", correctValue: "N", x: 72, y: 20, w: 28, h: 24 },
        { id: "t_2_right", type: "totalidad", correctValue: "S", x: 58, y: 20, w: 28, h: 24 },
        // dirige (vertical): from=DIRECTOR(e_3,y:85) → to=PELICULA(e_2,y:25)
        { id: "t_3_left",  type: "totalidad", correctValue: "N", x: 44, y: 67, w: 28, h: 24 },
        { id: "t_3_right", type: "totalidad", correctValue: "S", x: 44, y: 43, w: 28, h: 24 }
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
},

// ── Ejercicio 10: Fútbol ──────────────────────────────────────────────────
{
    title: "⚽ Fútbol",
    description: `En una asociación deportiva se desea almacenar información sobre clubes y partidos de  fútbol.<br><br>• De cada CLUB se guarda Nombre, AñoFundación, Ubicación, Entrenador, Presidente y Estadio.<br>• De cada JUGADOR se guarda Ced, Nacionalidad, Estatura, Apodo, Nombre y  FechaNac.<br><br>• JUGADOR puede juega_en muchos CLUBES y en un CLUB pueden jugar muchos jugadores<br>• CLUB puede jugar con  muchos CLUBES y viceversa. Cuando un club va a jugar a otro club se dice que es visitante y el otro es locatario<br>`,
    hint: "Recuerda de Fútbol no es una entidad",
    wordBank: ["CLUB", "Nombre", "AñoFundación", "Ubicación", "Entrenador", "Presidente", "Estadio", "JUGADOR", "Ced", "Nacionalidad", "Estatura", "Apodo", "Nombre", "FechaNac", "juega_en", "N", "N", "juega_con", "Fecha", "Resultado", "N", "N"],
    nodes: [
        { id: "e_0", type: "entity", correctValue: "CLUB", x: 30, y: 30, w: 110, h: 52 },
        { id: "a_0", type: "attribute", isKey: true, correctValue: "Nombre", x: 15, y: 10, w: 92, h: 40 },
        { id: "a_1", type: "attribute", correctValue: "AñoFundación", x: 15, y: 22, w: 92, h: 40 },
        { id: "a_2", type: "attribute", correctValue: "Ubicación", x: 30, y: 10, w: 92, h: 40 },
        { id: "a_3", type: "attribute", correctValue: "Entrenador", x: 40, y: 10, w: 92, h: 40 },
        { id: "a_4", type: "attribute", correctValue: "Presidente", x: 15, y: 34, w: 92, h: 40 },
        { id: "a_5", type: "attribute", correctValue: "Estadio", x: 15, y: 46, w: 92, h: 40 },
       
        { id: "e_1", type: "entity", correctValue: "JUGADOR", x: 30, y: 90, w: 110, h: 52 },
        { id: "a_6", type: "attribute", isKey: true, correctValue: "Ced", x: 45, y: 68, w: 92, h: 40 },
        { id: "a_7", type: "attribute", correctValue: "Nacionalidad", x: 15, y: 68, w: 92, h: 40 },
        { id: "a_8", type: "attribute", correctValue: "Estatura", x: 45, y: 92, w: 92, h: 40 },
        { id: "a_9", type: "attribute", correctValue: "Apodo", x: 45, y: 80, w: 92, h: 40 },
        { id: "a_10", type: "attribute", correctValue: "Nombre", x: 15, y: 80, w: 92, h: 40 },
        { id: "a_11", type: "attribute", correctValue: "FechaNac", x: 15, y: 92, w: 92, h: 40 },
       
        { id: "r_0", type: "relation", correctValue: "juega_en", x: 30, y: 60, w: 80, h: 80 },
        { id: "c_0_left", type: "cardinality", correctValue: "N", x: 30, y: 45, w: 30, h: 30 },
        { id: "c_0_right", type: "cardinality", correctValue: "N", x: 30, y: 75, w: 30, h: 30 },
       
        { id: "r_1", type: "relation", correctValue: "juega_con", x: 60, y: 30, w: 80, h: 80 },
        { id: "c_1_left", type: "cardinality", correctValue: "N", x: 43, y: 20, w: 30, h: 30 },
        { id: "c_1_right", type: "cardinality", correctValue: "N", x: 43, y: 40, w: 30, h: 30 },
        { id: "a_12", type: "attribute", correctValue: "Fecha", x: 70, y: 20, w: 92, h: 40 },
        { id: "a_13", type: "attribute", correctValue: "Resultado", x: 70, y: 40, w: 92, h: 40 }
    ],
    connections: [
        { from: "a_0", to: "e_0" }, { from: "a_1", to: "e_0" }, { from: "a_2", to: "e_0" },
        { from: "a_3", to: "e_0" }, { from: "a_4", to: "e_0" }, { from: "a_5", to: "e_0" },
        { from: "a_6", to: "e_1" }, { from: "a_7", to: "e_1" }, { from: "a_8", to: "e_1" },
        { from: "a_9", to: "e_1" }, { from: "a_10", to: "e_1" }, { from: "a_11", to: "e_1" },
        { from: "e_1", to: "r_0" }, { from: "r_0", to: "e_0" },
        { from: "c_0_left", to: "r_0" }, { from: "c_0_right", to: "r_0" },
        { from: "e_0", to: "r_1", role: "locatario" }, { from: "r_1", to: "e_0", role: "visitante" },
        { from: "c_1_left", to: "r_1" }, { from: "c_1_right", to: "r_1" },
        { from: "a_12", to: "r_1" }, { from: "a_13", to: "r_1" }
    ],
    concept: "autorelacion",
    availableFor: ["class", "home", "eval"],
    enabled: true
},

// ── Ejercicio 11: Música ──────────────────────────────────────────────────
{
    title: "🎵 Música",
    description: `Se desea mantener información sobre música, al estilo de programas como Spotify.<br><br>• De cada <strong>artista</strong> se guarda <strong>nombre</strong> que lo identifica, <strong>nacionalidad</strong> y <strong>fotografía</strong>.<br>• De cada <strong>album</strong> se guarda <strong>títuloA</strong> que lo identifica y <strong>género</strong>.<br>• De cada <strong>tema</strong> se guarda <strong>títuloT</strong> que lo identifica y <strong>duración</strong>.<br><br>• Un <strong>artista</strong> puede componer muchos <strong>álbumes</strong> y un <strong>álbum</strong> puede estar compuesto por muchos <strong>artistas</strong>.<br>• Un <strong>álbum</strong> puede contener muchos <strong>temas</strong> y un <strong>tema</strong> puede estar contenido en muchos <strong>álbumes</strong>.<br>`,
    hint: "Recuerda que Música no es una entidad",
    wordBank: ["ARTISTA", "Nombre", "Nacionalidad", "Fotografía", "ALBUM", "TítuloA", "Género", "TEMA", "TítuloT", "Duración", "compone", "N", "N", "contiene", "N", "1"],
    nodes: [
        { id: "e_0", type: "entity", correctValue: "ARTISTA", x: 20, y: 50, w: 110, h: 52 },
        { id: "a_0", type: "attribute", isKey: true, correctValue: "Nombre", x: 20, y: 22, w: 92, h: 40 },
        { id: "a_1", type: "attribute", correctValue: "Nacionalidad", x: 14, y: 72, w: 92, h: 40 },
        { id: "a_2", type: "attribute", correctValue: "Fotografía", x: 24, y: 72, w: 92, h: 40 },
        { id: "e_1", type: "entity", correctValue: "ALBUM", x: 50, y: 50, w: 110, h: 52 },
        { id: "a_3", type: "attribute", isKey: true, correctValue: "TítuloA", x: 50, y: 22, w: 92, h: 40 },
        { id: "a_4", type: "attribute", correctValue: "Género", x: 50, y: 72, w: 92, h: 40 },
        { id: "e_2", type: "entity", correctValue: "TEMA", x: 80, y: 50, w: 110, h: 52 },
        { id: "a_5", type: "attribute", isKey: true, correctValue: "TítuloT", x: 80, y: 22, w: 92, h: 40 },
        { id: "a_6", type: "attribute", correctValue: "Duración", x: 80, y: 72, w: 92, h: 40 },
        { id: "r_0", type: "relation", correctValue: "compone", x: 35, y: 50, w: 80, h: 80 },
        { id: "c_0_1", type: "cardinality", correctValue: "N", x: 29, y: 50, w: 30, h: 30 },
        { id: "c_0_n", type: "cardinality", correctValue: "N", x: 41, y: 50, w: 30, h: 30 },
        { id: "r_1", type: "relation", correctValue: "contiene", x: 65, y: 50, w: 80, h: 80 },
        { id: "c_1_1", type: "cardinality", correctValue: "N", x: 71, y: 50, w: 30, h: 30 },
        { id: "c_1_n", type: "cardinality", correctValue: "1", x: 59, y: 50, w: 30, h: 30 }
    ],
    connections: [
        { from: "a_0", to: "e_0" },
        { from: "a_1", to: "e_0" },
        { from: "a_2", to: "e_0" },
        { from: "a_3", to: "e_1" },
        { from: "a_4", to: "e_1" },
        { from: "a_5", to: "e_2" },
        { from: "a_6", to: "e_2" },
        { from: "e_0", to: "r_0" },
        { from: "r_0", to: "e_1" },
        { from: "c_0_n", to: "r_0" },
        { from: "c_0_1", to: "r_0" },
        { from: "e_2", to: "r_1" },
        { from: "r_1", to: "e_1" },
        { from: "c_1_n", to: "r_1" },
        { from: "c_1_1", to: "r_1" }
    ],
    // METADATOS
    concept: "relaciones_simples",
    availableFor: ["class", "home", "eval"],
    enabled: true
},


// ── Ejercicio 12: Biblioteca2 ─────────────────────────────────────────────
{
    title: "📖 Biblioteca2",
    description: `Una biblioteca desea registrar el préstamo de ejemplares de libros a sus socios.<br><br>
        • De cada <strong>socio</strong> se guarda su CI, celular, nombre completo (compuesto por nombre, primer apellido y segundo apellido) y dirección.<br>
        • De cada <strong>libro</strong> se guarda un código, título, año y autor; un libro puede tener más de un autor.<br>
        • Cada <strong>ejemplar</strong> tiene un número identificador y su existencia depende del libro al que pertenece.<br>
        • Un <strong>socio</strong> puede tomar prestados muchos ejemplares, y un mismo <strong>ejemplar</strong> puede ser prestado a muchos socios; de cada préstamo se registra la fecha de inicio, fecha de fin y fecha de devolución.<br>
        • Cada <strong>ejemplar</strong> pertenece a un único <strong>libro</strong>, pero un libro puede tener muchos ejemplares.`,
    hint: "",
    wordBank: ["SOCIO", "CI", "Celular", "NomCompleto", "Nom", "Ape1", "Ape2", "Dirección", "EJEMPLAR", "Número", "LIBRO", "Código", "Titulo", "Año", "Autor", "prestar", "FechaI", "FechaF", "FechaD", "N", "N", "tiene", "N", "1"],
    nodes: [
        { id: "e_0", type: "entity", correctValue: "SOCIO", x: 15, y: 50, w: 110, h: 52 },
        { id: "a_0", type: "attribute", isKey: true, correctValue: "CI", x: 10, y: 28, w: 92, h: 40 },
        { id: "a_1", type: "attribute", correctValue: "Celular", x: 7, y: 72, w: 92, h: 40 },
        { id: "a_2", type: "attribute", correctValue: "NomCompleto", x: 22, y: 28, w: 92, h: 40 },
        { id: "a_3", type: "attribute", correctValue: "Nom", x: 10, y: 15, w: 92, h: 40 },
        { id: "a_4", type: "attribute", correctValue: "Ape1", x: 20, y: 15, w: 92, h: 40 },
        { id: "a_5", type: "attribute", correctValue: "Ape2", x: 30, y: 15, w: 92, h: 40 },
        { id: "a_6", type: "attribute", correctValue: "Dirección", x: 18, y: 70, w: 92, h: 40 },
        { id: "e_1", type: "entity", isWeak: true, correctValue: "EJEMPLAR", x: 50, y: 50, w: 110, h: 52 },
        { id: "a_7", type: "attribute", isKey: true, isDashed: true, correctValue: "Número", x: 50, y: 22, w: 92, h: 40 },
        { id: "e_2", type: "entity", correctValue: "LIBRO", x: 80, y: 50, w: 110, h: 52 },
        { id: "a_8", type: "attribute", isKey: true, correctValue: "Código", x: 80, y: 22, w: 92, h: 40 },
        { id: "a_9", type: "attribute", correctValue: "Titulo", x: 90, y: 22, w: 92, h: 40 },
        { id: "a_10", type: "attribute", correctValue: "Año", x: 90, y: 72, w: 92, h: 40 },
        { id: "a_11", type: "attribute", isMultivalued: true, correctValue: "Autor", x: 80, y: 72, w: 92, h: 40 },
        { id: "r_0", type: "relation", correctValue: "prestar", x: 33, y: 50, w: 80, h: 80 },
        { id: "c_0_1", type: "cardinality", correctValue: "N", x: 26, y: 50, w: 30, h: 30 },
        { id: "c_0_n", type: "cardinality", correctValue: "N", x: 40, y: 50, w: 30, h: 30 },
        { id: "a_12", type: "attribute", correctValue: "FechaI", x: 28, y: 70, w: 92, h: 40 },
        { id: "a_13", type: "attribute", correctValue: "FechaF", x: 33, y: 28, w: 92, h: 40 },
        { id: "a_14", type: "attribute", correctValue: "FechaD", x: 38, y: 70, w: 92, h: 40 },
        { id: "r_1", type: "relation", isDoubleRelation: true, totalityLeft: true, correctValue: "tiene", x: 65, y: 50, w: 80, h: 80 },
        { id: "c_1_1", type: "cardinality", correctValue: "N", x: 58, y: 50, w: 30, h: 30 },
        { id: "c_1_n", type: "cardinality", correctValue: "1", x: 72, y: 50, w: 30, h: 30 },
        { id: "t_1_left",  type: "totalidad", correctValue: "S",  x: 60.7, y: 45, w: 28, h: 24 },
        { id: "t_1_right", type: "totalidad", correctValue: "N", x: 72.7, y: 45, w: 28, h: 24 }
    ],
    connections: [
        { from: "a_0", to: "e_0" },
        { from: "a_1", to: "e_0" },
        { from: "a_2", to: "e_0" },
        { from: "a_3", to: "a_2" },
        { from: "a_4", to: "a_2" },
        { from: "a_5", to: "a_2" },
        { from: "a_6", to: "e_0" },
        { from: "a_7", to: "e_1" },
        { from: "a_8", to: "e_2" },
        { from: "a_9", to: "e_2" },
        { from: "a_10", to: "e_2" },
        { from: "a_11", to: "e_2" },
        { from: "e_0", to: "r_0" },
        { from: "r_0", to: "e_1" },
        { from: "c_0_n", to: "r_0" },
        { from: "c_0_1", to: "r_0" },
        { from: "a_12", to: "r_0" },
        { from: "a_13", to: "r_0" },
        { from: "a_14", to: "r_0" },
        { from: "e_1", to: "r_1" },
        { from: "r_1", to: "e_2" },
        { from: "c_1_n", to: "r_1" },
        { from: "c_1_1", to: "r_1" }
    ],
    // METADATOS
    concept: "entidad_debil",
    availableFor: ["class", "home", "eval"],
    enabled: true
},
// ── Ejercicio 13: Almacén de Piezas ──────────────────────────────────────
{
    title: "🔩 Almacén de Piezas",
    description: `Se desea crear una base de datos sobre un almacén de piezas.<br><br>
• Cada <strong>pieza</strong> se identifica con un código de dos letras y un número (por ejemplo, TU6). De cada <strong>pieza</strong> se guarda id_pieza, descripciónP y precio.<br>
• De cada <strong>almacén</strong> se guarda nro, descripciónA y dirección.<br>
• Cada <strong>estantería</strong> pertenece a un único <strong>almacén</strong> y se identifica por id_est dentro de ese <strong>almacén</strong>.<br><br>
• Un <strong>almacén</strong> puede vender muchas piezas, y una <strong>pieza</strong> puede ser vendida en muchos almacenes.<br>
• Un <strong>almacén</strong> puede tener muchas estanterías, pero cada <strong>estantería</strong> pertenece a un único <strong>almacén</strong>.<br>
• Una <strong>pieza</strong> puede estar compuesta por muchas piezas, y a su vez puede ser componente de muchas piezas.`,
    hint: "",
    wordBank: ["PIEZA", "ID_Pieza", "DescripciónP", "Precio", "ALMACÉN", "Nro", "DescripciónA", "Dirección", "ESTANTERÍA", "ID_Est", "vende", "N", "N", "tiene", "1", "N", "compuesta_por", "N", "N"],
    nodes: [
        { id: "e_0", type: "entity", correctValue: "PIEZA", x: 23, y: 50, w: 110, h: 52 },
        { id: "a_0", type: "attribute", isKey: true, correctValue: "ID_Pieza", x: 23, y: 22, w: 92, h: 40 },
        { id: "a_1", type: "attribute", correctValue: "DescripciónP", x: 23, y: 72, w: 92, h: 40 },
        { id: "a_2", type: "attribute", correctValue: "Precio", x: 33, y: 22, w: 92, h: 40 },
        { id: "e_1", type: "entity", correctValue: "ALMACÉN", x: 50, y: 50, w: 110, h: 52 },
        { id: "a_3", type: "attribute", isKey: true, correctValue: "Nro", x: 50, y: 22, w: 92, h: 40 },
        { id: "a_4", type: "attribute", correctValue: "DescripciónA", x: 40, y: 72, w: 92, h: 40 },
        { id: "a_5", type: "attribute", correctValue: "Dirección", x: 50, y: 72, w: 92, h: 40 },
        { id: "e_2", type: "entity", isWeak: true, correctValue: "ESTANTERÍA", x: 76.7, y: 50, w: 110, h: 52 },
        { id: "a_6", type: "attribute", isKey: true, isDashed: true, correctValue: "ID_Est", x: 76.7, y: 22, w: 92, h: 40 },
        { id: "r_0", type: "relation", correctValue: "vende", x: 36.7, y: 50, w: 80, h: 80 },
        { id: "c_0_1", type: "cardinality", correctValue: "N", x: 30, y: 50, w: 30, h: 30 },
        { id: "c_0_n", type: "cardinality", correctValue: "N", x: 43.3, y: 50, w: 30, h: 30 },
        { id: "r_1", type: "relation", isDoubleRelation: true, totalityRight: true, correctValue: "tiene", x: 63.3, y: 50, w: 80, h: 80 },
        { id: "c_1_1", type: "cardinality", correctValue: "1", x: 56.7, y: 50, w: 30, h: 30 },
        { id: "c_1_n", type: "cardinality", correctValue: "N", x: 70, y: 50, w: 30, h: 30 },
        { id: "t_1_left",  type: "totalidad", correctValue: "N",  x: 60.7, y: 45, w: 28, h: 24 },
        { id: "t_1_right", type: "totalidad", correctValue: "S", x: 72.7, y: 45, w: 28, h: 24 },
        { id: "r_2", type: "relation", correctValue: "compuesta_por", x: 7, y: 50, w: 100, h: 100 },
        { id: "c_2_top", type: "cardinality", correctValue: "N", x: 16, y: 40, w: 30, h: 30 },
        { id: "c_2_bot", type: "cardinality", correctValue: "N", x: 16, y: 60, w: 30, h: 30 }
    ],
    connections: [
        { from: "a_0", to: "e_0" },
        { from: "a_1", to: "e_0" },
        { from: "a_2", to: "e_0" },
        { from: "a_3", to: "e_1" },
        { from: "a_4", to: "e_1" },
        { from: "a_5", to: "e_1" },
        { from: "a_6", to: "e_2" },
        { from: "e_0", to: "r_0" },
        { from: "r_0", to: "e_1" },
        { from: "c_0_n", to: "r_0" },
        { from: "c_0_1", to: "r_0" },
        { from: "e_1", to: "r_1" },
        { from: "r_1", to: "e_2" },
        { from: "c_1_n", to: "r_1" },
        { from: "c_1_1", to: "r_1" },
        { from: "e_0", to: "r_2", role: "componente" },
        { from: "r_2", to: "e_0", role: "compuesto" },
        { from: "c_2_top", to: "r_2" },
        { from: "c_2_bot", to: "r_2" }
    ],
    // METADATOS
    concept: "autorelacion",
    availableFor: ["class", "home", "eval"],
    enabled: true
},
// ── Ejercicio 14: Instituto ──────────────────────────────────────────────────────────

{
    title: "🏫 Instituto",
    description: `En un instituto, los docentes dictan cursos y el director supervisa ese dictado.<br><br>
• De cada <strong>curso</strong> se guarda código y nom_curso.<br>
• De cada <strong>docente</strong> se guarda ci_doc y nom_docente.<br>
• De cada <strong>director</strong> se guarda ci_dir, nom_director y teléfono.<br><br>
• Un <strong>docente</strong> puede dictar varios cursos, pero un <strong>curso</strong> solo es dictado por un <strong>docente</strong>.<br>
• El <strong>director</strong> supervisa el dictado de todos los cursos.`,
    hint: "",
    wordBank: ["CURSO", "Código", "Nom_Curso", "DOCENTE", "CI_Doc", "Nom_Docente", "DIRECTOR", "CI_Dir", "Nom_Director", "Teléfono", "dicta", "N", "1", "supervisa", "N", "1"],
    nodes: [
        // Caja de agregación (visual, sin input) — encierra CURSO + dicta + DOCENTE + sus atributos
        { id: "agg_0", type: "aggregation", x: 27, y: 38, w: 520, h: 190 },
        // CURSO
        { id: "e_0", type: "entity",    correctValue: "CURSO",       x: 13, y: 45, w: 110, h: 52 },
        { id: "a_0", type: "attribute", isKey: true, correctValue: "Código",      x:  8, y: 28, w: 92, h: 40 },
        { id: "a_1", type: "attribute", correctValue: "Nom_Curso",   x: 19, y: 28, w: 92, h: 40 },
        // DOCENTE
        { id: "e_1", type: "entity",    correctValue: "DOCENTE",     x: 42, y: 45, w: 110, h: 52 },
        { id: "a_2", type: "attribute", isKey: true, correctValue: "CI_Doc",      x: 33, y: 28, w: 92, h: 40 },
        { id: "a_3", type: "attribute", correctValue: "Nom_Docente", x: 44, y: 28, w: 92, h: 40 },
        // dicta
        { id: "r_0",   type: "relation",    correctValue: "dicta", x: 27, y: 45, w: 80, h: 80 },
        { id: "c_0_n", type: "cardinality", correctValue: "N",     x: 21, y: 45, w: 30, h: 30 },
        { id: "c_0_1", type: "cardinality", correctValue: "1",     x: 33, y: 45, w: 30, h: 30 },
        // supervisa (ambos lados totalidad S — todos los cursos son supervisados)
        { id: "r_1",   type: "relation",    totalityLeft: true, totalityRight: true, correctValue: "supervisa", x: 65, y: 39, w: 80, h: 80 },
        { id: "c_1_n", type: "cardinality", correctValue: "N",         x: 59, y: 39, w: 30, h: 30 },
        { id: "c_1_1", type: "cardinality", correctValue: "1",         x: 71, y: 39, w: 30, h: 30 },
        { id: "t_1_left",  type: "totalidad", correctValue: "S", x: 51, y: 39, w: 28, h: 24 },
        { id: "t_1_right", type: "totalidad", correctValue: "S", x: 68, y: 39, w: 28, h: 24 },
        // DIRECTOR
        { id: "e_2", type: "entity",    correctValue: "DIRECTOR",     x: 82, y: 40, w: 110, h: 52 },
        { id: "a_4", type: "attribute", isKey: true, correctValue: "CI_Dir",       x: 72, y: 62, w: 92, h: 40 },
        { id: "a_5", type: "attribute", correctValue: "Nom_Director", x: 82, y: 62, w: 92, h: 40 },
        { id: "a_6", type: "attribute", correctValue: "Teléfono",     x: 92, y: 62, w: 92, h: 40 }
    ],
    connections: [
        { from: "a_0", to: "e_0" }, { from: "a_1", to: "e_0" },
        { from: "a_2", to: "e_1" }, { from: "a_3", to: "e_1" },
        { from: "e_0", to: "r_0" }, { from: "r_0", to: "e_1" },
        { from: "c_0_n", to: "r_0" }, { from: "c_0_1", to: "r_0" },
        { from: "agg_0", to: "r_1" }, { from: "r_1", to: "e_2" },
        { from: "c_1_n", to: "r_1" }, { from: "c_1_1", to: "r_1" },
        { from: "a_4", to: "e_2" }, { from: "a_5", to: "e_2" }, { from: "a_6", to: "e_2" }
    ],
    // METADATOS
    concept: "agregacion",
    availableFor: ["class", "home", "eval"],
    enabled: true
}

// ── Ejercicio 15:  ──────────────────────────────────────────
    // ┌─────────────────────────────────────────────────────────────────────────┐
    // │ 🟢 PEGAR AQUÍ: 1er BLOQUE (ejercicio completo) del asistente            │
    // │ AGREGAR COMA después del último ejercicio (arriba ↑) y antes de esto    │
    // │ Reemplazar esta línea con el código del Paso 3                          │
    // └─────────────────────────────────────────────────────────────────────────┘
];

const analyzeData = [
    // ── Ejercicio 0: Taller Mecánico ────────────────────────────────────────
    [
        "Un taller mecánico desea registrar información referente a las reparaciones de los autos que llegan al taller y los dueños de los mismos.\n\n",
        "• De cada ", {word:"CLIENTE",type:"entidad",entityType:"fuerte"}, " se guarda la ",
        {word:"CI",type:"atributo",attrType:"clave"}, ", ", {word:"Nombre",type:"atributo",attrType:"simple"}, " y ", {word:"Apellido",type:"atributo",attrType:"simple"}, ".\n",
        "• De los ", {word:"AUTO",type:"entidad",entityType:"fuerte"}, " se guarda la ",
        {word:"Matrícula",type:"atributo",attrType:"clave"}, ", ", {word:"Marca",type:"atributo",attrType:"simple"}, ", ", {word:"Modelo",type:"atributo",attrType:"simple"}, " y ", {word:"Combustible",type:"atributo",attrType:"simple"}, ".\n",
        "• De cada ", {word:"REPARACIÓN",type:"entidad",entityType:"fuerte"}, " se guarda ",
        {word:"Código",type:"atributo",attrType:"clave"}, " y ", {word:"Descripción",type:"atributo",attrType:"simple"}, ".\n",
        "• Un cliente puede ", {word:"tener",type:"relacion"}, " muchos autos.\n",
        "• Un auto puede ", {word:"recibir",type:"relacion"}, " muchas reparaciones. Se registra ", {word:"Fecha_entrada",type:"atributo",attrType:"relacion"}, " y ", {word:"Observación",type:"atributo",attrType:"relacion"}, "."
    ],

    // ── Ejercicio 1: Biblioteca Escolar ──────────────────────────────────────
    [
        "Se desea diseñar el esquema para el control de los libros prestados en una biblioteca escolar.\n\n",
        "• Cada ", {word:"SOCIO",type:"entidad",entityType:"fuerte"}, " tiene ",
        {word:"Id_socio",type:"atributo",attrType:"clave"}, ", ", {word:"Nombre",type:"atributo",attrType:"simple"}, " y ", {word:"Teléfono",type:"atributo",attrType:"simple"}, ".\n",
        "• De los ", {word:"LIBRO",type:"entidad",entityType:"fuerte"}, " se registra el ",
        {word:"Isbn",type:"atributo",attrType:"clave"}, ", ", {word:"Título",type:"atributo",attrType:"simple"}, " y ", {word:"Autor",type:"atributo",attrType:"simple"}, ".\n",
        "• Un socio puede ", {word:"solicitar",type:"relacion"}, " múltiples préstamos y un libro puede prestarse a diferentes socios.\n",
        "• El Préstamo registra la ", {word:"Fecha_prestamo",type:"atributo",attrType:"relacion"}, " y si fue ", {word:"Devuelto",type:"atributo",attrType:"relacion"}, "."
    ],
    // ── Ejercicio 2: Tienda Online ────────────────────────────────────────────
    [
        "Se modela un sistema simplificado de ventas para un comercio electrónico en Internet.\n\n",
        "• El ", {word:"CLIENTE",type:"entidad",entityType:"fuerte"}, " tiene ",
        {word:"Id_cliente",type:"atributo",attrType:"clave"}, ", ", {word:"Nombre",type:"atributo",attrType:"simple"}, ", ", {word:"Email",type:"atributo",attrType:"simple"}, ".\n",
        "• El cliente ", {word:"realiza",type:"relacion"}, " un ", {word:"PEDIDO",type:"entidad",entityType:"fuerte"}, " con ",
        {word:"Nro_pedido",type:"atributo",attrType:"clave"}, ", ", {word:"Fecha_pedido",type:"atributo",attrType:"simple"}, ", ", {word:"Total",type:"atributo",attrType:"simple"}, ".\n",
        "• Un cliente puede registrar múltiples pedidos en el mes, pero cada pedido solo pertenece a un único cliente."
    ],
    // ── Ejercicio 3: Red Social ───────────────────────────────────────────────
    [
        "Una red social tiene ", {word:"USUARIO",type:"entidad",entityType:"fuerte"}, ", que pueden ser ",
        {word:"CREADOR",type:"entidad",entityType:"fuerte"}, " o ", {word:"ESPECTADOR",type:"entidad",entityType:"fuerte"}, " (categorización IS-A).\n\n",
        "• Los usuarios tienen ", {word:"Id_usuario",type:"atributo",attrType:"clave"}, ", ", {word:"Email",type:"atributo",attrType:"simple"}, " y ", {word:"Año_ingreso",type:"atributo",attrType:"simple"}, ".\n",
        "• Los Creadores tienen ", {word:"Cant_seguidores",type:"atributo",attrType:"simple"}, ".\n",
        "• Los Espectadores pueden tener varios ", {word:"Teléfono",type:"atributo",attrType:"multivaluado"}, " y una ", {word:"Ciudad",type:"atributo",attrType:"simple"}, ".\n",
        "• Los Usuarios ", {word:"publican",type:"relacion"}, " ", {word:"CONTENIDO",type:"entidad",entityType:"fuerte"}, ".\n",
        "• El Contenido tiene ", {word:"Nro_contenido",type:"atributo",attrType:"clave"}, ", ", {word:"Título",type:"atributo",attrType:"simple"}, " y ", {word:"Fecha",type:"atributo",attrType:"simple"}, "."
    ],
    // ── Ejercicio 4: Plataforma Streaming ────────────────────────────────────
    [
        "Una plataforma de streaming desea administrar su catálogo de películas y sus socios.\n\n",
        "• De cada ", {word:"SOCIO",type:"entidad",entityType:"fuerte"}, " se guarda ",
        {word:"Cod_socio",type:"atributo",attrType:"clave"}, ", ", {word:"Nombre_completo",type:"atributo",attrType:"compuesto",components:["Primer_nom","Primer_ape"]},
        " (compuesto por ", {word:"Primer_nom",type:"atributo",attrType:"simple"}, " y ", {word:"Primer_ape",type:"atributo",attrType:"simple"}, ") y una lista de ",
        {word:"Directores_favoritos",type:"atributo",attrType:"multivaluado"}, ".\n",
        "• De cada ", {word:"PELÍCULA",type:"entidad",entityType:"fuerte"}, " se registra ",
        {word:"Cod_pelicula",type:"atributo",attrType:"clave"}, ", ", {word:"Titulo",type:"atributo",attrType:"simple"}, ", ",
        {word:"Año",type:"atributo",attrType:"simple"}, " y una lista de ", {word:"Actores",type:"atributo",attrType:"multivaluado"}, ".\n",
        "• Las películas se almacenan en ", {word:"ARCHIVADOR",type:"entidad",entityType:"fuerte"}, " con ",
        {word:"Nro_arch",type:"atributo",attrType:"clave"}, " y ", {word:"Ubicacion",type:"atributo",attrType:"simple"}, ".\n",
        "• Un socio puede ", {word:"alquilar",type:"relacion"}, " muchas películas y una película puede ser alquilada por muchos socios. Se registra ",
        {word:"Fecha_alq",type:"atributo",attrType:"relacion"}, " y ", {word:"Fech_devuelto",type:"atributo",attrType:"relacion"}, ".\n",
        "• Un archivador ", {word:"guarda",type:"relacion"}, " muchas películas, pero cada película está en un solo archivador."
    ],
    // ── Ejercicio 5: Sistema Hospitalario ────────────────────────────────────
    [
        "Un hospital desea gestionar información sobre sus pacientes, médicos y consultas.\n\n",
        "• De cada ", {word:"PACIENTE",type:"entidad",entityType:"fuerte"}, " se guarda ",
        {word:"Cédula",type:"atributo",attrType:"clave"}, ", ", {word:"NombreP",type:"atributo",attrType:"simple"}, " y ", {word:"Teléfono",type:"atributo",attrType:"simple"}, ".\n",
        "• De cada ", {word:"MÉDICO",type:"entidad",entityType:"fuerte"}, " se registra ",
        {word:"Matrícula",type:"atributo",attrType:"clave"}, ", ", {word:"NombreM",type:"atributo",attrType:"simple"}, " y ", {word:"Especialidad",type:"atributo",attrType:"simple"}, ".\n",
        "• Un PACIENTE ", {word:"consulta",type:"relacion"}, " muchos MÉDICOS y un MÉDICO atiende a muchos PACIENTES. Se registra ", {word:"Fecha",type:"atributo",attrType:"relacion"}, " y ", {word:"Diagnóstico",type:"atributo",attrType:"relacion"}, "."
    ],
    // ── Ejercicio 6: Institución educativa ───────────────────────────────────
[
    "Se quiere llevar un registro digital de las materias que los alumnos están cursando actualmente.\n\n",
    "• De cada ",
    {word:"MATERIA",type:"entidad",entityType:"fuerte"},
    " se guarda ",
    {word:"Código",type:"atributo",attrType:"clave"},
    ", ",
    {word:"NombreMat",type:"atributo",attrType:"simple"},
    " y ",
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
    " y ",
    {word:"Edad",type:"atributo",attrType:"derivado"},
    ".\n",
    "Por otra parte, se desea agregar la ", {word:"Nota",type:"atributo",attrType:"relacion"}, " que tiene el alumno en cada materia.\n",
    "• Un ALUMNO  ",{word:"cursa",type:"relacion"}, " muchas MATERIAS. Y una MATERIA puede ser cursada por muchos ALUMNOS.\n"
],
    // ── Ejercicio 7: Colegio ──────────────────────────────────────────────────
   [
    "En un colegio privado sucede lo siguiente: \n\n",
    "• De cada ",
    {word:"PROFESOR",type:"entidad",entityType:"fuerte"},
    " se guarda ",
    {word:"CédulaP",type:"atributo",attrType:"clave"},
    ", ",
    {word:"Nombre",type:"atributo",attrType:"simple"},
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
    {word:"NombreCom",type:"atributo",attrType:"compuesto",components:["Nom","Ape1","Ape2"]},
    " (compuesto por ", {word:"Nom",type:"atributo",attrType:"simple"}, ", ", {word:"Ape1",type:"atributo",attrType:"simple"}, " y ", {word:"Ape2",type:"atributo",attrType:"simple"}, "), ",
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
    "• Un PROFESOR puede ",
    {word:"dictar",type:"relacion"},
    " muchas ASIGNATURAS y una ASIGNATURA puede ser dictada por muchos PROFESORES.\n",
    "• Un ALUMNO puede ",
    {word:"cursar",type:"relacion"},
    " muchas ASIGNATURAS y una ASIGNATURA puede ser cursada por muchos ALUMNOS.\n",
    "• Un PROFESOR puede ",
    {word:"publicar",type:"relacion"},
    " muchos LIBROS y un LIBRO es solo publicado por un PROFESOR.\n"
],

    // ── Ejercicio 8: Película ─────────────────────────────────────────────────
    [
        "Un videoclub desea llevar un registro de sus clientes, las películas disponibles, los ejemplares en alquiler, y los directores y actores que participan en cada película.\n\n",
        "• De cada ", {word:"CLIENTE",type:"entidad",entityType:"fuerte"}, " se guarda ",
        {word:"CédulaC",type:"atributo",attrType:"clave"}, ", ", {word:"NombreC",type:"atributo",attrType:"simple"}, ", ", {word:"Dirección",type:"atributo",attrType:"simple"}, " y ", {word:"Teléfono",type:"atributo",attrType:"simple"}, ".\n",
        "• De cada ", {word:"EJEMPLAR",type:"entidad",entityType:"débil"}, " se guarda ",
        {word:"Número",type:"atributo",attrType:"clave"}, " y ", {word:"Estado",type:"atributo",attrType:"simple"}, ".\n",
        "• De cada ", {word:"PELICULA",type:"entidad",entityType:"fuerte"}, " se guarda ",
        {word:"Título",type:"atributo",attrType:"clave"}, ", ", {word:"Productora",type:"atributo",attrType:"simple"}, ", ", {word:"Fecha",type:"atributo",attrType:"simple"}, " y ", {word:"NacionalidadP",type:"atributo",attrType:"simple"}, ".\n",
        "• De cada ", {word:"DIRECTOR",type:"entidad",entityType:"fuerte"}, " se guarda ",
        {word:"CédulaD",type:"atributo",attrType:"clave"}, ", ", {word:"NombreD",type:"atributo",attrType:"simple"}, " y ", {word:"NacionalidadD",type:"atributo",attrType:"simple"}, ".\n",
        "• De cada ", {word:"ACTOR",type:"entidad",entityType:"fuerte"}, " se guarda ",
        {word:"CédulaA",type:"atributo",attrType:"clave"}, ", ", {word:"Principal",type:"atributo",attrType:"simple"}, ", ", {word:"Sexo",type:"atributo",attrType:"simple"}, ", ", {word:"NacionalidadA",type:"atributo",attrType:"simple"}, " y ", {word:"NombreA",type:"atributo",attrType:"simple"}, ".\n\n",
        "• Un CLIENTE ", {word:"alquila",type:"relacion"}, " muchos EJEMPLARES y un EJEMPLAR es alquilado por muchos CLIENTES.\n",
        "• Una PELICULA ", {word:"tiene",type:"relacion"}, " muchos EJEMPLARES, pero un EJEMPLAR es de una sola PELICULA.\n",
        "• Un ACTOR ", {word:"participa",type:"relacion"}, " en muchas PELICULAS y en una PELICULA pueden participar muchos ACTORES.\n",
        "• Una PELICULA es dirigida por un DIRECTOR. Un DIRECTOR ", {word:"dirige",type:"relacion"}, " muchas PELICULAS."
    ],
    // ── Ejercicio 9: Fútbol ───────────────────────────────────────────────────
    [
        "En una asociación deportiva se desea almacenar información sobre clubes y partidos de fútbol.\n\n",
        "• De cada ", {word:"CLUB",type:"entidad",entityType:"fuerte"}, " se guarda ",
        {word:"Nombre",type:"atributo",attrType:"clave"}, ", ", {word:"AñoFundación",type:"atributo",attrType:"simple"}, ", ", {word:"Ubicación",type:"atributo",attrType:"simple"}, ", ", {word:"Entrenador",type:"atributo",attrType:"simple"}, ", ", {word:"Presidente",type:"atributo",attrType:"simple"}, " y ", {word:"Estadio",type:"atributo",attrType:"simple"}, ".\n",
        "• De cada ", {word:"JUGADOR",type:"entidad",entityType:"fuerte"}, " se guarda ",
        {word:"Ced",type:"atributo",attrType:"clave"}, ", ", {word:"Nacionalidad",type:"atributo",attrType:"simple"}, ", ", {word:"Estatura",type:"atributo",attrType:"simple"}, ", ", {word:"Apodo",type:"atributo",attrType:"simple"}, ", ", {word:"Nombre",type:"atributo",attrType:"simple"}, " y ", {word:"FechaNac",type:"atributo",attrType:"simple"}, ".\n\n",
        "• Un JUGADOR ", {word:"juega_en",type:"relacion"}, " muchos CLUBES.\n",
        "• Un CLUB ", {word:"juega_con",type:"relacion"}, " muchos CLUBES."
    ],

    // ── Ejercicio 10: Música ──────────────────────────────────────────────────
    [
        "• De cada ", {word:"ARTISTA",type:"entidad",entityType:"fuerte"}, " se guarda ",
        {word:"Nombre",type:"atributo",attrType:"clave"}, ", ",
        {word:"Nacionalidad",type:"atributo",attrType:"simple"}, " y ",
        {word:"Fotografía",type:"atributo",attrType:"simple"}, ".\n",
        "• De cada ", {word:"ALBUM",type:"entidad",entityType:"fuerte"}, " se guarda ",
        {word:"TítuloA",type:"atributo",attrType:"clave"}, " y ",
        {word:"Género",type:"atributo",attrType:"simple"}, ".\n",
        "• De cada ", {word:"TEMA",type:"entidad",entityType:"fuerte"}, " se guarda ",
        {word:"TítuloT",type:"atributo",attrType:"clave"}, " y ",
        {word:"Duración",type:"atributo",attrType:"simple"}, ".\n",
        "• Un artista puede ", {word:"compone",type:"relacion"}, " muchos álbumes.\n",
        "• Un álbum puede ", {word:"contiene",type:"relacion"}, " muchos temas.\n"
    ],

    // ── Ejercicio 11: Biblioteca2 ────────────────────────────────────────────
    [
        "• De cada ", {word:"SOCIO",type:"entidad",entityType:"fuerte"}, " se guarda ",
        {word:"CI",type:"atributo",attrType:"clave"}, ", ",
        {word:"Celular",type:"atributo",attrType:"simple"}, ", ",
        {word:"NomCompleto",type:"atributo",attrType:"compuesto"}, " (compuesto por ",
        {word:"Nom",type:"atributo",attrType:"simple"}, ", ",
        {word:"Ape1",type:"atributo",attrType:"simple"}, " y ",
        {word:"Ape2",type:"atributo",attrType:"simple"}, ") y ",
        {word:"Dirección",type:"atributo",attrType:"simple"}, ".\n",
        "• De cada ", {word:"EJEMPLAR",type:"entidad",entityType:"débil"}, " se guarda ",
        {word:"Número",type:"atributo",attrType:"clave"}, ".\n",
        "• De cada ", {word:"LIBRO",type:"entidad",entityType:"fuerte"}, " se guarda ",
        {word:"Código",type:"atributo",attrType:"clave"}, ", ",
        {word:"Titulo",type:"atributo",attrType:"simple"}, ", ",
        {word:"Año",type:"atributo",attrType:"simple"}, " y ",
        {word:"Autor",type:"atributo",attrType:"multivaluado"}, ".\n",
        "• Un SOCIO puede ", {word:"prestar",type:"relacion"}, " muchos EJEMPLARES.\n",
        "• Un EJEMPLAR puede ", {word:"tiene",type:"relacion"}, " muchos LIBROS.\n"
    ],

    // ── Ejercicio 12: Almacén de Piezas ──────────────────────────────────────
    [
        "• De cada ",
        {word:"PIEZA",type:"entidad",entityType:"fuerte"},
        " se guarda ",
        {word:"ID_Pieza",type:"atributo",attrType:"clave"},
        ", ",
        {word:"DescripciónP",type:"atributo",attrType:"simple"},
        " y ",
        {word:"Precio",type:"atributo",attrType:"simple"},
        ".\n",
        "• De cada ",
        {word:"ALMACÉN",type:"entidad",entityType:"fuerte"},
        " se guarda ",
        {word:"Nro",type:"atributo",attrType:"clave"},
        ", ",
        {word:"DescripciónA",type:"atributo",attrType:"simple"},
        " y ",
        {word:"Dirección",type:"atributo",attrType:"simple"},
        ".\n",
        "• Cada ",
        {word:"ESTANTERÍA",type:"entidad",entityType:"débil"},
        " pertenece a un único ALMACÉN y se identifica por ",
        {word:"ID_Est",type:"atributo",attrType:"clave"},
        " dentro de ese almacén.\n",
        "• Un ALMACÉN puede ",
        {word:"vende",type:"relacion"},
        " muchas PIEZAS, y una PIEZA puede ser vendida en muchos almacenes.\n",
        "• Un ALMACÉN puede ",
        {word:"tiene",type:"relacion"},
        " muchas estanterías, pero cada ESTANTERÍA pertenece a un único ALMACÉN.\n",
        "• Una PIEZA puede ",
        {word:"compuesta_por",type:"relacion"},
        " muchas PIEZAS (rol: ",
        {word:"componente",type:"relacion"},
        ") y a su vez ser componente de muchas piezas (rol: ",
        {word:"compuesto",type:"relacion"},
        ").\n"
    ],

    // ── Ejercicio 13: Instituto ──────────────────────────────────────────────────
    [
        "• De cada ",
        {word:"CURSO",type:"entidad",entityType:"fuerte"},
        " se guarda ",
        {word:"Código",type:"atributo",attrType:"clave"},
        " y ",
        {word:"Nom_Curso",type:"atributo",attrType:"simple"},
        ".\n",
        "• De cada ",
        {word:"DOCENTE",type:"entidad",entityType:"fuerte"},
        " se guarda ",
        {word:"CI_Doc",type:"atributo",attrType:"clave"},
        " y ",
        {word:"Nom_Docente",type:"atributo",attrType:"simple"},
        ".\n",
        "• De cada ",
        {word:"DIRECTOR",type:"entidad",entityType:"fuerte"},
        " se guarda ",
        {word:"CI_Dir",type:"atributo",attrType:"clave"},
        ", ",
        {word:"Nom_Director",type:"atributo",attrType:"simple"},
        " y ",
        {word:"Teléfono",type:"atributo",attrType:"simple"},
        ".\n",
        "• Un DOCENTE puede ",
        {word:"dicta",type:"relacion"},
        " varios cursos, pero un CURSO solo es dictado por un DOCENTE.\n",
        "• El DIRECTOR ",
        {word:"supervisa",type:"relacion"},
        " el dictado de todos los cursos.\n"
    ]

    //15

    // ┌─────────────────────────────────────────────────────────────────────────┐
    // │ 🟡 PEGAR AQUÍ: 2do BLOQUE (analyzeData) del asistente                   │
    // │ AGREGAR COMA después del último análisis (arriba ↑) y antes de esto     │
    // │ Reemplazar esta línea con el código del Paso 3                          │
    // └─────────────────────────────────────────────────────────────────────────┘
];

const analyzeConfig = [

    // ── Ejercicio 0: Taller Mecánico ──────────────────────────────────────────
    { requireSubtypes: true  },   // atributos de relación

    // ── Ejercicio 1: Biblioteca Escolar ───────────────────────────────────────
    { requireSubtypes: true  },   // atributos de relación

    // ── Ejercicio 2: Tienda Online ────────────────────────────────────────────
    { requireSubtypes: false },

    // ── Ejercicio 3: Red Social ───────────────────────────────────────────────
    { requireSubtypes: true  },   // ISA

    // ── Ejercicio 4: Plataforma Streaming ─────────────────────────────────────
    { requireSubtypes: true  },   // compuesto / multivaluado

    // ── Ejercicio 5: Sistema Hospitalario ─────────────────────────────────────
    { requireSubtypes: false },

    // ── Ejercicio 6: Institución educativa ────────────────────────────────────
    { requireSubtypes: true  },   // compuesto / derivado

    // ── Ejercicio 7: Colegio ──────────────────────────────────────────────────
    { requireSubtypes: true  },   // compuesto / derivado / multivaluado

    // ── Ejercicio 8: Película ─────────────────────────────────────────────────
    { requireSubtypes: false },

    // ── Ejercicio 9: Fútbol ───────────────────────────────────────────────────
    { requireSubtypes: false },

    // ── Ejercicio 10: Música ──────────────────────────────────────────────────
    { requireSubtypes: false },

    // ── Ejercicio 11: Biblioteca2 ─────────────────────────────────────────────
    { requireSubtypes: true  },

    // ── Ejercicio 12: Almacén de Piezas ───────────────────────────────────────
    { requireSubtypes: true  },
 
    // ── Ejercicio 13: Instituto ──────────────────────────────────────────────────
    { requireSubtypes: false }
];
