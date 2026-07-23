// tablesData.js — Datos de "Pasaje a tablas" para DB-Lab
// Cada ejercicio tiene: entityTables[], relations[]
// ruleId: 'nn' | '1n_total' | '1n_sintot' | 'auto_nn' | 'agg_total'
// Licencia CC BY-SA 4.0 — Prof. Elizabeth Izquierdo con asistencia de Claude

const tablesData = [

// ─────────────────────────────────────────────────────────────────────────────
// EX 0 — Taller Mecánico
// ─────────────────────────────────────────────────────────────────────────────
{
    title: "🔧 Taller Mecánico",
    entityTables: [
        {
            name: "CLIENTE",
            fields: [
                { name: "CI",        isPK: true  },
                { name: "Nombre",    isPK: false },
                { name: "Apellido",  isPK: false }
            ]
        },
        {
            name: "AUTO",
            fields: [
                { name: "Matrícula",   isPK: true  },
                { name: "Marca",       isPK: false },
                { name: "Modelo",      isPK: false },
                { name: "Combustible", isPK: false }
            ]
        },
        {
            name: "REPARACIÓN",
            fields: [
                { name: "Código",      isPK: true  },
                { name: "Descripción", isPK: false }
            ]
        }
    ],
    relations: [
        {
            name: "tiene",
            ruleId: "1n_sintot",
            cardHint: "CLIENTE 1:N AUTO (sin totalidad del lado N)",
            ruleHint: "Sin totalidad → nueva tabla. PK = clave del lado N (AUTO → Matrícula).",
            generatesTable: true,
            tableName: "tiene",
            tableNote: "PK = Matrícula (clave de AUTO, lado N). CI es FK hacia CLIENTE.",
            tableFields: [
                { name: "Matrícula", isPK: true,  isFK: true, fkTo: "AUTO"    },
                { name: "CI",        isPK: false, isFK: true, fkTo: "CLIENTE" }
            ]
        },
        {
            name: "recibe",
            ruleId: "nn",
            cardHint: "AUTO N:N REPARACIÓN",
            ruleHint: "N:N → siempre tabla intermedia con PK compuesta de ambas claves.",
            generatesTable: true,
            tableName: "recibe",
            tableNote: "PK compuesta: Matrícula + Código. Los atributos de relación van aquí.",
            tableFields: [
                { name: "Matrícula",    isPK: true,  isFK: true, fkTo: "AUTO"       },
                { name: "Código",       isPK: true,  isFK: true, fkTo: "REPARACIÓN" },
                { name: "Fecha_entrada",isPK: false },
                { name: "Observación",  isPK: false }
            ]
        }
    ]
},

// ─────────────────────────────────────────────────────────────────────────────
// EX 1 — Biblioteca Escolar
// ─────────────────────────────────────────────────────────────────────────────
{
    title: "📚 Biblioteca Escolar",
    entityTables: [
        {
            name: "SOCIO",
            fields: [
                { name: "Id_socio",  isPK: true  },
                { name: "Nombre",    isPK: false },
                { name: "Teléfono",  isPK: false }
            ]
        },
        {
            name: "LIBRO",
            fields: [
                { name: "Isbn",   isPK: true  },
                { name: "Título", isPK: false },
                { name: "Autor",  isPK: false }
            ]
        }
    ],
    relations: [
        {
            name: "préstamo",
            ruleId: "nn",
            cardHint: "SOCIO N:N LIBRO",
            ruleHint: "N:N → tabla intermedia. Los atributos de la relación también van en ella.",
            generatesTable: true,
            tableName: "préstamo",
            tableNote: "PK compuesta: Id_socio + Isbn. Fecha_prestamo y Devuelto son atributos de la relación.",
            tableFields: [
                { name: "Id_socio",      isPK: true,  isFK: true, fkTo: "SOCIO" },
                { name: "Isbn",          isPK: true,  isFK: true, fkTo: "LIBRO" },
                { name: "Fecha_prestamo",isPK: false },
                { name: "Devuelto",      isPK: false }
            ]
        }
    ]
},

// ─────────────────────────────────────────────────────────────────────────────
// EX 2 — Tienda Online  ← CORREGIDO: realiza → 1n_sintot (sin totalidad)
// ─────────────────────────────────────────────────────────────────────────────
{
    title: "🛒 Tienda Online",
    entityTables: [
        {
            name: "CLIENTE",
            fields: [
                { name: "Id_cliente", isPK: true  },
                { name: "Nombre",     isPK: false },
                { name: "Email",      isPK: false }
            ]
        },
        {
            name: "PEDIDO",
            fields: [
                { name: "Nro_pedido",  isPK: true  },
                { name: "Fecha_pedido",isPK: false },
                { name: "Total",       isPK: false }
            ]
        }
    ],
    relations: [
        {
            name: "realiza",
            ruleId: "1n_sintot",
            cardHint: "CLIENTE 1:N PEDIDO (sin totalidad del lado 1)",
            ruleHint: "En el MER no hay doble línea de totalidad → nueva tabla. PK = Nro_pedido (lado N).",
            generatesTable: true,
            tableName: "realiza",
            tableNote: "PK = Nro_pedido (clave de PEDIDO, lado N). Id_cliente es FK hacia CLIENTE.",
            tableFields: [
                { name: "Nro_pedido", isPK: true,  isFK: true, fkTo: "PEDIDO"  },
                { name: "Id_cliente", isPK: false, isFK: true, fkTo: "CLIENTE" }
            ]
        }
    ]
},

// ─────────────────────────────────────────────────────────────────────────────
// EX 3 — Red Social (ISA)
// ─────────────────────────────────────────────────────────────────────────────
{
    title: "🌐 Red Social",
    entityTables: [
        {
            name: "USUARIO",
            fields: [
                { name: "Id_usuario",  isPK: true  },
                { name: "Email",       isPK: false },
                { name: "Año_ingreso", isPK: false }
            ]
        },
        {
            name: "CREADOR",
            note: "Hereda Id_usuario de USUARIO (especialización ISA). Id_usuario es PK y FK.",
            fields: [
                { name: "Id_usuario",     isPK: true,  isFK: true, fkTo: "USUARIO" },
                { name: "Cant_seguidores",isPK: false }
            ]
        },
        {
            name: "ESPECTADOR",
            note: "Hereda Id_usuario de USUARIO (especialización ISA). Id_usuario es PK y FK.",
            fields: [
                { name: "Id_usuario", isPK: true,  isFK: true, fkTo: "USUARIO" },
                { name: "Ciudad",     isPK: false }
            ]
        },
        {
            name: "CONTENIDO",
            fields: [
                { name: "Nro_contenido", isPK: true  },
                { name: "Título",        isPK: false },
                { name: "Fecha",         isPK: false }
            ]
        }
    ],
    relations: [
        {
            name: "publica",
            ruleId: "1n_total",
            cardHint: "USUARIO 1:N CONTENIDO (con totalidad del lado N)",
            ruleHint: "Totalidad del lado N (todo CONTENIDO pertenece a un USUARIO) → FK en CONTENIDO.",
            generatesTable: false,
            fkPlacement: {
                targetTable: "CONTENIDO",
                reason: "Todo contenido pertenece obligatoriamente a un usuario → FK en la tabla del lado N.",
                fkFields: [
                    { name: "Id_usuario", isFK: true, fkTo: "USUARIO" }
                ]
            }
        }
    ]
},

// ─────────────────────────────────────────────────────────────────────────────
// EX 4 — Plataforma Streaming
// ─────────────────────────────────────────────────────────────────────────────
{
    title: "🎬 Plataforma Streaming",
    entityTables: [
        {
            name: "SOCIO",
            fields: [
                { name: "Cod_socio",       isPK: true  },
                { name: "Nombre_completo", isPK: false },
                { name: "Directores_fav",  isPK: false }
            ]
        },
        {
            name: "PELÍCULA",
            fields: [
                { name: "Cod_pelicula", isPK: true  },
                { name: "Titulo",       isPK: false },
                { name: "Año",          isPK: false }
            ]
        },
        {
            name: "ARCHIVADOR",
            fields: [
                { name: "Nro_arch",  isPK: true  },
                { name: "Ubicacion", isPK: false }
            ]
        }
    ],
    relations: [
        {
            name: "alquila",
            ruleId: "nn",
            cardHint: "SOCIO N:N PELÍCULA",
            ruleHint: "N:N → tabla intermedia. Los atributos de la relación (Fecha, Devuelto) van aquí.",
            generatesTable: true,
            tableName: "alquila",
            tableNote: "PK compuesta: Cod_socio + Cod_pelicula. Se agregan los atributos de la relación.",
            tableFields: [
                { name: "Cod_socio",    isPK: true,  isFK: true, fkTo: "SOCIO"    },
                { name: "Cod_pelicula", isPK: true,  isFK: true, fkTo: "PELÍCULA" },
                { name: "Fecha",        isPK: false },
                { name: "Devuelto",     isPK: false }
            ]
        },
        {
            name: "guarda",
            ruleId: "1n_total",
            cardHint: "ARCHIVADOR 1:N PELÍCULA (con totalidad del lado N)",
            ruleHint: "Totalidad (cada película está en un archivador) → FK en la tabla del lado N (PELÍCULA).",
            generatesTable: false,
            fkPlacement: {
                targetTable: "PELÍCULA",
                reason: "Cada película pertenece obligatoriamente a un archivador → FK en PELÍCULA.",
                fkFields: [
                    { name: "Nro_arch", isFK: true, fkTo: "ARCHIVADOR" }
                ]
            }
        }
    ]
},

// ─────────────────────────────────────────────────────────────────────────────
// EX 5 — Sistema Hospitalario
// ─────────────────────────────────────────────────────────────────────────────
{
    title: "🏥 Sistema Hospitalario",
    entityTables: [
        {
            name: "PACIENTE",
            fields: [
                { name: "Cédula",    isPK: true  },
                { name: "NombreP",   isPK: false },
                { name: "Teléfono",  isPK: false }
            ]
        },
        {
            name: "MÉDICO",
            fields: [
                { name: "Matrícula",   isPK: true  },
                { name: "NombreM",     isPK: false },
                { name: "Especialidad",isPK: false }
            ]
        },
        {
            name: "CONSULTA",
            fields: [
                { name: "Número",      isPK: true  },
                { name: "Fecha",       isPK: false },
                { name: "Diagnóstico", isPK: false }
            ]
        }
    ],
    relations: [
        {
            name: "realiza",
            ruleId: "1n_total",
            cardHint: "PACIENTE 1:N CONSULTA (con totalidad del lado N)",
            ruleHint: "Toda consulta pertenece a un paciente (totalidad) → FK en CONSULTA.",
            generatesTable: false,
            fkPlacement: {
                targetTable: "CONSULTA",
                reason: "Cada consulta pertenece obligatoriamente a un paciente → FK en CONSULTA.",
                fkFields: [
                    { name: "Cédula", isFK: true, fkTo: "PACIENTE" }
                ]
            }
        },
        {
            name: "atiende",
            ruleId: "1n_total",
            cardHint: "MÉDICO 1:N CONSULTA (con totalidad del lado N)",
            ruleHint: "Toda consulta es atendida por un médico (totalidad) → FK en CONSULTA.",
            generatesTable: false,
            fkPlacement: {
                targetTable: "CONSULTA",
                reason: "Cada consulta tiene un médico obligatoriamente → FK en CONSULTA.",
                fkFields: [
                    { name: "Matrícula", isFK: true, fkTo: "MÉDICO" }
                ]
            }
        }
    ]
},

// ─────────────────────────────────────────────────────────────────────────────
// EX 6 — Institución Educativa
// ─────────────────────────────────────────────────────────────────────────────
{
    title: "🏫 Institución Educativa",
    entityTables: [
        {
            name: "MATERIA",
            fields: [
                { name: "Código",    isPK: true  },
                { name: "NombreMat", isPK: false },
                { name: "Año",       isPK: false }
            ]
        },
        {
            name: "ALUMNO",
            fields: [
                { name: "Cédula",    isPK: true  },
                { name: "Nombre",    isPK: false },
                { name: "Dirección", isPK: false },
                { name: "Fecha_nac", isPK: false }
            ]
        }
    ],
    relations: [
        {
            name: "cursa",
            ruleId: "nn",
            cardHint: "ALUMNO N:N MATERIA",
            ruleHint: "N:N → tabla intermedia. El atributo Nota va en la tabla de la relación.",
            generatesTable: true,
            tableName: "cursa",
            tableNote: "PK compuesta: Cédula + Código. La Nota es un atributo de la relación.",
            tableFields: [
                { name: "Cédula", isPK: true,  isFK: true, fkTo: "ALUMNO"  },
                { name: "Código", isPK: true,  isFK: true, fkTo: "MATERIA" },
                { name: "Nota",   isPK: false }
            ]
        }
    ]
},

// ─────────────────────────────────────────────────────────────────────────────
// EX 7 — Colegio
// ─────────────────────────────────────────────────────────────────────────────
{
    title: "🏫 Colegio",
    entityTables: [
        {
            name: "PROFESOR",
            fields: [
                { name: "CédulaP",    isPK: true  },
                { name: "Nombre",     isPK: false },
                { name: "TeléfonoP",  isPK: false },
                { name: "FechaNac",   isPK: false },
                { name: "AñoIngreso", isPK: false }
            ]
        },
        {
            name: "ASIGNATURA",
            fields: [
                { name: "Código",      isPK: true  },
                { name: "NombreAsig",  isPK: false }
            ]
        },
        {
            name: "ALUMNO",
            fields: [
                { name: "CédulaA",  isPK: true  },
                { name: "NombreCom",isPK: false },
                { name: "Teléfono", isPK: false },
                { name: "FechaNac", isPK: false }
            ]
        },
        {
            name: "LIBRO",
            fields: [
                { name: "CódigoL", isPK: true  },
                { name: "Titulo",  isPK: false },
                { name: "Tema",    isPK: false },
                { name: "Fecha",   isPK: false }
            ]
        }
    ],
    relations: [
        {
            name: "dicta",
            ruleId: "nn",
            cardHint: "PROFESOR N:N ASIGNATURA",
            ruleHint: "N:N → tabla intermedia con PK compuesta.",
            generatesTable: true,
            tableName: "dicta",
            tableNote: "PK compuesta: CédulaP + Código.",
            tableFields: [
                { name: "CédulaP", isPK: true, isFK: true, fkTo: "PROFESOR"   },
                { name: "Código",  isPK: true, isFK: true, fkTo: "ASIGNATURA" }
            ]
        },
        {
            name: "cursa",
            ruleId: "nn",
            cardHint: "ALUMNO N:N ASIGNATURA",
            ruleHint: "N:N → tabla intermedia con PK compuesta.",
            generatesTable: true,
            tableName: "cursa",
            tableNote: "PK compuesta: CédulaA + Código.",
            tableFields: [
                { name: "CédulaA", isPK: true, isFK: true, fkTo: "ALUMNO"     },
                { name: "Código",  isPK: true, isFK: true, fkTo: "ASIGNATURA" }
            ]
        },
        {
            name: "publica",
            ruleId: "1n_total",
            cardHint: "PROFESOR 1:N LIBRO (con totalidad del lado N)",
            ruleHint: "Todo libro es publicado por un profesor (totalidad) → FK en LIBRO.",
            generatesTable: false,
            fkPlacement: {
                targetTable: "LIBRO",
                reason: "Cada libro pertenece obligatoriamente a un profesor → FK en LIBRO.",
                fkFields: [
                    { name: "CédulaP", isFK: true, fkTo: "PROFESOR" }
                ]
            }
        }
    ]
},

// ─────────────────────────────────────────────────────────────────────────────
// EX 8 — Videoclub / Película
// ─────────────────────────────────────────────────────────────────────────────
{
    title: "🎬 Videoclub",
    entityTables: [
        {
            name: "CLIENTE",
            fields: [
                { name: "CédulaC",  isPK: true  },
                { name: "NombreC",  isPK: false },
                { name: "Dirección",isPK: false },
                { name: "Teléfono", isPK: false }
            ]
        },
        {
            name: "PELICULA",
            fields: [
                { name: "Título",      isPK: true  },
                { name: "Productora",  isPK: false },
                { name: "Fecha",       isPK: false },
                { name: "Nacionalidad",isPK: false }
            ]
        },
        {
            name: "EJEMPLAR",
            note: "Entidad débil de PELICULA. Título es FK hacia PELICULA.",
            fields: [
                { name: "Título",  isPK: true,  isFK: true, fkTo: "PELICULA" },
                { name: "Número",  isPK: true  },
                { name: "Estado",  isPK: false }
            ]
        },
        {
            name: "DIRECTOR",
            fields: [
                { name: "CédulaD",    isPK: true  },
                { name: "NombreD",    isPK: false },
                { name: "NacionalidadD",isPK: false }
            ]
        },
        {
            name: "ACTOR",
            fields: [
                { name: "CédulaA",    isPK: true  },
                { name: "NombreA",    isPK: false },
                { name: "Sexo",       isPK: false },
                { name: "NacionalidadA",isPK: false }
            ]
        }
    ],
    relations: [
        {
            name: "dirige",
            ruleId: "1n_total",
            cardHint: "DIRECTOR 1:N PELICULA (con totalidad del lado N)",
            ruleHint: "Toda película es dirigida por un director (totalidad) → FK en PELICULA.",
            generatesTable: false,
            fkPlacement: {
                targetTable: "PELICULA",
                reason: "Cada película tiene un director obligatoriamente → FK en PELICULA.",
                fkFields: [
                    { name: "CédulaD", isFK: true, fkTo: "DIRECTOR" }
                ]
            }
        },
        {
            name: "alquila",
            ruleId: "nn",
            cardHint: "CLIENTE N:N EJEMPLAR",
            ruleHint: "N:N → tabla intermedia con PK compuesta.",
            generatesTable: true,
            tableName: "alquila",
            tableNote: "PK compuesta: CédulaC + Número (del EJEMPLAR).",
            tableFields: [
                { name: "CédulaC", isPK: true, isFK: true, fkTo: "CLIENTE"  },
                { name: "Número",  isPK: true, isFK: true, fkTo: "EJEMPLAR" }
            ]
        },
        {
            name: "participa",
            ruleId: "nn",
            cardHint: "ACTOR N:N PELICULA",
            ruleHint: "N:N → tabla intermedia con PK compuesta.",
            generatesTable: true,
            tableName: "participa",
            tableNote: "PK compuesta: CédulaA + Título.",
            tableFields: [
                { name: "CédulaA", isPK: true, isFK: true, fkTo: "ACTOR"    },
                { name: "Título",  isPK: true, isFK: true, fkTo: "PELICULA" }
            ]
        }
    ]
},

// ─────────────────────────────────────────────────────────────────────────────
// EX 9 — Fútbol (autorelación)
// ─────────────────────────────────────────────────────────────────────────────
{
    title: "⚽ Fútbol",
    entityTables: [
        {
            name: "CLUB",
            fields: [
                { name: "Nombre",      isPK: true  },
                { name: "AñoFundación",isPK: false },
                { name: "Ubicación",   isPK: false },
                { name: "Entrenador",  isPK: false },
                { name: "Presidente",  isPK: false },
                { name: "Estadio",     isPK: false }
            ]
        },
        {
            name: "JUGADOR",
            fields: [
                { name: "Ced",        isPK: true  },
                { name: "Nombre",     isPK: false },
                { name: "Apodo",      isPK: false },
                { name: "Estatura",   isPK: false },
                { name: "Nacionalidad",isPK: false },
                { name: "FechaNac",   isPK: false }
            ]
        }
    ],
    relations: [
        {
            name: "juega_en",
            ruleId: "nn",
            cardHint: "JUGADOR N:N CLUB",
            ruleHint: "N:N → tabla intermedia con PK compuesta.",
            generatesTable: true,
            tableName: "juega_en",
            tableNote: "PK compuesta: Ced (JUGADOR) + Nombre (CLUB).",
            tableFields: [
                { name: "Ced",    isPK: true, isFK: true, fkTo: "JUGADOR" },
                { name: "Nombre", isPK: true, isFK: true, fkTo: "CLUB"    }
            ]
        },
        {
            name: "juega_con",
            ruleId: "auto_nn",
            cardHint: "CLUB N:N CLUB (autorelación)",
            ruleHint: "Autorelación N:N → tabla con dos FKs a la misma entidad, con roles distintos.",
            generatesTable: true,
            tableName: "juega_con",
            tableNote: "Dos roles para CLUB: NombreLocal (equipo de casa) y NombreVisitante (equipo rival). Ambos FK→CLUB.",
            tableFields: [
                { name: "NombreLocal",     isPK: true, isFK: true, fkTo: "CLUB", fkRefField: "Nombre" },
                { name: "NombreVisitante", isPK: true, isFK: true, fkTo: "CLUB", fkRefField: "Nombre" }
            ]
        }
    ]
},

// ─────────────────────────────────────────────────────────────────────────────
// EX 10 — Música
// ─────────────────────────────────────────────────────────────────────────────
{
    title: "🎵 Música",
    entityTables: [
        {
            name: "ARTISTA",
            fields: [
                { name: "Nombre",      isPK: true  },
                { name: "Nacionalidad",isPK: false },
                { name: "Fotografía",  isPK: false }
            ]
        },
        {
            name: "ALBUM",
            fields: [
                { name: "TítuloA", isPK: true  },
                { name: "Género",  isPK: false }
            ]
        },
        {
            name: "TEMA",
            fields: [
                { name: "TítuloT",  isPK: true  },
                { name: "Duración", isPK: false }
            ]
        }
    ],
    relations: [
        {
            name: "contiene",
            ruleId: "1n_total",
            cardHint: "ALBUM 1:N TEMA (con totalidad del lado N)",
            ruleHint: "Todo tema pertenece a un álbum (totalidad) → FK en TEMA.",
            generatesTable: false,
            fkPlacement: {
                targetTable: "TEMA",
                reason: "Cada tema pertenece obligatoriamente a un álbum → FK en TEMA.",
                fkFields: [
                    { name: "TítuloA", isFK: true, fkTo: "ALBUM" }
                ]
            }
        },
        {
            name: "compone",
            ruleId: "nn",
            cardHint: "ARTISTA N:N ALBUM",
            ruleHint: "N:N → tabla intermedia con PK compuesta.",
            generatesTable: true,
            tableName: "compone",
            tableNote: "PK compuesta: Nombre (ARTISTA) + TítuloA (ALBUM).",
            tableFields: [
                { name: "Nombre",  isPK: true, isFK: true, fkTo: "ARTISTA" },
                { name: "TítuloA", isPK: true, isFK: true, fkTo: "ALBUM"   }
            ]
        }
    ]
},

// ─────────────────────────────────────────────────────────────────────────────
// EX 11 — Biblioteca 2 (entidad débil EJEMPLAR)
// ─────────────────────────────────────────────────────────────────────────────
{
    title: "📖 Biblioteca 2",
    entityTables: [
        {
            name: "SOCIO",
            fields: [
                { name: "CI",         isPK: true  },
                { name: "Celular",    isPK: false },
                { name: "NomCompleto",isPK: false },
                { name: "Dirección",  isPK: false }
            ]
        },
        {
            name: "LIBRO",
            fields: [
                { name: "Código", isPK: true  },
                { name: "Titulo", isPK: false },
                { name: "Año",    isPK: false }
            ]
        },
        {
            name: "EJEMPLAR",
            note: "Entidad débil de LIBRO. La clave es compuesta: Código (FK→LIBRO) + Número.",
            fields: [
                { name: "Código", isPK: true, isFK: true, fkTo: "LIBRO" },
                { name: "Número", isPK: true }
            ]
        }
    ],
    relations: [
        {
            name: "prestar",
            ruleId: "nn",
            cardHint: "SOCIO N:N EJEMPLAR",
            ruleHint: "N:N → tabla intermedia. Como EJEMPLAR tiene clave compuesta, la PK incluye todos sus campos identificadores.",
            generatesTable: true,
            tableName: "prestar",
            tableNote: "PK incluye CI (SOCIO) + Código + Número (EJEMPLAR). La clave del ejemplar es compuesta.",
            tableFields: [
                { name: "CI",     isPK: true, isFK: true, fkTo: "SOCIO"    },
                { name: "Código", isPK: true, isFK: true, fkTo: "LIBRO"    },
                { name: "Número", isPK: true, isFK: true, fkTo: "EJEMPLAR" }
            ]
        }
    ]
},

// ─────────────────────────────────────────────────────────────────────────────
// EX 12 — Almacén de Piezas (autorelación + entidad débil)
// ─────────────────────────────────────────────────────────────────────────────
{
    title: "🔩 Almacén de Piezas",
    entityTables: [
        {
            name: "PIEZA",
            fields: [
                { name: "ID_Pieza",   isPK: true  },
                { name: "DescripciónP",isPK: false },
                { name: "Precio",     isPK: false }
            ]
        },
        {
            name: "ALMACÉN",
            fields: [
                { name: "Nro",        isPK: true  },
                { name: "DescripciónA",isPK: false },
                { name: "Dirección",  isPK: false }
            ]
        },
        {
            name: "ESTANTERÍA",
            note: "Entidad débil de ALMACÉN. La clave es compuesta: Nro (FK→ALMACÉN) + ID_Est.",
            fields: [
                { name: "Nro",    isPK: true, isFK: true, fkTo: "ALMACÉN" },
                { name: "ID_Est", isPK: true }
            ]
        }
    ],
    relations: [
        {
            name: "vende",
            ruleId: "nn",
            cardHint: "ALMACÉN N:N PIEZA",
            ruleHint: "N:N → tabla intermedia con PK compuesta.",
            generatesTable: true,
            tableName: "vende",
            tableNote: "PK compuesta: Nro (ALMACÉN) + ID_Pieza (PIEZA).",
            tableFields: [
                { name: "Nro",      isPK: true, isFK: true, fkTo: "ALMACÉN" },
                { name: "ID_Pieza", isPK: true, isFK: true, fkTo: "PIEZA"   }
            ]
        },
        {
            name: "compuesta_por",
            ruleId: "auto_nn",
            cardHint: "PIEZA N:N PIEZA (autorelación)",
            ruleHint: "Autorelación N:N → tabla con dos FKs a la misma entidad, con roles distintos.",
            generatesTable: true,
            tableName: "compuesta_por",
            tableNote: "Dos roles: ID_Pieza_comp (la pieza ensamblada) e ID_Pieza_componente (la pieza que la forma). Ambos FK→PIEZA.",
            tableFields: [
                { name: "ID_Pieza_comp",       isPK: true, isFK: true, fkTo: "PIEZA", fkRefField: "ID_Pieza" },
                { name: "ID_Pieza_componente", isPK: true, isFK: true, fkTo: "PIEZA", fkRefField: "ID_Pieza" }
            ]
        }
    ]
},

// ─────────────────────────────────────────────────────────────────────────────
// EX 13 — Instituto (agregación)
// ─────────────────────────────────────────────────────────────────────────────
{
    title: "🏫 Instituto",
    entityTables: [
        {
            name: "CURSO",
            fields: [
                { name: "Código",    isPK: true  },
                { name: "Nom_Curso", isPK: false }
            ]
        },
        {
            name: "DOCENTE",
            fields: [
                { name: "CI_Doc",     isPK: true  },
                { name: "Nom_Docente",isPK: false }
            ]
        },
        {
            name: "DIRECTOR",
            fields: [
                { name: "CI_Dir",      isPK: true  },
                { name: "Nom_Director",isPK: false },
                { name: "Teléfono",    isPK: false }
            ]
        }
    ],
    relations: [
        {
            name: "dicta",
            ruleId: "agg_total",
            cardHint: "DOCENTE 1:N CURSO — agrega la relación (totalidad)",
            ruleHint: "Agregación con totalidad: el lado N (CURSO) recibe la FK del lado 1 (DOCENTE).",
            generatesTable: false,
            fkPlacement: {
                targetTable: "CURSO",
                reason: "Todo curso es dictado por un docente → FK del DOCENTE en CURSO.",
                fkFields: [
                    { name: "CI_Doc", isFK: true, fkTo: "DOCENTE" }
                ]
            }
        },
        {
            name: "supervisa",
            ruleId: "1n_total",
            cardHint: "DIRECTOR supervisa el dictado de CURSO (totalidad)",
            ruleHint: "Todo curso es supervisado por un director (totalidad) → FK en CURSO.",
            generatesTable: false,
            fkPlacement: {
                targetTable: "CURSO",
                reason: "Cada curso tiene un director supervisor → FK del DIRECTOR en CURSO.",
                fkFields: [
                    { name: "CI_Dir", isFK: true, fkTo: "DIRECTOR" }
                ]
            }
        }
    ]
}

]; // fin tablesData
