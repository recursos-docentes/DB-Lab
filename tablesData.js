// tablesData.js — Esquemas relacionales para el tab "Pasaje a Tablas"
// Alineado con exercises[i]. Cada entrada define las tablas resultantes
// y los pasos de derivación visibles en el panel izquierdo.
//
// Campo de cada tabla:
//   name       : nombre visible del campo
//   isPK       : true si es clave primaria
//   isFK       : true si es clave foránea
//   fkTo       : nombre de la tabla referenciada (si isFK)
//
// Convenciones:
//   - Atributos derivados se EXCLUYEN (no aparecen en tablas relacionales)
//   - Atributos compuestos se EXPANDEN (sus subatributos aparecen directamente)
//   - Atributos multivaluados generan una tabla separada
//   - Cardinalidades 1:N con totalidad implícita → FK en la tabla del lado N
//   - N:N siempre genera tabla intermedia

const tablesData = [

// ── Ejercicio 1: Taller Mecánico ──────────────────────────────────────────
{
    derivation: [
        { element: "CLIENTE",         icon: "📋", rule: "Entidad → tabla",                   note: "Tabla con PK: CI" },
        { element: "AUTO",            icon: "📋", rule: "Entidad → tabla",                   note: "Tabla con PK: Matrícula" },
        { element: "REPARACIÓN",      icon: "📋", rule: "Entidad → tabla",                   note: "Tabla con PK: Código" },
        { element: "tiene (1:N)",     icon: "🔗", rule: "N:1 sin totalidad → tabla nueva",   note: "Tabla: tiene (PK = Matrícula del lado N)" },
        { element: "recibe (N:N)",    icon: "🔀", rule: "N:N → tabla intermedia",            note: "Tabla: recibe con PK compuesta" }
    ],
    tables: [
        {
            name: "CLIENTE", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "CI",       isPK: true,  isFK: false },
                { name: "Nombre",   isPK: false, isFK: false },
                { name: "Apellido", isPK: false, isFK: false }
            ]
        },
        {
            name: "AUTO", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "Matrícula",   isPK: true,  isFK: false },
                { name: "Marca",       isPK: false, isFK: false },
                { name: "Modelo",      isPK: false, isFK: false },
                { name: "Combustible", isPK: false, isFK: false }
            ]
        },
        {
            name: "REPARACIÓN", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "Código",      isPK: true,  isFK: false },
                { name: "Descripción", isPK: false, isFK: false }
            ]
        },
        {
            name: "tiene", ruleLabel: "Rel. N:1 sin totalidad",
            ruleNote: "N:1 sin totalidad del lado N → nueva tabla. PK = clave de la entidad del lado N.",
            fields: [
                { name: "Matrícula", isPK: true,  isFK: true, fkTo: "AUTO" },
                { name: "CI",        isPK: false, isFK: true, fkTo: "CLIENTE" }
            ]
        },
        {
            name: "recibe", ruleLabel: "Rel. N:N",
            ruleNote: "N:N → tabla intermedia. La PK compuesta agrupa las claves de ambas entidades.",
            fields: [
                { name: "Matrícula",    isPK: true,  isFK: true,  fkTo: "AUTO" },
                { name: "Código",       isPK: true,  isFK: true,  fkTo: "REPARACIÓN" },
                { name: "Fecha_entrada",isPK: false, isFK: false },
                { name: "Observación",  isPK: false, isFK: false }
            ]
        }
    ]
},

// ── Ejercicio 2: Biblioteca Escolar ──────────────────────────────────────
{
    derivation: [
        { element: "SOCIO",        icon: "📋", rule: "Entidad → tabla",          note: "Tabla con PK: Id_socio" },
        { element: "LIBRO",        icon: "📋", rule: "Entidad → tabla",          note: "Tabla con PK: Isbn" },
        { element: "préstamo (N:N)",icon: "🔀", rule: "N:N → tabla intermedia", note: "Tabla: préstamo con PK compuesta" }
    ],
    tables: [
        {
            name: "SOCIO", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "Id_socio",  isPK: true,  isFK: false },
                { name: "Nombre",    isPK: false, isFK: false },
                { name: "Teléfono", isPK: false, isFK: false }
            ]
        },
        {
            name: "LIBRO", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "Isbn",   isPK: true,  isFK: false },
                { name: "Título", isPK: false, isFK: false },
                { name: "Autor",  isPK: false, isFK: false }
            ]
        },
        {
            name: "préstamo", ruleLabel: "Rel. N:N",
            ruleNote: "N:N → tabla intermedia. Los atributos propios de la relación también se incluyen.",
            fields: [
                { name: "Id_socio",      isPK: true,  isFK: true,  fkTo: "SOCIO" },
                { name: "Isbn",          isPK: true,  isFK: true,  fkTo: "LIBRO" },
                { name: "Fecha_prestamo",isPK: false, isFK: false },
                { name: "Devuelto",      isPK: false, isFK: false }
            ]
        }
    ]
},

// ── Ejercicio 3: Tienda Online ────────────────────────────────────────────
{
    derivation: [
        { element: "CLIENTE",       icon: "📋", rule: "Entidad → tabla",         note: "Tabla con PK: Id_cliente" },
        { element: "PEDIDO",        icon: "📋", rule: "Entidad → tabla",         note: "Tabla con PK: Nro_pedido" },
        { element: "realiza (1:N)", icon: "🔗", rule: "N:1 con totalidad → FK",  note: "Cada pedido pertenece a un cliente → FK Id_cliente en PEDIDO" }
    ],
    tables: [
        {
            name: "CLIENTE", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "Id_cliente", isPK: true,  isFK: false },
                { name: "Nombre",     isPK: false, isFK: false },
                { name: "Email",      isPK: false, isFK: false }
            ]
        },
        {
            name: "PEDIDO", ruleLabel: "Entidad + FK de realiza",
            ruleNote: "N:1 con totalidad del lado N → no se crea tabla nueva. La clave de CLIENTE se incorpora como FK en PEDIDO.",
            fields: [
                { name: "Nro_pedido",   isPK: true,  isFK: false },
                { name: "Fecha_pedido", isPK: false, isFK: false },
                { name: "Total",        isPK: false, isFK: false },
                { name: "Id_cliente",   isPK: false, isFK: true,  fkTo: "CLIENTE" }
            ]
        }
    ]
},

// ── Ejercicio 4: Red Social ───────────────────────────────────────────────
{
    derivation: [
        { element: "USUARIO",         icon: "📋", rule: "Entidad → tabla",                  note: "Tabla con PK: Id_usuario" },
        { element: "CONTENIDO",       icon: "📋", rule: "Entidad → tabla",                  note: "Tabla con PK: Nro_contenido" },
        { element: "publica (1:N)",   icon: "🔗", rule: "N:1 con totalidad → FK",           note: "Cada contenido es de un usuario → FK Id_usuario en CONTENIDO" },
        { element: "CREADOR (ISA)",   icon: "🔺", rule: "Categorización → hereda PK",       note: "CREADOR hereda Id_usuario de USUARIO" },
        { element: "ESPECTADOR (ISA)",icon: "🔺", rule: "Categorización → hereda PK",       note: "ESPECTADOR hereda Id_usuario de USUARIO" },
        { element: "Teléfono (mv.)",  icon: "📋", rule: "Atributo multivaluado → tabla",    note: "Tabla separada con FK → ESPECTADOR" }
    ],
    tables: [
        {
            name: "USUARIO", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "Id_usuario",  isPK: true,  isFK: false },
                { name: "Email",       isPK: false, isFK: false },
                { name: "Año_ingreso", isPK: false, isFK: false }
            ]
        },
        {
            name: "CONTENIDO", ruleLabel: "Entidad + FK de publica",
            ruleNote: "N:1 con totalidad del lado N → FK Id_usuario en CONTENIDO.",
            fields: [
                { name: "Nro_contenido", isPK: true,  isFK: false },
                { name: "Título",        isPK: false, isFK: false },
                { name: "Fecha",         isPK: false, isFK: false },
                { name: "Id_usuario",    isPK: false, isFK: true,  fkTo: "USUARIO" }
            ]
        },
        {
            name: "CREADOR", ruleLabel: "Categorización (ISA)",
            ruleNote: "Las subentidades heredan la PK de la superentidad como FK.",
            fields: [
                { name: "Id_usuario",    isPK: true,  isFK: true,  fkTo: "USUARIO" },
                { name: "Cant_seguidores",isPK: false, isFK: false }
            ]
        },
        {
            name: "ESPECTADOR", ruleLabel: "Categorización (ISA)",
            ruleNote: "Las subentidades heredan la PK de la superentidad como FK.",
            fields: [
                { name: "Id_usuario", isPK: true,  isFK: true,  fkTo: "USUARIO" },
                { name: "Ciudad",     isPK: false, isFK: false }
            ]
        },
        {
            name: "Teléfono", ruleLabel: "Attr. multivaluado",
            ruleNote: "El atributo multivaluado genera una tabla separada con FK a la entidad original.",
            fields: [
                { name: "Id_usuario", isPK: true, isFK: true,  fkTo: "ESPECTADOR" },
                { name: "Teléfono",   isPK: true, isFK: false }
            ]
        }
    ]
},

// ── Ejercicio 5: Plataforma Streaming ────────────────────────────────────
{
    derivation: [
        { element: "SOCIO",            icon: "📋", rule: "Entidad → tabla (compuesto expandido)",  note: "Nombre_completo → Primer_nom + Primer_ape" },
        { element: "PELÍCULA",         icon: "📋", rule: "Entidad → tabla",                        note: "Tabla con PK: Cod_pelicula" },
        { element: "ARCHIVADOR",       icon: "📋", rule: "Entidad → tabla",                        note: "Tabla con PK: Nro_arch" },
        { element: "Directores_fav.",  icon: "📋", rule: "Atrib. multivaluado → tabla",            note: "Tabla separada con FK → SOCIO" },
        { element: "Actores",          icon: "📋", rule: "Atrib. multivaluado → tabla",            note: "Tabla separada con FK → PELÍCULA" },
        { element: "alquila (N:N)",    icon: "🔀", rule: "N:N → tabla intermedia",                 note: "Tabla: alquila con PK compuesta" },
        { element: "guarda (N:1)",     icon: "🔗", rule: "N:1 con totalidad → FK",                 note: "Cada película está en un archivador → FK Nro_arch en PELÍCULA" }
    ],
    tables: [
        {
            name: "SOCIO", ruleLabel: "Entidad (compuesto expandido)",
            ruleNote: "Nombre_completo se expande en subatributos. Los atributos compuestos no se representan en el M-R.",
            fields: [
                { name: "Cod_socio",  isPK: true,  isFK: false },
                { name: "Primer_nom", isPK: false, isFK: false },
                { name: "Primer_ape", isPK: false, isFK: false }
            ]
        },
        {
            name: "PELÍCULA", ruleLabel: "Entidad + FK de guarda",
            ruleNote: "N:1 con totalidad del lado N → FK Nro_arch incorporado en PELÍCULA.",
            fields: [
                { name: "Cod_pelicula", isPK: true,  isFK: false },
                { name: "Titulo",       isPK: false, isFK: false },
                { name: "Año",          isPK: false, isFK: false },
                { name: "Nro_arch",     isPK: false, isFK: true,  fkTo: "ARCHIVADOR" }
            ]
        },
        {
            name: "ARCHIVADOR", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "Nro_arch", isPK: true,  isFK: false },
                { name: "Ubicacion", isPK: false, isFK: false }
            ]
        },
        {
            name: "Directores_favoritos", ruleLabel: "Attr. multivaluado",
            ruleNote: "Atributo multivaluado → tabla separada con FK al SOCIO.",
            fields: [
                { name: "Cod_socio",            isPK: true, isFK: true,  fkTo: "SOCIO" },
                { name: "Directores_favoritos",  isPK: true, isFK: false }
            ]
        },
        {
            name: "Actores", ruleLabel: "Attr. multivaluado",
            ruleNote: "Atributo multivaluado → tabla separada con FK a PELÍCULA.",
            fields: [
                { name: "Cod_pelicula", isPK: true, isFK: true,  fkTo: "PELÍCULA" },
                { name: "Actores",      isPK: true, isFK: false }
            ]
        },
        {
            name: "alquila", ruleLabel: "Rel. N:N",
            ruleNote: "N:N → tabla intermedia con PK compuesta de las claves de ambas entidades.",
            fields: [
                { name: "Cod_socio",    isPK: true,  isFK: true,  fkTo: "SOCIO" },
                { name: "Cod_pelicula", isPK: true,  isFK: true,  fkTo: "PELÍCULA" },
                { name: "Fecha_alq",    isPK: false, isFK: false },
                { name: "Fech_devuelto",isPK: false, isFK: false }
            ]
        }
    ]
},

// ── Ejercicio 6: Sistema Hospitalario ────────────────────────────────────
{
    derivation: [
        { element: "PACIENTE",       icon: "📋", rule: "Entidad → tabla",          note: "Tabla con PK: Cédula" },
        { element: "MÉDICO",         icon: "📋", rule: "Entidad → tabla",          note: "Tabla con PK: Matrícula" },
        { element: "CONSULTA",       icon: "📋", rule: "Entidad → tabla",          note: "Tabla con PK: Número" },
        { element: "realiza (1:N)",  icon: "🔗", rule: "N:1 con totalidad → FK",   note: "Cada consulta pertenece a un paciente → FK Cédula en CONSULTA" },
        { element: "atiende (1:N)",  icon: "🔗", rule: "N:1 con totalidad → FK",   note: "Cada consulta es atendida por un médico → FK Matrícula en CONSULTA" }
    ],
    tables: [
        {
            name: "PACIENTE", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "Cédula",    isPK: true,  isFK: false },
                { name: "Nombre",    isPK: false, isFK: false },
                { name: "Teléfono", isPK: false, isFK: false }
            ]
        },
        {
            name: "MÉDICO", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "Matrícula",   isPK: true,  isFK: false },
                { name: "Nombre",      isPK: false, isFK: false },
                { name: "Especialidad",isPK: false, isFK: false }
            ]
        },
        {
            name: "CONSULTA", ruleLabel: "Entidad + FKs de relaciones",
            ruleNote: "Las relaciones 1:N con totalidad del lado N incorporan FK en la tabla del lado N.",
            fields: [
                { name: "Número",     isPK: true,  isFK: false },
                { name: "Fecha",      isPK: false, isFK: false },
                { name: "Diagnóstico",isPK: false, isFK: false },
                { name: "Cédula",     isPK: false, isFK: true,  fkTo: "PACIENTE" },
                { name: "Matrícula",  isPK: false, isFK: true,  fkTo: "MÉDICO" }
            ]
        }
    ]
},

// ── Ejercicio 7: Institución educativa ───────────────────────────────────
{
    derivation: [
        { element: "MATERIA",          icon: "📋", rule: "Entidad → tabla",            note: "Tabla con PK: Código" },
        { element: "ALUMNO",           icon: "📋", rule: "Entidad → tabla (expandida)", note: "Dirección compuesto → Calle, Nro, Esquina. Edad derivado → excluido." },
        { element: "Teléfonos (mv.)",  icon: "📋", rule: "Atrib. multivaluado → tabla", note: "Tabla separada con FK → ALUMNO" },
        { element: "cursa (N:N)",      icon: "🔀", rule: "N:N → tabla intermedia",      note: "Nota es atributo propio de la relación" }
    ],
    tables: [
        {
            name: "MATERIA", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "Código",    isPK: true,  isFK: false },
                { name: "NombreMat", isPK: false, isFK: false },
                { name: "Año",       isPK: false, isFK: false }
            ]
        },
        {
            name: "ALUMNO", ruleLabel: "Entidad (compuesto expandido, derivado excluido)",
            ruleNote: "Dirección se expande en sus subatributos. Edad (derivado) no se incluye en el M-R.",
            fields: [
                { name: "Cédula",   isPK: true,  isFK: false },
                { name: "Nombre",   isPK: false, isFK: false },
                { name: "Calle",    isPK: false, isFK: false },
                { name: "Nro",      isPK: false, isFK: false },
                { name: "Esquina",  isPK: false, isFK: false },
                { name: "Fecha_nac",isPK: false, isFK: false }
            ]
        },
        {
            name: "Teléfonos", ruleLabel: "Attr. multivaluado",
            ruleNote: "Atributo multivaluado → tabla separada. PK compuesta: (Cédula + Teléfonos).",
            fields: [
                { name: "Cédula",    isPK: true, isFK: true,  fkTo: "ALUMNO" },
                { name: "Teléfonos", isPK: true, isFK: false }
            ]
        },
        {
            name: "cursa", ruleLabel: "Rel. N:N",
            ruleNote: "N:N → tabla intermedia. Nota es un atributo propio de la relación.",
            fields: [
                { name: "Código", isPK: true,  isFK: true,  fkTo: "MATERIA" },
                { name: "Cédula", isPK: true,  isFK: true,  fkTo: "ALUMNO" },
                { name: "Nota",   isPK: false, isFK: false }
            ]
        }
    ]
},

// ── Ejercicio 8: Colegio ──────────────────────────────────────────────────
{
    derivation: [
        { element: "PROFESOR",       icon: "📋", rule: "Entidad → tabla (derivado excluido)", note: "Grado (derivado) no se incluye en el M-R" },
        { element: "ASIGNATURA",     icon: "📋", rule: "Entidad → tabla",                     note: "Tabla con PK: Código" },
        { element: "ALUMNO",         icon: "📋", rule: "Entidad (compuesto + derivado)",       note: "NombreCom → Nom+Ape1+Ape2; Edad excluido; Antecedentes es multivaluado" },
        { element: "LIBRO",          icon: "📋", rule: "Entidad → tabla",                     note: "Tabla con PK: CódigoL" },
        { element: "Antecedentes",   icon: "📋", rule: "Atrib. multivaluado → tabla",         note: "Tabla separada con FK → ALUMNO" },
        { element: "dicta (N:N)",    icon: "🔀", rule: "N:N → tabla intermedia",              note: "Tabla: dicta" },
        { element: "cursa (N:N)",    icon: "🔀", rule: "N:N → tabla intermedia",              note: "Tabla: cursa" },
        { element: "publica (1:N)",  icon: "🔗", rule: "N:1 con totalidad → FK",              note: "Cada libro es publicado por un profesor → FK CédulaP en LIBRO" }
    ],
    tables: [
        {
            name: "PROFESOR", ruleLabel: "Entidad (derivado excluido)",
            ruleNote: "Grado es derivado → no se incluye en el modelo relacional.",
            fields: [
                { name: "CédulaP",    isPK: true,  isFK: false },
                { name: "Nombre",     isPK: false, isFK: false },
                { name: "TeléfonoP",  isPK: false, isFK: false },
                { name: "FechaNac",   isPK: false, isFK: false },
                { name: "AñoIngreso", isPK: false, isFK: false }
            ]
        },
        {
            name: "ASIGNATURA", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "Código",      isPK: true,  isFK: false },
                { name: "NombreAsisg", isPK: false, isFK: false }
            ]
        },
        {
            name: "ALUMNO", ruleLabel: "Entidad (compuesto + derivados excluidos)",
            ruleNote: "NombreCom se expande en Nom, Ape1, Ape2. Edad (derivado) se excluye.",
            fields: [
                { name: "CédulaA",  isPK: true,  isFK: false },
                { name: "Nom",      isPK: false, isFK: false },
                { name: "Ape1",     isPK: false, isFK: false },
                { name: "Ape2",     isPK: false, isFK: false },
                { name: "Teléfono", isPK: false, isFK: false },
                { name: "FechaNac", isPK: false, isFK: false }
            ]
        },
        {
            name: "LIBRO", ruleLabel: "Entidad + FK de publica",
            ruleNote: "N:1 con totalidad del lado N → FK CédulaP en LIBRO.",
            fields: [
                { name: "CódigoL",  isPK: true,  isFK: false },
                { name: "Titulo",   isPK: false, isFK: false },
                { name: "Tema",     isPK: false, isFK: false },
                { name: "Fecha",    isPK: false, isFK: false },
                { name: "CédulaP",  isPK: false, isFK: true,  fkTo: "PROFESOR" }
            ]
        },
        {
            name: "Antecedentes", ruleLabel: "Attr. multivaluado",
            ruleNote: "Atributo multivaluado → tabla separada con FK al ALUMNO.",
            fields: [
                { name: "CédulaA",      isPK: true, isFK: true,  fkTo: "ALUMNO" },
                { name: "Antecedentes", isPK: true, isFK: false }
            ]
        },
        {
            name: "dicta", ruleLabel: "Rel. N:N",
            ruleNote: "N:N → tabla intermedia con PK compuesta.",
            fields: [
                { name: "CédulaP", isPK: true, isFK: true, fkTo: "PROFESOR" },
                { name: "Código",  isPK: true, isFK: true, fkTo: "ASIGNATURA" }
            ]
        },
        {
            name: "cursa", ruleLabel: "Rel. N:N",
            ruleNote: "N:N → tabla intermedia con PK compuesta.",
            fields: [
                { name: "CédulaA", isPK: true, isFK: true, fkTo: "ALUMNO" },
                { name: "Código",  isPK: true, isFK: true, fkTo: "ASIGNATURA" }
            ]
        }
    ]
},

// ── Ejercicio 9: Película ─────────────────────────────────────────────────
{
    derivation: [
        { element: "CLIENTE",        icon: "📋", rule: "Entidad → tabla",         note: "Tabla con PK: CédulaC" },
        { element: "EJEMPLAR",       icon: "📋", rule: "Entidad débil → tabla",   note: "PK compuesta: Número + Título (FK → PELICULA)" },
        { element: "PELICULA",       icon: "📋", rule: "Entidad → tabla",         note: "Tabla con PK: Título" },
        { element: "DIRECTOR",       icon: "📋", rule: "Entidad → tabla",         note: "Tabla con PK: CédulaD" },
        { element: "ACTOR",          icon: "📋", rule: "Entidad → tabla",         note: "Tabla con PK: CédulaA" },
        { element: "tiene (1:N)",    icon: "🔗", rule: "Entidad débil → FK en entidad débil", note: "FK Título en EJEMPLAR (relación de identificación)" },
        { element: "dirige (N:1)",   icon: "🔗", rule: "N:1 con totalidad → FK",  note: "Cada película tiene un director → FK CédulaD en PELICULA" },
        { element: "alquila (N:N)",  icon: "🔀", rule: "N:N → tabla intermedia",  note: "Tabla: alquila con atributos de la relación" },
        { element: "participa (N:N)",icon: "🔀", rule: "N:N → tabla intermedia",  note: "Tabla: participa" }
    ],
    tables: [
        {
            name: "CLIENTE", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "CédulaC",  isPK: true,  isFK: false },
                { name: "NombreC",  isPK: false, isFK: false },
                { name: "Dirección",isPK: false, isFK: false },
                { name: "Teléfono", isPK: false, isFK: false }
            ]
        },
        {
            name: "PELICULA", ruleLabel: "Entidad + FK de dirige",
            ruleNote: "Cada película tiene un director (totalidad del lado N) → FK CédulaD en PELICULA.",
            fields: [
                { name: "Título",       isPK: true,  isFK: false },
                { name: "Productora",   isPK: false, isFK: false },
                { name: "Fecha",        isPK: false, isFK: false },
                { name: "NacionalidadP",isPK: false, isFK: false },
                { name: "CédulaD",      isPK: false, isFK: true,  fkTo: "DIRECTOR" }
            ]
        },
        {
            name: "EJEMPLAR", ruleLabel: "Entidad débil",
            ruleNote: "Entidad débil: PK compuesta incluye la clave de la entidad dominante.",
            fields: [
                { name: "Número", isPK: true,  isFK: false },
                { name: "Título", isPK: true,  isFK: true,  fkTo: "PELICULA" },
                { name: "Estado", isPK: false, isFK: false }
            ]
        },
        {
            name: "DIRECTOR", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "CédulaD",     isPK: true,  isFK: false },
                { name: "NombreD",     isPK: false, isFK: false },
                { name: "NacionalidadD",isPK: false, isFK: false }
            ]
        },
        {
            name: "ACTOR", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "CédulaA",      isPK: true,  isFK: false },
                { name: "Principal",    isPK: false, isFK: false },
                { name: "Sexo",         isPK: false, isFK: false },
                { name: "NacionalidadA",isPK: false, isFK: false },
                { name: "NombreA",      isPK: false, isFK: false }
            ]
        },
        {
            name: "alquila", ruleLabel: "Rel. N:N",
            ruleNote: "N:N → tabla intermedia. Atributos propios de la relación incluidos.",
            fields: [
                { name: "CédulaC",       isPK: true,  isFK: true,  fkTo: "CLIENTE" },
                { name: "Número",        isPK: true,  isFK: true,  fkTo: "EJEMPLAR" },
                { name: "FechaComienzo", isPK: false, isFK: false },
                { name: "FechaDevolución",isPK: false, isFK: false }
            ]
        },
        {
            name: "participa", ruleLabel: "Rel. N:N",
            ruleNote: "N:N → tabla intermedia con PK compuesta.",
            fields: [
                { name: "CédulaA", isPK: true, isFK: true, fkTo: "ACTOR" },
                { name: "Título",  isPK: true, isFK: true, fkTo: "PELICULA" }
            ]
        }
    ]
},

// ── Ejercicio 10: Fútbol ──────────────────────────────────────────────────
{
    derivation: [
        { element: "CLUB",           icon: "📋", rule: "Entidad → tabla",             note: "Tabla con PK: Nombre" },
        { element: "JUGADOR",        icon: "📋", rule: "Entidad → tabla",             note: "Tabla con PK: Ced" },
        { element: "juega_en (N:N)", icon: "🔀", rule: "N:N → tabla intermedia",      note: "Tabla: juega_en" },
        { element: "juega_con (N:N autorreferencial)", icon: "🔀", rule: "N:N autorelación → tabla con roles", note: "Los roles distinguen locatario/visitante. Ambas FK referencian a CLUB." }
    ],
    tables: [
        {
            name: "CLUB", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "Nombre",       isPK: true,  isFK: false },
                { name: "AñoFundación", isPK: false, isFK: false },
                { name: "Ubicación",    isPK: false, isFK: false },
                { name: "Entrenador",   isPK: false, isFK: false },
                { name: "Presidente",   isPK: false, isFK: false },
                { name: "Estadio",      isPK: false, isFK: false }
            ]
        },
        {
            name: "JUGADOR", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "Ced",          isPK: true,  isFK: false },
                { name: "Nacionalidad", isPK: false, isFK: false },
                { name: "Estatura",     isPK: false, isFK: false },
                { name: "Apodo",        isPK: false, isFK: false },
                { name: "Nombre",       isPK: false, isFK: false },
                { name: "FechaNac",     isPK: false, isFK: false }
            ]
        },
        {
            name: "juega_en", ruleLabel: "Rel. N:N",
            ruleNote: "N:N → tabla intermedia con PK compuesta.",
            fields: [
                { name: "Nombre", isPK: true, isFK: true, fkTo: "CLUB" },
                { name: "Ced",    isPK: true, isFK: true, fkTo: "JUGADOR" }
            ]
        },
        {
            name: "juega_con", ruleLabel: "Autorelación N:N",
            ruleNote: "Autorelación N:N: ambas FK referencian a la misma entidad. Los roles diferencian los campos.",
            fields: [
                { name: "Nombre_locatario", isPK: true,  isFK: true,  fkTo: "CLUB" },
                { name: "Nombre_visitante", isPK: true,  isFK: true,  fkTo: "CLUB" },
                { name: "Fecha",            isPK: false, isFK: false },
                { name: "Resultado",        isPK: false, isFK: false }
            ]
        }
    ]
},

// ── Ejercicio 11: Música ──────────────────────────────────────────────────
{
    derivation: [
        { element: "ARTISTA",       icon: "📋", rule: "Entidad → tabla",         note: "Tabla con PK: Nombre" },
        { element: "ALBUM",         icon: "📋", rule: "Entidad → tabla",         note: "Tabla con PK: TítuloA" },
        { element: "TEMA",          icon: "📋", rule: "Entidad → tabla",         note: "Tabla con PK: TítuloT" },
        { element: "contiene (1:N)",icon: "🔗", rule: "N:1 con totalidad → FK",  note: "Cada tema pertenece a un álbum → FK TítuloA en TEMA" },
        { element: "compone (N:N)", icon: "🔀", rule: "N:N → tabla intermedia",  note: "Tabla: compone" }
    ],
    tables: [
        {
            name: "ARTISTA", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "Nombre",       isPK: true,  isFK: false },
                { name: "Nacionalidad", isPK: false, isFK: false },
                { name: "Fotografía",   isPK: false, isFK: false }
            ]
        },
        {
            name: "ALBUM", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "TítuloA", isPK: true,  isFK: false },
                { name: "Género",  isPK: false, isFK: false }
            ]
        },
        {
            name: "TEMA", ruleLabel: "Entidad + FK de contiene",
            ruleNote: "N:1 con totalidad del lado N → FK TítuloA en TEMA.",
            fields: [
                { name: "TítuloT",  isPK: true,  isFK: false },
                { name: "Duración", isPK: false, isFK: false },
                { name: "TítuloA",  isPK: false, isFK: true, fkTo: "ALBUM" }
            ]
        },
        {
            name: "compone", ruleLabel: "Rel. N:N",
            ruleNote: "N:N → tabla intermedia con PK compuesta.",
            fields: [
                { name: "Nombre",  isPK: true, isFK: true, fkTo: "ARTISTA" },
                { name: "TítuloA", isPK: true, isFK: true, fkTo: "ALBUM" }
            ]
        }
    ]
},

// ── Ejercicio 12: Biblioteca2 ─────────────────────────────────────────────
{
    derivation: [
        { element: "SOCIO",          icon: "📋", rule: "Entidad → tabla (compuesto expandido)", note: "NomCompleto → Nom + Ape1 + Ape2" },
        { element: "LIBRO",          icon: "📋", rule: "Entidad → tabla",                       note: "Tabla con PK: Código" },
        { element: "Autor (mv.)",    icon: "📋", rule: "Atrib. multivaluado → tabla",           note: "Tabla separada con FK → LIBRO" },
        { element: "EJEMPLAR",       icon: "📋", rule: "Entidad débil → tabla",                 note: "PK compuesta: Número + Código (FK → LIBRO)" },
        { element: "prestar (N:N)",  icon: "🔀", rule: "N:N → tabla intermedia",                note: "Tabla con atributos de la relación" }
    ],
    tables: [
        {
            name: "SOCIO", ruleLabel: "Entidad (compuesto expandido)",
            ruleNote: "NomCompleto se expande en sus subatributos: Nom, Ape1, Ape2.",
            fields: [
                { name: "CI",        isPK: true,  isFK: false },
                { name: "Celular",   isPK: false, isFK: false },
                { name: "Nom",       isPK: false, isFK: false },
                { name: "Ape1",      isPK: false, isFK: false },
                { name: "Ape2",      isPK: false, isFK: false },
                { name: "Dirección", isPK: false, isFK: false }
            ]
        },
        {
            name: "LIBRO", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "Código", isPK: true,  isFK: false },
                { name: "Titulo", isPK: false, isFK: false },
                { name: "Año",    isPK: false, isFK: false }
            ]
        },
        {
            name: "Autor", ruleLabel: "Attr. multivaluado",
            ruleNote: "Atributo multivaluado → tabla separada. PK compuesta: (Código + Autor).",
            fields: [
                { name: "Código", isPK: true, isFK: true,  fkTo: "LIBRO" },
                { name: "Autor",  isPK: true, isFK: false }
            ]
        },
        {
            name: "EJEMPLAR", ruleLabel: "Entidad débil",
            ruleNote: "Entidad débil: PK compuesta incluye la clave de la entidad dominante (LIBRO).",
            fields: [
                { name: "Número", isPK: true,  isFK: false },
                { name: "Código", isPK: true,  isFK: true,  fkTo: "LIBRO" }
            ]
        },
        {
            name: "prestar", ruleLabel: "Rel. N:N",
            ruleNote: "N:N → tabla intermedia. PK referencia a SOCIO y al EJEMPLAR (que a su vez referencia a LIBRO).",
            fields: [
                { name: "CI",     isPK: true,  isFK: true,  fkTo: "SOCIO" },
                { name: "Número", isPK: true,  isFK: true,  fkTo: "EJEMPLAR" },
                { name: "Código", isPK: true,  isFK: true,  fkTo: "LIBRO" },
                { name: "FechaI", isPK: false, isFK: false },
                { name: "FechaF", isPK: false, isFK: false },
                { name: "FechaD", isPK: false, isFK: false }
            ]
        }
    ]
},

// ── Ejercicio 13: Almacén de Piezas ──────────────────────────────────────
{
    derivation: [
        { element: "PIEZA",               icon: "📋", rule: "Entidad → tabla",              note: "Tabla con PK: ID_Pieza" },
        { element: "ALMACÉN",             icon: "📋", rule: "Entidad → tabla",              note: "Tabla con PK: Nro" },
        { element: "ESTANTERÍA",          icon: "📋", rule: "Entidad débil → tabla",        note: "PK compuesta: ID_Est + Nro (FK → ALMACÉN)" },
        { element: "vende (N:N)",         icon: "🔀", rule: "N:N → tabla intermedia",       note: "Tabla: vende" },
        { element: "compuesta_por (N:N)", icon: "🔀", rule: "N:N autorelación → tabla",    note: "Ambas FK referencian PIEZA con roles distintos" }
    ],
    tables: [
        {
            name: "PIEZA", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "ID_Pieza",    isPK: true,  isFK: false },
                { name: "DescripciónP",isPK: false, isFK: false },
                { name: "Precio",      isPK: false, isFK: false }
            ]
        },
        {
            name: "ALMACÉN", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "Nro",         isPK: true,  isFK: false },
                { name: "DescripciónA",isPK: false, isFK: false },
                { name: "Dirección",   isPK: false, isFK: false }
            ]
        },
        {
            name: "ESTANTERÍA", ruleLabel: "Entidad débil",
            ruleNote: "Entidad débil: su existencia depende del almacén al que pertenece.",
            fields: [
                { name: "ID_Est", isPK: true, isFK: false },
                { name: "Nro",    isPK: true, isFK: true, fkTo: "ALMACÉN" }
            ]
        },
        {
            name: "vende", ruleLabel: "Rel. N:N",
            ruleNote: "N:N → tabla intermedia con PK compuesta.",
            fields: [
                { name: "ID_Pieza", isPK: true, isFK: true, fkTo: "PIEZA" },
                { name: "Nro",      isPK: true, isFK: true, fkTo: "ALMACÉN" }
            ]
        },
        {
            name: "compuesta_por", ruleLabel: "Autorelación N:N",
            ruleNote: "Autorelación N:N: ambas FK referencian a PIEZA pero con roles distintos (componente / compuesto).",
            fields: [
                { name: "ID_Pieza_componente", isPK: true, isFK: true, fkTo: "PIEZA" },
                { name: "ID_Pieza_compuesto",  isPK: true, isFK: true, fkTo: "PIEZA" }
            ]
        }
    ]
},

// ── Ejercicio 14: Instituto ───────────────────────────────────────────────
{
    derivation: [
        { element: "DOCENTE",         icon: "📋", rule: "Entidad → tabla",          note: "Tabla con PK: CI_Doc" },
        { element: "DIRECTOR",        icon: "📋", rule: "Entidad → tabla",          note: "Tabla con PK: CI_Dir" },
        { element: "CURSO",           icon: "📋", rule: "Entidad → tabla",          note: "Tabla con PK: Código" },
        { element: "dicta (N:1)",     icon: "🔗", rule: "N:1 con totalidad → FK",   note: "Cada curso es dictado por un docente → FK CI_Doc en CURSO" },
        { element: "supervisa (agr.)",icon: "🔗", rule: "Agregación N:1 totalidad → FK", note: "El director supervisa el dictado de cursos → FK CI_Dir en CURSO (la agregación se trata como entidad)" }
    ],
    tables: [
        {
            name: "DOCENTE", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "CI_Doc",     isPK: true,  isFK: false },
                { name: "Nom_Docente",isPK: false, isFK: false }
            ]
        },
        {
            name: "DIRECTOR", ruleLabel: "Entidad",
            ruleNote: "Cada entidad se transforma en una tabla.",
            fields: [
                { name: "CI_Dir",      isPK: true,  isFK: false },
                { name: "Nom_Director",isPK: false, isFK: false },
                { name: "Teléfono",    isPK: false, isFK: false }
            ]
        },
        {
            name: "CURSO", ruleLabel: "Entidad + FKs de dicta y supervisa",
            ruleNote: "N:1 con totalidad (dicta) → FK CI_Doc. Agregación N:1 (supervisa) → FK CI_Dir. Ambas se incorporan en CURSO.",
            fields: [
                { name: "Código",    isPK: true,  isFK: false },
                { name: "Nom_Curso", isPK: false, isFK: false },
                { name: "CI_Doc",    isPK: false, isFK: true,  fkTo: "DOCENTE" },
                { name: "CI_Dir",    isPK: false, isFK: true,  fkTo: "DIRECTOR" }
            ]
        }
    ]
}

]; // fin tablesData
