<?php
include '../db/database.php';

$database = new Database();
$conn = $database->getConnection(); 

$sql = "CALL ObtenerAsistenciaTrabajadores()"; 

try {
    $result = $conn->query($sql);

    $asistencia = [];
    while ($row = $result->fetch_assoc()) {
        $asistencia[] = $row;
    }

    echo json_encode(['status' => 'success', 'data' => $asistencia]);
} catch (mysqli_sql_exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error al obtener la asistencia: ' . $e->getMessage()]);
}

// Cerrar la conexión
$conn->close();
?>
