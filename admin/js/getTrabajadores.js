let listaTrabajadores = [];

async function cargarTrabajadores() {
    try {
        const response = await fetch('api/consultartrabajadores.php');
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.status);
        }

        listaTrabajadores = await response.json();

        const tbody = document.querySelector('tbody');
        tbody.innerHTML = '';

        listaTrabajadores.forEach(trabajador => {
            const row = document.createElement('tr');
            row.className = "text-gray-700 dark:text-gray-400";

            row.innerHTML = `
                <td class="px-4 py-3">
                    <div class="flex items-center text-sm">
                        <div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                            <img class="object-cover w-full h-full rounded-full" src='uploads/${trabajador.files}' alt="Trabajador" loading="lazy" />
                            <div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                        </div>
                        <div>
                            <p class="font-semibold">${trabajador.nombres} ${trabajador.apellido_p}</p>
                            <p class="text-xs text-gray-600 dark:text-gray-400">
                                ${trabajador.dni}
                            </p>
                        </div>
                    </div>
                </td>
                <td class="px-4 py-3 text-sm">${trabajador.sexo}</td>
                <td class="px-4 py-3 text-sm">${trabajador.nombre_puesto}</td>
                <td class="px-4 py-3 text-sm">${trabajador.turno}</td>
                <td class="px-4 py-3 text-sm">${trabajador.hora_limite}</td>
                <td class="px-4 py-3 text-sm">${trabajador.salida}</td>
                <td class="px-4 py-3 text-xs">
                    <span class="px-2 py-1 font-semibold leading-tight rounded-full 
                        ${trabajador.estado === 1 ? 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100' : 'text-black bg-gray-100 dark:bg-gray-700 dark:text-gray-100'}">
                        ${trabajador.estado === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td class="px-4 py-3 text-sm">${trabajador.numero_cel}</td>
                <td class="px-4 py-3 text-sm">S/ ${trabajador.salario_por_dia}</td>
                <td class="px-4 py-3">
                    <div class="flex items-center space-x-4 text-sm">
                        <button
                            class="editBtn flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                            aria-label="Edit" data-id="${trabajador.id_trabajador}">
                            <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                            </svg>
                        </button>
                        <button class="downloadBtn flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                            aria-label="Download QR" data-barcode="${trabajador.dni}">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                            </svg>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        document.querySelectorAll('.editBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const idTrabajador = e.currentTarget.dataset.id;
                abrirModalEdicion(idTrabajador);
            });
        });

        // Agregar eventos a los botones de descarga
        document.querySelectorAll('.downloadBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const barcode = e.currentTarget.dataset.barcode;
                descargarQR(barcode);
            });
        });
    } catch (error) {
        console.error('Error al cargar trabajadores:', error);
    }
}

function descargarQR(barcode) {
    
    var productUrl = barcode;

    // Generar el QR Code
    QRCode.toDataURL(productUrl, {
        width: 256,
        height: 256,
        color: {
            dark: '#000000',
            light: '#ffffff'
        }
    }).then(function (url) {
        var a = document.createElement("a");
        a.setAttribute("download", "qr_" + barcode + ".png");
        a.setAttribute("href", url);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }).catch(function (error) {
        console.error(error);
    });
}

async function cargarPuestosHorarios() {
    try {
        const response = await fetch('api/consultarPuestosHorarios.php');
        if (!response.ok) {
            throw new Error('Error al obtener puestos y horarios: ' + response.status);
        }

        const data = await response.json();

        // Cargar puestos en el selector
        const puestoSelect = document.getElementById('editPuesto');
        puestoSelect.innerHTML = ''; // Limpiar opciones previas
        data.puestos.forEach(puesto => {
            const option = document.createElement('option');
            option.value = puesto.id_puesto;
            option.textContent = puesto.nombre_puesto;
            puestoSelect.appendChild(option);
        });

        // Cargar horarios en el selector
        const horarioSelect = document.getElementById('editHorario');
        horarioSelect.innerHTML = ''; // Limpiar opciones previas
        data.horarios.forEach(horario => {
            const option = document.createElement('option');
            option.value = horario.id_horario;
            option.textContent = horario.turno;
            horarioSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error al cargar puestos y horarios:', error);
    }
}

// Llamar a la función al abrir el modal o cargar la página
cargarPuestosHorarios();



function abrirModalEdicion(idTrabajador) {
    const trabajador = listaTrabajadores.find(t => t.id_trabajador == idTrabajador);

    if (trabajador) {
        document.getElementById('editIdTrabajador').value = trabajador.id_trabajador;
        document.getElementById('editNombres').value = trabajador.nombres;
        document.getElementById('editApellidoP').value = trabajador.apellido_p;
        document.getElementById('editApellidoM').value = trabajador.apellido_m;
        document.getElementById('editDni').value = trabajador.dni;
        document.getElementById('editNumeroCel').value = trabajador.numero_cel;
        document.getElementById('editSexo').value = trabajador.sexo;
        document.getElementById('editEstado').value = trabajador.estado;
        document.getElementById('editSalario').value = trabajador.salario_por_dia;

        // Mostrar la imagen actual del trabajador
        const imgPath = trabajador.files ? `uploads/${trabajador.files}` : 'default-image.png';
        document.getElementById('editImagePreview').src = imgPath;

        // Seleccionar el puesto del trabajador
        const puestoSelect = document.getElementById('editPuesto');
        puestoSelect.value = trabajador.id_puesto;

        // Seleccionar el horario del trabajador
        const horarioSelect = document.getElementById('editHorario');
        horarioSelect.value = trabajador.id_horario;

        // Mostrar el modal de edición
        document.getElementById('editModal').classList.remove('hidden');
    }
}


// Cerrar el modal de edición al hacer clic en el botón de cancelar
document.getElementById('closeModalBtn2').addEventListener('click', () => {
    document.getElementById('editModal').classList.add('hidden');
});



// Manejar el envío del formulario de edición
document.getElementById('editForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Crear un objeto FormData para enviar archivos
    const formData = new FormData();


    // Obtener los valores de los campos del formulario
    const id_trabajador = document.getElementById('editIdTrabajador').value;
    const nombres = document.getElementById('editNombres').value;
    const apellido_p = document.getElementById('editApellidoP').value;
    const apellido_m = document.getElementById('editApellidoM').value;
    const dni = document.getElementById('editDni').value;
    const numero_cel = document.getElementById('editNumeroCel').value;
    const sexo = document.getElementById('editSexo').value;
    const id_puesto = document.getElementById('editPuesto').value;
    const id_horario = document.getElementById('editHorario').value;
    const estado = document.getElementById('editEstado').value;
    const salario_por_dia = document.getElementById('editSalario').value;

    // Agregar datos al objeto FormData
    formData.append('id_trabajador', id_trabajador);
    formData.append('nombres', nombres);
    formData.append('apellido_p', apellido_p);
    formData.append('apellido_m', apellido_m);
    formData.append('dni', dni);
    formData.append('numero_cel', numero_cel);
    formData.append('sexo', sexo);
    formData.append('id_puesto', id_puesto);
    formData.append('id_horario', id_horario);
    formData.append('estado', estado);
    formData.append('salario_por_dia', salario_por_dia);

    // Agregar archivos al objeto FormData
    const files = document.getElementById('editFiles').files;
    for (let i = 0; i < files.length; i++) {
        formData.append('files[]', files[i]); // El nombre puede ser un array para manejar múltiples archivos
    }

    console.log([...formData]);  // Para verificar los datos antes de enviarlos

    try {
        // Enviar los datos al servidor mediante fetch
        const response = await fetch('api/editartrabajador.php', {
            method: 'POST',
            body: formData // Usar FormData directamente
        });

        const result = await response.json();

        // Verificar el estado de la respuesta
        if (result.status === 'success') {
            alert('Trabajador actualizado con éxito');
            cargarTrabajadores(); // Recargar la lista de trabajadores
        } else {
            alert('Error al actualizar trabajador: ' + result.message);
        }

        // Cerrar el modal de edición
        document.getElementById('editModal').classList.add('hidden');

    } catch (error) {
        console.error('Error al actualizar trabajador:', error);
    }
});

// Cargar la lista de trabajadores cuando la página se cargue
window.onload = cargarTrabajadores;
