async function cargarTrabajadores() {
    try {
        const response = await fetch('api/consultarsalario.php'); 
        if (!response.ok) {
            throw new Error('Error en la red: ' + response.status);
        }

        const trabajadores = await response.json();

        const tbody = document.querySelector('tbody');
        tbody.innerHTML = ''; 

        trabajadores.forEach(trabajador => {
            const row = document.createElement('tr');
            row.className = "text-gray-700 dark:text-gray-400";

            row.innerHTML = `
                <td class="px-4 py-3">
                    <div class="flex items-center text-sm">
                        <div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                            <img class="object-cover w-full h-full rounded-full" src="uploads/${trabajador.files}" />
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
                <td class="px-4 py-3 text-sm">
                    ${trabajador.total_soles} soles
                </td>
                <td class="px-4 py-3 text-xs">
                    <span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                        ${trabajador.estado ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td class="px-4 py-3 text-sm">
                    ${new Date().toLocaleDateString()} <!-- Fecha actual -->
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar trabajadores:', error);
    }
}

// Cargar trabajadores al iniciar
window.onload = cargarTrabajadores;