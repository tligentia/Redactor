<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Redactor AI ✨

Una aplicación web moderna para generación y edición de contenido impulsada por IA, construida con React, TypeScript y Vite. Utiliza la API de Google Gemini para crear publicaciones para redes sociales, artículos de blog, imágenes y más.

[Ver en AI Studio](https://ai.studio/apps/drive/16ZsjO5sa2xc29sIaZNBLi4YDkBxk4C7e)

## 🚀 Características

- **Generación de Contenido Multi-Plataforma**
  - Publicaciones para LinkedIn, Twitter, Instagram y Facebook
  - Artículos de blog completos
  - Generación y edición de imágenes con IA
  
- **Personalización Avanzada**
  - Múltiples tonos y estilos visuales
  - Niveles de creatividad ajustables
  - Personas contextuales para diferentes audiencias
  
- **Herramientas de Edición**
  - Editor de texto integrado
  - Historial de generaciones
  - Sugerencias de temas y titulares
  
- **Experiencia de Usuario**
  - Interfaz moderna y responsiva
  - Modo oscuro/claro
  - Atajos de teclado
  - Panel de control intuitivo

## 🛠️ Tecnologías

- **Frontend:** React 19, TypeScript
- **Build Tool:** Vite 6
- **IA:** Google Gemini API (@google/genai)
- **Iconos:** Lucide React
- **Estilos:** CSS moderno

## 📋 Requisitos Previos

- Node.js (versión recomendada: 18.x o superior)
- Una API Key de Gemini ([obtener aquí](https://makersuite.google.com/app/apikey))

## 🔧 Instalación y Configuración

1. **Clonar el repositorio** (si aplica)
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crea un archivo `.env.local` en la raíz del proyecto:
   ```bash
   GEMINI_API_KEY=tu_api_key_aqui
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173`

## 📦 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila la aplicación para producción |
| `npm run preview` | Vista previa de la build de producción |

## 🏗️ Estructura del Proyecto

```
├── components/          # Componentes React reutilizables
│   ├── Header.tsx       # Encabezado de la aplicación
│   ├── InputZone.tsx    # Zona de entrada de texto
│   ├── ControlPanel.tsx # Panel de controles
│   ├── ResultsZone.tsx  # Zona de resultados
│   └── ...
├── services/            # Servicios de API
│   └── geminiService.ts # Integración con Gemini API
├── utils/               # Funciones utilitarias
├── types.ts             # Definiciones de tipos TypeScript
├── constants.ts         # Constantes de la aplicación
├── App.tsx              # Componente principal
└── index.tsx            # Punto de entrada
```

## ⚙️ Configuración Avanzada

### Modelos de IA

La aplicación soporta múltiples modelos para diferentes tareas:

**Modelos de Texto:**
- Modelos predeterminados configurados en `constants.ts`

**Modelos de Imagen:**
- Opciones configurables desde el panel de control

### Personalización

Puedes modificar los siguientes aspectos en `constants.ts`:
- Estilos visuales disponibles
- Formatos de imagen
- Tonos de texto
- Niveles de creatividad

## 🔐 Seguridad

- La API Key se almacena localmente en `.env.local`
- Nunca commits tu archivo `.env.local` al repositorio
- El archivo `.gitignore` ya incluye `.env.local`

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo los términos de AI Studio.

## 🔗 Enlaces Útiles

- [Documentación de Google Gemini](https://ai.google.dev/)
- [Documentación de React](https://react.dev/)
- [Documentación de Vite](https://vitejs.dev/)
- [AI Studio](https://ai.studio/)

---

<div align="center">
  <strong>Hecho con ❤️ usando Google AI Studio</strong>
</div>
