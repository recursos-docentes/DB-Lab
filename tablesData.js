// tablesData.js — Datos para el tab "Pasaje a Tablas" (v2 — flujo guiado)
// Estructura por ejercicio:
//   entityTables[]  — tablas que derivan de entidades (incl. débiles, ISA, multivaluados)
//   relations[]     — relaciones binarias del MER con decisión genera/no genera tabla
//
// Convenciones de campos:
//   isPK        → clave primaria (se muestra subrayada en notación relacional)
//   isFK        → clave foránea
//   fkTo        → tabla referenciada
//   fkRefField  → campo PK referenciado (solo si difiere del nombre del campo FK)
//
// Diseñada por Prof. Elizabeth Izquierdo con asistencia de Claude — CC BY-SA 4.0

const tablesData = [

// ── Ejercicio 1: Taller Mecánico ──────────────────────────────────────────
{
    entityTables: [
        {
            name: "CLIENTE", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "CI",       isPK: true  },
                { name: "Nombre",   isPK: false },
                { name: "Apellido", isPK: false }
            ]
        },
        {
            name: "AUTO", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "Matrícula",   isPK: true  },
                { name: "Marca",       isPK: false },
                { name: "Modelo",      isPK: false },
                { name: "Combustible", isPK: false }
            ]
        },
        {
            name: "REPARACIÓN", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "Código",      isPK: true  },
                { name: "Descripción", isPK: false }
            ]
        }
    ],
    relations: [
        {
            name: "tiene",
            cardHint: "CLIENTE 1:N AUTO (sin totalidad)",
            ruleHint: "Sin totalidad del lado 1 → nueva tabla con PK = clave del lado N",
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
            cardHint: "AUTO N:N REPARACIÓN",
            ruleHint: "N:N → siempre genera tabla intermedia con PK compuesta",
            generatesTable: true,
            tableName: "recibe",
            tableNote: "PK compuesta: Matrícula (FK→AUTO) + Código (FK→REPARACIÓN). Incluye atributos de la relación.",
            tableFields: [
                { name: "Matrícula",     isPK: true,  isFK: true,  fkTo: "AUTO"       },
                { name: "Código",        isPK: true,  isFK: true,  fkTo: "REPARACIÓN" },
                { name: "Fecha_entrada", isPK: false, isFK: false },
                { name: "Observación",   isPK: false, isFK: false }
            ]
        }
    ]
},

// ── Ejercicio 2: Biblioteca Escolar ──────────────────────────────────────
{
    entityTables: [
        {
            name: "SOCIO", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "Id_socio", isPK: true  },
                { name: "Nombre",   isPK: false },
                { name: "Teléfono", isPK: false }
            ]
        },
        {
            name: "LIBRO", sourceType: "entity",
            note: "Entidad fuerte",
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
            cardHint: "SOCIO N:N LIBRO",
            ruleHint: "N:N → siempre genera tabla intermedia",
            generatesTable: true,
            tableName: "préstamo",
            tableNote: "PK compuesta: Id_socio + Isbn. Incluye atributos de la relación.",
            tableFields: [
                { name: "Id_socio",       isPK: true,  isFK: true,  fkTo: "SOCIO" },
                { name: "Isbn",           isPK: true,  isFK: true,  fkTo: "LIBRO" },
                { name: "Fecha_prestamo", isPK: false, isFK: false },
                { name: "Devuelto",       isPK: false, isFK: false }
            ]
        }
    ]
},

// ── Ejercicio 3: Tienda Online ────────────────────────────────────────────
{
    entityTables: [
        {
            name: "CLIENTE", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "Id_cliente", isPK: true  },
                { name: "Nombre",     isPK: false },
                { name: "Email",      isPK: false }
            ]
        },
        {
            name: "PEDIDO", sourceType: "entity",
            note: "Entidad fuerte — recibirá FK de la relación 'realiza'",
            fields: [
                { name: "Nro_pedido",   isPK: true  },
                { name: "Fecha_pedido", isPK: false },
                { name: "Total",        isPK: false }
            ]
        }
    ],
    relations: [
        {
            name: "realiza",
            cardHint: "CLIENTE 1:N PEDIDO (con totalidad)",
            ruleHint: "Con totalidad del lado N → no genera tabla; FK en la tabla del lado N",
            generatesTable: false,
            fkPlacement: {
                targetTable: "PEDIDO",
                reason: "Cada pedido pertenece obligatoriamente a un cliente (totalidad) → FK Id_cliente en PEDIDO",
                fkFields: [
                    { name: "Id_cliente", isFK: true, fkTo: "CLIENTE" }
                ]
            }
        }
    ]
},

// ── Ejercicio 4: Red Social ───────────────────────────────────────────────
{
    entityTables: [
        {
            name: "USUARIO", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "Id_usuario",  isPK: true  },
                { name: "Email",       isPK: false },
                { name: "Año_ingreso", isPK: false }
            ]
        },
        {
            name: "CONTENIDO", sourceType: "entity",
            note: "Entidad fuerte — recibirá FK de la relación 'publica'",
            fields: [
                { name: "Nro_contenido", isPK: true  },
                { name: "Título",        isPK: false },
                { name: "Fecha",         isPK: false }
            ]
        },
        {
            name: "CREADOR", sourceType: "isa",
            note: "Subentidad (ISA) — hereda PK de USUARIO como PK+FK",
            fields: [
                { name: "Id_usuario",     isPK: true,  isFK: true, fkTo: "USUARIO" },
                { name: "Cant_seguidores",isPK: false }
            ]
        },
        {
            name: "ESPECTADOR", sourceType: "isa",
            note: "Subentidad (ISA) — hereda PK de USUARIO como PK+FK",
            fields: [
                { name: "Id_usuario", isPK: true,  isFK: true, fkTo: "USUARIO" },
                { name: "Ciudad",     isPK: false }
            ]
        },
        {
            name: "Teléfono", sourceType: "multivalued",
            note: "Atributo multivaluado de ESPECTADOR → tabla separada con PK compuesta",
            fields: [
                { name: "Id_usuario", isPK: true, isFK: true, fkTo: "ESPECTADOR" },
                { name: "Teléfono",   isPK: true, isFK: false }
            ]
        }
    ],
    relations: [
        {
            name: "publica",
            cardHint: "USUARIO 1:N CONTENIDO (con totalidad)",
            ruleHint: "Con totalidad del lado N → FK en la tabla del lado N",
            generatesTable: false,
            fkPlacement: {
                targetTable: "CONTENIDO",
                reason: "Todo contenido es publicado por un usuario (totalidad) → FK Id_usuario en CONTENIDO",
                fkFields: [
                    { name: "Id_usuario", isFK: true, fkTo: "USUARIO" }
                ]
            }
        }
    ]
},

// ── Ejercicio 5: Plataforma Streaming ────────────────────────────────────
{
    entityTables: [
        {
            name: "SOCIO", sourceType: "entity",
            note: "Entidad fuerte — Nombre_completo expandido en subatributos",
            fields: [
                { name: "Cod_socio",  isPK: true  },
                { name: "Primer_nom", isPK: false },
                { name: "Primer_ape", isPK: false }
            ]
        },
        {
            name: "PELÍCULA", sourceType: "entity",
            note: "Entidad fuerte — recibirá FK de la relación 'guarda'",
            fields: [
                { name: "Cod_pelicula", isPK: true  },
                { name: "Titulo",       isPK: false },
                { name: "Año",          isPK: false }
            ]
        },
        {
            name: "ARCHIVADOR", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "Nro_arch",  isPK: true  },
                { name: "Ubicacion", isPK: false }
            ]
        },
        {
            name: "Directores_favoritos", sourceType: "multivalued",
            note: "Atributo multivaluado de SOCIO → tabla separada",
            fields: [
                { name: "Cod_socio",            isPK: true, isFK: true,  fkTo: "SOCIO" },
                { name: "Directores_favoritos",  isPK: true, isFK: false }
            ]
        },
        {
            name: "Actores", sourceType: "multivalued",
            note: "Atributo multivaluado de PELÍCULA → tabla separada",
            fields: [
                { name: "Cod_pelicula", isPK: true, isFK: true,  fkTo: "PELÍCULA" },
                { name: "Actores",      isPK: true, isFK: false }
            ]
        }
    ],
    relations: [
        {
            name: "alquila",
            cardHint: "SOCIO N:N PELÍCULA",
            ruleHint: "N:N → siempre genera tabla intermedia",
            generatesTable: true,
            tableName: "alquila",
            tableNote: "PK compuesta: Cod_socio + Cod_pelicula. Incluye fechas de la relación.",
            tableFields: [
                { name: "Cod_socio",     isPK: true,  isFK: true,  fkTo: "SOCIO"    },
                { name: "Cod_pelicula",  isPK: true,  isFK: true,  fkTo: "PELÍCULA"  },
                { name: "Fecha_alq",     isPK: false, isFK: false },
                { name: "Fech_devuelto", isPK: false, isFK: false }
            ]
        },
        {
            name: "guarda",
            cardHint: "PELÍCULA N:1 ARCHIVADOR (con totalidad)",
            ruleHint: "Con totalidad del lado N → FK en la tabla del lado N",
            generatesTable: false,
            fkPlacement: {
                targetTable: "PELÍCULA",
                reason: "Toda película está en un archivador (totalidad) → FK Nro_arch en PELÍCULA",
                fkFields: [
                    { name: "Nro_arch", isFK: true, fkTo: "ARCHIVADOR" }
                ]
            }
        }
    ]
},

// ── Ejercicio 6: Sistema Hospitalario ────────────────────────────────────
{
    entityTables: [
        {
            name: "PACIENTE", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "Cédula",    isPK: true  },
                { name: "Nombre",    isPK: false },
                { name: "Teléfono",  isPK: false }
            ]
        },
        {
            name: "MÉDICO", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "Matrícula",    isPK: true  },
                { name: "Nombre",       isPK: false },
                { name: "Especialidad", isPK: false }
            ]
        },
        {
            name: "CONSULTA", sourceType: "entity",
            note: "Entidad fuerte — recibirá FKs de las relaciones 'realiza' y 'atiende'",
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
            cardHint: "PACIENTE 1:N CONSULTA (con totalidad)",
            ruleHint: "Con totalidad del lado N → FK en CONSULTA",
            generatesTable: false,
            fkPlacement: {
                targetTable: "CONSULTA",
                reason: "Toda consulta la realiza un paciente (totalidad) → FK Cédula en CONSULTA",
                fkFields: [
                    { name: "Cédula", isFK: true, fkTo: "PACIENTE" }
                ]
            }
        },
        {
            name: "atiende",
            cardHint: "MÉDICO 1:N CONSULTA (con totalidad)",
            ruleHint: "Con totalidad del lado N → FK en CONSULTA",
            generatesTable: false,
            fkPlacement: {
                targetTable: "CONSULTA",
                reason: "Toda consulta es atendida por un médico (totalidad) → FK Matrícula en CONSULTA",
                fkFields: [
                    { name: "Matrícula", isFK: true, fkTo: "MÉDICO" }
                ]
            }
        }
    ]
},

// ── Ejercicio 7: Institución Educativa ───────────────────────────────────
{
    entityTables: [
        {
            name: "MATERIA", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "Código",    isPK: true  },
                { name: "NombreMat", isPK: false },
                { name: "Año",       isPK: false }
            ]
        },
        {
            name: "ALUMNO", sourceType: "entity",
            note: "Dirección expandida en subatributos. Edad (derivado) excluido.",
            fields: [
                { name: "Cédula",    isPK: true  },
                { name: "Nombre",    isPK: false },
                { name: "Calle",     isPK: false },
                { name: "Nro",       isPK: false },
                { name: "Esquina",   isPK: false },
                { name: "Fecha_nac", isPK: false }
            ]
        },
        {
            name: "Teléfonos", sourceType: "multivalued",
            note: "Atributo multivaluado de ALUMNO → tabla separada con PK compuesta",
            fields: [
                { name: "Cédula",    isPK: true, isFK: true,  fkTo: "ALUMNO" },
                { name: "Teléfonos", isPK: true, isFK: false }
            ]
        }
    ],
    relations: [
        {
            name: "cursa",
            cardHint: "ALUMNO N:N MATERIA",
            ruleHint: "N:N → siempre genera tabla intermedia",
            generatesTable: true,
            tableName: "cursa",
            tableNote: "PK compuesta: Código + Cédula. Nota es atributo propio de la relación.",
            tableFields: [
                { name: "Código", isPK: true,  isFK: true,  fkTo: "MATERIA" },
                { name: "Cédula", isPK: true,  isFK: true,  fkTo: "ALUMNO"  },
                { name: "Nota",   isPK: false, isFK: false }
            ]
        }
    ]
},

// ── Ejercicio 8: Colegio ──────────────────────────────────────────────────
{
    entityTables: [
        {
            name: "PROFESOR", sourceType: "entity",
            note: "Grado (derivado) excluido",
            fields: [
                { name: "CédulaP",    isPK: true  },
                { name: "Nombre",     isPK: false },
                { name: "TeléfonoP",  isPK: false },
                { name: "FechaNac",   isPK: false },
                { name: "AñoIngreso", isPK: false }
            ]
        },
        {
            name: "ASIGNATURA", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "Código",      isPK: true  },
                { name: "NombreAsisg", isPK: false }
            ]
        },
        {
            name: "ALUMNO", sourceType: "entity",
            note: "NombreCom expandido en Nom+Ape1+Ape2. Edad (derivado) excluido.",
            fields: [
                { name: "CédulaA",  isPK: true  },
                { name: "Nom",      isPK: false },
                { name: "Ape1",     isPK: false },
                { name: "Ape2",     isPK: false },
                { name: "Teléfono", isPK: false },
                { name: "FechaNac", isPK: false }
            ]
        },
        {
            name: "LIBRO", sourceType: "entity",
            note: "Entidad fuerte — recibirá FK de la relación 'publica'",
            fields: [
                { name: "CódigoL", isPK: true  },
                { name: "Titulo",  isPK: false },
                { name: "Tema",    isPK: false },
                { name: "Fecha",   isPK: false }
            ]
        },
        {
            name: "Antecedentes", sourceType: "multivalued",
            note: "Atributo multivaluado de ALUMNO → tabla separada",
            fields: [
                { name: "CédulaA",      isPK: true, isFK: true,  fkTo: "ALUMNO" },
                { name: "Antecedentes", isPK: true, isFK: false }
            ]
        }
    ],
    relations: [
        {
            name: "dicta",
            cardHint: "PROFESOR N:N ASIGNATURA",
            ruleHint: "N:N → siempre genera tabla intermedia",
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
            cardHint: "ALUMNO N:N ASIGNATURA",
            ruleHint: "N:N → siempre genera tabla intermedia",
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
            cardHint: "PROFESOR 1:N LIBRO (con totalidad)",
            ruleHint: "Con totalidad del lado N → FK en LIBRO",
            generatesTable: false,
            fkPlacement: {
                targetTable: "LIBRO",
                reason: "Cada libro es publicado por un profesor (totalidad) → FK CédulaP en LIBRO",
                fkFields: [
                    { name: "CédulaP", isFK: true, fkTo: "PROFESOR" }
                ]
            }
        }
    ]
},

// ── Ejercicio 9: Película ─────────────────────────────────────────────────
{
    entityTables: [
        {
            name: "CLIENTE", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "CédulaC",   isPK: true  },
                { name: "NombreC",   isPK: false },
                { name: "Dirección", isPK: false },
                { name: "Teléfono",  isPK: false }
            ]
        },
        {
            name: "PELICULA", sourceType: "entity",
            note: "Entidad fuerte — recibirá FK de la relación 'dirige'",
            fields: [
                { name: "Título",        isPK: true  },
                { name: "Productora",    isPK: false },
                { name: "Fecha",         isPK: false },
                { name: "NacionalidadP", isPK: false }
            ]
        },
        {
            name: "EJEMPLAR", sourceType: "weak",
            note: "Entidad débil de PELICULA — PK compuesta incluye FK a entidad dominante",
            fields: [
                { name: "Número", isPK: true,  isFK: false },
                { name: "Título", isPK: true,  isFK: true,  fkTo: "PELICULA" },
                { name: "Estado", isPK: false, isFK: false }
            ]
        },
        {
            name: "DIRECTOR", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "CédulaD",      isPK: true  },
                { name: "NombreD",      isPK: false },
                { name: "NacionalidadD",isPK: false }
            ]
        },
        {
            name: "ACTOR", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "CédulaA",       isPK: true  },
                { name: "Principal",     isPK: false },
                { name: "Sexo",          isPK: false },
                { name: "NacionalidadA", isPK: false },
                { name: "NombreA",       isPK: false }
            ]
        }
    ],
    relations: [
        {
            name: "dirige",
            cardHint: "PELÍCULA N:1 DIRECTOR (con totalidad)",
            ruleHint: "Con totalidad del lado N → FK en PELICULA",
            generatesTable: false,
            fkPlacement: {
                targetTable: "PELICULA",
                reason: "Toda película tiene un director (totalidad) → FK CédulaD en PELICULA",
                fkFields: [
                    { name: "CédulaD", isFK: true, fkTo: "DIRECTOR" }
                ]
            }
        },
        {
            name: "alquila",
            cardHint: "CLIENTE N:N EJEMPLAR",
            ruleHint: "N:N → siempre genera tabla intermedia",
            generatesTable: true,
            tableName: "alquila",
            tableNote: "PK compuesta: CédulaC + Número. Incluye fechas de la relación.",
            tableFields: [
                { name: "CédulaC",         isPK: true,  isFK: true,  fkTo: "CLIENTE"  },
                { name: "Número",           isPK: true,  isFK: true,  fkTo: "EJEMPLAR" },
                { name: "FechaComienzo",    isPK: false, isFK: false },
                { name: "FechaDevolución",  isPK: false, isFK: false }
            ]
        },
        {
            name: "participa",
            cardHint: "ACTOR N:N PELICULA",
            ruleHint: "N:N → siempre genera tabla intermedia",
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

// ── Ejercicio 10: Fútbol ──────────────────────────────────────────────────
{
    entityTables: [
        {
            name: "CLUB", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "Nombre",        isPK: true  },
                { name: "AñoFundación",  isPK: false },
                { name: "Ubicación",     isPK: false },
                { name: "Entrenador",    isPK: false },
                { name: "Presidente",    isPK: false },
                { name: "Estadio",       isPK: false }
            ]
        },
        {
            name: "JUGADOR", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "Ced",          isPK: true  },
                { name: "Nacionalidad", isPK: false },
                { name: "Estatura",     isPK: false },
                { name: "Apodo",        isPK: false },
                { name: "Nombre",       isPK: false },
                { name: "FechaNac",     isPK: false }
            ]
        }
    ],
    relations: [
        {
            name: "juega_en",
            cardHint: "JUGADOR N:N CLUB",
            ruleHint: "N:N → siempre genera tabla intermedia",
            generatesTable: true,
            tableName: "juega_en",
            tableNote: "PK compuesta: Nombre (FK→CLUB) + Ced (FK→JUGADOR).",
            tableFields: [
                { name: "Nombre", isPK: true, isFK: true, fkTo: "CLUB"    },
                { name: "Ced",    isPK: true, isFK: true, fkTo: "JUGADOR" }
            ]
        },
        {
            name: "juega_con",
            cardHint: "CLUB N:N CLUB (autorelación)",
            ruleHint: "N:N autorelación → tabla con roles para distinguir cada extremo",
            generatesTable: true,
            tableName: "juega_con",
            tableNote: "PK compuesta con roles: Nombre_locatario + Nombre_visitante (ambas FK→CLUB). Incluye atributos.",
            tableFields: [
                { name: "Nombre_locatario", isPK: true,  isFK: true,  fkTo: "CLUB", fkRefField: "Nombre" },
                { name: "Nombre_visitante", isPK: true,  isFK: true,  fkTo: "CLUB", fkRefField: "Nombre" },
                { name: "Fecha",            isPK: false, isFK: false },
                { name: "Resultado",        isPK: false, isFK: false }
            ]
        }
    ]
},

// ── Ejercicio 11: Música ──────────────────────────────────────────────────
{
    entityTables: [
        {
            name: "ARTISTA", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "Nombre",       isPK: true  },
                { name: "Nacionalidad", isPK: false },
                { name: "Fotografía",   isPK: false }
            ]
        },
        {
            name: "ALBUM", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "TítuloA", isPK: true  },
                { name: "Género",  isPK: false }
            ]
        },
        {
            name: "TEMA", sourceType: "entity",
            note: "Entidad fuerte — recibirá FK de la relación 'contiene'",
            fields: [
                { name: "TítuloT",  isPK: true  },
                { name: "Duración", isPK: false }
            ]
        }
    ],
    relations: [
        {
            name: "contiene",
            cardHint: "ALBUM 1:N TEMA (con totalidad)",
            ruleHint: "Con totalidad del lado N → FK en TEMA",
            generatesTable: false,
            fkPlacement: {
                targetTable: "TEMA",
                reason: "Cada tema pertenece a un álbum (totalidad) → FK TítuloA en TEMA",
                fkFields: [
                    { name: "TítuloA", isFK: true, fkTo: "ALBUM" }
                ]
            }
        },
        {
            name: "compone",
            cardHint: "ARTISTA N:N ALBUM",
            ruleHint: "N:N → siempre genera tabla intermedia",
            generatesTable: true,
            tableName: "compone",
            tableNote: "PK compuesta: Nombre (FK→ARTISTA) + TítuloA (FK→ALBUM).",
            tableFields: [
                { name: "Nombre",  isPK: true, isFK: true, fkTo: "ARTISTA" },
                { name: "TítuloA", isPK: true, isFK: true, fkTo: "ALBUM"   }
            ]
        }
    ]
},

// ── Ejercicio 12: Biblioteca2 ─────────────────────────────────────────────
{
    entityTables: [
        {
            name: "SOCIO", sourceType: "entity",
            note: "NomCompleto expandido en Nom+Ape1+Ape2",
            fields: [
                { name: "CI",        isPK: true  },
                { name: "Celular",   isPK: false },
                { name: "Nom",       isPK: false },
                { name: "Ape1",      isPK: false },
                { name: "Ape2",      isPK: false },
                { name: "Dirección", isPK: false }
            ]
        },
        {
            name: "LIBRO", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "Código", isPK: true  },
                { name: "Titulo", isPK: false },
                { name: "Año",    isPK: false }
            ]
        },
        {
            name: "Autor", sourceType: "multivalued",
            note: "Atributo multivaluado de LIBRO → tabla separada con PK compuesta",
            fields: [
                { name: "Código", isPK: true, isFK: true,  fkTo: "LIBRO" },
                { name: "Autor",  isPK: true, isFK: false }
            ]
        },
        {
            name: "EJEMPLAR", sourceType: "weak",
            note: "Entidad débil de LIBRO — PK compuesta incluye FK a LIBRO",
            fields: [
                { name: "Número", isPK: true, isFK: false },
                { name: "Código", isPK: true, isFK: true,  fkTo: "LIBRO" }
            ]
        }
    ],
    relations: [
        {
            name: "prestar",
            cardHint: "SOCIO N:N EJEMPLAR",
            ruleHint: "N:N → siempre genera tabla intermedia",
            generatesTable: true,
            tableName: "prestar",
            tableNote: "PK compuesta: CI + Número + Código. Los tres forman la identidad del préstamo.",
            tableFields: [
                { name: "CI",     isPK: true,  isFK: true,  fkTo: "SOCIO"    },
                { name: "Número", isPK: true,  isFK: true,  fkTo: "EJEMPLAR" },
                { name: "Código", isPK: true,  isFK: true,  fkTo: "LIBRO"    },
                { name: "FechaI", isPK: false, isFK: false },
                { name: "FechaF", isPK: false, isFK: false },
                { name: "FechaD", isPK: false, isFK: false }
            ]
        }
    ]
},

// ── Ejercicio 13: Almacén de Piezas ──────────────────────────────────────
{
    entityTables: [
        {
            name: "PIEZA", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "ID_Pieza",     isPK: true  },
                { name: "DescripciónP", isPK: false },
                { name: "Precio",       isPK: false }
            ]
        },
        {
            name: "ALMACÉN", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "Nro",          isPK: true  },
                { name: "DescripciónA", isPK: false },
                { name: "Dirección",    isPK: false }
            ]
        },
        {
            name: "ESTANTERÍA", sourceType: "weak",
            note: "Entidad débil de ALMACÉN — PK compuesta incluye FK a ALMACÉN",
            fields: [
                { name: "ID_Est", isPK: true, isFK: false },
                { name: "Nro",    isPK: true, isFK: true,  fkTo: "ALMACÉN" }
            ]
        }
    ],
    relations: [
        {
            name: "vende",
            cardHint: "ALMACÉN N:N PIEZA",
            ruleHint: "N:N → siempre genera tabla intermedia",
            generatesTable: true,
            tableName: "vende",
            tableNote: "PK compuesta: ID_Pieza (FK→PIEZA) + Nro (FK→ALMACÉN).",
            tableFields: [
                { name: "ID_Pieza", isPK: true, isFK: true, fkTo: "PIEZA"   },
                { name: "Nro",      isPK: true, isFK: true, fkTo: "ALMACÉN" }
            ]
        },
        {
            name: "compuesta_por",
            cardHint: "PIEZA N:N PIEZA (autorelación)",
            ruleHint: "N:N autorelación → tabla con roles para distinguir componente y compuesto",
            generatesTable: true,
            tableName: "compuesta_por",
            tableNote: "Ambas FK referencian PIEZA con roles distintos (componente / compuesto).",
            tableFields: [
                { name: "ID_Pieza_componente", isPK: true, isFK: true, fkTo: "PIEZA", fkRefField: "ID_Pieza" },
                { name: "ID_Pieza_compuesto",  isPK: true, isFK: true, fkTo: "PIEZA", fkRefField: "ID_Pieza" }
            ]
        }
    ]
},

// ── Ejercicio 14: Instituto ───────────────────────────────────────────────
{
    entityTables: [
        {
            name: "DOCENTE", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "CI_Doc",      isPK: true  },
                { name: "Nom_Docente", isPK: false }
            ]
        },
        {
            name: "DIRECTOR", sourceType: "entity",
            note: "Entidad fuerte",
            fields: [
                { name: "CI_Dir",       isPK: true  },
                { name: "Nom_Director", isPK: false },
                { name: "Teléfono",     isPK: false }
            ]
        },
        {
            name: "CURSO", sourceType: "entity",
            note: "Entidad fuerte — recibirá FKs de 'dicta' y 'supervisa'",
            fields: [
                { name: "Código",    isPK: true  },
                { name: "Nom_Curso", isPK: false }
            ]
        }
    ],
    relations: [
        {
            name: "dicta",
            cardHint: "CURSO N:1 DOCENTE (con totalidad, agregación)",
            ruleHint: "Agregación con totalidad → la FK se incorpora en la tabla del lado N",
            generatesTable: false,
            fkPlacement: {
                targetTable: "CURSO",
                reason: "Todo curso es dictado por un docente (totalidad) → FK CI_Doc en CURSO",
                fkFields: [
                    { name: "CI_Doc", isFK: true, fkTo: "DOCENTE" }
                ]
            }
        },
        {
            name: "supervisa",
            cardHint: "CURSO N:1 DIRECTOR (con totalidad)",
            ruleHint: "Con totalidad del lado N → FK en CURSO",
            generatesTable: false,
            fkPlacement: {
                targetTable: "CURSO",
                reason: "Todo curso es supervisado por un director (totalidad) → FK CI_Dir en CURSO",
                fkFields: [
                    { name: "CI_Dir", isFK: true, fkTo: "DIRECTOR" }
                ]
            }
        }
    ]
}

]; // fin tablesData
