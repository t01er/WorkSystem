<?php
// Incluir el archivo de conexión
include '../db/database.php';

// Establecer la cabecera para JSON
header('Content-Type: application/json');

// Crear una instancia de la clase Database
$database = new Database();
$conn = $database->getConnection();

// Verificar la conexión
if ($conn->connect_error) {
    die(json_encode(['error' => 'Error al conectar a la base de datos']));
}

// Consulta para obtener los horarios
$query = "SELECT id_horario, turno, hora_limite, salida FROM horario";
$result = $conn->query($query);

$horarios = [];

// Verificar si la consulta devuelve resultados
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $horarios[] = $row;
    }
}

echo json_encode($horarios);

// Cerrar la conexión
$conn->close();
?>
