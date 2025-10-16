CREATE TABLE "pacientes" (
  "id_paciente" varchar(36) PRIMARY KEY,
  "nombre" varchar(100),
  "apellido" varchar(100),
  "fecha_nacimiento" date,
  "genero" varchar(20),
  "numero_historia_clinica" varchar(50) UNIQUE,
  "antecedentes_medicos" text,
  "fecha_creacion" timestamp,
  "creado_por" varchar(36)
);

CREATE TABLE "usuarios" (
  "id_usuario" varchar(36) PRIMARY KEY,
  "nombre_usuario" varchar(50) UNIQUE,
  "correo_electronico" varchar(100) UNIQUE,
  "hash_contrasena" varchar(255),
  "nombre" varchar(100),
  "apellido" varchar(100),
  "rol" varchar(50),
  "numero_licencia" varchar(100),
  "esta_activo" boolean,
  "fecha_creacion" timestamp
);

CREATE TABLE "estudios_medicos" (
  "id_estudio" varchar(36) PRIMARY KEY,
  "id_paciente" varchar(36),
  "tipo_estudio" varchar(50),
  "fecha_estudio" timestamp,
  "medico_referente" varchar(100),
  "descripcion_estudio" text,
  "ruta_imagen_original" varchar(500),
  "estado" varchar(50),
  "fecha_creacion" timestamp,
  "creado_por" varchar(36)
);

CREATE TABLE "imagenes_estudio" (
  "id_imagen" varchar(36) PRIMARY KEY,
  "id_estudio" varchar(36),
  "nombre_archivo" varchar(255),
  "formato_imagen" varchar(10),
  "ruta_imagen" varchar(500),
  "fecha_creacion" timestamp
);

CREATE TABLE "diagnosticos" (
  "id_diagnostico" varchar(36) PRIMARY KEY,
  "id_estudio" varchar(36),
  "descripcion_diagnostico" text,
  "hallazgos_principales" text,
  "observaciones_medicas" text,
  "fecha_diagnostico" timestamp,
  "diagnosticado_por" varchar(36)
);

CREATE TABLE "reportes_medicos" (
  "id_reporte" varchar(36) PRIMARY KEY,
  "id_estudio" varchar(36),
  "titulo_reporte" varchar(200),
  "contenido_reporte" text,
  "firma_medico" varchar(255),
  "fecha_aprobacion" timestamp,
  "ruta_pdf" varchar(500),
  "fecha_creacion" timestamp,
  "creado_por" varchar(36)
);

CREATE TABLE "valores_medicos" (
  "id_valor_medico" varchar(36) PRIMARY KEY,
  "id_estudio" varchar(36),
  "nombre_parametro" varchar(100),
  "valor_parametro" decimal(10,4),
  "unidad_medida" varchar(20),
  "fecha_medicion" timestamp,
  "creado_por" varchar(36)
);

CREATE TABLE "auditoria" (
  "id_auditoria" varchar(36) PRIMARY KEY,
  "id_usuario" varchar(36),
  "accion" varchar(100),
  "tabla_afectada" varchar(50),
  "id_registro_afectado" varchar(36),
  "valores_anteriores" text,
  "valores_nuevos" text,
  "direccion_ip" varchar(45),
  "fecha_hora" timestamp
);

ALTER TABLE "estudios_medicos" ADD FOREIGN KEY ("id_paciente") REFERENCES "pacientes" ("id_paciente");

ALTER TABLE "estudios_medicos" ADD FOREIGN KEY ("creado_por") REFERENCES "usuarios" ("id_usuario");

ALTER TABLE "imagenes_estudio" ADD FOREIGN KEY ("id_estudio") REFERENCES "estudios_medicos" ("id_estudio");

ALTER TABLE "diagnosticos" ADD FOREIGN KEY ("id_estudio") REFERENCES "estudios_medicos" ("id_estudio");

ALTER TABLE "diagnosticos" ADD FOREIGN KEY ("diagnosticado_por") REFERENCES "usuarios" ("id_usuario");

ALTER TABLE "reportes_medicos" ADD FOREIGN KEY ("id_estudio") REFERENCES "estudios_medicos" ("id_estudio");

ALTER TABLE "reportes_medicos" ADD FOREIGN KEY ("creado_por") REFERENCES "usuarios" ("id_usuario");

ALTER TABLE "valores_medicos" ADD FOREIGN KEY ("id_estudio") REFERENCES "estudios_medicos" ("id_estudio");

ALTER TABLE "valores_medicos" ADD FOREIGN KEY ("creado_por") REFERENCES "usuarios" ("id_usuario");

ALTER TABLE "auditoria" ADD FOREIGN KEY ("id_usuario") REFERENCES "usuarios" ("id_usuario");
