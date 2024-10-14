<?php
include '../db/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener los datos enviados
    $dni = $_POST['dni'];
    $hora_actual = $_POST['hora_actual'];

    // Crear una nueva instancia de la clase Database
    $database = new Database();
    $conn = $database->getConnection(); // Obtener la conexión

    // Llamar al procedimiento almacenado para registrar la asistencia
    $sql = "CALL RegistrarAsistencia('$dni', '$hora_actual')";
    
    try {
        // Ejecutar la consulta
        if ($result = $conn->query($sql)) {
            // Recuperar datos del trabajador
            $trabajador_sql = "SELECT nombres, apellido_p, apellido_m FROM trabajador WHERE dni = '$dni'";
            $trabajador_result = $conn->query($trabajador_sql);
            $trabajador_data = $trabajador_result->fetch_assoc();

            echo json_encode([
                'status' => 'success', 
                'message' => 'Asistencia registrada correctamente.', 
                'trabajador' => $trabajador_data
            ]);
        }
    } catch (mysqli_sql_exception $e) {
        // Manejar el error específico para asistencia duplicada
        if ($e->getMessage() === 'Ya se registró asistencia para hoy.') {
            echo json_encode(['status' => 'error', 'message' => 'Ya se registró asistencia para hoy.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al registrar la asistencia: ' . $e->getMessage()]);
        }
    }

    // Cerrar la conexión
    $conn->close();
}
?>
