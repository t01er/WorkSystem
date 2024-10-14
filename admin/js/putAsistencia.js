let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });

scanner.addListener('scan', function (content) {
    alert('Código QR Detectado: ' + content);

    // Aquí se realiza el envío del DNI a registrarasistencia.php
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
// Función para registrar asistencia
function registrarAsistencia(dni) {
    const horaActual = new Date().toLocaleTimeString(); // Obtener la hora actual

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
                alert(data.message); // Mensaje de éxito
                console.log('Datos del trabajador:', data.trabajador);
            } else {
                alert(data.message); // Mensaje de error
            }
        })
        .catch(error => {
            console.error('Error al registrar la asistencia:', error);
            alert('Error al registrar la asistencia.');
        });
}

// Función para mostrar los datos del trabajador
function mostrarDatosTrabajador(trabajador) {
    const trabajadorInfoDiv = document.getElementById('trabajadorInfo'); // Asegúrate de tener este div en tu HTML

    // Mostrar datos en el HTML
    trabajadorInfoDiv.innerHTML = `
        <h5 class="font-semibold text-gray-800 dark:text-gray-300">Datos del Trabajador</h5>
        <p><strong>Nombres:</strong> ${trabajador.nombres}</p>
        <p><strong>Apellido Paterno:</strong> ${trabajador.apellido_p}</p>
        <p><strong>Apellido Materno:</strong> ${trabajador.apellido_m}</p>
    `;
}
