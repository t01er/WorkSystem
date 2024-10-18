<?php
// Incluir archivo de conexión
include '../db/database.php';


// Conexión a la base de datos
$conexion = (new Database())->getConnection();

// Verificar la conexión
if (!$conexion) {
    echo json_encode([
        'error' => 'Error de conexión a la base de datos'
    ]);
    exit();
}

// Consultar todos los puestos
$queryPuestos = "SELECT id_puesto, nombre_puesto FROM puesto";
$resultPuestos = mysqli_query($conexion, $queryPuestos);

$puestos = [];
if ($resultPuestos && mysqli_num_rows($resultPuestos) > 0) {
    while ($row = mysqli_fetch_assoc($resultPuestos)) {
        $puestos[] = $row;
    }
}

// Consultar todos los horarios
$queryHorarios = "SELECT id_horario, turno FROM horario";
$resultHorarios = mysqli_query($conexion, $queryHorarios);

$horarios = [];
if ($resultHorarios && mysqli_num_rows($resultHorarios) > 0) {
    while ($row = mysqli_fetch_assoc($resultHorarios)) {
        $horarios[] = $row;
    }
}

// Verificar si las consultas se ejecutaron correctamente
if (empty($puestos) && empty($horarios)) {
    echo json_encode([
        'error' => 'No se encontraron datos de puestos ni de horarios'
    ]);
} else {
    // Enviar los resultados como JSON
    echo json_encode([
        'puestos' => $puestos,
        'horarios' => $horarios,
    ]);
}

// Cerrar la conexión
mysqli_close($conexion);

?>
