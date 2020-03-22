# Examen final - segundo modulo Adalab - Ana Valdivia Cano

Realización de una página web de tipo buscador de series de televisión utilizando **HTML5, SASS y Javascript.**

## Funcionalidades creadas con Javascript
1. Realizar petición de datos de la Api: http://www.tvmaze.com/api.
2. Generar elementos con DOM.
3. Realizar una búsqueda por caracteres y pintar los resultados en la web.
4. Poder seleccionar las diferentes películas y colocarlas en una sección de favoritos.
5. Añadir estilos a las películas seleccionadas como favoritas en el listado de la búsqueda, y quitarlos al volver a pulsar sobre ellos.
6. Colocar botones en las peliculas añadidas a favoritos para poder eliminarlas con un click.
7. Crear un botón para borrar todos los favoritos de una vez.
8. Guardar todos los datos de favoritos en localstorage, editarlos cuando borramos favoritos y recuperarlos al recargar la página.
9. Realizar búsqueda mediante un click en el botón de búsqueda y pulsando la tecla enter.
10. Añadir una coverpage inicial y poder volver a ella mediante un click en el logo de la web.

![Adalab](_src/assets/images/logo-adalab-80px.png)


### Versión lista para subir a producción

Para generar los ficheros para producción ejecuta:

```
npm run docs
```

o lo que en este proyecto es lo mismo:

```
gulp docs
```

En la carpeta **docs/** se generarán los CSS y JS minimizados y sin sourcemaps listos para subir al repo. A continuación súbelos al repo y activa en GitHub Pages la opción **master/docs/**, para que GitHub Pages sirva la página desde la carpeta **docs/**.

---

Si quieres generar los ficheros listos para producción y además subirlos a GitHub directamente ejecuta el siguiente comando:

```
npm run push-docs
```

Este comando borra la carpeta **docs/**, la vuelve a generar, crea un commit con los nuevos ficheros y hace un `git push`, todo del tirón. ¿Cómo se te queda el cuerpo?. Si quieres saber cómo funciona échale un ojo al fichero `package.json`.



