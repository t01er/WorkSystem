document.getElementById('openModalBtn').addEventListener('click', function () {
    document.getElementById('registerModal').classList.remove('hidden');
    loadSelectOptions(); 
});


document.getElementById('closeModalBtn').addEventListener('click', function () {
    document.getElementById('registerModal').classList.add('hidden');
});


async function loadSelectOptions() {
    try {
        const puestosResponse = await fetch('api/puestos.php'); 
        const puestos = await puestosResponse.json();
        const puestoSelect = document.getElementById('id_puesto');

        puestos.forEach(puesto => {
            const option = document.createElement('option');
            option.value = puesto.id_puesto;
            option.textContent = puesto.nombre_puesto;
            puestoSelect.appendChild(option);
        });

        const horariosResponse = await fetch('api/horarios.php'); 
        const horarios = await horariosResponse.json();
        const horarioSelect = document.getElementById('id_horario');

        horarios.forEach(horario => {
            const option = document.createElement('option');
            option.value = horario.id_horario;
            option.textContent = `${horario.turno} - Limite: ${horario.hora_limite} - Salida: ${horario.salida}`;
            horarioSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar opciones:', error);
    }
}

document.getElementById('registerModal').addEventListener('show', loadSelectOptions);


document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const dni = document.getElementById('dni').value;
    const nombres = document.getElementById('nombres').value;
    const apellido_p = document.getElementById('apellido_p').value;
    const apellido_m = document.getElementById('apellido_m').value;
    const numero_cel = document.getElementById('numero_cel').value;
    const sexo = document.getElementById('sexo').value;
    const files = document.getElementById('files').files[0];  // Aquí obtenemos el archivo
    const id_puesto = document.getElementById('id_puesto').value;
    const id_horario = document.getElementById('id_horario').value;
    const salario_por_dia = document.getElementById('salario_por_dia').value;
    const estado = document.getElementById('estado').value;

    const formData = new FormData();
    formData.append('dni', dni);
    formData.append('nombres', nombres);
    formData.append('apellido_p', apellido_p);
    formData.append('apellido_m', apellido_m);
    formData.append('numero_cel', numero_cel);
    formData.append('sexo', sexo);
    formData.append('files', files);  // Adjuntamos el archivo
    formData.append('id_puesto', id_puesto);
    formData.append('id_horario', id_horario);
    formData.append('salario_por_dia', salario_por_dia);
    formData.append('estado', estado);

    try {
        const response = await fetch('api/registrartrabajador.php', {
            method: 'POST',
            body: formData  // Usamos FormData en lugar de JSON
        });

        const result = await response.json();

        if (result.success) {
            alert('Trabajador registrado con éxito');
            document.getElementById('registerModal').classList.add('hidden');          
        } else {
            alert('Error al registrar trabajador: ' + result.message);
        }

    } catch (error) {
        console.error('Error al registrar trabajador:', error);
    }
});

