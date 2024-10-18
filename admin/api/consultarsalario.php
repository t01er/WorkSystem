<?php
include_once '../db/database.php';

$database = new Database();
$conn = $database->getConnection();

if (!$conn) {
    echo json_encode(['error' => 'Error de conexión']);
    exit;
}

$stmt = $conn->query("CALL CalcularTotalSoles()");

if (!$stmt) {
    echo json_encode(['error' => 'Error en la consulta: ' . $conn->error]);
    exit;
}

$trabajadores = [];

while ($row = $stmt->fetch_assoc()) {
    $trabajadores[] = $row;
}

$stmt->free();

$conn->close();

header('Content-Type: application/json');
echo json_encode($trabajadores);
