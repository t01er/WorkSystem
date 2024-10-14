<?php
include '../db/database.php';

$database = new Database();
$conn = $database->getConnection();

if (isset($_FILES['files'])) {
    $uploadDir = '../uploads/'; 
    $fileName = basename($_FILES['files']['name']);
    $targetFilePath = $uploadDir . $fileName;

    $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
    $allowedTypes = array('jpg', 'jpeg', 'png', 'gif');

    if (in_array($fileType, $allowedTypes)) {
        if (move_uploaded_file($_FILES['files']['tmp_name'], $targetFilePath)) {
            $files = $fileName;  // Guardamos solo el nombre del archivo
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al subir la imagen.']);
            exit;
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Formato de archivo no permitido.']);
        exit;
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No se ha enviado ninguna imagen.']);
    exit;
}

// Obtener los demás datos del formulario
$dni = $_POST['dni'];
$nombres = $_POST['nombres'];
$apellido_p = $_POST['apellido_p'];
$apellido_m = $_POST['apellido_m'];
$numero_cel = $_POST['numero_cel'];
$sexo = $_POST['sexo'];
$id_puesto = $_POST['id_puesto'];
$id_horario = $_POST['id_horario'];
$salario_por_dia = $_POST['salario_por_dia'];
$estado = $_POST['estado'];

try {
    // Preparar la declaración
    $stmt = $conn->prepare("CALL RegistrarTrabajador(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    // Pasar los parámetros
    $stmt->bind_param('sssssssiiii', $dni, $nombres, $apellido_p, $apellido_m, $sexo, $numero_cel, $files, $id_puesto, $id_horario, $estado, $salario_por_dia);
    
    // Ejecutar el procedimiento
    $stmt->execute();

    // Comprobar si la ejecución fue exitosa
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Trabajador registrado con éxito']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No se pudo registrar el trabajador']);
    }

} catch (mysqli_sql_exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error al registrar el trabajador: ' . $e->getMessage()]);
}

// Cerrar la conexión
$stmt->close();
$conn->close();
?>
