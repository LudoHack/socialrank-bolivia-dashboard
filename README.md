# Social Rank Bolivia Dashboard Frontend

Frontend para el dashboard de noticias de Social Rank Bolivia.

## Tecnologías

- React
- TypeScript
- Tailwind CSS
- React Query
- Axios

## Configuración

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
Crear un archivo `.env` con:
```
REACT_APP_API_URL=https://socialrank-bolivia-api-news.onrender.com/noticias/api
```

3. Iniciar en desarrollo:
```bash
npm start
```

4. Construir para producción:
```bash
npm run build
```

## Despliegue

El proyecto está configurado para desplegarse en Render.com.

### Variables de Entorno en Render

- `REACT_APP_API_URL`: URL del backend API

## Estructura del Proyecto

- `/src/components`: Componentes reutilizables
- `/src/pages`: Páginas principales
- `/src/services`: Servicios y llamadas a API
- `/src/hooks`: Custom hooks
- `/src/config`: Configuración global
- `/src/types`: Tipos TypeScript
- `/src/styles`: Estilos globales
