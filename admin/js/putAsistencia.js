let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });

scanner.addListener('scan', function (content) {
    // Llama a la función para registrar asistencia
    registrarAsistencia(content);
});

document.getElementById('startCamera').addEventListener('click', function () {
    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
        } else {
            console.error('No se encontraron cámaras.');
        }
    }).catch(function (e) {
        console.error(e);
    });
});

// Función para registrar asistencia
function registrarAsistencia(dni) {
    const horaActual = new Date().toLocaleTimeString(); 

    fetch('api/registrarasistencia.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `dni=${dni}&hora_actual=${horaActual}` 
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Mostrar los datos del trabajador en el modal
            mostrarDatosTrabajador(data.trabajador);
        } else {
            alert(data.message); // Mensaje de error
        }
    })
    .catch(error => {
        console.error('Error al registrar la asistencia:', error);
        alert('Error al registrar la asistencia.');
    });
}


function mostrarDatosTrabajador(trabajador) {
    const modalContent = document.getElementById('modalContent');
    const modal = document.getElementById('modal');

    // Mostrar datos en el modal
    modalContent.innerHTML = `
        <p><strong>Nombres:</strong> ${trabajador.nombres}</p>
        <p><strong>Apellido Paterno:</strong> ${trabajador.apellido_p}</p>
        <p><strong>Apellido Materno:</strong> ${trabajador.apellido_m}</p>
    `;

    // Mostrar el modal
    modal.classList.remove('hidden');

    // Agregar evento al botón de cerrar
    document.getElementById('closeModal').onclick = function() {
        modal.classList.add('hidden');
    };
}
